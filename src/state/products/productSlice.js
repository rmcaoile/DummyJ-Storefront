import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api } from "@/api/client"
import { LIST_ALL_PARAMS } from "@/api/config"
import { normalizeProducts } from "@/api/normalize"

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await api.get("/products", { params: LIST_ALL_PARAMS })
    return normalizeProducts(res.data);
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load products";
      });
  },
});

export default productSlice.reducer;
