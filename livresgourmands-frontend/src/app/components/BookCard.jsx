import { Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { BsCartPlus } from 'react-icons/bs';

/* ─── image helper ────────────────────────────────────────────────────────── */
// L'API stocke un nom de fichier brut (ex : "1715000000-cover.jpg").
// Express le sert via GET /uploads/<filename>.
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
  .replace('/api', '');

function imgUrl(image) {
  if (!image) return null;
  if (image.startsWith('http')) return image;   // URL absolue → pas de préfixe
  return `${BASE_URL}/uploads/${image}`;        // nom de fichier → prefix serveur
}

const PLACEHOLDER = 'https://placehold.co/300x400/EDE7D9/2C5F2E?text=📚';

/* ─── price helper ────────────────────────────────────────────────────────── */
function fmt(amount) {
  return `${parseFloat(amount || 0).toFixed(2)} $`;
}

/* ─── composant ───────────────────────────────────────────────────────────── */
export default function BookCard({ book, showAddToCart = true }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation();   // ne pas déclencher le onClick de la carte
    addToCart(book);
  };

  return (
    <div className="book-card" onClick={() => navigate(`/products/${book.id}`)}>
      {/* image */}
      <div className="book-card-img-wrapper">
        <img
          src={imgUrl(book.image) || PLACEHOLDER}
          alt={book.titre}
          onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
        />
      </div>

      {/* infos */}
      <div className="book-card-body">
        <div className="book-card-title">{book.titre}</div>
        <div className="book-card-author">{book.auteur}</div>

        <div className="d-flex align-items-center justify-content-between mt-2">
          {/* prix en dollars */}
          <span className="book-card-price">{fmt(book.prix)}</span>
          {book.stock <= 0 && (
            <Badge bg="secondary" className="book-card-stock-badge">
              Épuisé
            </Badge>
          )}
        </div>

        {showAddToCart && (
          <Button
            size="sm"
            className="w-100 mt-2"
            variant={book.stock > 0 ? 'primary' : 'secondary'}
            disabled={book.stock <= 0}
            onClick={handleAdd}
          >
            <BsCartPlus className="me-1" />
            {book.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
          </Button>
        )}
      </div>
    </div>
  );
}
