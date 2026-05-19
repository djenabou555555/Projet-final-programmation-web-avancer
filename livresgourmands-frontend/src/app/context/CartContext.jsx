import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantite, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.prix_unitaire) * item.quantite,
    0
  );

  function addToCart(ouvrage, quantite = 1) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.ouvrage_id === ouvrage.id);
      if (existing) {
        return prev.map((i) =>
          i.ouvrage_id === ouvrage.id
            ? { ...i, quantite: i.quantite + quantite }
            : i
        );
      }
      return [
        ...prev,
        {
          ouvrage_id: ouvrage.id,
          titre: ouvrage.titre,
          auteur: ouvrage.auteur,
          image: ouvrage.image || null,
          prix_unitaire: parseFloat(ouvrage.prix),
          quantite,
        },
      ];
    });
  }

  function updateQuantity(ouvrageId, newQty) {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty < 1) {
      removeFromCart(ouvrageId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.ouvrage_id === ouvrageId ? { ...i, quantite: qty } : i))
    );
  }

  function removeFromCart(ouvrageId) {
    setCartItems((prev) => prev.filter((i) => i.ouvrage_id !== ouvrageId));
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans un <CartProvider>');
  return ctx;
}
