import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsSearch, BsPerson, BsCart3, BsBoxArrowRight } from 'react-icons/bs';
import { useCart } from '../context/CartContext.jsx';

// Base du serveur backend (ex: http://localhost:3000)
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
  .replace('/api', '');

// Le Logo.png est à la RACINE du backend, pas dans /uploads
// Express le sert via : app.use('/logo', express.static('Logo.png'))
// OU on le copie dans uploads/ — voir instructions ci-dessous
const LOGO_URL = `${BASE_URL}/uploads/Logo.png`;

export default function NavBar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Navbar className="lg-navbar" expand="md" sticky="top">
      <Container>
        {/* ── Brand avec logo réel ── */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <img
            src={LOGO_URL}
            alt="Livre Gourmand"
            height="48"
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'inline';
            }}
          />
          {/* Fallback texte si image absente */}
          <span className="navbar-brand-text" style={{ display: 'none' }}>
            📚 Livre Gourmand
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">Accueil</Nav.Link>
            <Nav.Link as={Link} to="/products">Recherche</Nav.Link>
            <Nav.Link as={Link} to="/categories">Catégories</Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-2">
            <button className="cart-badge-btn" onClick={() => navigate('/products')} title="Rechercher">
              <BsSearch style={{ fontSize: '1.1rem', color: 'var(--lg-navy)' }} />
            </button>

            {user ? (
              <>
                {(user.role === 'administrateur' || user.role === 'gestionnaire') && (
                  <button className="cart-badge-btn" onClick={() => navigate('/admin')} title="Administration">
                    <BsPerson style={{ fontSize: '1.2rem', color: 'var(--lg-navy)' }} />
                  </button>
                )}
                <button className="cart-badge-btn" onClick={handleLogout} title="Déconnexion">
                  <BsBoxArrowRight style={{ fontSize: '1.2rem', color: 'var(--lg-navy)' }} />
                </button>
              </>
            ) : (
              <button className="cart-badge-btn" onClick={() => navigate('/login')} title="Connexion">
                <BsPerson style={{ fontSize: '1.2rem', color: 'var(--lg-navy)' }} />
              </button>
            )}

            <button className="cart-badge-btn" onClick={() => navigate('/cart')} title="Panier">
              <BsCart3 style={{ fontSize: '1.2rem', color: 'var(--lg-navy)' }} />
              {cartCount > 0 && (
                <span className="cart-badge-count">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
