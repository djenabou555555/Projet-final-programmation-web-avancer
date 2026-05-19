import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { BsArrowLeft } from 'react-icons/bs';
import BookCard from '../components/BookCard.jsx';
import api from '../../api/axios.js';

const CAT_ICONS = ['🍽️', '🥐', '🍰', '🥗', '🍷', '🍜', '🥩', '🧁', '🫕', '🍱'];

export default function Categories() {
  const [categories, setCategories]     = useState([]);
  const [allBooks, setAllBooks]         = useState([]);   // tous les ouvrages
  const [selected, setSelected]         = useState(null); // catégorie active {id, nom}
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  // ① Charger catégories ET ouvrages en une seule fois au montage
  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/ouvrages')])
      .then(([cRes, bRes]) => {
        setCategories(cRes.data);
        setAllBooks(bRes.data);
      })
      .catch(() => setError('Impossible de charger les données.'))
      .finally(() => setLoading(false));
  }, []);

  // ② Filtrage côté front : on garde uniquement les recettes dont
  //    categorie_id correspond à la catégorie sélectionnée.
  //    Si aucune catégorie sélectionnée → on n'affiche pas de livre.
  const filteredBooks = selected
    ? allBooks.filter(
        (b) => String(b.categorie_id) === String(selected.id)
      )
    : [];

  /* ─── rendu ─────────────────────────────────────────────────── */
  return (
    <div className="page-wrapper">
      <Container>

        {/* En-tête dynamique selon si on est en mode "liste" ou "détail" */}
        {selected ? (
          /* ── vue détail d'une catégorie ── */
          <>
            <Button
              variant="link"
              className="ps-0 mb-3 text-muted"
              onClick={() => setSelected(null)}
            >
              <BsArrowLeft className="me-1" /> Toutes les catégories
            </Button>

            <h1 className="section-title mb-1">
              {CAT_ICONS[categories.findIndex((c) => c.id === selected.id) % CAT_ICONS.length]}{' '}
              {selected.nom}
            </h1>
            <p className="text-muted mb-4">
              {filteredBooks.length} recette{filteredBooks.length !== 1 ? 's' : ''} dans cette catégorie
            </p>

            {filteredBooks.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '3rem' }}>📭</div>
                <p className="mt-3">Aucune recette dans cette catégorie pour l'instant.</p>
              </div>
            ) : (
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {filteredBooks.map((book) => (
                  <Col key={book.id}>
                    <BookCard book={book} />
                  </Col>
                ))}
              </Row>
            )}
          </>
        ) : (
          /* ── vue liste des catégories ── */
          <>
            <h1 className="section-title mb-2">Catégories</h1>
            <p className="text-muted mb-4">
              Cliquez sur une catégorie pour voir les recettes correspondants.
            </p>

            {loading && (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
              </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {categories.map((cat, i) => {
                  // Nombre de recettes dans cette catégorie
                  const count = allBooks.filter(
                    (b) => String(b.categorie_id) === String(cat.id)
                  ).length;

                  return (
                    <Col key={cat.id}>
                      <Card
                        className="h-100 text-center"
                        style={{
                          border: '1px solid var(--lg-border)',
                          borderRadius: 'var(--card-radius)',
                          cursor: 'pointer',
                          transition: 'box-shadow 0.2s, transform 0.2s',
                        }}
                        onClick={() => setSelected(cat)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            '0 6px 24px rgba(0,0,0,0.12)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <Card.Body className="p-4">
                          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                            {CAT_ICONS[i % CAT_ICONS.length]}
                          </div>
                          <Card.Title
                            style={{
                              fontFamily: 'var(--font-display)',
                              color: 'var(--lg-navy)',
                              fontSize: '1rem',
                              marginBottom: '0.25rem',
                            }}
                          >
                            {cat.nom}
                          </Card.Title>
                          {cat.description && (
                            <Card.Text
                              style={{
                                fontSize: '0.82rem',
                                color: 'var(--lg-text-muted)',
                                marginBottom: '0.5rem',
                              }}
                            >
                              {cat.description}
                            </Card.Text>
                          )}
                          {/* badge nombre de recettes */}
                          <span
                            style={{
                              background: 'var(--lg-green)',
                              color: 'white',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              padding: '0.15rem 0.65rem',
                              fontWeight: 700,
                            }}
                          >
                            {count} recette{count !== 1 ? 's' : ''}
                          </span>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
