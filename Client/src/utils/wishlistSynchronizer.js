/**
 * Global Wishlist Synchronization Utility
 * 
 * This utility provides a centralized way to keep all wishlist-related
 * components synchronized across the application in real-time.
 */

import { emitRealtimeEvent, REALTIME_EVENTS } from '../hooks/useRealtimeSubscription';

class WishlistSynchronizer {
  constructor() {
    this.listeners = new Set();
    this.lastUpdateTime = null;
    this.debounceTimeout = null;
  }

  /**
   * Register a component for wishlist updates
   */
  register(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all registered components of wishlist changes
   */
  notify(data) {
    this.lastUpdateTime = Date.now();
    
    // Debounce rapid updates
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    
    this.debounceTimeout = setTimeout(() => {
      this.listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in wishlist listener:', error);
        }
      });
    }, 100);
  }

  /**
   * Emit a wishlist update event with enhanced data
   */
  emitUpdate(items, eventType = 'updated') {
    const data = {
      items,
      totalCount: items.length,
      timestamp: Date.now(),
      eventType
    };

    // Emit the specific event
    switch (eventType) {
      case 'added':
        emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_ITEM_ADDED, data);
        break;
      case 'removed':
        emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_ITEM_REMOVED, data);
        break;
      case 'cleared':
        emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_CLEARED, data);
        break;
      default:
        emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_UPDATED, data);
    }

    // Always emit the general update event
    if (eventType !== 'updated') {
      emitRealtimeEvent(REALTIME_EVENTS.WISHLIST_UPDATED, data);
    }

    // Notify local listeners
    this.notify(data);
  }

  /**
   * Force a global synchronization across all components
   */
  forceSync() {
    console.log('WishlistSynchronizer: Forcing global sync...');
    emitRealtimeEvent('wishlist:force:refresh', { timestamp: Date.now() });
  }

  /**
   * Get the time of the last update
   */
  getLastUpdateTime() {
    return this.lastUpdateTime;
  }

  /**
   * Check if the wishlist was recently updated
   */
  isRecentlyUpdated(threshold = 5000) {
    if (!this.lastUpdateTime) return false;
    return Date.now() - this.lastUpdateTime < threshold;
  }
}

// Create a singleton instance
const wishlistSynchronizer = new WishlistSynchronizer();

// Export convenience functions
export const registerWishlistListener = (callback) => {
  return wishlistSynchronizer.register(callback);
};

export const notifyWishlistUpdate = (items, eventType) => {
  wishlistSynchronizer.emitUpdate(items, eventType);
};

export const forceWishlistSync = () => {
  wishlistSynchronizer.forceSync();
};

export const isWishlistRecentlyUpdated = (threshold) => {
  return wishlistSynchronizer.isRecentlyUpdated(threshold);
};

export const getLastWishlistUpdateTime = () => {
  return wishlistSynchronizer.getLastUpdateTime();
};

export default wishlistSynchronizer;
