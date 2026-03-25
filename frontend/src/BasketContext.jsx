import { createContext, useContext, useState } from "react";

const BasketContext = createContext();

export function BasketProvider({ children }) {
  const [basket, setBasket] = useState([]);

  function addToBasket(product) {
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

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromBasket(id) {
    setBasket(prev => prev.filter(item => item.id !== id));
  }

  function clearBasket() {
    setBasket([]);
  }

  return (
    <BasketContext.Provider
      value={{
        basket,
        addToBasket,
        removeFromBasket,
        clearBasket
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  return useContext(BasketContext);
}