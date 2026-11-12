
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminCustomers = lazy(() => import('./pages/AdminCustomers'));


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AnnouncementBar />
          <Navbar />

          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center bg-[#f8f6f1">
                <p className="text-sm tracking-widest text-[#a58a5c]">
                  LOADING SHOPSPHERE...
                  </p>
              </div>
            }
            >

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
          </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

