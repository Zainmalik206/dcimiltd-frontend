
// import {useEffect, useContext, createContext, useState,children} from 'react'


// const AuthContext = createContext()

// const AuthProvider = ({children})=> {

//   const [auth, setAuth] = useState(() => {
//   return JSON.parse(localStorage.getItem("auth")) || { user: null, token: '', refreshToken: '' };
// });

//    useEffect(()=>{
//           const userAuth = JSON.parse(localStorage.getItem("auth"))
//           userAuth && setAuth(userAuth)
//    },[])

//       return(
//          <AuthContext.Provider value={[auth, setAuth]}>
//                     {children}
//        </AuthContext.Provider>
//       )
        
// }



// export default AuthProvider;

// export const useAuth =()=> useContext(AuthContext)









import { useEffect, useContext, createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem("auth");
      return saved ? JSON.parse(saved) : { user: null, token: '', refreshToken: '' };
    } catch {
      return { user: null, token: '', refreshToken: '' };
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      try {
        setAuth(JSON.parse(saved));
      } catch (err) {
        console.error("Invalid auth data");
      }
    }
  }, []);

  useEffect(() => {
    if (auth?.token) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  // Google Login Function
  const loginWithGoogle = async (googleToken) => {
    try {
      const res = await fetch("http://localhost:1726/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await res.json();

      if (data.success) {
        const newAuth = {
          user: data.user,
          token: data.token,
          refreshToken: ""
        };
        setAuth(newAuth);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    setAuth({ user: null, token: '', refreshToken: '' });
  };

  return (
    <AuthContext.Provider value={[auth, setAuth, { loginWithGoogle, logout }]}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth =()=> useContext(AuthContext)
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   const [auth, setAuth, actions] = context;
//   return [auth, setAuth, actions];
// };