import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

import { api } from "@/api/client"
import { LIST_ALL_PARAMS } from "@/api/config"
import { normalizeCarts } from "@/api/normalize"

export const fetchUserCarts = createAsyncThunk(
  "cart/fetchUserCarts",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState();
    const productList = state.products.items;

    // Per-user key
    const localKey = `userCarts-${userId}`;
    const saved = JSON.parse(localStorage.getItem(localKey)) || [];
    if (saved.length > 0) {
      return saved;
    }

    // Fetch using API if no local data
    const res = await api.get("/carts", { params: LIST_ALL_PARAMS });
    const userCarts = normalizeCarts(res.data).filter((cart) => cart.userId === userId);
    console.log(userCarts);

    const mappedCarts = userCarts.map((cart) => ({
      ...cart,
      products: cart.products.map((p) => {
        const full = productList.find((fp) => fp.id === p.productId);
        return {
          ...p,
          ...(full ?? {}),
          id: p.productId,
          quantity: p.quantity || 1,
        };
      }),
    }));

    // Save to localStorage 
    localStorage.setItem(localKey, JSON.stringify(mappedCarts));

    return mappedCarts;
  }
);

// Update a cart in the API
export const updateCartApi = createAsyncThunk(
  "cart/updateCartApi",
  async (cart, { rejectWithValue }) => {
    try {
      const res = await api.put(`/carts/${cart.id}`, {
        id: cart.id,
        userId: cart.userId,
        products: cart.products.map(p => ({ productId: p.id, quantity: p.quantity }))
      });
      toast.success("Updated item quantity.");
      return res.data;
    } catch (err) {
      toast.error("Failed to update cart.");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Remove a product in cart in the API
export const removeItemCartApi = createAsyncThunk(
  "cart/removeItemCartApi",
  async (cart, { rejectWithValue }) => {
    try {
      const res = await api.put(`/carts/${cart.id}`, {
        id: cart.id,
        userId: cart.userId,
        products: cart.products.map(p => ({ productId: p.id, quantity: p.quantity }))
      });
      toast.success("Item removed from cart.");
      return res.data;
    } catch (err) {
      toast.error("Failed to remove item.");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a new cart in the API
export const createCartApi = createAsyncThunk(
  "cart/createCartApi",
  async (cart, { rejectWithValue }) => {
    try {
      const res = await api.post("/carts", {
        id: cart.id,
        userId: cart.userId,
        date: cart.date,
        products: cart.products.map(p => ({ productId: p.id, quantity: p.quantity }))
      });
      // toast.success("New cart created in API.");
      return res.data;
    } catch (err) {
      toast.error("Failed to create new cart in API.");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete a cart in the API
export const deleteCartApi = createAsyncThunk(
  "cart/deleteCartApi",
  async (cartId, { rejectWithValue }) => {
    try {
      await api.delete(`/carts/${cartId}`);
      toast.success("Removed cart with no items.");
      return { cartId };
    } catch (err) {
      toast.error("Failed to delete empty cart.");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    userCarts: [],
    error: null,
  },
  reducers: {
    addToCart(state, action) {
      const { userId, product, dispatch } = action.payload;
      const today = new Date().toISOString().split("T")[0];
      const cartIndex = state.userCarts.findIndex((cart) => cart.userId === userId && cart.date === today);

      let cart;
      if (cartIndex !== -1) {
        cart = state.userCarts[cartIndex];
        const productIndex = cart.products.findIndex((p) => p.id === product.id);

        if (productIndex !== -1) {
          cart.products[productIndex].quantity += 1;
          toast.success(`Increased quantity of "${product.title}"`);
        } else {
          cart.products.push({ ...product, quantity: 1 });
          toast.success(`Added "${product.title}" to your cart`);
        }
        state.userCarts[cartIndex] = cart;
        // Dispatch updateCartApi thunk
        if (dispatch) dispatch(updateCartApi(cart));
      } else {
        const newCart = {
          id: Date.now(),
          userId,
          date: today,
          products: [{ ...product, quantity: 1 }],
        };
        state.userCarts.unshift(newCart);
        toast.success(`Created new cart and added "${product.title}"`);
        // Dispatch createCartApi thunk
        if (dispatch) dispatch(createCartApi(newCart));
      }
      localStorage.setItem(`userCarts-${userId}`, JSON.stringify(state.userCarts));
    },
    
    setUserCarts(state, action) {
      state.userCarts = action.payload;
    },

    clearUserCarts(state) {
      state.userCarts = [];
      state.error = null;
    },

    checkoutCarts: (state, action) => {
      const { selectedCarts, selectedItems, userId } = action.payload;

      const updatedCarts = state.userCarts
        .map((cart) => {
          if (selectedCarts[cart.id]) {
            toast.success(`Checked out cart on ${cart.date}`);
            return null;
          }

          const remaining = cart.products.filter(
            (p) => !selectedItems[`${cart.id}-${p.id}`]
          );

          if (remaining.length === 0) {
            toast.success(`Checked out all items from cart on ${cart.date}`);
            return null;
          }

          if (remaining.length < cart.products.length) {
            toast.success(`Checked out selected items from cart on ${cart.date}`);
          }

          return { ...cart, products: remaining };
        })
        .filter(Boolean);

      state.userCarts = updatedCarts;
      localStorage.setItem(`userCarts-${userId}`, JSON.stringify(updatedCarts));
    },

    updateProductQuantity: (state, action) => {
      const { cartId, productId, delta, userId } = action.payload;
      const cartIndex = state.userCarts.findIndex(cart => cart.id === cartId);

      if (cartIndex === -1) return;

      const cart = state.userCarts[cartIndex];
      const productIndex = cart.products.findIndex(p => p.id === productId);

      if (productIndex === -1) return;

      const product = cart.products[productIndex];
      const newQuantity = (product.quantity || 1) + delta;

      if (newQuantity < 1) {
        // Remove product
        cart.products.splice(productIndex, 1);
        if (cart.products.length === 0) {
          state.userCarts.splice(cartIndex, 1);
          toast.success("Cart removed (no more items).");
        } else {
          toast.success(`Removed "${product.title}" from cart.`);
        }
      } else {
        cart.products[productIndex].quantity = newQuantity;
        toast.success(`Updated quantity of "${product.title}" to ${newQuantity}`);
      }

      // Update state and localStorage
      localStorage.setItem(`userCarts-${userId}`, JSON.stringify(state.userCarts));
    },

    removeProductFromCart: (state, action) => {
      const { cartId, productId, userId } = action.payload;
      const cartIndex = state.userCarts.findIndex(cart => cart.id === cartId);

      if (cartIndex === -1) return;

      const cart = state.userCarts[cartIndex];
      cart.products = cart.products.filter(p => p.id !== productId);

      if (cart.products.length === 0) {
        state.userCarts.splice(cartIndex, 1);
        toast.success("Removed cart (no more items).");
      } else {
        state.userCarts[cartIndex] = cart;
        toast.success("Item removed from cart.");
      }

      // Sync with localStorage
      localStorage.setItem(`userCarts-${userId}`, JSON.stringify(state.userCarts));
    },


  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCarts.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserCarts.fulfilled, (state, action) => {
        state.userCarts = action.payload;
      })
      .addCase(fetchUserCarts.rejected, (state) => {
        state.error = "Failed to fetch user carts";
      });
  },
});


export const {
  addToCart,
  setUserCarts,
  clearUserCarts,
  checkoutCarts,
  updateProductQuantity,
  removeProductFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
