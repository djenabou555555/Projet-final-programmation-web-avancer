import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { BsSearch, BsXCircle } from 'react-icons/bs';
import BookCard from '../components/BookCard.jsx';
import api from '../../api/axios.js';

export default function Products() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  useEffect(() => {
    Promise.all([api.get('/ouvrages'), api.get('/categories')])
      .then(([bRes, cRes]) => {
        setBooks(bRes.data);
        setCategories(cRes.data);
      })
      .catch(() => setError('Impossible de charger les données.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = books.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      b.titre.toLowerCase().includes(q) ||
      b.auteur.toLowerCase().includes(q) ||
      (b.isbn && b.isbn.toLowerCase().includes(q));
    const matchCat = !selectedCat || String(b.categorie_id) === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="page-wrapper">
      <Container>
        <h1 className="section-title mb-4">Catalogue de recettes</h1>

        {/* Search & Filter bar */}
        <Row className="mb-4 g-3">
          <Col md={7}>
            <InputGroup>
              <InputGroup.Text><BsSearch /></InputGroup.Text>
              <Form.Control
                placeholder="Rechercher par titre, auteur ou ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <Button variant="outline-secondary" onClick={() => setSearch('')}>
                  <BsXCircle />
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={5}>
            <Form.Select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
              <option value="">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {loading && <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>📭</div>
            <p className="mt-3">Aucune recette trouvée pour cette recherche.</p>
            <Button variant="outline-primary" onClick={() => { setSearch(''); setSelectedCat(''); }}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-muted mb-3">{filtered.length} recette{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}</p>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {filtered.map((book) => (
                <Col key={book.id}>
                  <BookCard book={book} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}
