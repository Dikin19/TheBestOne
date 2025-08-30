import { emitRealtimeEvent, REALTIME_EVENTS } from '../hooks/useRealtimeSubscription';

/**
 * Utility functions for wishlist real-time updates
 * These functions can be used from any component to emit wishlist events
 */

/**
 * Notify about wishlist item addition
 * @param {number} productId - ID of the added product
 * @param {number} totalCount - New total count of wishlist items
 * @param {object} productData - Product data (optional)
 */
export const notifyWishlistItemAdded = (productId, totalCount, productData = null) => {
  emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_ITEM_ADDED, {
    productId: parseInt(productId),
    totalCount,
    productData,
    timestamp: new Date().toISOString()
  });
};

/**
 * Notify about wishlist item removal
 * @param {number} productId - ID of the removed product
 * @param {number} totalCount - New total count of wishlist items
 */
export const notifyWishlistItemRemoved = (productId, totalCount) => {
  emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_ITEM_REMOVED, {
    productId: parseInt(productId),
    totalCount,
    timestamp: new Date().toISOString()
  });
};

/**
 * Notify about complete wishlist update
 * @param {Array} wishlistItems - Complete array of wishlist items
 */
export const notifyWishlistUpdated = (wishlistItems) => {
  emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_UPDATED, {
    items: wishlistItems,
    totalCount: wishlistItems?.length || 0,
    timestamp: new Date().toISOString()
  });
};

/**
 * Notify about wishlist being cleared
 */
export const notifyWishlistCleared = () => {
  emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_CLEARED, {
    totalCount: 0,
    timestamp: new Date().toISOString()
  });
};

/**
 * Force refresh wishlist data across all components
 */
export const forceWishlistRefresh = () => {
  emitRealtimeEvent('wishlist:force:refresh', {
    timestamp: new Date().toISOString()
  });
};

/**
 * Show wishlist update notification with animation
 * @param {string} type - 'added' or 'removed'
 * @param {string} productName - Name of the product
 * @param {number} count - Current wishlist count
 */
export const showWishlistNotification = (type, productName, count) => {
  const message = type === 'added' 
    ? `${productName} added to wishlist (${count} items)`
    : `${productName} removed from wishlist (${count} items)`;
    
  // Create a temporary notification element
  const notification = document.createElement('div');
  notification.className = `
    fixed top-20 right-4 z-[100] bg-white border border-gray-200 rounded-lg shadow-lg p-4
    transform transition-all duration-500 ease-out translate-x-full opacity-0
  `;
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full flex items-center justify-center ${
        type === 'added' ? 'bg-green-100' : 'bg-red-100'
      }">
        <svg class="w-4 h-4 ${type === 'added' ? 'text-green-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${type === 'added' 
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
          }
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-900">${message}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full', 'opacity-0');
  }, 10);
  
  // Animate out and remove
  setTimeout(() => {
    notification.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 3000);
};
