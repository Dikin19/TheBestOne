/**
 * Simple hook specifically for navbar wishlist count display
 * This ensures the navbar always shows the most up-to-date count
 */

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistCount, setWishlistCount } from '../store/wishlistSlice';
import { useRealtimeSubscription, REALTIME_EVENTS } from './useRealtimeSubscription';
import { registerWishlistListener } from '../utils/wishlistSynchronizer';

export const useNavbarWishlistCount = () => {
  const dispatch = useDispatch();
  const wishlistCount = useSelector(selectWishlistCount);

  useEffect(() => {
    // Register for all possible wishlist update events
    const unregisterSync = registerWishlistListener((data) => {
      if (typeof data.totalCount === 'number') {
        dispatch(setWishlistCount(data.totalCount));
      }
    });

    return unregisterSync;
  }, [dispatch]);

  // Backup event listeners for extra reliability
  useRealtimeSubscription(REALTIME_EVENTS.WISHLIST_UPDATED, (data) => {
    if (typeof data.totalCount === 'number') {
      dispatch(setWishlistCount(data.totalCount));
    }
  });

  useRealtimeSubscription(REALTIME_EVENTS.WISHLIST_ITEM_ADDED, (data) => {
    if (typeof data.totalCount === 'number') {
      dispatch(setWishlistCount(data.totalCount));
    }
  });

  useRealtimeSubscription(REALTIME_EVENTS.WISHLIST_ITEM_REMOVED, (data) => {
    if (typeof data.totalCount === 'number') {
      dispatch(setWishlistCount(data.totalCount));
    }
  });

  useRealtimeSubscription(REALTIME_EVENTS.WISHLIST_CLEARED, () => {
    dispatch(setWishlistCount(0));
  });

  return wishlistCount;
};
