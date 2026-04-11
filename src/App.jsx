// App.jsx (pura code, sirf dashboard section change kia hai)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Login from "./pages/authorization/Login";
import Contactus from "./pages/Contactus";
import Navigation from "./layouts/Navigation";
import Signup from "./pages/authorization/Signup";
import ForgetPassword from "./pages/authorization/ForgetPassword";
import Footer from "./pages/Footer";
import SinglePage from "./pages/SinglePage";
import { ToastContainer } from "react-toastify";
import ActivateAccount from "./pages/authorization/ActivateAccount";
import ChangePassword from "./pages/ChangePassword";
import AuthProvider from "./context/auth";
import Profile from "./pages/dashboard/Profile";
import ViewProducts from "./pages/dashboard/ViewProducts";
import Cart from "./layouts/Cart";
import FAQs from "./pages/FAQs";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import TermsConditions from "./pages/TermsConditions";
import Checkout from "./pages/Checkout";
import EditProduct from "./pages/dashboard/EditProduct";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/orderDetails";
import SearchResults from "./pages/SearchResults";
import AdminOrders from "./pages/dashboard/AdminOrders";
import WishlistPage from "./pages/WishlistPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout"; // NEW IMPORT
import UserDashboard from "./pages/dashboard/UserDashboard"; // Import if needed for dashboard content
import AdminDashboard from "./pages/dashboard/AdminDashboard"; // Import if needed
import ProtectedDashboard from "./pages/dashboard/ProtectedDashboard"; // Keep if you want role check
import FreeShippingStatus from "./layouts/FreeShippngStatus";
import UsersPage from "./pages/dashboard/UsersPage"; // Import UsersPage
import AddProduct from './pages/dashboard/AddProduct'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <FreeShippingStatus />
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<SinglePage />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/cart" element={<Cart />} />

          {/* Authorization pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/activate/:token" element={<ActivateAccount />} />
          <Route path="/access/:token" element={<ChangePassword />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard Layout with nested routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<ProtectedDashboard />} /> {/* Role check yahan */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/view-products" element={<ViewProducts />} />
            <Route path="/all-users" element={<UsersPage />} />
            <Route path="/admin-orders" element={<AdminOrders />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            {/* Add more dashboard pages here, like /addresses */}
          </Route>

          {/* Other protected or non-dashboard routes */}
          <Route path="/dashboard/add-product" element={<AddProduct />} /> {/* If not in layout */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard/edit-product/:id" element={<EditProduct />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Static pages */}
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/returns-policy" element={<ReturnPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;