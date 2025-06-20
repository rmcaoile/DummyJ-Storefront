import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserCarts = createAsyncThunk(
  "cart/fetchUserCarts",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState();
    const productList = state.products.items;

    const res = await axios.get("https://fakestoreapi.com/carts");
    const userCarts = res.data.filter((cart) => cart.userId === userId);
    console.log(userCarts);

    return userCarts.map((cart) => ({
      ...cart,
      products: cart.products.map((p) => {
        const full = productList.find((fp) => fp.id === p.productId);
        return full
          ? { ...full, quantity: p.quantity || 1 }
          : { id: p.productId, title: "Unknown", price: 0, quantity: p.quantity || 1 };
      }),
    }));
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
      const { userId, product } = action.payload;
      const today = new Date().toISOString().split("T")[0];
      const cartIndex = state.userCarts.findIndex((cart) => cart.userId === userId && cart.date === today);

      if (cartIndex !== -1) {
        const cart = state.userCarts[cartIndex];
        const productIndex = cart.products.findIndex((p) => p.id === product.id);

        if (productIndex !== -1) {
          cart.products[productIndex].quantity += 1;
        } else {
          cart.products.push({ ...product, quantity: 1 });
        }
      } else {
        const newCart = {
          id: Date.now(),
          userId,
          date: today,
          products: [{ ...product, quantity: 1 }],
        };
        state.userCarts.unshift(newCart);
      }

      localStorage.setItem(`userCarts-${userId}`, JSON.stringify(state.userCarts));
    },
    setUserCarts(state, action) {
      state.userCarts = action.payload;
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

export const { addToCart, setUserCarts } = cartSlice.actions;
export default cartSlice.reducer;
