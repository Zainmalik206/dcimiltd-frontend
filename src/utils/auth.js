// src/utils/auth.js

// get token from localStorage 'auth' object
export const getToken = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth?.token || null;
};

// save full auth object after login
export const setAuth = (auth) => localStorage.setItem("auth", JSON.stringify(auth));

// remove auth object on logout
export const removeAuth = () => localStorage.removeItem("auth");
