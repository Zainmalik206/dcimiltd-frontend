// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import apis from "../../config/apis";

// const initialState = {
//   order: null,
//   loading: false,
//   error: null,
//   success: false, // Yeh add karo
// };

// export const createOrder = createAsyncThunk(
//   "order/createOrder",
//   async (orderData, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.post(`${apis.orders}`, orderData);
//       return data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message
//       );
//     }
//   }
// );

// const orderSlice = createSlice({
//   name: "order",
//   initialState,
//   reducers: {
//     clearOrder: (state) => {
//       state.order = null;
//       state.success = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createOrder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(createOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.order = action.payload;
//         state.success = true; // Yeh zaroori hai
//       })
//       .addCase(createOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.success = false;
//       });
//   },
// });

// export const { clearOrder } = orderSlice.actions;
// export default orderSlice.reducer;