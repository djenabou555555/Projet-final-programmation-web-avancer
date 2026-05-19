import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  BsCreditCard2Front, BsLock, BsCheckCircle, BsArrowLeft,
} from 'react-icons/bs';
import { useCart } from '../context/CartContext.jsx';
import api from '../../api/axios.js';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function fmt(amount) {
  return `${parseFloat(amount || 0).toFixed(2)} $`;
}

// Formate le numéro de carte en groupes de 4  →  1234 5678 9012 3456
function formatCardNumber(raw) {
  return raw
    .replace(/\D/g, '')            // supprimer tout ce qui n'est pas chiffre
    .slice(0, 16)                  // max 16 chiffres
    .replace(/(.{4})/g, '$1 ')     // insérer un espace tous les 4 chiffres
    .trimEnd();
}

// Formate la date d'expiration  →  MM/AA
function formatExpiry(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

const SEUIL_LIVRAISON = 30;

/* ─── composant ───────────────────────────────────────────────────────────── */
export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // ── état du formulaire ──────────────────────────────────────────────────────
  const [form, setForm] = useState({
    titulaire:      '',
    numeroCarte:    '',
    expiration:     '',
    cvv:            '',
    adresseFacture: '',
    ville:          '',
    codePostal:     '',
    pays:           'Canada',
  });

  const [touched,   setTouched]   = useState({});
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState(false);
  const [showCvv,   setShowCvv]   = useState(false);

  const shipping  = cartTotal >= SEUIL_LIVRAISON ? 0 : 4.99;
  const grandTotal = cartTotal + shipping;

  // ── validation ──────────────────────────────────────────────────────────────
  const validators = {
    titulaire:      (v) => v.trim().length < 3         ? 'Nom du titulaire requis (min. 3 caractères).' : '',
    numeroCarte:    (v) => v.replace(/\s/g, '').length !== 16 ? 'Numéro de carte invalide (16 chiffres).'    : '',
    expiration:     (v) => {
      const [mm, yy] = v.split('/');
      const month = parseInt(mm, 10);
      const year  = parseInt('20' + yy, 10);
      const now   = new Date();
      if (!mm || !yy || mm.length !== 2 || yy.length !== 2) return 'Format MM/AA requis.';
      if (month < 1 || month > 12)                           return 'Mois invalide.';
      if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1))
        return 'Carte expirée.';
      return '';
    },
    cvv:            (v) => !/^\d{3,4}$/.test(v)       ? 'CVV invalide (3 ou 4 chiffres).'               : '',
    adresseFacture: (v) => v.trim().length < 5         ? "Adresse de facturation requise."                : '',
    ville:          (v) => v.trim().length < 2         ? 'Ville requise.'                                 : '',
    codePostal:     (v) => v.trim().length < 3         ? 'Code postal requis.'                            : '',
  };

  const fieldErrors = Object.fromEntries(
    Object.entries(validators).map(([k, fn]) => [k, fn(form[k] || '')])
  );
  const isValid = Object.values(fieldErrors).every((e) => e === '');

  // ── handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'numeroCarte') value = formatCardNumber(value);
    if (name === 'expiration')  value = formatExpiry(value);
    if (name === 'cvv')         value = value.replace(/\D/g, '').slice(0, 4);
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleBlur = (e) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  // Afficher l'erreur d'un champ seulement s'il a été touché
  const fieldError = (name) =>
    touched[name] && fieldErrors[name] ? fieldErrors[name] : '';

  // ── soumission ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tout marquer comme touché pour révéler toutes les erreurs
    setTouched(Object.fromEntries(Object.keys(validators).map((k) => [k, true])));
    if (!isValid) return;

    setLoading(true);
    setError('');

    try {
      // Construire la commande
      const payload = {
        items: cartItems.map((i) => ({
          ouvrage_id:   i.ouvrage_id,
          quantite:     i.quantite,
          prix_unitaire: i.prix_unitaire,
        })),
        total:             grandTotal,
        adresse_livraison: `${form.adresseFacture}, ${form.codePostal} ${form.ville}, ${form.pays}`,
        mode_paiement:     'carte',
        // NE JAMAIS envoyer le vrai numéro de carte — ici on simule
        payment_provider_id: `MOCK-${Date.now()}`,
      };

      await api.post('/commandes', payload);

      clearCart();          // vider le panier après commande réussie
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Erreur lors du paiement. Vérifiez vos informations ou réessayez.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── écran de confirmation ── */
  if (success) {
    return (
      <div className="page-wrapper" style={{ background: 'var(--lg-cream)' }}>
        <Container>
          <div
            style={{
              maxWidth: 500,
              margin: '4rem auto',
              textAlign: 'center',
              background: 'white',
              borderRadius: 'var(--card-radius)',
              border: '1px solid var(--lg-border)',
              padding: '3rem 2rem',
            }}
          >
            <BsCheckCircle
              size={64}
              style={{ color: 'var(--lg-green)', marginBottom: '1rem' }}
            />
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--lg-navy)' }}>
              Commande confirmée !
            </h2>
            <p className="text-muted mb-4">
              Merci pour votre achat. Vous recevrez une confirmation par e-mail.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  /* ── panier vide → redirection ── */
  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper">
        <Container>
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>🛒</div>
            <h4 className="mt-3">Votre panier est vide.</h4>
            <Button variant="primary" onClick={() => navigate('/products')}>
              Parcourir le catalogue
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  /* ── formulaire de paiement ── */
  return (
    <div className="page-wrapper" style={{ background: 'var(--lg-cream)' }}>
      <Container>
        <Button
          variant="link"
          className="ps-0 mb-4 text-muted"
          onClick={() => navigate('/cart')}
          type="button"
        >
          <BsArrowLeft className="me-1" /> Retour au panier
        </Button>

        <h1 className="section-title mb-4">
          <BsCreditCard2Front className="me-2" />
          Paiement sécurisé
        </h1>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Row className="g-4">
          {/* ─── FORMULAIRE (gauche) ─────────────────────────────────── */}
          <Col lg={8}>
            <Form noValidate onSubmit={handleSubmit}>

              {/* ── Résumé de commande ── */}
              <Card className="mb-4" style={{ border: '1px solid var(--lg-border)' }}>
                <Card.Header
                  style={{
                    background: 'var(--lg-cream)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--lg-navy)',
                  }}
                >
                  Récapitulatif de la commande
                </Card.Header>
                <Card.Body className="p-0">
                  <table className="table mb-0" style={{ fontSize: '0.9rem' }}>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.ouvrage_id}>
                          <td style={{ paddingLeft: '1rem' }}>
                            {item.titre}
                            <span
                              className="text-muted ms-2"
                              style={{ fontSize: '0.8rem' }}
                            >
                              × {item.quantite}
                            </span>
                          </td>
                          <td
                            className="text-end pe-3"
                            style={{ fontWeight: 600, color: 'var(--lg-green)' }}
                          >
                            {fmt(item.prix_unitaire * item.quantite)}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ borderTop: '2px solid var(--lg-border)' }}>
                        <td style={{ paddingLeft: '1rem' }}>Livraison</td>
                        <td className="text-end pe-3">
                          {shipping === 0 ? (
                            <span style={{ color: 'var(--lg-green)' }}>Gratuite</span>
                          ) : (
                            fmt(shipping)
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            paddingLeft: '1rem',
                            fontWeight: 700,
                            fontSize: '1rem',
                          }}
                        >
                          Total
                        </td>
                        <td
                          className="text-end pe-3"
                          style={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            color: 'var(--lg-navy)',
                          }}
                        >
                          {fmt(grandTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>

              {/* ── Section : Informations bancaires ── */}
              <Card className="mb-4" style={{ border: '1px solid var(--lg-border)' }}>
                <Card.Header
                  style={{
                    background: 'var(--lg-cream)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--lg-navy)',
                  }}
                >
                  <BsCreditCard2Front className="me-2" />
                  Informations bancaires
                </Card.Header>
                <Card.Body>

                  {/* Nom du titulaire */}
                  <Form.Group className="mb-3">
                    <Form.Label>Nom du titulaire *</Form.Label>
                    <Form.Control
                      type="text"
                      name="titulaire"
                      value={form.titulaire}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="ex : MARIE DUPONT"
                      isInvalid={!!fieldError('titulaire')}
                      isValid={touched.titulaire && !fieldErrors.titulaire}
                      style={{ textTransform: 'uppercase' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {fieldError('titulaire')}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Numéro de carte */}
                  <Form.Group className="mb-3">
                    <Form.Label>Numéro de carte *</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        name="numeroCarte"
                        value={form.numeroCarte}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        isInvalid={!!fieldError('numeroCarte')}
                        isValid={
                          touched.numeroCarte && !fieldErrors.numeroCarte
                        }
                        style={{ paddingRight: '2.5rem', letterSpacing: '0.1em' }}
                        inputMode="numeric"
                      />
                      <BsCreditCard2Front
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--lg-text-muted)',
                        }}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {fieldError('numeroCarte')}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Date d'expiration + CVV */}
                  <Row className="mb-3">
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>Date d'expiration *</Form.Label>
                        <Form.Control
                          type="text"
                          name="expiration"
                          value={form.expiration}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="MM/AA"
                          maxLength={5}
                          inputMode="numeric"
                          isInvalid={!!fieldError('expiration')}
                          isValid={touched.expiration && !fieldErrors.expiration}
                        />
                        <Form.Control.Feedback type="invalid">
                          {fieldError('expiration')}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>CVV *</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showCvv ? 'text' : 'password'}
                            name="cvv"
                            value={form.cvv}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="123"
                            maxLength={4}
                            inputMode="numeric"
                            isInvalid={!!fieldError('cvv')}
                            isValid={touched.cvv && !fieldErrors.cvv}
                            style={{ paddingRight: '2.5rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCvv((v) => !v)}
                            tabIndex={-1}
                            style={{
                              position: 'absolute',
                              right: '0.75rem',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--lg-text-muted)',
                              padding: 0,
                            }}
                          >
                            {showCvv ? '🙈' : '👁️'}
                          </button>
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {fieldError('cvv')}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          3 ou 4 chiffres au dos de votre carte
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* ── Section : Adresse de facturation ── */}
              <Card className="mb-4" style={{ border: '1px solid var(--lg-border)' }}>
                <Card.Header
                  style={{
                    background: 'var(--lg-cream)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--lg-navy)',
                  }}
                >
                  Adresse de facturation
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Adresse complète *</Form.Label>
                    <Form.Control
                      type="text"
                      name="adresseFacture"
                      value={form.adresseFacture}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="123, rue des Érables"
                      isInvalid={!!fieldError('adresseFacture')}
                      isValid={touched.adresseFacture && !fieldErrors.adresseFacture}
                    />
                    <Form.Control.Feedback type="invalid">
                      {fieldError('adresseFacture')}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row className="mb-3">
                    <Col sm={4}>
                      <Form.Group>
                        <Form.Label>Code postal *</Form.Label>
                        <Form.Control
                          type="text"
                          name="codePostal"
                          value={form.codePostal}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="H2X 1Y4"
                          isInvalid={!!fieldError('codePostal')}
                          isValid={touched.codePostal && !fieldErrors.codePostal}
                        />
                        <Form.Control.Feedback type="invalid">
                          {fieldError('codePostal')}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={4}>
                      <Form.Group>
                        <Form.Label>Ville *</Form.Label>
                        <Form.Control
                          type="text"
                          name="ville"
                          value={form.ville}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Montréal"
                          isInvalid={!!fieldError('ville')}
                          isValid={touched.ville && !fieldErrors.ville}
                        />
                        <Form.Control.Feedback type="invalid">
                          {fieldError('ville')}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={4}>
                      <Form.Group>
                        <Form.Label>Pays</Form.Label>
                        <Form.Select
                          name="pays"
                          value={form.pays}
                          onChange={handleChange}
                        >
                          <option>Canada</option>
                          <option>France</option>
                          <option>Belgique</option>
                          <option>Suisse</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* ── Bouton Payer ── */}
              <div
                style={{
                  background: 'var(--lg-cream)',
                  border: '1px solid var(--lg-border)',
                  borderRadius: 'var(--card-radius)',
                  padding: '1.5rem',
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-center mb-3"
                  style={{ fontSize: '1.2rem', fontWeight: 700 }}
                >
                  <span>Total à payer</span>
                  <span style={{ color: 'var(--lg-green)', fontSize: '1.5rem' }}>
                    {fmt(grandTotal)}
                  </span>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                  style={{ fontSize: '1.1rem', padding: '0.85rem' }}
                >
                  <BsLock className="me-2" />
                  {loading ? 'Traitement en cours…' : `Payer ${fmt(grandTotal)}`}
                </Button>

                <p
                  className="text-center text-muted mt-2 mb-0"
                  style={{ fontSize: '0.8rem' }}
                >
                  🔒 Paiement sécurisé — vos données sont chiffrées
                </p>
              </div>

            </Form>
          </Col>

          {/* ─── PANNEAU DROIT : sécurité + aide ────────────────────── */}
          <Col lg={4}>
            <div
              style={{
                background: 'white',
                border: '1px solid var(--lg-border)',
                borderRadius: 'var(--card-radius)',
                padding: '1.5rem',
                position: 'sticky',
                top: '80px',
              }}
            >
              <h6
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--lg-navy)',
                  marginBottom: '1rem',
                }}
              >
                🔒 Paiement sécurisé
              </h6>
              <ul
                style={{
                  paddingLeft: '1.25rem',
                  color: 'var(--lg-text-muted)',
                  fontSize: '0.85rem',
                  lineHeight: 2,
                }}
              >
                <li>Connexion chiffrée SSL</li>
                <li>Données bancaires non stockées</li>
                <li>Remboursement sous 30 jours</li>
                <li>Service client disponible</li>
              </ul>

              <hr style={{ borderColor: 'var(--lg-border)' }} />

              <h6
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--lg-navy)',
                  marginBottom: '0.75rem',
                }}
              >
                🚚 Livraison estimée
              </h6>
              <p style={{ fontSize: '0.85rem', color: 'var(--lg-text-muted)', marginBottom: 0 }}>
                {shipping === 0
                  ? '✅ Livraison gratuite incluse'
                  : `Frais de livraison : ${fmt(shipping)}`}
                <br />
                Délai : 3 à 5 jours ouvrés
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
