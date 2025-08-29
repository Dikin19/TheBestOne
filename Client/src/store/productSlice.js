import { createSlice } from "@reduxjs/toolkit";
import axios from "../config/axiosInstance";


const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    detail:[],
    Profile: [],
    isLoading: false, 
  },
  reducers: {
    fetchProductsStart: (state) => {
      state.isLoading = true;
    },
    fetchProductsSuccess: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    fetchProductsFailure: (state) => {
      state.isLoading = false;
    },
    fetchProductByIdSuccess: (state, action) => {
      state.detail = action.payload;
      state.isLoading = false;
    },
    fetchProfileSuccess: (state, action) => {
      state.Profile = action.payload;
      state.isLoading = false;
    },
  },
});

export const { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure,fetchProductByIdSuccess, fetchProfileSuccess } = productSlice.actions;

const productReducer = productSlice.reducer;
export default productReducer;

export function fetchProduct() {
  return async (dispatch) => {
    dispatch(fetchProductsStart());
    try {
      const { data } = await axios({
        method: "get",
        url: "/customers/product",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      dispatch(fetchProductsSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(fetchProductsFailure(error.response?.data?.message || "Something went wrong!"));
    }
  };
}


export function fetchById(id) {
  return async (dispatch) => {
    dispatch(fetchProductsStart());
    try {
      const { data } = await axios({
        method: "get",
        url: `/customers/product/${id}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      dispatch(fetchProductByIdSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(fetchProductsFailure(error.response?.data?.message || "Something went wrong!"));
    }
  };
}

export function fetchProfile() {
  return async (dispatch) => {
    dispatch(fetchProductsStart());
    try {
      const { data } = await axios({
        method: "get",
        url: "/customers/profile",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      
      // Simpan profilePicture ke localStorage jika ada
      if (data.profilePicture) {
        localStorage.setItem('profilePicture', data.profilePicture);
      }
      
      dispatch(fetchProfileSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(fetchProductsFailure(error.response?.data?.message || "Something went wrong!"));
    }
  };
}

