import './App.css';
import Header from './components/Header/Header.jsx';
import Banner from './components/Banner/Banner.jsx';
import ProductList from './components/ProductList/ProductList.jsx';
import Footer from './components/Footer/Footer.jsx';
import Register from './components/Register/Register.jsx';
import Login from './components/Login/Login.jsx';
import CartPage from './components/CartPage/CartPage.jsx';
import ProductDetail from './components/ProductDetail/ProductDetail.jsx';
import CategoryProducts from './components/CategoryProducts/CategoryProducts.jsx';
import AdminPanel from './components/AdminPanel/AdminPanel.jsx';
import SearchResults from './components/SearchResults/SearchResults.jsx';
import AdminRoute from './components/AdminRoute/AdminRoute.jsx';
import Profile from './pages/Profile.jsx';
import Orders from './pages/Orders.jsx';
import SellerPanel from './pages/SellerPanel.jsx';
import StorePage from './pages/StorePage.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <div className="mt-8">
                    <Banner />
                  </div>
                  <ProductList />
                </>
              } />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:id" element={<CategoryProducts />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              } />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/seller-panel" element={<SellerPanel />} />
              <Route path="/store/:name" element={<StorePage />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
