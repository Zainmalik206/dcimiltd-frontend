// 


const API = "http://localhost:1726/api/v1/reviews";

const getHeaders = () => {
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      ...options,
      headers: getHeaders(),
    });

    // Direct JSON return
    const data = await res.json();

    // Agar backend error bheje to bhi safe
    return data?.ok !== undefined ? data : { ok: false, error: "Invalid response" };

  } catch (err) {
    return { ok: false, error: "Network error" };
  }
};

export const reviewAPI = {
  get: (productId) => safeFetch(`${API}/product/${productId}`),

  add: (productId, comment, address, rating) =>
    safeFetch(`${API}/add`, {
      method: "POST",
      body: JSON.stringify({ productId, comment, address, rating }),
    }),
};
