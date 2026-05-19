import { Nav, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { BsSpeedometer2, BsBook, BsCart3, BsBoxArrowLeft } from 'react-icons/bs';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: <BsSpeedometer2 /> },
  { to: '/admin/ouvrages', label: 'Ouvrages', icon: <BsBook /> },
  { to: '/admin/commandes', label: 'Commandes', icon: <BsCart3 /> },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="admin-sidebar" style={{ width: '220px', flexShrink: 0 }}>
        <div style={{ padding: '1rem 1.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '1.05rem' }}>
            📚 Admin
          </span>
        </div>
        <Nav className="flex-column">
          {NAV_ITEMS.map((item) => (
            <Nav.Link
              key={item.to}
              as={Link}
              to={item.to}
              className={location.pathname === item.to ? 'active' : ''}
            >
              <span className="me-2">{item.icon}</span> {item.label}
            </Nav.Link>
          ))}
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 1.5rem' }} />
          <Nav.Link onClick={() => navigate('/')} style={{ color: 'rgba(255,255,255,0.7)' }}>
            <span className="me-2"><BsBoxArrowLeft /></span> Retour au site
          </Nav.Link>
        </Nav>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, background: '#F8F9FA', padding: '2.5rem' }}>
        <Outlet />
      </div>
    </div>
  );
}
