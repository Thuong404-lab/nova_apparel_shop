// Mock data with normalized structure & high-fashion imagery for NOVA APPAREL

export const mockCategories = [
  { categoryId: 'CAT001', name: 'Áo Thun (Tops & Tees)', slug: 'tops-tees', count: 32, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', description: 'Áo thun, áo phông streetwear, polo thời trang form rộng' },
  { categoryId: 'CAT002', name: 'Áo Khoác (Outerwear)', slug: 'outerwear', count: 18, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', description: 'Áo khoác biker da, varsity jacket, hoodie và bomber cao cấp' },
  { categoryId: 'CAT003', name: 'Quần & Jeans (Bottoms)', slug: 'pants-jeans', count: 20, image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800', description: 'Quần túi hộp cargo tactical, jeans baggy wash xám' },
  { categoryId: 'CAT004', name: 'Đầm & Váy (Dresses)', slug: 'dresses-skirts', count: 15, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800', description: 'Chân váy xếp ly, đầm bodycon phong cách Cyberpunk' },
  { categoryId: 'CAT005', name: 'Phụ Kiện (Accessories)', slug: 'accessories', count: 24, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', description: 'Túi đeo chéo canvas, mũ lưỡi trai tag kim loại NOVA' }
];

export const mockColors = [
  { colorId: 'COL001', colorName: 'Đen (Obsidian)', hexCode: '#09090b' },
  { colorId: 'COL002', colorName: 'Trắng (Pure White)', hexCode: '#ffffff' },
  { colorId: 'COL003', colorName: 'Xám Khói (Smoke Grey)', hexCode: '#71717a' },
  { colorId: 'COL004', colorName: 'Beige (Sand Warm)', hexCode: '#d4c5b9' },
  { colorId: 'COL005', colorName: 'Xanh Rêu (Olive Drab)', hexCode: '#4b5320' },
  { colorId: 'COL006', colorName: 'Đỏ Rượu (Burgundy)', hexCode: '#7f1d1d' }
];

export const mockSizes = [
  { sizeId: 'SZ001', sizeName: 'S', categoryId: 'CAT001' },
  { sizeId: 'SZ002', sizeName: 'M', categoryId: 'CAT001' },
  { sizeId: 'SZ003', sizeName: 'L', categoryId: 'CAT001' },
  { sizeId: 'SZ004', sizeName: 'XL', categoryId: 'CAT001' },
  { sizeId: 'SZ005', sizeName: 'M', categoryId: 'CAT002' },
  { sizeId: 'SZ006', sizeName: 'L', categoryId: 'CAT002' },
  { sizeId: 'SZ007', sizeName: 'XL', categoryId: 'CAT002' },
  { sizeId: 'SZ008', sizeName: '29', categoryId: 'CAT003' },
  { sizeId: 'SZ009', sizeName: '30', categoryId: 'CAT003' },
  { sizeId: 'SZ010', sizeName: '31', categoryId: 'CAT003' },
  { sizeId: 'SZ011', sizeName: '32', categoryId: 'CAT003' },
  { sizeId: 'SZ012', sizeName: 'S', categoryId: 'CAT004' },
  { sizeId: 'SZ013', sizeName: 'M', categoryId: 'CAT004' },
  { sizeId: 'SZ014', sizeName: 'FreeSize', categoryId: 'CAT005' }
];

export const mockProducts = [
  {
    productId: 'PROD001',
    categoryId: 'CAT001',
    categoryName: 'Tops & Tees',
    name: 'Áo Thun Shark Streetwear Oversize 250gsm',
    tag: 'BESTSELLER',
    description: 'Chất liệu 100% Cotton 2 chiều định lượng 250gsm dày dặn đứng form. Hình in lụa tráng cao thành sắc nét, không bong tróc sau nhiều lần giặt. Cổ áo bo dệt 3cm chống dão.',
    basePrice: 350000,
    rating: 4.9,
    reviewCount: 148,
    status: 'Available',
    images: [
      { imageId: 'IMG001', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', isPrimary: true },
      { imageId: 'IMG002', imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', isPrimary: false }
    ],
    variants: [
      { variantId: 'VAR001', sizeName: 'M', colorName: 'Đen (Obsidian)', hexCode: '#09090b', stockQty: 50, priceOverride: 350000 },
      { variantId: 'VAR002', sizeName: 'L', colorName: 'Đen (Obsidian)', hexCode: '#09090b', stockQty: 40, priceOverride: 350000 },
      { variantId: 'VAR003', sizeName: 'M', colorName: 'Trắng (Pure White)', hexCode: '#ffffff', stockQty: 30, priceOverride: 350000 },
      { variantId: 'VAR004', sizeName: 'L', colorName: 'Trắng (Pure White)', hexCode: '#ffffff', stockQty: 25, priceOverride: 350000 }
    ]
  },
  {
    productId: 'PROD002',
    categoryId: 'CAT002',
    categoryName: 'Outerwear',
    name: 'Áo Khoác Da Biker Asymmetric Metal Zip',
    tag: 'HOT DROP',
    description: 'Chất liệu da PU tổng hợp cao cấp chống nứt nổ, lót dù gió thoáng khí êm ái. Khóa kéo kim loại tĩnh điện sáng bóng phong cách Rockstar.',
    basePrice: 1450000,
    rating: 5.0,
    reviewCount: 89,
    status: 'Available',
    images: [
      { imageId: 'IMG003', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', isPrimary: true },
      { imageId: 'IMG004', imageUrl: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800', isPrimary: false }
    ],
    variants: [
      { variantId: 'VAR005', sizeName: 'M', colorName: 'Đen (Obsidian)', hexCode: '#09090b', stockQty: 15, priceOverride: 1450000 },
      { variantId: 'VAR006', sizeName: 'L', colorName: 'Đen (Obsidian)', hexCode: '#09090b', stockQty: 10, priceOverride: 1450000 }
    ]
  },
  {
    productId: 'PROD003',
    categoryId: 'CAT003',
    categoryName: 'Pants & Jeans',
    name: 'Quần Cargo Pants Multi-Pocket Tactical',
    tag: 'NEW ARRIVAL',
    description: 'Vải Kaki thun co giãn nhẹ nhập khẩu, thiết kế 6 túi hộp đa năng phong cách Techwear. Dây rút gấu quần linh hoạt tùy chỉnh phom suông hoặc jogger.',
    basePrice: 680000,
    rating: 4.8,
    reviewCount: 64,
    status: 'Available',
    images: [
      { imageId: 'IMG005', imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800', isPrimary: true },
      { imageId: 'IMG006', imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800', isPrimary: false }
    ],
    variants: [
      { variantId: 'VAR007', sizeName: '30', colorName: 'Đen (Obsidian)', hexCode: '#09090b', stockQty: 25, priceOverride: 680000 },
      { variantId: 'VAR008', sizeName: '31', colorName: 'Xám Khói (Smoke Grey)', hexCode: '#71717a', stockQty: 20, priceOverride: 680000 }
    ]
  },
  {
    productId: 'PROD004',
    categoryId: 'CAT004',
    categoryName: 'Dresses & Skirts',
    name: 'Chân Váy Xếp Ly Tennis Pleated Skirt',
    tag: 'TRENDING',
    description: 'Phong cách trẻ trung K-Fashion, chất liệu tuyết mưa dày dặn giữ nếp gấp xếp ly sắc sảo không bị nhăn sau khi giặt.',
    basePrice: 420000,
    rating: 4.9,
    reviewCount: 92,
    status: 'Available',
    images: [
      { imageId: 'IMG007', imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800', isPrimary: true },
      { imageId: 'IMG008', imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800', isPrimary: false }
    ],
    variants: [
      { variantId: 'VAR009', sizeName: 'S', colorName: 'Đen (Obsidian)', hexCode: '#09090b', stockQty: 30, priceOverride: 420000 },
      { variantId: 'VAR010', sizeName: 'M', colorName: 'Beige (Sand Warm)', hexCode: '#d4c5b9', stockQty: 25, priceOverride: 420000 }
    ]
  },
  {
    productId: 'PROD005',
    categoryId: 'CAT002',
    categoryName: 'Outerwear',
    name: 'Áo Hoodie Cyber Heavyweight 380gsm',
    tag: 'LIMITED',
    description: 'Vải nỉ chân cua 100% cotton 380gsm giữ ấm cực tốt, mũ 2 lớp dập phom đứng. Họa tiết dập nổi phong cách Cyberpunk độc bản.',
    basePrice: 750000,
    rating: 5.0,
    reviewCount: 110,
    status: 'Available',
    images: [
      { imageId: 'IMG009', imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800', isPrimary: true },
      { imageId: 'IMG010', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800', isPrimary: false }
    ],
    variants: [
      { variantId: 'VAR011', sizeName: 'L', colorName: 'Đen (Obsidian)', hexCode: '#09090b', stockQty: 45, priceOverride: 750000 }
    ]
  },
  {
    productId: 'PROD006',
    categoryId: 'CAT003',
    categoryName: 'Pants & Jeans',
    name: 'Quần Raw Denim Ripped Baggy Jeans',
    tag: 'EXCLUSIVE',
    description: 'Vải Jean 100% Cotton wash màu xám khói, rách gối cá tính, phom suông rộng tôn dáng đường phố.',
    basePrice: 790000,
    rating: 4.8,
    reviewCount: 57,
    status: 'Available',
    images: [
      { imageId: 'IMG011', imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', isPrimary: true },
      { imageId: 'IMG012', imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800', isPrimary: false }
    ],
    variants: [
      { variantId: 'VAR012', sizeName: '31', colorName: 'Xám Khói (Smoke Grey)', hexCode: '#71717a', stockQty: 18, priceOverride: 790000 }
    ]
  },
  {
    productId: 'PROD007',
    categoryId: 'CAT001',
    categoryName: 'Tops & Tees',
    name: 'Áo Thun Acid Washed Drop Shoulder',
    tag: 'VINTAGE',
    description: 'Công nghệ wash màu Acid loang độc bản 90s, form vai trễ thoải mái, chất vải cotton hữu cơ mềm mịn.',
    basePrice: 390000,
    rating: 4.9,
    reviewCount: 75,
    status: 'Available',
    images: [
      { imageId: 'IMG013', imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', isPrimary: true }
    ],
    variants: [
      { variantId: 'VAR013', sizeName: 'L', colorName: 'Xám Khói (Smoke Grey)', hexCode: '#71717a', stockQty: 35, priceOverride: 390000 }
    ]
  },
  {
    productId: 'PROD008',
    categoryId: 'CAT005',
    categoryName: 'Accessories',
    name: 'Mũ Cap NOVA Minimalist Metal Tag',
    tag: 'ACCESSORY',
    description: 'Vải Canvas thô đứng dáng, khóa cài kim loại khắc laser chìm thương hiệu NOVA cao cấp.',
    basePrice: 290000,
    rating: 4.9,
    reviewCount: 130,
    status: 'Available',
    images: [
      { imageId: 'IMG014', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', isPrimary: true }
    ],
    variants: [
      { variantId: 'VAR014', sizeName: 'FreeSize', colorName: 'Đen (Obsidian)', hexCode: '#09090b', stockQty: 60, priceOverride: 290000 }
    ]
  }
];

export const mockUsers = [
  {
    userId: 'USER001',
    username: 'admin',
    fullName: 'Quản Trị Viên Hệ Thống',
    email: 'admin@novaapparel.vn',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
  },
  {
    userId: 'USER002',
    username: 'staff01',
    fullName: 'Nguyễn Văn Kho',
    email: 'staff01@novaapparel.vn',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
  },
  {
    userId: 'USER003',
    username: 'nguyenvana',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'
  }
];

export const mockOrders = [
  {
    orderId: 'ORD1001',
    customerId: 'CUST001',
    customerName: 'Nguyễn Văn A',
    phone: '0987654321',
    address: '123 Đường Cầu Giấy, Hà Nội',
    orderStatus: 'Delivered',
    paymentMethod: 'Wallet',
    paymentStatus: 'Paid',
    paidAmount: 1800000,
    totalAmount: 1800000,
    createdAt: '2026-08-25T14:30:00Z',
    items: [
      { variantId: 'VAR001', name: 'Áo Thun Shark Streetwear Oversize', sizeName: 'M', colorName: 'Đen (Obsidian)', unitPrice: 350000, quantity: 1, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800' },
      { variantId: 'VAR006', name: 'Áo Khoác Da Biker Asymmetric Metal Zip', sizeName: 'L', colorName: 'Đen (Obsidian)', unitPrice: 1450000, quantity: 1, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800' }
    ]
  },
  {
    orderId: 'ORD1002',
    customerId: 'CUST002',
    customerName: 'Trần Thị Bích',
    phone: '0978123456',
    address: '456 Lê Duẩn, Đà Nẵng',
    orderStatus: 'Shipping',
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    paidAmount: 0,
    totalAmount: 750000,
    createdAt: '2026-08-28T09:15:00Z',
    items: [
      { variantId: 'VAR011', name: 'Áo Hoodie Cyber Heavyweight 380gsm', sizeName: 'L', colorName: 'Đen (Obsidian)', unitPrice: 750000, quantity: 1, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800' }
    ]
  }
];

export const mockWallet = {
  walletId: 'WAL001',
  customerId: 'CUST001',
  balance: 5000000,
  walletStatus: 'Active',
  transactions: [
    {
      transactionId: 'WTX001',
      transactionType: 'Deposit',
      amount: 2000000,
      transactionStatus: 'Completed',
      description: 'Nạp tiền vào Ví Nova Wallet qua VNPay QR',
      createdAt: '2026-08-24T10:00:00Z'
    },
    {
      transactionId: 'WTX002',
      transactionType: 'Purchase',
      amount: 1800000,
      transactionStatus: 'Completed',
      description: 'Thanh toán đơn hàng ORD1001',
      createdAt: '2026-08-25T14:30:00Z'
    }
  ]
};

export const mockAnalytics = {
  totalRevenue: 345800000,
  monthlyRevenue: 89400000,
  totalOrders: 412,
  activeCustomers: 1280,
  revenueTrend: [
    { month: 'T1', revenue: 45000000 },
    { month: 'T2', revenue: 52000000 },
    { month: 'T3', revenue: 68000000 },
    { month: 'T4', revenue: 61000000 },
    { month: 'T5', revenue: 75000000 },
    { month: 'T6', revenue: 89400000 }
  ],
  topProducts: [
    { name: 'Áo Khoác Da Biker Asymmetric', sales: 84, revenue: 121800000 },
    { name: 'Áo Thun Shark Streetwear', sales: 156, revenue: 54600000 },
    { name: 'Áo Hoodie Cyber Heavyweight', sales: 62, revenue: 46500000 }
  ]
};

export const mockComments = [];
