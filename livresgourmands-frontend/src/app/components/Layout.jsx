import NavBar from './NavBar.jsx';
import { Container } from 'react-bootstrap';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');

export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <footer style={{ background: 'var(--lg-navy)', color: 'rgba(255,255,255,0.6)', padding: '2.5rem 0', marginTop: '4rem' }}>
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src={`${BASE_URL}/uploads/Logo.png`}
                alt="Recettes Gourmandes"
                height="55"
                style={{ objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <span style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '1.1rem' }}>
                  Recettes Gourmandes
                </span>
                <p className="mb-0 mt-1" style={{ fontSize: '0.85rem' }}>
                  La plus grande collection de recettes en français.
                </p>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} Recettes Gourmandes — Tous droits réservés
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}