import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

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
    const res = await axios.get("https://fakestoreapi.com/carts");
    const userCarts = res.data.filter((cart) => cart.userId === userId);
    console.log(userCarts);

    // return userCarts.map((cart) => ({
    const mappedCarts = userCarts.map((cart) => ({
      ...cart,
      products: cart.products.map((p) => {
        const full = productList.find((fp) => fp.id === p.productId);
        return full
          ? { ...full, quantity: p.quantity || 1 }
          : { id: p.productId, title: "Unknown", price: 0, quantity: p.quantity || 1 };
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
      const res = await axios.put(`https://fakestoreapi.com/carts/${cart.id}`, {
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
  "cart/updateCartApi",
  async (cart, { rejectWithValue }) => {
    try {
      const res = await axios.put(`https://fakestoreapi.com/carts/${cart.id}`, {
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
      const res = await axios.post("https://fakestoreapi.com/carts", {
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
      await axios.delete(`https://fakestoreapi.com/carts/${cartId}`);
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
