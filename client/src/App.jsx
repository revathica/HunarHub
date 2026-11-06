import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Entrepreneurs from "./pages/Entrepreneurs"
import EntrepreneurProfile from "./pages/EntrepreneurProfile"
import Login from "./pages/Login"
import Register from "./pages/Register"
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard"
import ProductDashboard from "./pages/ProductDashboard"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Navbar from "./components/Navbar"
import MyOrders from "./pages/MyOrders"
import EntrepreneurOrders from "./pages/EntrepreneurOrders"
import AdminDashboard from "./pages/AdminDashboard"
import AdminOrders from "./pages/AdminOrders"
import AdminEntrepreneurs from "./pages/AdminEntrepreneurs"
import AdminProducts from "./pages/AdminProducts"
import Review from "./pages/Review"
import ManageCustomers from "./pages/ManageCustomers"
import Profile from "./pages/Profile"
import CreateBusinessProfile from "./pages/CreateBusinessProfile"

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/entrepreneurs"
          element={<Entrepreneurs />}
        />

        <Route
          path="/entrepreneurs/:id"
          element={<EntrepreneurProfile />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/entrepreneur-dashboard"
          element={<EntrepreneurDashboard />}
        />

        <Route
          path="/product-dashboard"
          element={<ProductDashboard />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/my-orders" element={<MyOrders />} />

        <Route
          path="/entrepreneur-orders"
          element={<EntrepreneurOrders />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin/entrepreneurs"
          element={<AdminEntrepreneurs />}
        />

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />
        <Route
          path="/admin/customers"
          element={<ManageCustomers />}
        />
        <Route path="/review/:orderId" 
        element={<Review />}
         />
         <Route path="/profile" 
         element={<Profile />} 
         />
        <Route
          path="/create-business-profile"
          element={<CreateBusinessProfile />}
        /> 

      </Routes>

    </BrowserRouter>
  )
}

export default App