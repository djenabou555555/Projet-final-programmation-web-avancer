import { useEffect, useState } from 'react';
import {
  Button, Table, Modal, Form, Row, Col, Alert, Spinner, Badge,
} from 'react-bootstrap';
import { BsPencil, BsTrash, BsPlus, BsBook } from 'react-icons/bs';
import api from '../../../api/axios.js';

const EMPTY = {
  titre: '', auteur: '', isbn: '', description: '',
  prix: '', stock: 0, categorie_id: '', image: null,
};

// Prix en dollars
function fmt(amount) {
  return `${parseFloat(amount || 0).toFixed(2)} $`;
}

export default function AdminOuvrages() {
  const [books, setBooks]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([api.get('/ouvrages'), api.get('/categories')])
      .then(([bRes, cRes]) => { setBooks(bRes.data); setCategories(cRes.data); })
      .catch(() => setError('Erreur de chargement.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit   = (b)  => { setEditing(b.id); setForm({ ...b, image: null }); setShowModal(true); };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== '') data.append(k, v);
      });
      if (editing) {
        await api.put(`/ouvrages/${editing}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccess('Ouvrage modifié.');
      } else {
        await api.post('/ouvrages', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccess('Ouvrage créé.');
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/ouvrages/${deleteId}`);
      setSuccess('Ouvrage supprimé.');
      setDeleteId(null);
      fetchAll();
    } catch {
      setError('Erreur lors de la suppression.');
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--lg-navy)' }}>
          <BsBook className="me-2" />Ouvrages
        </h2>
        <Button variant="primary" onClick={openCreate}>
          <BsPlus size={20} className="me-1" /> Ajouter un ouvrage
        </Button>
      </div>

      {error   && <Alert variant="danger"  dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
      ) : (
        <div style={{ border: '1px solid var(--lg-border)', borderRadius: 'var(--card-radius)', overflow: 'hidden' }}>
          <Table hover responsive className="mb-0">
            <thead style={{ background: 'var(--lg-cream)' }}>
              <tr>
                <th>Titre</th><th>Auteur</th><th>ISBN</th>
                <th>Prix</th><th>Stock</th><th>Catégorie</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.titre}</td>
                  <td>{b.auteur}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--lg-text-muted)' }}>{b.isbn}</td>
                  {/* Prix en dollars */}
                  <td style={{ fontWeight: 600, color: 'var(--lg-green)' }}>{fmt(b.prix)}</td>
                  <td>
                    <Badge bg={b.stock > 0 ? 'success' : 'secondary'}>{b.stock}</Badge>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {categories.find((c) => c.id === b.categorie_id)?.nom || '—'}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm" onClick={() => openEdit(b)}><BsPencil /></Button>
                      <Button variant="outline-danger"  size="sm" onClick={() => setDeleteId(b.id)}><BsTrash /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* ── Modal création / édition ── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ background: 'var(--lg-cream)' }}>
          <Modal.Title style={{ fontFamily: 'var(--font-display)' }}>
            {editing ? "Modifier l'ouvrage" : 'Nouvel ouvrage'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row className="mb-3">
              <Col sm={8}>
                <Form.Group>
                  <Form.Label>Titre *</Form.Label>
                  <Form.Control name="titre" value={form.titre} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Catégorie</Form.Label>
                  <Form.Select name="categorie_id" value={form.categorie_id} onChange={handleChange}>
                    <option value="">— Aucune —</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Auteur *</Form.Label>
                  <Form.Control name="auteur" value={form.auteur} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>ISBN *</Form.Label>
                  <Form.Control name="isbn" value={form.isbn} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Prix ($) *</Form.Label>
                  <Form.Control type="number" step="0.01" name="prix" value={form.prix} onChange={handleChange} required min="0" />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Stock *</Form.Label>
                  <Form.Control type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Image</Form.Label>
                  <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={handleChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ background: 'var(--lg-cream)' }}>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Sauvegarde…' : editing ? 'Enregistrer' : 'Créer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ── Modal confirmation suppression ── */}
      <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cet ouvrage ? Cette action est irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
          <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
