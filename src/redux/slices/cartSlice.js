import { createSlice } from "@reduxjs/toolkit";
import { successToast, errorToast, cartToast, warningToast } from '../../functions/toastify'

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  shippingPrice: 0,
  subtotal: 0,
  totalPrice: 0,
}; 

const saveCart = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const calculateTotals = (state) => {
  state.subtotal = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  state.shippingPrice = state.subtotal >= 75 || state.subtotal === 0 ? 0 : 1;
  state.totalPrice = state.subtotal + state.shippingPrice;
  saveCart(state.cartItems);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      const existing = state.cartItems.find((i) => i._id === payload._id);

      if (existing) {
        if (existing.quantity + 1 <= payload.stock) {
          existing.quantity += 1;
          // ✅ Sirf title aur quantity increased
          cartToast(`${payload.title} quantity increased`);
        } else {
          errorToast(`Only ${payload.stock} items available`);
        }
      } else {
        if (payload.stock > 0) {
          state.cartItems.push({ ...payload, quantity: 1 });
          // ✅ Pehli dfa sirf Added to cart (Title hata diya for clean look)
          successToast("Added to cart");
        } else {
          errorToast("Out of stock");
        }
      }
      calculateTotals(state);
    },

    increaseQty: (state, { payload }) => {
      const item = state.cartItems.find((i) => i._id === payload);
      if (item) {
        if (item.quantity + 1 <= item.stock) {
          item.quantity += 1;
          cartToast(`${item.title} quantity increased`);
        } else {
          errorToast(`Only ${item.stock} items available`);
        }
      }
      calculateTotals(state);
    },

    decreaseQty: (state, { payload }) => {
      const item = state.cartItems.find((i) => i._id === payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter((i) => i._id !== payload);
          warningToast("Item removed from cart");
        }
      }
      calculateTotals(state);
    },

    removeFromCart: (state, { payload }) => {
      state.cartItems = state.cartItems.filter((i) => i._id !== payload);
      warningToast("Item removed from cart");
      calculateTotals(state);
    },

    clearCart: (state) => {
      state.cartItems = [];
      warningToast("Cart cleared");
      calculateTotals(state);
    },
  },
});

export const { addToCart, increaseQty, decreaseQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;