import { useState, useEffect, useCallback } from 'react';
import axios from '../config/axiosInstance';
import { 
  WISHLIST_ENDPOINTS, 
  WISHLIST_MESSAGES,
  getAuthHeaders,
  isAuthenticated,
  parseErrorMessage,
  showSuccessToast,
  showErrorToast,
  showLoginRequired,
  isValidProductId,
  cacheWishlistData,
  getCachedWishlistData,
  clearWishlistCache
} from '../utils/wishlistUtils';
import { emitRealtimeEvent, REALTIME_EVENTS } from './useRealtimeSubscription';

/**
 * Custom hook for managing wishlist functionality
 * @returns {Object} Wishlist state and methods
 */
export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch user's wishlist from API
   */
  const fetchWishlist = useCallback(async (useCache = true) => {
    if (!isAuthenticated()) {
      setError(WISHLIST_MESSAGES.ERROR.AUTH_REQUIRED);
      return [];
    }

    // Try to get cached data first
    if (useCache) {
      const cachedData = getCachedWishlistData();
      if (cachedData) {
        setWishlistItems(cachedData);
        return cachedData;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios({
        method: 'get',
        url: WISHLIST_ENDPOINTS.GET,
        headers: getAuthHeaders()
      });

      const items = response.data.data || [];
      setWishlistItems(items);
      
      // Cache the data
      cacheWishlistData(items);
      
      return items;
      
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      setError(errorMessage);
      console.error('Fetch wishlist error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add product to wishlist
   */
  const addToWishlist = useCallback(async (productId) => {
    if (!isAuthenticated()) {
      showLoginRequired(() => {
        window.location.href = '/login';
      });
      return false;
    }

    if (!isValidProductId(productId)) {
      showErrorToast('Invalid product ID');
      return false;
    }

    setIsLoading(true);

    try {
      const response = await axios({
        method: 'post',
        url: WISHLIST_ENDPOINTS.ADD,
        data: { productId: parseInt(productId) },
        headers: getAuthHeaders()
      });

      // Update local state immediately and get the updated items
      const updatedItems = await fetchWishlist(false); // Force refresh without cache
      
      // Emit real-time event with correct count
      emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_ITEM_ADDED, {
        productId: parseInt(productId),
        totalCount: updatedItems.length
      });
      emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_UPDATED, {
        items: updatedItems,
        totalCount: updatedItems.length
      });
      
      showSuccessToast(WISHLIST_MESSAGES.SUCCESS.ADDED);
      return true;

    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      showErrorToast(errorMessage);
      console.error('Add to wishlist error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchWishlist, wishlistItems]);

  /**
   * Remove product from wishlist
   */
  const removeFromWishlist = useCallback(async (productId) => {
    if (!isAuthenticated()) {
      showErrorToast(WISHLIST_MESSAGES.ERROR.AUTH_REQUIRED);
      return false;
    }

    if (!isValidProductId(productId)) {
      showErrorToast('Invalid product ID');
      return false;
    }

    setIsLoading(true);

    try {
      await axios({
        method: 'delete',
        url: WISHLIST_ENDPOINTS.REMOVE(productId),
        headers: getAuthHeaders()
      });

      // Update local state immediately
      const updatedItems = wishlistItems.filter(item => item.ProductId !== parseInt(productId));
      setWishlistItems(updatedItems);
      
      // Clear cache to ensure fresh data
      clearWishlistCache();
      
      // Emit real-time event
      emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_ITEM_REMOVED, {
        productId: parseInt(productId),
        totalCount: updatedItems.length
      });
      emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_UPDATED, {
        items: updatedItems,
        totalCount: updatedItems.length
      });
      
      showSuccessToast(WISHLIST_MESSAGES.SUCCESS.REMOVED);
      return true;

    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      showErrorToast(errorMessage);
      console.error('Remove from wishlist error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [wishlistItems]);

  /**
   * Toggle product in wishlist (add if not present, remove if present)
   */
  const toggleWishlist = useCallback(async (productId) => {
    const isInWishlist = wishlistItems.some(item => item.ProductId === parseInt(productId));
    
    if (isInWishlist) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  }, [wishlistItems, addToWishlist, removeFromWishlist]);

  /**
   * Check if product is in wishlist
   */
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.ProductId === parseInt(productId));
  }, [wishlistItems]);

  /**
   * Get wishlist statistics
   */
  const getWishlistStats = useCallback(() => {
    const totalItems = wishlistItems.length;
    const totalValue = wishlistItems.reduce((sum, item) => sum + (item.Product?.price || 0), 0);
    const categories = [...new Set(wishlistItems.map(item => item.Product?.Category?.name).filter(Boolean))];
    
    return {
      totalItems,
      totalValue,
      averagePrice: totalItems > 0 ? Math.round(totalValue / totalItems) : 0,
      categories: categories.length,
      categoryList: categories
    };
  }, [wishlistItems]);

  /**
   * Clear all wishlist items
   */
  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated()) {
      showErrorToast(WISHLIST_MESSAGES.ERROR.AUTH_REQUIRED);
      return false;
    }

    const promises = wishlistItems.map(item => removeFromWishlist(item.ProductId));
    
    try {
      await Promise.all(promises);
      setWishlistItems([]);
      clearWishlistCache();
      showSuccessToast('Wishlist cleared successfully');
      return true;
    } catch (error) {
      showErrorToast('Failed to clear wishlist');
      return false;
    }
  }, [wishlistItems, removeFromWishlist]);

  /**
   * Refresh wishlist data
   */
  const refreshWishlist = useCallback(() => {
    clearWishlistCache();
    return fetchWishlist(false);
  }, [fetchWishlist]);

  // Load wishlist on hook initialization
  useEffect(() => {
    if (isAuthenticated()) {
      fetchWishlist();
    }
  }, [fetchWishlist]);

  return {
    // State
    wishlistItems,
    isLoading,
    error,
    
    // Methods
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    refreshWishlist,
    
    // Utilities
    isInWishlist,
    getWishlistStats,
    
    // Computed values
    isEmpty: wishlistItems.length === 0,
    count: wishlistItems.length
  };
};

/**
 * Hook for single product wishlist status
 * @param {number} productId - Product ID to track
 */
export const useProductWishlistStatus = (productId) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Check if product is in wishlist
   */
  const checkWishlistStatus = useCallback(async () => {
    if (!isAuthenticated() || !isValidProductId(productId)) {
      console.log('useProductWishlistStatus: Not authenticated or invalid product ID', { 
        isAuth: isAuthenticated(), 
        productId, 
        isValid: isValidProductId(productId) 
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios({
        method: 'get',
        url: WISHLIST_ENDPOINTS.GET,
        headers: getAuthHeaders()
      });

      const items = response.data.data || [];
      const inWishlist = items.some(item => item.ProductId === parseInt(productId));
      
      console.log('useProductWishlistStatus: Check result', { 
        productId, 
        items: items.map(item => ({ ProductId: item.ProductId, ProductName: item.Product?.name })), 
        inWishlist 
      });
      
      setIsInWishlist(inWishlist);
      
    } catch (error) {
      console.error('Check wishlist status error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  /**
   * Toggle wishlist status for this product
   */
  const toggleWishlist = useCallback(async () => {
    if (!isAuthenticated()) {
      showLoginRequired(() => {
        window.location.href = '/login';
      });
      return false;
    }

    if (!isValidProductId(productId)) {
      showErrorToast('Invalid product ID');
      return false;
    }

    setIsLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await axios({
          method: 'delete',
          url: WISHLIST_ENDPOINTS.REMOVE(productId),
          headers: getAuthHeaders()
        });
        
        setIsInWishlist(false);
        showSuccessToast(WISHLIST_MESSAGES.SUCCESS.REMOVED);
      } else {
        // Add to wishlist
        await axios({
          method: 'post',
          url: WISHLIST_ENDPOINTS.ADD,
          data: { productId: parseInt(productId) },
          headers: getAuthHeaders()
        });
        
        setIsInWishlist(true);
        showSuccessToast(WISHLIST_MESSAGES.SUCCESS.ADDED);
      }
      
      // Clear cache to ensure fresh data on next fetch
      clearWishlistCache();
      
      console.log('useProductWishlistStatus: Toggle completed', { 
        productId, 
        newStatus: !isInWishlist 
      });
      
      return true;
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      showErrorToast(errorMessage);
      console.error('Toggle wishlist error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [productId, isInWishlist]);

  // Check status on mount
  useEffect(() => {
    checkWishlistStatus();
  }, [checkWishlistStatus]);

  return {
    isInWishlist,
    isLoading,
    toggleWishlist,
    checkWishlistStatus
  };
};
