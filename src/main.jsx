import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import ShopNext from "./ShopNext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "621801053824-n7k0vc7s0qbnotmgv6dhtgbkgt6mhqeo.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <ShopNext />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import { HelmetProvider } from "react-helmet-async";
// import { Provider } from "react-redux";
// import store from "./redux/store.js";
// import ShopNext from "./ShopNext.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <HelmetProvider>
//       <Provider store={store}>
//         <ShopNext />
//       </Provider>
//     </HelmetProvider>
//   </StrictMode>
// );
