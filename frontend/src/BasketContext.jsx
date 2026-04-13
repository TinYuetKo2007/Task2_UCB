import { createContext, useContext, useState, useCallback, useMemo } from "react";

const BasketContext = createContext();

export function BasketProvider({ children }) {
  const [basket, setBasket] = useState([]);

  const addToBasket = useCallback((product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    setBasket(prev => {
      const exists = prev.find(item => item.id === product.id);

      if (exists) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          productId: product.id,  // always SQLite ID
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1
        }
      ];
    });
  }, []);

  const removeFromBasket = useCallback((id) => {
    setBasket(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearBasket = useCallback(() => {
    setBasket([]);
  }, []);

  const value = useMemo(() => ({
    basket,
    addToBasket,
    removeFromBasket,
    clearBasket
  }), [basket, addToBasket, removeFromBasket, clearBasket]);

  return (
    <BasketContext.Provider value={value}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  return useContext(BasketContext);
}