// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import apis from "../../config/apis";

// export const getOrderDetails = createAsyncThunk(
//   "orderDetails/getOrderDetails",
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(`${apis.orders}/${id}`);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// const orderDetailsSlice = createSlice({
//   name: "orderDetails",
//   initialState: { order: null, loading: false, error: null },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getOrderDetails.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getOrderDetails.fulfilled, (state, action) => {
//         state.loading = false;
//         state.order = action.payload;
//       })
//       .addCase(getOrderDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default orderDetailsSlice.reducer;