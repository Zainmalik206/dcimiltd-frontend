import { configureStore, combineReducers } from "@reduxjs/toolkit";
import productSlice from "./slices/prodSlice";
import cartSlice from "./slices/cartSlice";
///import orderSlice from "./slices/ordersSlice";

// import orderListSlice from "./slices/orderListSlice";
///import orderDetailsSlice from "./slices/orderDetailsSlice";


////import authSlice from './slices/authSlice'

const reducer = combineReducers({
  prodSlice: productSlice,
  cart: cartSlice,
  ///order: orderSlice,
  //orderList: orderListSlice,
  ///orderDetails: orderDetailsSlice,
  /// auth: authSlice
});

const store = configureStore({ reducer });
export default store;
