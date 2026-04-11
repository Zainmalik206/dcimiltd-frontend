// import React from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import axios from "axios";
// import apis from "../config/apis.js";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/auth.jsx";
// import { successToast } from "../functions/toastify.js";

// const GoogleLoginButton = () => {
//   const [auth, setAuth] = useAuth();
//   const GOOGLE_AUTH_URL = "http://localhost:1726/api/v1/auth/google";
//   const navigate = useNavigate();

// const handleSuccess = async (credentialResponse) => {
//   try {
//     const res = await axios.post(`${GOOGLE_AUTH_URL}`, {
//       token: credentialResponse.credential,
//     });

//     // Map Google login user to normal user structure
//     const mappedUser = {
//       _id: res.data.user.id,
//       first_name: res.data.user.name.split(" ")[0] || "",
//       last_name: res.data.user.name.split(" ").slice(1).join(" ") || "",
//       email: res.data.user.email,
//       profile_picture: res.data.user.avatar,
//       role: ["user"], // default role, adjust if needed
//       isAdmin: false, // default false
//       mobile_number: "",
//       address: "",
//       city: "",
//       state: "",
//       country: "",
//       zip_code: "",
//       gender: "",
//       dob: "",
//     };

//     const authData = {
//       token: res.data.token,
//       refreshToken: "", // no refresh token from Google login
//       user: mappedUser,
//     };

//     // Save in localStorage & context
//     localStorage.setItem("auth", JSON.stringify(authData));
//     setAuth(authData);

//     navigate("/dashboard");

//   } catch (error) {
//     console.error("Google login failed", error);
//     alert("Google login failed");
//   }
// };


//   const handleError = () => {
//     alert("Google login failed");
//   };

//   return (
//     <div className="flex justify-center">
//       <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
//     </div>
//   );
// };

// export default GoogleLoginButton;
