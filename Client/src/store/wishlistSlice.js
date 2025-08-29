import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../config/axiosInstance';
import { 
  WISHLIST_ENDPOINTS, 
  getAuthHeaders,
  isAuthenticated,
  parseErrorMessage,
  cacheWishlistData,
  getCachedWishlistData,
  clearWishlistCache
} from '../utils/wishlistUtils';

// Async thunks for wishlist operations
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async ({ useCache = true } = {}, { rejectWithValue }) => {
    if (!isAuthenticated()) {
      return rejectWithValue('Authentication required');
    }

    // Try to get cached data first
    if (useCache) {
      const cachedData = getCachedWishlistData();
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      const response = await axios({
        method: 'get',
        url: WISHLIST_ENDPOINTS.GET,
        headers: getAuthHeaders()
      });

      const items = response.data.data || [];
      
      // Cache the data
      cacheWishlistData(items);
      
      return items;
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue, dispatch }) => {
    if (!isAuthenticated()) {
      return rejectWithValue('Authentication required');
    }

    try {
      await axios({
        method: 'post',
        url: WISHLIST_ENDPOINTS.ADD,
        data: { productId: parseInt(productId) },
        headers: getAuthHeaders()
      });

      // Fetch updated wishlist
      const result = await dispatch(fetchWishlist({ useCache: false }));
      return { productId: parseInt(productId), items: result.payload };
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue, getState }) => {
    if (!isAuthenticated()) {
      return rejectWithValue('Authentication required');
    }

    try {
      await axios({
        method: 'delete',
        url: WISHLIST_ENDPOINTS.REMOVE(productId),
        headers: getAuthHeaders()
      });

      // Update local state immediately
      const currentItems = getState().wishlist.items;
      const updatedItems = currentItems.filter(item => item.ProductId !== parseInt(productId));
      
      // Clear cache to ensure fresh data
      clearWishlistCache();
      
      return { productId: parseInt(productId), items: updatedItems };
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    count: 0,
    isLoading: false,
    error: null,
    lastUpdated: null
  },
  reducers: {
    // Synchronous actions for real-time updates
    updateWishlistItems: (state, action) => {
      state.items = action.payload;
      state.count = action.payload.length;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    incrementWishlistCount: (state, action) => {
      state.count = action.payload.totalCount || state.count + 1;
      state.lastUpdated = Date.now();
    },
    decrementWishlistCount: (state, action) => {
      state.count = action.payload.totalCount || Math.max(0, state.count - 1);
      state.lastUpdated = Date.now();
    },
    setWishlistCount: (state, action) => {
      state.count = action.payload;
      state.lastUpdated = Date.now();
    },
    clearWishlist: (state) => {
      state.items = [];
      state.count = 0;
      state.lastUpdated = Date.now();
      clearWishlistCache();
    },
    clearWishlistError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.count = action.payload.length;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.count = action.payload.items.length;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.count = action.payload.items.length;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  updateWishlistItems,
  incrementWishlistCount,
  decrementWishlistCount,
  setWishlistCount,
  clearWishlist,
  clearWishlistError
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.count;
export const selectWishlistLoading = (state) => state.wishlist.isLoading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectIsInWishlist = (productId) => (state) => 
  state.wishlist.items.some(item => item.ProductId === parseInt(productId));

export default wishlistSlice.reducer;
