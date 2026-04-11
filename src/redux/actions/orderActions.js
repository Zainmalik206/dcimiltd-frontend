// import { createOrder } from "../slices/ordersSlice";
// import { listMyOrders } from "../slices/orderListSlice"; // Yeh add karo
// import { clearCartItems } from "./cartActions";
// import { getOrderDetails } from "../slices/orderDetailsSlice";

// export const placeOrder = (orderData) => async (dispatch) => {
//   try {
//     const result = await dispatch(createOrder(orderData));
//     if (result.error) throw result.error;

//     dispatch(clearCartItems());
//     localStorage.removeItem("cartItems");
//     return result.payload;
//   } catch (error) {
//     throw error;
//   }
// };



// export { getOrderDetails }; // Add this

// // Export listMyOrders
// export { listMyOrders };