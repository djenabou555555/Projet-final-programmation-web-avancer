import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import HomePage      from './pages/HomePage.jsx';
import Products      from './pages/Products.jsx';
import ProductPage   from './pages/ProductPage.jsx';
import Cart          from './pages/Cart.jsx';
import Checkout      from './pages/Checkout.jsx';
import Categories    from './pages/Categories.jsx';
import Login         from './pages/Login.jsx';
import Register      from './pages/Register.jsx';

import AdminLayout    from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminOuvrages  from './pages/admin/AdminOuvrages.jsx';
import AdminCommandes from './pages/admin/AdminCommandes.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout><HomePage    /></Layout>} path="/"            />
      <Route element={<Layout><Products    /></Layout>} path="/products"    />
      <Route element={<Layout><ProductPage /></Layout>} path="/products/:id"/>
      <Route element={<Layout><Cart        /></Layout>} path="/cart"        />
      <Route element={<Layout><Checkout    /></Layout>} path="/checkout"    />
      <Route element={<Layout><Categories  /></Layout>} path="/categories"  />
      <Route element={<Layout><Login       /></Layout>} path="/login"       />
      <Route element={<Layout><Register    /></Layout>} path="/register"    />

      <Route
        path="/admin"
        element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="ouvrages"  element={<AdminOuvrages  />} />
        <Route path="commandes" element={<AdminCommandes />} />
      </Route>
    </Routes>
  );
}