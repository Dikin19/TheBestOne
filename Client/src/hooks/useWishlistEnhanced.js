import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWishlist,
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  updateWishlistItems,
  incrementWishlistCount,
  decrementWishlistCount,
  setWishlistCount,
  clearWishlist,
  selectWishlistItems,
  selectWishlistCount,
  selectWishlistLoading,
  selectWishlistError,
  selectIsInWishlist
} from '../store/wishlistSlice';
import { useRealtimeSubscription, emitRealtimeEvent, REALTIME_EVENTS } from './useRealtimeSubscription';
import { notifyWishlistUpdate, registerWishlistListener } from '../utils/wishlistSynchronizer';
import { 
  showSuccessToast,
  showErrorToast,
  showLoginRequired,
  WISHLIST_MESSAGES,
  isAuthenticated,
  isValidProductId
} from '../utils/wishlistUtils';

/**
 * Enhanced wishlist hook with Redux integration and robust real-time synchronization
 */
export const useWishlistEnhanced = () => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistCount = useSelector(selectWishlistCount);
  const isLoading = useSelector(selectWishlistLoading);
  const error = useSelector(selectWishlistError);

  // Real-time event handlers
  useRealtimeSubscription(REALTIME_EVENTS.WISHLIST_UPDATED, (data) => {
    console.log('WISHLIST_UPDATED event received:', data);
    if (data?.items) {
      dispatch(updateWishlistItems(data.items));
    } else if (typeof data?.totalCount === 'number') {
      dispatch(setWishlistCount(data.totalCount));
    }
  });

  useRealtimeSubscription(REALTIME_EVENTS.WISHLIST_ITEM_ADDED, (data) => {
    console.log('WISHLIST_ITEM_ADDED event received:', data);
    if (typeof data?.totalCount === 'number') {
      dispatch(setWishlistCount(data.totalCount));
    } else {
      dispatch(incrementWishlistCount(data));
    }
  });

  useRealtimeSubscription(REALTIME_EVENTS.WISHLIST_ITEM_REMOVED, (data) => {
    console.log('WISHLIST_ITEM_REMOVED event received:', data);
    if (typeof data?.totalCount === 'number') {
      dispatch(setWishlistCount(data.totalCount));
    } else {
      dispatch(decrementWishlistCount(data));
    }
  });

  useRealtimeSubscription(REALTIME_EVENTS.WISHLIST_CLEARED, () => {
    console.log('WISHLIST_CLEARED event received');
    dispatch(clearWishlist());
  });

  // Force refresh handler
  useRealtimeSubscription('wishlist:force:refresh', async () => {
    console.log('Force refresh event received');
    dispatch(fetchWishlist({ useCache: false }));
  });

  // Initialize wishlist on mount and register for synchronization
  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(fetchWishlist({ useCache: true }));
    }

    // Register for global synchronization events
    const unregister = registerWishlistListener((data) => {
      console.log('Global wishlist sync received:', data);
      if (data.items) {
        dispatch(updateWishlistItems(data.items));
      }
    });

    return unregister;
  }, [dispatch]);

  // Methods
  const refreshWishlist = useCallback(async (useCache = false) => {
    return dispatch(fetchWishlist({ useCache }));
  }, [dispatch]);

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

    try {
      const result = await dispatch(addToWishlistAction(productId));
      
      if (result.type.endsWith('/fulfilled')) {
        // Emit real-time events using the synchronizer
        notifyWishlistUpdate(result.payload.items, 'added');
        
        showSuccessToast(WISHLIST_MESSAGES.SUCCESS.ADDED);
        return true;
      } else {
        showErrorToast(result.payload || 'Failed to add to wishlist');
        return false;
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      showErrorToast('Failed to add to wishlist');
      return false;
    }
  }, [dispatch]);

  const removeFromWishlist = useCallback(async (productId) => {
    if (!isAuthenticated()) {
      showErrorToast(WISHLIST_MESSAGES.ERROR.AUTH_REQUIRED);
      return false;
    }

    if (!isValidProductId(productId)) {
      showErrorToast('Invalid product ID');
      return false;
    }

    try {
      const result = await dispatch(removeFromWishlistAction(productId));
      
      if (result.type.endsWith('/fulfilled')) {
        // Emit real-time events using the synchronizer
        notifyWishlistUpdate(result.payload.items, 'removed');
        
        showSuccessToast(WISHLIST_MESSAGES.SUCCESS.REMOVED);
        return true;
      } else {
        showErrorToast(result.payload || 'Failed to remove from wishlist');
        return false;
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      showErrorToast('Failed to remove from wishlist');
      return false;
    }
  }, [dispatch]);

  const toggleWishlist = useCallback(async (productId) => {
    const isInWishlist = wishlistItems.some(item => item.ProductId === parseInt(productId));
    
    if (isInWishlist) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  }, [wishlistItems, addToWishlist, removeFromWishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.ProductId === parseInt(productId));
  }, [wishlistItems]);

  const getWishlistStats = useCallback(() => {
    return {
      totalItems: wishlistCount,
      categories: [...new Set(wishlistItems.map(item => item.Product?.categoryId).filter(Boolean))].length,
      totalValue: wishlistItems.reduce((sum, item) => sum + (item.Product?.price || 0), 0)
    };
  }, [wishlistItems, wishlistCount]);

  const clearWishlistData = useCallback(() => {
    dispatch(clearWishlist());
    notifyWishlistUpdate([], 'cleared');
  }, [dispatch]);

  // Force synchronization method
  const forceSynchronize = useCallback(async () => {
    console.log('Forcing wishlist synchronization...');
    try {
      const result = await dispatch(fetchWishlist({ useCache: false }));
      if (result.type.endsWith('/fulfilled')) {
        notifyWishlistUpdate(result.payload, 'updated');
        console.log('Wishlist synchronized successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to synchronize wishlist:', error);
      return false;
    }
  }, [dispatch]);

  return {
    // State
    wishlistItems,
    wishlistCount,
    isLoading,
    error,
    
    // Methods
    fetchWishlist: refreshWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistStats,
    clearWishlist: clearWishlistData,
    forceSynchronize,
    
    // Utilities
    isAuthenticated: isAuthenticated()
  };
};

// Backward compatibility - export the original hook name
export const useWishlist = useWishlistEnhanced;

/**
 * Specialized hook for individual product wishlist status
 * This provides a simple interface for components that only need to track
 * whether a specific product is in the wishlist
 * @param {number} productId - Product ID to track
 */
export const useProductWishlistStatus = (productId) => {
  const { 
    wishlistItems, 
    isLoading: globalLoading, 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist: checkIsInWishlist 
  } = useWishlistEnhanced();

  const [isLoading, setIsLoading] = useState(false);
  
  // Check if product is in wishlist using the global state
  const isInWishlist = checkIsInWishlist(productId);

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
      let success;
      if (isInWishlist) {
        success = await removeFromWishlist(productId);
      } else {
        success = await addToWishlist(productId);
      }
      
      return success;
    } catch (error) {
      console.error('Toggle wishlist error:', error);
      showErrorToast('Failed to update wishlist');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [productId, isInWishlist, addToWishlist, removeFromWishlist]);

  return {
    isInWishlist,
    isLoading: isLoading || globalLoading,
    toggleWishlist
  };
};
