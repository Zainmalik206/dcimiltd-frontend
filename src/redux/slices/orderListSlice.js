// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import apis from "../../config/apis";



// const initialState = {
//   orders: [],     // <-- Array, not undefined
//   loading: false,
//   error: null,
// };

// export const listMyOrders = createAsyncThunk(
//   "orderList/listMyOrders",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(`${apis.orders}/myorders`);
//       return data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message
//       );
//     }
//   }
// );

// const orderListSlice = createSlice({
//   name: "orderList",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(listMyOrders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(listMyOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(listMyOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default orderListSlice.reducer;