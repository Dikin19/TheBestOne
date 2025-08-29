import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import wishlistReducer from './wishlistSlice';

const store = configureStore({
  reducer: {
    product: productReducer,
    wishlist: wishlistReducer,
  },
});

export default store;

console.log(store, " <<<<<<<<<<< STORE");