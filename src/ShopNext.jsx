


import React from 'react'
import App from './App'
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";


const ShopNext = () => (
  <div>
    <h1>
      <App />
    </h1>
  </div>
)

export default ShopNext




// import React from "react";
// import App from "./App";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// // 👇 Apna actual Google Client ID yahan daalo
// const GOOGLE_CLIENT_ID = "621801053824-n7k0vc7s0qbnotmgv6dhtgbkgt6mhqeo.apps.googleusercontent.com";

// const ShopNext = () => {
//   return (
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//       <App />
//     </GoogleOAuthProvider>
//   );
// };

// export default ShopNext;
