import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    products: [],
    userCarts: [],
    loading: false,
    error: null,
  },
  reducers: {}  
});


export default cartSlice.reducer;
