import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../auth/AxiosConfig.jsx";

export const getAllProduct = createAsyncThunk(
  "product/getAllProduct",
  async (keyword) => {
    let reqOptionsGetAll = {
      url: `/api/products?search_query=${keyword}&limit=250`,
      method: "GET",
    };
    try {
      const response = await axiosInstance.request(reqOptionsGetAll);
      return response.data.result;
    } catch (error) {
      const data = JSON.parse(error.request.response);
      throw new Error(data ? data.message : error.message);
    }
  }
);

export const getAllByCategory = createAsyncThunk(
  "product/getAllByCategory",
  async (id) => {
    let reqOptions = {
      url: `/api/products/category/${id}`,
      method: "GET",
    };
    try {
      const response = await axiosInstance.request(reqOptions);
      return response.data.result;
    } catch (error) {
      const data = JSON.parse(error.request.response);
      throw new Error(data ? data.message : error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // get by category
      .addCase(getAllByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;