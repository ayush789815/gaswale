import "./App.css";
import { Layout } from "./components";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import FAQ from "./pages/FAQ";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import Cart from "./pages/Cart";
import Services from "./pages/Services";
import ProductDetail from "./pages/ProductDetail";
import OrderDetails from "./pages/OrderDetails";
import AddressSelection from "./pages/AddressSelection";
import PaymentTypeSelection from "./pages/PaymentTypeSelection";
// import PaymentDetail from "./pages/dashboard/PaymentDetail";
import AboutUs from "./pages/AboutUs";
import Policies from "./pages/Policies";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<Products />} />
          <Route path="/products/detail/:id" element={<ProductDetail />} />
          <Route path="/faqs" element={<FAQ />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/services" element={<Services />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/order-detail/:id" element={<OrderDetails />} />
          <Route path="place-order/address" element={<AddressSelection />} />
          <Route path="/payment-type-selection" element={<PaymentTypeSelection />} />
          {/* <Route path="/payment-detail/:id" element={<PaymentDetail />} /> */}



          <Route path="/cart" element={<Cart />} />
          
          {/* <Route path="/services" element={<Services />} /> */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/policies" element={<Policies />} />
          {/* <Route path="/contact" element={<ContactUs />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Layout>
      <ToastContainer autoClose={1000} />
    </BrowserRouter>
  );
}

export default App;
