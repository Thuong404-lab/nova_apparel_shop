import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setItems(cartApi.get());
  }, []);

  const addItem = (product, variant, quantity = 1) => {
    const cartItem = {
      variantId: variant.variantId,
      productId: product.productId,
      name: product.name,
      image: typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.imageUrl,
      sizeName: variant.sizeName || 'M',
      colorName: variant.colorName || 'Default',
      unitPrice: variant.priceOverride || product.basePrice,
      quantity: Number(quantity),
      stockQty: variant.stockQty || 10,
      reservedQty: variant.reservedQty || 0
    };

    const updated = cartApi.addItem(cartItem);
    setItems([...updated]);
    addToast(`Đã thêm ${product.name} vào giỏ hàng!`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = (variantId, newQty) => {
    const updated = cartApi.updateQuantity(variantId, newQty);
    setItems([...updated]);
  };

  const removeItem = (variantId) => {
    const updated = cartApi.removeItem(variantId);
    setItems([...updated]);
    addToast('Đã xóa sản phẩm khỏi giỏ hàng.', 'info');
  };

  const clearCart = () => {
    cartApi.clear();
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = items.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addToCart: addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        getCartCount: () => totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
