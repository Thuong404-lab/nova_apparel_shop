import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const rawItems = cartApi.get() || [];
    // Sanitize any corrupt items
    const sanitized = rawItems
      .filter(item => item && (item.name || item.productId))
      .map(item => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.unitPrice) || Number(item.price) || 350000,
        image: item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'
      }));
    setItems(sanitized);
  }, []);

  const addItem = (product, variant, quantity = 1) => {
    const price = Number(variant?.priceOverride) || Number(product?.basePrice) || 350000;
    const imgUrl = typeof product.images?.[0] === 'string' 
      ? product.images[0] 
      : product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';

    const cartItem = {
      variantId: variant?.variantId || `${product.productId}-${variant?.sizeName || 'M'}-${variant?.colorName || 'Default'}`,
      productId: product.productId,
      name: product.name,
      image: imgUrl,
      sizeName: variant?.sizeName || 'M',
      colorName: variant?.colorName || 'Default',
      unitPrice: price,
      quantity: Number(quantity) || 1,
      stockQty: variant?.stockQty || 10,
      reservedQty: variant?.reservedQty || 0
    };

    const updated = cartApi.addItem(cartItem);
    const sanitized = updated.map(item => ({
      ...item,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 350000
    }));
    setItems(sanitized);
    addToast(`Đã thêm ${product.name} vào giỏ hàng!`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = (variantId, newQty) => {
    const updated = cartApi.updateQuantity(variantId, newQty);
    const sanitized = updated.map(item => ({
      ...item,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 350000
    }));
    setItems(sanitized);
  };

  const removeItem = (variantId) => {
    const updated = cartApi.removeItem(variantId);
    setItems(updated.map(item => ({
      ...item,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 350000
    })));
    addToast('Đã xóa sản phẩm khỏi giỏ hàng.', 'info');
  };

  const clearCart = () => {
    cartApi.clear();
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  const subtotal = items.reduce((acc, item) => acc + ((Number(item.unitPrice) || 0) * (Number(item.quantity) || 1)), 0);

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
        subtotal: isNaN(subtotal) ? 0 : subtotal,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
