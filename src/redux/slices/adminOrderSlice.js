// // src/redux/slices/adminOrderSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import apis from "../../config/apis";

// export const getAllOrders = createAsyncThunk("admin/orders", async (_, { rejectWithValue }) => {
//   try {
//     const { data } = await axios.get(`${apis.orders}`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     });
//     return data;
//   } catch (err) {
//     return rejectWithValue(err.response?.data?.message || err.message);
//   }
// });

// export const updateOrderStatus = createAsyncThunk(
//   "admin/updateStatus",
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.put(`${apis.orders}/${id}/status`, { status }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       return data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// const adminOrderSlice = createSlice({
//   name: "adminOrders",
//   initialState: { orders: [], loading: false, error: null },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllOrders.pending, (state) => { state.loading = true; })
//       .addCase(getAllOrders.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         state.orders = payload;
//       })
//       .addCase(getAllOrders.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload;
//       })
//       .addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
//         const idx = state.orders.findIndex(o => o._id === payload._id);
//         if (idx > -1) state.orders[idx] = payload;
//       });
//   },
// });

// export default adminOrderSlice.reducer;
