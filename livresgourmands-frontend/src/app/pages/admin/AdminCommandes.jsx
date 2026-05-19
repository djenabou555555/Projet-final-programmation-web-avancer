import { useEffect, useState } from 'react';
import { Table, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { BsCart3 } from 'react-icons/bs';
import api from '../../../api/axios.js';

const STATUTS = ['en_cours', 'payee', 'annulee', 'expediee'];
const BADGE_MAP = {
  en_cours: 'warning',
  payee: 'success',
  annulee: 'danger',
  expediee: 'info',
};
const LABEL_MAP = {
  en_cours: 'En cours',
  payee: 'Payée',
  annulee: 'Annulée',
  expediee: 'Expédiée',
};

export default function AdminCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/commandes')
      .then((res) => setCommandes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Erreur de chargement des commandes.'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, statut) => {
    try {
      await api.put(`/commandes/${id}/status`, { statut });
      setCommandes((prev) => prev.map((c) => c.id === id ? { ...c, statut } : c));
      setSuccess(`Statut de la commande #${id} mis à jour.`);
    } catch {
      setError('Impossible de mettre à jour le statut.');
    }
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--lg-navy)' }} className="mb-4">
        <BsCart3 className="me-2" />Commandes
      </h2>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
      ) : commandes.length === 0 ? (
        <div className="empty-state"><p>Aucune commande trouvée.</p></div>
      ) : (
        <div style={{ border: '1px solid var(--lg-border)', borderRadius: 'var(--card-radius)', overflow: 'hidden' }}>
          <Table hover responsive className="mb-0">
            <thead style={{ background: 'var(--lg-cream)' }}>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Total</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700 }}>#{c.id}</td>
                  <td>{c.client_nom || c.client_id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--lg-green)' }}>
                    {parseFloat(c.total || 0).toFixed(2)} €
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--lg-text-muted)' }}>
                    {new Date(c.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <Badge bg={BADGE_MAP[c.statut] || 'secondary'}>
                      {LABEL_MAP[c.statut] || c.statut}
                    </Badge>
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={c.statut}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      style={{ width: '140px' }}
                    >
                      {STATUTS.map((s) => (
                        <option key={s} value={s}>{LABEL_MAP[s]}</option>
                      ))}
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
