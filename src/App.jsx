import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import MobileNav from "@/components/organisms/MobileNav";
import Home from "@/components/pages/Home";
import ProductDetail from "@/components/pages/ProductDetail";
import CategoryPage from "@/components/pages/CategoryPage";
import CategoriesPage from "@/components/pages/CategoriesPage";
import SearchPage from "@/components/pages/SearchPage";
import CartPage from "@/components/pages/CartPage";
import AdminDashboard from "@/components/pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <MobileNav />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;