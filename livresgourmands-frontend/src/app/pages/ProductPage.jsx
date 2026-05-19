import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import {
  BsCartPlus, BsArrowLeft, BsStarFill, BsStar,
  BsTruck, BsShieldCheck, BsChatLeftText,
} from 'react-icons/bs';
import { useCart } from '../context/CartContext.jsx';
import api from '../../api/axios.js';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
  .replace('/api', '');

function imgUrl(image) {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `${BASE_URL}/uploads/${image}`;
}

const PLACEHOLDER = 'https://placehold.co/400x530/EDE7D9/2C5F2E?text=📚';

function fmt(amount) {
  return `${parseFloat(amount || 0).toFixed(2)} $`;
}

/* ─── sous-composant : étoiles ─────────────────────────────────────────────── */
function StarRating({ note }) {
  return (
    <span style={{ color: '#f5a623' }}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= note
          ? <BsStarFill key={i} style={{ marginRight: 2 }} />
          : <BsStar key={i} style={{ marginRight: 2, opacity: 0.4 }} />
      )}
    </span>
  );
}

/* ─── données mockées pour les avis ───────────────────────────────────────── */
const MOCK_AVIS = [
  { id: 1, auteur: 'Marie L.', note: 5, commentaire: 'Excellente recette, recettes claires et délicieuses. Je le recommande vivement !' },
  { id: 2, auteur: 'Jean-Pierre D.', note: 4, commentaire: 'Très bonne sélection de recettes. Photos magnifiques, explications précises.' },
  { id: 3, auteur: 'Sophie M.', note: 5, commentaire: 'Parfait pour débuter en cuisine. Les recettes sont accessibles et savoureuses.' },
];

/* ─── composant principal ─────────────────────────────────────────────────── */
export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    // Charge la recette + essaie de charger les vrais avis (fallback sur mock)
    Promise.all([
      api.get(`/ouvrages/${id}`),
      api.get(`/ouvrages/${id}/avis`).catch(() => ({ data: [] })),
    ])
      .then(([bookRes, avisRes]) => {
        setBook(bookRes.data);
        const avisData = Array.isArray(avisRes.data) ? avisRes.data : [];
        setAvis(avisData.length > 0 ? avisData : MOCK_AVIS);
      })
      .catch(() => setError('Recette introuvable.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart(book, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  /* ── états de chargement ── */
  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );

  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  const notemoyenne =
    avis.length > 0
      ? Math.round(avis.reduce((s, a) => s + a.note, 0) / avis.length)
      : 0;

  /* ── rendu ── */
  return (
    <div className="page-wrapper">
      <Container>
        {/* Retour */}
        <Button
          variant="link"
          className="ps-0 mb-4 text-muted"
          onClick={() => navigate(-1)}
        >
          <BsArrowLeft className="me-1" /> Retour
        </Button>

        {/* ────────────────── BLOC 1 : image + infos ────────────────── */}
        <Row className="g-5 mb-5">
          {/* image */}
          <Col md={4}>
            <div className="product-image-wrapper">
              <img
                src={imgUrl(book.image) || PLACEHOLDER}
                alt={book.titre}
                onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
              />
            </div>
          </Col>

          {/* infos */}
          <Col md={8}>
            {book.categorie_nom && (
              <Badge
                bg="success"
                className="mb-2"
                style={{ background: 'var(--lg-green) !important' }}
              >
                {book.categorie_nom}
              </Badge>
            )}

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--lg-navy)',
              }}
            >
              {book.titre}
            </h1>

            <p className="text-muted mb-1">
              par <strong>{book.auteur}</strong>
            </p>

            {book.isbn && (
              <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                ISBN : {book.isbn}
              </p>
            )}

            {/* note résumée */}
            {avis.length > 0 && (
              <div className="d-flex align-items-center gap-2 mb-3">
                <StarRating note={notemoyenne} />
                <span style={{ fontSize: '0.85rem', color: 'var(--lg-text-muted)' }}>
                  ({avis.length} avis)
                </span>
              </div>
            )}

            {/* prix en $ */}
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--lg-green)',
                marginBottom: '1rem',
              }}
            >
              {fmt(book.prix)}
            </div>

            {book.stock > 0 ? (
              <Badge bg="success" className="mb-3">
                En stock ({book.stock} disponibles)
              </Badge>
            ) : (
              <Badge bg="secondary" className="mb-3">
                Épuisé
              </Badge>
            )}

            {book.description && (
              <p
                style={{
                  color: 'var(--lg-text-muted)',
                  lineHeight: 1.8,
                  marginBottom: '1.5rem',
                }}
              >
                {book.description}
              </p>
            )}

            {/* sélecteur quantité + bouton panier */}
            {book.stock > 0 && (
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label mb-0" htmlFor="qty-select">
                    Qté :
                  </label>
                  <select
                    id="qty-select"
                    className="form-select"
                    style={{ width: '80px' }}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {Array.from(
                      { length: Math.min(book.stock, 10) },
                      (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAdd}
                  disabled={added}
                >
                  <BsCartPlus className="me-2" />
                  {added ? 'Ajouté ✓' : 'Ajouter au panier'}
                </Button>
              </div>
            )}
          </Col>
        </Row>

        {/* ────────────────── BLOC 2 : Qualité garantie + Livraison ─── */}
        {/* Placés juste sous le bloc produit, avant les avis */}
        <Row className="g-4 mb-5">
          {/* Qualité garantie */}
          <Col md={6}>
            <div
              style={{
                background: 'var(--lg-cream)',
                border: '1px solid var(--lg-border)',
                borderRadius: 'var(--card-radius)',
                padding: '1.5rem',
                height: '100%',
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <BsShieldCheck size={24} style={{ color: 'var(--lg-green)' }} />
                <h5
                  style={{
                    fontFamily: 'var(--font-display)',
                    marginBottom: 0,
                    color: 'var(--lg-navy)',
                  }}
                >
                  Qualité garantie
                </h5>
              </div>
              <ul
                style={{
                  paddingLeft: '1.25rem',
                  color: 'var(--lg-text-muted)',
                  lineHeight: 2,
                  marginBottom: 0,
                }}
              >
                <li> Des Recettes sélectionnés avec soin par notre équipe éditoriale</li>
                <li>Éditions originales et authentiques</li>
                <li>Satisfaction garantie ou remboursement sous 30 jours</li>
                <li>Emballage soigné pour une livraison sans dommages</li>
              </ul>
            </div>
          </Col>

          {/* Livraison */}
          <Col md={6}>
            <div
              style={{
                background: 'var(--lg-cream)',
                border: '1px solid var(--lg-border)',
                borderRadius: 'var(--card-radius)',
                padding: '1.5rem',
                height: '100%',
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <BsTruck size={24} style={{ color: 'var(--lg-green)' }} />
                <h5
                  style={{
                    fontFamily: 'var(--font-display)',
                    marginBottom: 0,
                    color: 'var(--lg-navy)',
                  }}
                >
                  Livraison
                </h5>
              </div>
              <ul
                style={{
                  paddingLeft: '1.25rem',
                  color: 'var(--lg-text-muted)',
                  lineHeight: 2,
                  marginBottom: 0,
                }}
              >
                <li>
                  <strong style={{ color: 'var(--lg-green)' }}>
                    Livraison gratuite
                  </strong>{' '}
                  dès 50 $ d'achat
                </li>
                <li>Livraison standard : 4,99 $ — 3 à 5 jours ouvrés</li>
                <li>Livraison express : 9,99 $ — 24 à 48 h</li>
                <li>Retrait en point relais disponible</li>
              </ul>
            </div>
          </Col>
        </Row>

        {/* ────────────────── BLOC 3 : Avis des clients ─────────────── */}
        {/* Placés en bas de page, après qualité + livraison */}
        <section>
          <div className="d-flex align-items-center gap-3 mb-4">
            <BsChatLeftText size={22} style={{ color: 'var(--lg-green)' }} />
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                marginBottom: 0,
                color: 'var(--lg-navy)',
              }}
            >
              Avis des clients
            </h4>
            {avis.length > 0 && (
              <span
                style={{
                  background: 'var(--lg-green)',
                  color: 'white',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  padding: '0.1rem 0.6rem',
                  fontWeight: 700,
                }}
              >
                {avis.length}
              </span>
            )}
          </div>

          {avis.length === 0 ? (
            <p style={{ color: 'var(--lg-text-muted)' }}>
              Aucun avis pour l'instant. Soyez le premier à donner votre avis !
            </p>
          ) : (
            <Row className="g-3">
              {avis.map((a) => (
                <Col key={a.id} md={4}>
                  <div
                    style={{
                      background: 'var(--lg-white)',
                      border: '1px solid var(--lg-border)',
                      borderRadius: 'var(--card-radius)',
                      padding: '1.25rem',
                      height: '100%',
                    }}
                  >
                    {/* en-tête : note + auteur */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <StarRating note={a.note} />
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--lg-text-muted)',
                        }}
                      >
                        {a.auteur || a.client_nom || 'Client'}
                      </span>
                    </div>
                    {/* texte de l'avis */}
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--lg-text)',
                        lineHeight: 1.6,
                        marginBottom: 0,
                      }}
                    >
                      {a.commentaire || a.contenu}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </section>
      </Container>
    </div>
  );
}
