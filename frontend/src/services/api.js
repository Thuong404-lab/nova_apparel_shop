// Unified API Service Layer with Mock/Live Switching

import {
  mockProducts,
  mockCategories,
  mockColors,
  mockSizes,
  mockOrders,
  mockWallet,
  mockComments,
  mockAnalytics,
  mockUsers
} from '../data/mockData';

// Switch this flag to false when connecting to the Spring Boot REST API
export const USE_MOCK_DATA = true;
export const API_BASE_URL = 'http://localhost:8080/api';

// Local storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'nova_products_v2',
  ORDERS: 'fms_orders',
  CART: 'fms_cart',
  WISHLIST: 'fms_wishlist',
  WALLET: 'fms_wallet',
  USER: 'fms_user',
  COMMENTS: 'fms_comments'
};

// Initialize Mock LocalStorage if empty
const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CART)) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([
      { ...mockProducts[0].variants[0], product: mockProducts[0], quantity: 1 },
      { ...mockProducts[10].variants[0], product: mockProducts[10], quantity: 2 }
    ]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(['PROD001', 'PROD004', 'PROD007']));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WALLET)) {
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(mockWallet));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(mockComments));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUsers[2])); // default customer
  }
};

initLocalStorage();

// Helper to simulate network latency
const sleep = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  login: async ({ username, password }) => {
    if (USE_MOCK_DATA) {
      await sleep();
      const user = mockUsers.find(u => u.username === username.trim().toLowerCase()) || {
        id: 'CUST_' + Date.now(),
        username: username,
        fullName: username === 'admin' ? 'Admin Manager' : username === 'staff' ? 'Staff Member' : 'KhÃ¡ch hÃ ng ' + username,
        role: username.includes('admin') ? 'Admin' : username.includes('staff') ? 'Staff' : 'Customer',
        email: `${username}@gmail.com`,
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return { success: true, token: 'mock-jwt-token-' + Date.now(), user };
    }
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  register: async (data) => {
    if (USE_MOCK_DATA) {
      await sleep();
      const newUser = {
        id: 'CUST_' + Date.now(),
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: 'Customer',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getCurrentUser: () => {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

export const productApi = {
  getAll: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await sleep(150);
      let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      if (filters.category && filters.category !== 'all') {
        products = products.filter(p => p.categoryId === filters.category || p.categoryName === filters.category);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (filters.minPrice) {
        products = products.filter(p => p.basePrice >= Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        products = products.filter(p => p.basePrice <= Number(filters.maxPrice));
      }
      if (filters.sort === 'price-asc') {
        products.sort((a, b) => a.basePrice - b.basePrice);
      } else if (filters.sort === 'price-desc') {
        products.sort((a, b) => b.basePrice - a.basePrice);
      } else if (filters.sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      }
      return { success: true, data: products };
    }
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/products?${query}`);
    return res.json();
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await sleep(100);
      const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      const item = products.find(p => p.productId === id);
      return { success: !!item, data: item };
    }
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return res.json();
  },

  getCategories: async () => {
    return { success: true, data: mockCategories };
  },

  getColors: async () => {
    return { success: true, data: mockColors };
  },

  getSizes: async () => {
    return { success: true, data: mockSizes };
  }
};

export const cartApi = {
  get: () => {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  },

  addItem: (item) => {
    const cart = cartApi.get();
    const existingIndex = cart.findIndex(i => i.variantId === item.variantId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity || 1;
    } else {
      cart.push(item);
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  },

  updateQuantity: (variantId, quantity) => {
    let cart = cartApi.get();
    if (quantity <= 0) {
      cart = cart.filter(i => i.variantId !== variantId);
    } else {
      cart = cart.map(i => i.variantId === variantId ? { ...i, quantity } : i);
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  },

  removeItem: (variantId) => {
    const cart = cartApi.get().filter(i => i.variantId !== variantId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  },

  clear: () => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  }
};

export const wishlistApi = {
  get: () => {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return raw ? JSON.parse(raw) : [];
  },

  toggle: (productId) => {
    let list = wishlistApi.get();
    if (list.includes(productId)) {
      list = list.filter(id => id !== productId);
    } else {
      list.push(productId);
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    return list;
  }
};

export const orderApi = {
  getMyOrders: async () => {
    if (USE_MOCK_DATA) {
      await sleep(150);
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
      return { success: true, data: orders };
    }
    const res = await fetch(`${API_BASE_URL}/orders/my-orders`);
    return res.json();
  },

  getById: async (orderId) => {
    if (USE_MOCK_DATA) {
      await sleep(100);
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
      const order = orders.find(o => o.orderId === orderId);
      return { success: !!order, data: order };
    }
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    return res.json();
  },

  create: async (orderData) => {
    if (USE_MOCK_DATA) {
      await sleep(300);
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
      const newOrder = {
        orderId: 'ORD' + Math.floor(1000 + Math.random() * 9000),
        customerId: orderData.customerId || 'CUST001',
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        shippingAddress: orderData.shippingAddress,
        orderStatus: 'Pending',
        placedAt: new Date().toISOString(),
        totalAmount: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentMethod === 'COD' ? 'Pending' : 'Paid',
        paidAmount: orderData.paymentMethod === 'COD' ? 0 : orderData.totalAmount,
        items: orderData.items
      };
      orders.unshift(newOrder);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      cartApi.clear();
      return { success: true, data: newOrder };
    }
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  cancel: async (orderId) => {
    if (USE_MOCK_DATA) {
      await sleep(150);
      let orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
      orders = orders.map(o => o.orderId === orderId ? { ...o, orderStatus: 'Cancelled' } : o);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return { success: true, message: 'ÄÃ£ há»§y Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng' };
    }
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, { method: 'PUT' });
    return res.json();
  }
};

export const walletApi = {
  get: async () => {
    if (USE_MOCK_DATA) {
      await sleep(100);
      const wallet = JSON.parse(localStorage.getItem(STORAGE_KEYS.WALLET) || JSON.stringify(mockWallet));
      return { success: true, data: wallet };
    }
    const res = await fetch(`${API_BASE_URL}/wallet`);
    return res.json();
  },

  deposit: async (amount) => {
    if (USE_MOCK_DATA) {
      await sleep(300);
      const wallet = JSON.parse(localStorage.getItem(STORAGE_KEYS.WALLET) || JSON.stringify(mockWallet));
      wallet.balance += Number(amount);
      wallet.transactions.unshift({
        transactionId: 'WTX' + Date.now().toString().slice(-4),
        type: 'Deposit',
        amount: Number(amount),
        status: 'Completed',
        method: 'VNPay',
        description: 'Náº¡p tiá»n vÃ o vÃ­ qua cá»•ng thanh toÃ¡n VNPay',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
      return { success: true, data: wallet };
    }
    const res = await fetch(`${API_BASE_URL}/wallet/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    return res.json();
  }
};

export const staffApi = {
  getAllOrders: async () => {
    if (USE_MOCK_DATA) {
      await sleep(150);
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
      return { success: true, data: orders };
    }
    const res = await fetch(`${API_BASE_URL}/staff/orders`);
    return res.json();
  },

  updateStatus: async (orderId, newStatus) => {
    if (USE_MOCK_DATA) {
      await sleep(150);
      let orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
      orders = orders.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return { success: true, message: `ÄÃ£ cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n sang ${newStatus}` };
    }
    const res = await fetch(`${API_BASE_URL}/staff/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    return res.json();
  },

  importWarehouse: async (importData) => {
    if (USE_MOCK_DATA) {
      await sleep(200);
      const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      // Update variant stock in local products
      for (const p of products) {
        const variant = p.variants?.find(v => v.variantId === importData.variantId);
        if (variant) {
          variant.stockQty += Number(importData.quantity);
          break;
        }
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return { success: true, message: 'ÄÃ£ nháº­p kho thÃ nh cÃ´ng' };
    }
    const res = await fetch(`${API_BASE_URL}/staff/warehouse/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(importData)
    });
    return res.json();
  }
};

export const adminApi = {
  getStats: async () => {
    if (USE_MOCK_DATA) {
      await sleep(150);
      return { success: true, data: mockAnalytics };
    }
    const res = await fetch(`${API_BASE_URL}/admin/statistics`);
    return res.json();
  },

  saveProduct: async (productData) => {
    if (USE_MOCK_DATA) {
      await sleep(200);
      const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      const index = products.findIndex(p => p.productId === productData.productId);
      if (index > -1) {
        products[index] = { ...products[index], ...productData };
      } else {
        products.unshift({
          productId: 'PROD' + Math.floor(100 + Math.random() * 900),
          ...productData,
          rating: 5.0,
          reviewCount: 0,
          status: 'Available'
        });
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return { success: true, message: 'ÄÃ£ lÆ°u sáº£n pháº©m thÃ nh cÃ´ng' };
    }
    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  deleteProduct: async (productId) => {
    if (USE_MOCK_DATA) {
      await sleep(150);
      let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      products = products.filter(p => p.productId !== productId);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return { success: true, message: 'ÄÃ£ xÃ³a sáº£n pháº©m' };
    }
    const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, { method: 'DELETE' });
    return res.json();
  },

  getAccounts: async () => {
    if (USE_MOCK_DATA) {
      await sleep(150);
      return { success: true, data: mockUsers };
    }
    const res = await fetch(`${API_BASE_URL}/admin/accounts`);
    return res.json();
  }
};
