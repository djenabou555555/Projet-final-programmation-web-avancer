import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import AppRoutes from './routes.jsx';
import '../styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  );
}
