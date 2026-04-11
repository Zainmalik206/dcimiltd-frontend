import { configureStore, combineReducers } from "@reduxjs/toolkit";
import productSlice from "./slices/prodSlice";
import cartSlice from "./slices/cartSlice";


const reducer = combineReducers({
  prodSlice: productSlice,
  cart: cartSlice,
 
});

const store = configureStore({ reducer });
export default store;
