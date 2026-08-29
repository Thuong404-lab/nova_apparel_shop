import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistApi } from '../services/api';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    setWishlistIds(wishlistApi.get());
  }, []);

  const toggleWishlist = (productId, productName = 'Sản phẩm') => {
    const isAdding = !wishlistIds.includes(productId);
    const updated = wishlistApi.toggle(productId);
    setWishlistIds([...updated]);
    if (isAdding) {
      addToast(`Đã thêm "${productName}" vào mục Yêu thích!`, 'success');
    } else {
      addToast(`Đã xóa khỏi mục Yêu thích!`, 'info');
    }
  };

  const isFavorite = (productId) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isFavorite,
        count: wishlistIds.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
