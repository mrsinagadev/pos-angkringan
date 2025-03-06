import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../auth/AxiosConfig.jsx";

let reqOptionsGetAll = {
  url: "/api/carts",
  method: "GET",
};

export const getAllCart = createAsyncThunk("cart/getAllCart", async () => {
  try {
    const response = await axiosInstance.request(reqOptionsGetAll);
    return response.data.result;
  } catch (error) {
    const data = JSON.parse(error.request.response);
    throw new Error(data ? data.message : error.message);
  }
});

export const addToCart = createAsyncThunk("cart/addToCart", async (data) => {
  let bodyContent = JSON.stringify(data);
  let reqOptions = {
    url: "/api/carts",
    method: "POST",
    data: bodyContent,
  };
  try {
    await axiosInstance.request(reqOptions);
    const response = await axiosInstance.request(reqOptionsGetAll);
    return response.data.result;
  } catch (error) {
    const data = JSON.parse(error.request.response);
    throw new Error(data ? data.message : error.message);
  }
});

export const updateCart = createAsyncThunk("cart/updateCart", async (data) => {
  data.totalPrice = data.qty * data.price;
  let bodyContent = JSON.stringify(data);
  let reqOptions = {
    url: `/api/carts/${data.id}`,
    method: "PUT",
    data: bodyContent,
  };
  try {
    await axiosInstance.request(reqOptions);
    const response = await axiosInstance.request(reqOptionsGetAll);
    return response.data.result;
  } catch (error) {
    const data = JSON.parse(error.request.response);
    throw new Error(data ? data.message : error.message);
  }
});

export const setDetail = createAsyncThunk("cart/setDetail", async (data) => {
  return data;
});

export const deleteCart = createAsyncThunk("cart/deleteCart", async (data) => {
  let bodyContent = JSON.stringify(data);
  let reqOptions = {
    url: `/api/carts/${data.id}/${data.userId}`,
    method: "DELETE",
    data: bodyContent,
  };
  try {
    await axiosInstance.request(reqOptions);
    const response = await axiosInstance.request(reqOptionsGetAll);
    return response.data.result;
  } catch (error) {
    const data = JSON.parse(error.request.response);
    throw new Error(data ? data.message : error.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: null,
    loading: false,
    error: null,
    dataEdit: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCart.pending, (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
      })
      .addCase(getAllCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getAllCart.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error = action.error.message;
      })
      // add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.data = null;
      })
      // update cart
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // set detail
      .addCase(setDetail.fulfilled, (state, action) => {
        state.dataEdit = action.payload;
      })
      // delete cart
      .addCase(deleteCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;