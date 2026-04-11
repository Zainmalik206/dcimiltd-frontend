import React, { useEffect, useState, useRef } from "react"; // useRef add kiya
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../layouts/Loader";
import axios from "axios";
import apis from "../../config/apis";
import { errorToast, successToast } from "../../functions/toastify";

const ActivateAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // 1. useRef use karenge taake double call na ho
  const activationStarted = useRef(false);

  useEffect(() => {
    // 2. Sirf tab chale jab token ho aur pehle na chala ho
    if (token && !activationStarted.current) {
      activationStarted.current = true; // Mark as started
      activateAccount();
    }
  }, [token]);

  const activateAccount = async () => {
    try {
      const { data } = await axios.post(`${apis.auth}/signup`, { token });

      if (data.error) {
        // Agar error ho toh toast dikhao
        errorToast(data.error);
        navigate("/login");
      } else {
        // ✅ SUCCESS: Sirf ye aik toast ayega
        successToast("Your account has been activated!");
        navigate("/login");
      }
    } catch (error) {
      // Catch block tabhi chalega agar network issue ho ya server down ho
      console.log("Error:", error.message);
      // Yahan errorToast ko remove kar diya hai taake "failed" wala msg na aaye
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd]">
      {loading ? (
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-400 font-light tracking-[0.2em] text-xs uppercase animate-pulse">
            Verifying Authentication
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ActivateAccount;