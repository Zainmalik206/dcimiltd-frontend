const calculateSubTotal = (cartData) => {
  let subTotal = 0;
  cartData && cartData.map((item) => (subTotal += item.price * item.qty));
  return subTotal;
};

/* calculate sale price */
export const saleCalc = (price, onSale, discount) => {
  if (onSale) {
    const salePrice = price - (price * discount) / 100;
    return salePrice;
  } else {
    return price;
  }
};

const updateLocalStorage = (cartData) => {
  localStorage.setItem('cartItems', JSON.stringify(cartData));
  localStorage.setItem('subTotal', calculateSubTotal(JSON.stringify(cartData)));
};

export { calculateSubTotal, updateLocalStorage };
