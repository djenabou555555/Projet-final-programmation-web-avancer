import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsBoxArrowInRight, BsEye, BsEyeSlash } from 'react-icons/bs';
import api from '../../api/axios.js';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.email.includes('@')) {
      return setError('Veuillez entrer un email valide.');
    }
    if (form.password.length < 4) {
      return setError('Mot de passe trop court.');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setSuccess(`Bienvenue ${user.nom || user.email} !`);

      setTimeout(() => {
        const role = user?.role;
        if (role === 'administrateur' || role === 'gestionnaire') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 800);

    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setError('Aucun compte trouvé avec cet email.');
      } else if (status === 401) {
        setError('Mot de passe incorrect.');
      } else {
        setError('Erreur de connexion. Vérifiez que le serveur backend tourne.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ background: 'var(--lg-cream)', minHeight: '100vh' }}>
      <Container>
        <div className="auth-card" style={{ maxWidth: 480 }}>

          <div className="d-flex align-items-center gap-2 mb-1">
            <BsBoxArrowInRight size={24} style={{ color: 'var(--lg-green)' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 0 }}>
              Se connecter
            </h2>
          </div>
          <p className="text-muted mb-4">Accédez à votre compte de recettes Gourmand</p>

          {error   && <Alert variant="danger"  dismissible onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form noValidate onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Adresse e-mail *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Mot de passe *</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Votre mot de passe"
                  required
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: 'var(--lg-text-muted)', padding: 0, zIndex: 5,
                  }}
                  tabIndex={-1}
                >
                  {showPwd ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
                </button>
              </div>
            </Form.Group>

            <div className="d-flex gap-3">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                size="lg"
                style={{ flex: 1 }}
              >
                <BsBoxArrowInRight className="me-2" />
                {loading ? 'Connexion…' : 'Se connecter'}
              </Button>
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={() => navigate(-1)}
                type="button"
              >
                Annuler
              </Button>
            </div>
          </Form>

          <hr className="my-4" />
          <p className="text-center mb-0">
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: 'var(--lg-green)', fontWeight: 600 }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}