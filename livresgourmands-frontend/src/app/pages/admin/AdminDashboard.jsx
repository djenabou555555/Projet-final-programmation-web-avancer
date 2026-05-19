import { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { BsBook, BsCart3, BsPeople, BsGraphUp } from 'react-icons/bs';
import api from '../../../api/axios.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ ouvrages: 0, commandes: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/ouvrages'),
      api.get('/commandes'),
      api.get('/users'),
    ])
      .then(([oRes, cRes, uRes]) => {
        setStats({
          ouvrages: oRes.data.length,
          commandes: Array.isArray(cRes.data) ? cRes.data.length : 0,
          users: Array.isArray(uRes.data) ? uRes.data.length : 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Ouvrages', value: stats.ouvrages, icon: <BsBook size={28} />, color: '#2C5F2E' },
    { label: 'Commandes', value: stats.commandes, icon: <BsCart3 size={28} />, color: '#1A2332' },
    { label: 'Utilisateurs', value: stats.users, icon: <BsPeople size={28} />, color: '#5a3e8a' },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--lg-navy)' }} className="mb-4">
        <BsGraphUp className="me-2" />Tableau de bord
      </h2>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
      ) : (
        <Row className="g-4 mb-5">
          {cards.map((c, i) => (
            <Col key={i} sm={6} md={4}>
              <Card className="admin-stat-card p-3">
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: 56, height: 56, borderRadius: 12,
                    background: c.color + '15',
                    color: c.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {c.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{c.value}</div>
                    <div style={{ color: 'var(--lg-text-muted)', fontSize: '0.9rem' }}>{c.label}</div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Card className="admin-stat-card p-4">
        <h5 style={{ fontFamily: 'var(--font-display)' }}>Bienvenue dans l'administration</h5>
        <p className="text-muted mb-0">
          Utilisez le menu latéral pour gérer les ouvrages, les commandes et les utilisateurs.
        </p>
      </Card>
    </div>
  );
}
