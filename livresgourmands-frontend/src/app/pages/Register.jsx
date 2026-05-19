import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsPersonPlus } from 'react-icons/bs';
import api from '../../api/axios.js';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    adresse: '', code_postal: '', ville: '', pays: 'France',
    username: '', password: '', confirmPassword: '', acceptCGU: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Les mots de passe ne correspondent pas.');
    }
    if (form.password.length < 8) {
      return setError('Le mot de passe doit contenir au moins 8 caractères.');
    }
    if (!form.acceptCGU) {
      return setError('Veuillez accepter les conditions générales d\'utilisation.');
    }
    setLoading(true);
    try {
      await api.post('/auth/register', {
        nom: `${form.prenom} ${form.nom}`.trim(),
        email: form.email,
        password: form.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ background: 'var(--lg-cream)' }}>
      <Container>
        <div className="auth-card" style={{ maxWidth: '760px' }}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <BsPersonPlus size={24} style={{ color: 'var(--lg-green)' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 0 }}>Créer un compte</h2>
          </div>
          <p className="text-muted mb-4">Inscrivez-vous pour profiter de toutes les fonctionnalités de Recette Gourmand</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* ── Informations personnelles ── */}
            <h5 className="mb-3" style={{ fontFamily: 'var(--font-display)', borderBottom: '1px solid var(--lg-border)', paddingBottom: '0.5rem' }}>
              Informations personnelles
            </h5>
            <Row className="mb-3">
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Prénom *</Form.Label>
                  <Form.Control name="prenom" value={form.prenom} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Nom *</Form.Label>
                  <Form.Control name="nom" value={form.nom} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Téléphone *</Form.Label>
                  <Form.Control type="tel" name="telephone" value={form.telephone} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            {/* ── Adresse ── */}
            <h5 className="mb-3" style={{ fontFamily: 'var(--font-display)', borderBottom: '1px solid var(--lg-border)', paddingBottom: '0.5rem' }}>
              Adresse
            </h5>
            <Form.Group className="mb-3">
              <Form.Label>Adresse complète *</Form.Label>
              <Form.Control name="adresse" value={form.adresse} onChange={handleChange} />
            </Form.Group>
            <Row className="mb-4">
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Code postal *</Form.Label>
                  <Form.Control name="code_postal" value={form.code_postal} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Ville *</Form.Label>
                  <Form.Control name="ville" value={form.ville} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Pays *</Form.Label>
                  <Form.Control name="pays" value={form.pays} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            {/* ── Connexion ── */}
            <h5 className="mb-3" style={{ fontFamily: 'var(--font-display)', borderBottom: '1px solid var(--lg-border)', paddingBottom: '0.5rem' }}>
              Informations de connexion
            </h5>
            <Form.Group className="mb-3">
              <Form.Label>Nom d'utilisateur *</Form.Label>
              <Form.Control name="username" value={form.username} onChange={handleChange} required />
            </Form.Group>
            <Row className="mb-3">
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Mot de passe *</Form.Label>
                  <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />
                  <Form.Text className="text-muted">Minimum 8 caractères</Form.Text>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Confirmer le mot de passe *</Form.Label>
                  <Form.Control type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Check
              type="checkbox"
              name="acceptCGU"
              checked={form.acceptCGU}
              onChange={handleChange}
              label="J'accepte les conditions générales d'utilisation et la politique de confidentialité *"
              className="mb-4"
            />

            <div className="d-flex gap-3 align-items-center">
              <Button variant="primary" type="submit" disabled={loading} size="lg" style={{ flex: 1 }}>
                <BsPersonPlus className="me-2" />
                {loading ? 'Création…' : 'Créer mon compte'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate(-1)} size="lg">
                Annuler
              </Button>
            </div>
          </Form>

          <p className="text-center mt-4 mb-0">
            Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
