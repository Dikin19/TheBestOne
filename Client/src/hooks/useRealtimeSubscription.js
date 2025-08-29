import { useEffect, useRef } from 'react';

/**
 * Custom hook for real-time subscriptions using custom events
 * This allows components to listen for real-time updates without complex state management
 */
export const useRealtimeSubscription = (eventName, callback, dependencies = []) => {
  const callbackRef = useRef(callback);

  // Update the callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleEvent = (event) => {
      if (callbackRef.current) {
        callbackRef.current(event.detail);
      }
    };

    // Listen for custom events
    window.addEventListener(eventName, handleEvent);

    return () => {
      window.removeEventListener(eventName, handleEvent);
    };
  }, [eventName, ...dependencies]);
};

/**
 * Utility function to emit real-time events
 */
export const emitRealtimeEvent = (eventName, data) => {
  const event = new CustomEvent(eventName, { detail: data });
  window.dispatchEvent(event);
};

/**
 * Predefined event names for consistency
 */
export const REALTIME_EVENTS = {
  WISHLIST_UPDATED: 'wishlist:updated',
  WISHLIST_ITEM_ADDED: 'wishlist:item:added',
  WISHLIST_ITEM_REMOVED: 'wishlist:item:removed',
  WISHLIST_CLEARED: 'wishlist:cleared',
  USER_PROFILE_UPDATED: 'user:profile:updated',
  PRODUCT_UPDATED: 'product:updated'
};
