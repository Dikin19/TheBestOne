// Wishlist utility functions and constants

/**
 * Wishlist API endpoints
 */
export const WISHLIST_ENDPOINTS = {
  ADD: '/customers/wishlist',
  GET: '/customers/wishlist', 
  REMOVE: (productId) => `/customers/wishlist/${productId}`
};

/**
 * Wishlist error messages
 */
export const WISHLIST_MESSAGES = {
  SUCCESS: {
    ADDED: '❤️ Added to wishlist!',
    REMOVED: '💔 Removed from wishlist',
    UPDATED: 'Wishlist updated successfully'
  },
  ERROR: {
    NOT_FOUND: 'Product not found',
    ALREADY_EXISTS: 'Product already in wishlist',
    AUTH_REQUIRED: 'Please login to use wishlist',
    NETWORK_ERROR: 'Network error. Please try again.',
    GENERIC: 'Something went wrong. Please try again.'
  },
  LOADING: {
    ADDING: 'Adding to wishlist...',
    REMOVING: 'Removing from wishlist...',
    LOADING: 'Loading wishlist...'
  }
};

/**
 * Get authorization headers for API requests
 * @returns {Object} Headers object with authorization token
 */
export const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`
});

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has access token
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

/**
 * Parse API error message
 * @param {Error} error - The error object from API response
 * @returns {string} User-friendly error message
 */
export const parseErrorMessage = (error) => {
  if (error.response?.status === 401) {
    return WISHLIST_MESSAGES.ERROR.AUTH_REQUIRED;
  }
  
  if (error.response?.status === 404) {
    return WISHLIST_MESSAGES.ERROR.NOT_FOUND;
  }
  
  if (error.response?.status === 409) {
    return WISHLIST_MESSAGES.ERROR.ALREADY_EXISTS;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message && error.message.includes('Network')) {
    return WISHLIST_MESSAGES.ERROR.NETWORK_ERROR;
  }
  
  return WISHLIST_MESSAGES.ERROR.GENERIC;
};

/**
 * Show success toast notification
 * @param {string} message - Success message to display
 */
export const showSuccessToast = (message) => {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      icon: 'success',
      title: message,
      background: '#dcfce7',
      color: '#16a34a'
    });
  }
};

/**
 * Show error toast notification
 * @param {string} message - Error message to display
 */
export const showErrorToast = (message) => {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      icon: 'error',
      title: message,
      background: '#fee2e2',
      color: '#dc2626'
    });
  }
};

/**
 * Show login required modal
 * @param {Function} onConfirm - Callback when user confirms
 */
export const showLoginRequired = (onConfirm) => {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Login Required',
      text: 'Please login to add items to your wishlist',
      icon: 'warning',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Go to Login',
      showCancelButton: true,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      }
    });
  }
};

/**
 * Validate product ID
 * @param {any} productId - Product ID to validate
 * @returns {boolean} True if valid
 */
export const isValidProductId = (productId) => {
  return productId && !isNaN(productId) && parseInt(productId) > 0;
};

/**
 * Format wishlist item for display
 * @param {Object} wishlistItem - Raw wishlist item from API
 * @returns {Object} Formatted wishlist item
 */
export const formatWishlistItem = (wishlistItem) => {
  return {
    id: wishlistItem.id,
    productId: wishlistItem.ProductId,
    userId: wishlistItem.UserId,
    addedAt: new Date(wishlistItem.createdAt).toLocaleDateString(),
    product: {
      id: wishlistItem.Product.id,
      name: wishlistItem.Product.name,
      price: wishlistItem.Product.price,
      imageUrl: wishlistItem.Product.imgUrl,
      description: wishlistItem.Product.description,
      category: wishlistItem.Product.Category?.name || 'Unknown'
    }
  };
};

/**
 * Calculate wishlist statistics
 * @param {Array} wishlistItems - Array of wishlist items
 * @returns {Object} Wishlist statistics
 */
export const calculateWishlistStats = (wishlistItems) => {
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
};

/**
 * Debounce function for API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Local storage keys for wishlist caching
 */
export const STORAGE_KEYS = {
  WISHLIST_CACHE: 'wishlist_cache',
  WISHLIST_TIMESTAMP: 'wishlist_timestamp'
};

/**
 * Cache wishlist data in localStorage
 * @param {Array} wishlistData - Wishlist data to cache
 */
export const cacheWishlistData = (wishlistData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST_CACHE, JSON.stringify(wishlistData));
    localStorage.setItem(STORAGE_KEYS.WISHLIST_TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.warn('Failed to cache wishlist data:', error);
  }
};

/**
 * Get cached wishlist data
 * @param {number} maxAge - Maximum age in milliseconds (default: 5 minutes)
 * @returns {Array|null} Cached wishlist data or null if expired/not found
 */
export const getCachedWishlistData = (maxAge = 5 * 60 * 1000) => {
  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.WISHLIST_TIMESTAMP);
    const cachedData = localStorage.getItem(STORAGE_KEYS.WISHLIST_CACHE);
    
    if (!timestamp || !cachedData) {
      return null;
    }
    
    const age = Date.now() - parseInt(timestamp);
    if (age > maxAge) {
      localStorage.removeItem(STORAGE_KEYS.WISHLIST_CACHE);
      localStorage.removeItem(STORAGE_KEYS.WISHLIST_TIMESTAMP);
      return null;
    }
    
    return JSON.parse(cachedData);
  } catch (error) {
    console.warn('Failed to get cached wishlist data:', error);
    return null;
  }
};

/**
 * Clear wishlist cache
 */
export const clearWishlistCache = () => {
  localStorage.removeItem(STORAGE_KEYS.WISHLIST_CACHE);
  localStorage.removeItem(STORAGE_KEYS.WISHLIST_TIMESTAMP);
};
