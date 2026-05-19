import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsTrash, BsArrowLeft } from 'react-icons/bs';
import { useCart } from '../context/CartContext.jsx';

/* ─── helpers ─────────────────────────────────────────────────────────────── */

// Reconstruit l'URL complète de l'image à partir du nom de fichier stocké en DB
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
  .replace('/api', '');

function imgUrl(image) {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `${BASE_URL}/uploads/${image}`;
}

const PLACEHOLDER = 'https://placehold.co/64x80/EDE7D9/2C5F2E?text=📚';

// Tous les prix affichés en dollars
function fmt(amount) {
  return `${parseFloat(amount || 0).toFixed(2)} $`;
}

const SEUIL_LIVRAISON_GRATUITE = 30;

/* ─── composant ───────────────────────────────────────────────────────────── */

export default function Cart() {
  // ① On récupère TOUT ce qu'il faut depuis CartContext
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal >= SEUIL_LIVRAISON_GRATUITE ? 0 : 4.99;
  const grandTotal = cartTotal + shipping;

  /* ── panier vide ── */
  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper">
        <Container>
          <div className="empty-state">
            <div style={{ fontSize: '4rem' }}>🛒</div>
            <h3 className="mt-3" style={{ fontFamily: 'var(--font-display)' }}>
              Votre panier est vide
            </h3>
            <p className="text-muted">
              Découvrez notre catalogue et ajoutez vos recettes favoris.
            </p>
            <Button variant="primary" onClick={() => navigate('/products')}>
              Parcourir le catalogue
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  /* ── panier rempli ── */
  return (
    <div className="page-wrapper">
      <Container>
        <Button
          variant="link"
          className="ps-0 mb-3 text-muted"
          onClick={() => navigate('/products')}
        >
          <BsArrowLeft className="me-1" /> Continuer les achats
        </Button>

        <h1 className="section-title mb-4">
          Mon panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
        </h1>

        <Row className="g-4">
          {/* ─── tableau des articles ─────────────────────────────── */}
          <Col lg={8}>
            <div
              style={{
                border: '1px solid var(--lg-border)',
                borderRadius: 'var(--card-radius)',
                overflow: 'hidden',
              }}
            >
              <table className="table cart-table mb-0">
                <thead style={{ background: 'var(--lg-cream)' }}>
                  <tr>
                    <th>
                      Recette
                    </th>
                    <th>Prix unitaire</th>
                    <th>Quantité</th>
                    <th>Total ligne</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.ouvrage_id}>
                      {/* vignette + titre */}
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={imgUrl(item.image) || PLACEHOLDER}
                            alt={item.titre}
                            className="cart-item-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = PLACEHOLDER;
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.95rem',
                                color: 'var(--lg-navy)',
                              }}
                            >
                              {item.titre}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--lg-text-muted)' }}>
                              {item.auteur}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* prix unitaire en $ */}
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {fmt(item.prix_unitaire)}
                      </td>

                      {/* contrôles quantité ─ boutons − et + */}
                      <td>
                        <div className="qty-control">
                          <button
                            onClick={() =>
                              updateQuantity(item.ouvrage_id, item.quantite - 1)
                            }
                            aria-label="Diminuer"
                          >
                            −
                          </button>
                          <span style={{ minWidth: '28px', textAlign: 'center' }}>
                            {item.quantite}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.ouvrage_id, item.quantite + 1)
                            }
                            aria-label="Augmenter"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* total ligne en $ */}
                      <td
                        style={{
                          fontWeight: 700,
                          color: 'var(--lg-green)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fmt(parseFloat(item.prix_unitaire) * item.quantite)}
                      </td>

                      {/* supprimer */}
                      <td>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            padding: '0.25rem',
                          }}
                          onClick={() => removeFromCart(item.ouvrage_id)}
                          title="Supprimer cet article"
                        >
                          <BsTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-end">
              <Button variant="outline-danger" size="sm" onClick={clearCart}>
                Vider le panier
              </Button>
            </div>
          </Col>

          {/* ─── récapitulatif ────────────────────────────────────── */}
          <Col lg={4}>
            <div className="cart-summary-box">
              <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.25rem' }}>
                Récapitulatif
              </h5>

              <div className="cart-total-line">
                <span>Sous-total</span>
                <span>{fmt(cartTotal)}</span>
              </div>

              <div className="cart-total-line">
                <span>Livraison</span>
                {shipping === 0 ? (
                  <span style={{ color: 'var(--lg-green)', fontWeight: 600 }}>
                    Gratuite
                  </span>
                ) : (
                  <span>{fmt(shipping)}</span>
                )}
              </div>

              {shipping > 0 && (
                <Alert
                  variant="info"
                  style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                >
                  Plus que{' '}
                  <strong>
                    {fmt(SEUIL_LIVRAISON_GRATUITE - cartTotal)}
                  </strong>{' '}
                  pour la livraison gratuite !
                </Alert>
              )}

              <div className="cart-total-line grand">
                <span>Total</span>
                <span>{fmt(grandTotal)}</span>
              </div>

              <Button
                variant="primary"
                className="w-100 mt-3"
                size="lg"
                onClick={() => navigate('/checkout')}
              >
                Passer la commande
              </Button>
              <Button
                variant="link"
                className="w-100 mt-2 text-muted"
                onClick={() => navigate('/products')}
              >
                Continuer mes achats
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
