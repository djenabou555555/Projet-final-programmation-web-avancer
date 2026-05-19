import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsSearch, BsTruck, BsAward, BsStar } from 'react-icons/bs';
import { TbTrendingUp } from 'react-icons/tb';
import BookCard from '../components/BookCard.jsx';
import api from '../../api/axios.js';

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/ouvrages')
      .then((res) => setBooks(res.data.slice(0, 6)))
      .catch(() => setError('Impossible de charger les recettes. Veuillez réessayer.'))
      .finally(() => setLoading(false));
  }, []);

  const badges = [
    { icon: <BsTruck size={20} />, title: 'Livraison gratuite', sub: "Dès 30$ d'achat" },
    { icon: <BsAward size={20} />, title: 'Qualité garantie', sub: 'Recettes sélectionnées avec soin' },
    { icon: <BsStar size={20} />, title: 'Avis vérifiés', sub: 'Par nos clients' },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-section">
        <Container>
          <h1>Découvrez votre prochaine<br />recette favorite</h1>
          <p>
            La plus grande collection de recettes en français.
            Des classiques intemporels aux nouveautés tendance.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
              <BsSearch className="me-2" />
              Rechercher une recette
            </Button>
            <Button variant="outline-dark" size="lg" onClick={() => navigate('/categories')}>
              Parcourir les catégories
            </Button>
          </div>
        </Container>
      </section>

      {/* ── Trust badges ── */}
      <section className="hero-badges">
        <Container>
          <Row className="justify-content-center gy-3">
            {badges.map((b, i) => (
              <Col key={i} xs={12} sm={4} className="d-flex justify-content-center">
                <div className="hero-badge-item">
                  <div className="hero-badge-icon">{b.icon}</div>
                  <div className="hero-badge-text">
                    <h6>{b.title}</h6>
                    <p>{b.sub}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Popular books ── */}
      <section style={{ padding: 'var(--section-gap) 0' }}>
        <Container>
          <h2 className="section-title">
            <TbTrendingUp /> Recettes populaires
          </h2>

          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <Row xs={1} sm={2} md={3} className="g-4">
              {books.map((book) => (
                <Col key={book.id}>
                  <BookCard book={book} />
                </Col>
              ))}
            </Row>
          )}

          {!loading && !error && (
            <div className="text-center mt-5">
              <Button variant="outline-primary" size="lg" onClick={() => navigate('/products')}>
                Voir tous les recettes
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
