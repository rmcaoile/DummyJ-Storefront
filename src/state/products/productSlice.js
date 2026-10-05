import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api } from "@/api/client"
import { PRODUCTS_PAGE_SIZE, buildProductsUrl } from "@/api/config"
import { normalizeProduct, normalizeProducts } from "@/api/normalize"

// Searching, filtering and paging all happen server-side, so this takes the
// query rather than fetching everything and filtering in the browser.
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, limit = PRODUCTS_PAGE_SIZE, category = "All", search = "" } = {}) => {
    const res = await api.get(buildProductsUrl({ page, limit, category, search }))
    const items = normalizeProducts(res.data)

    return {
      items,
      total: res.data?.total ?? items.length,
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    const res = await api.get("/products/category-list")
    return Array.isArray(res.data) ? res.data : []
  }
)

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId) => {
    const res = await api.get(`/products/${productId}`)
    return normalizeProduct(res.data)
  }
)

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    categories: [],
    byId: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load products";
        state.items = [];
        state.total = 0;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categories = [];
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        if (action.payload) {
          state.byId[action.payload.id] = action.payload;
        }
      })
  },
});

export default productSlice.reducer;