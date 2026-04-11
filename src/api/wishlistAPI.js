// src/api/wishlistAPI.js
const API = "https://dc-imi-ltd-backend.vercel.app/api/v1/wishlist";

const getGuestId = () => {
  let id = localStorage.getItem("guest_wishlist_id");
  if (!id) {
    id = "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("guest_wishlist_id", id);
  }
  return id;
};

const getHeaders = () => {
  const auth = localStorage.getItem("auth");
  const token = auth ? JSON.parse(auth).token : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    "X-Guest-ID": getGuestId(),
  };
};

const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, { ...options, headers: getHeaders() });
    const data = await res.json();

    // ---------- GUEST SYNC ----------
    const guestId = getGuestId();
    if (data.ok && data.wishlist && guestId.startsWith("guest_")) {
      localStorage.setItem(`wishlist_${guestId}`, JSON.stringify(data.wishlist));
    }

    return data;
  } catch (err) {
    return { ok: false, error: "Network error" };
  }
};

export const wishlistAPI = {
  get: () => safeFetch(`${API}/get`),
  add: (productId) =>
    safeFetch(`${API}/add`, {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),
  remove: (productId) =>
    safeFetch(`${API}/remove`, {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),
};