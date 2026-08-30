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

  const toggleWishlist = (productOrId, name = '') => {
    const id = typeof productOrId === 'object' ? productOrId.productId : productOrId;
    const productName = typeof productOrId === 'object' ? productOrId.name : name || 'Sản phẩm';
    
    const isAdding = !wishlistIds.includes(id);
    const updated = wishlistApi.toggle(id);
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
        wishlist: wishlistIds,
        toggleWishlist,
        isFavorite,
        isInWishlist: isFavorite,
        count: wishlistIds.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
