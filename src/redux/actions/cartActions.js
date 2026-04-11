import { addToCart, removeFromCart, increaseQty, decreaseQty, clearCart } from "../slices/cartSlice";

export const addItemToCart = (product) => (dispatch) => {
  dispatch(addToCart(product));
};

export const removeItemFromCart = (id) => (dispatch) => {
  dispatch(removeFromCart(id));
};

export const increaseItemQty = (id) => (dispatch) => {
  dispatch(increaseQty(id));
};

export const decreaseItemQty = (id) => (dispatch) => {
  dispatch(decreaseQty(id));
};

export const clearCartItems = () => (dispatch) => {
  dispatch(clearCart());
};
