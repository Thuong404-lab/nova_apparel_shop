// Mock data mimicking the exact FashionShopDB normalized database structure

export const mockCategories = [
  { categoryId: 'CAT001', name: 'Tops & Tees', slug: 'tops-tees', count: 32, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', description: 'Áo thun, áo phông streetwear, polo thời trang' },
  { categoryId: 'CAT002', name: 'Outerwear', slug: 'outerwear', count: 18, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', description: 'Áo khoác da, jacket gió, hoodie và bomber cao cấp' },
  { categoryId: 'CAT003', name: 'Accessories', slug: 'accessories', count: 24, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500', description: 'Túi canvas, nón lưỡi trai, thắt lưng, phụ kiện' },
  { categoryId: 'CAT004', name: 'Dresses & Skirts', slug: 'dresses-skirts', count: 15, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500', description: 'Chân váy chữ A, xếp ly, váy đầm thiết kế' },
  { categoryId: 'CAT005', name: 'Pants & Jeans', slug: 'pants-jeans', count: 20, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', description: 'Quần tây âu ống suông, jeans baggy wash xám' }
];

export const mockColors = [
  { colorId: 'COL001', colorName: 'Đen (Black)', hexCode: '#000000' },
  { colorId: 'COL002', colorName: 'Trắng (White)', hexCode: '#FFFFFF' },
  { colorId: 'COL003', colorName: 'Be (Beige)', hexCode: '#F5F5DC' },
  { colorId: 'COL004', colorName: 'Xám (Grey)', hexCode: '#808080' },
  { colorId: 'COL005', colorName: 'Xanh Navy', hexCode: '#000080' },
  { colorId: 'COL006', colorName: 'Hồng (Pink)', hexCode: '#FFC0CB' },
  { colorId: 'COL007', colorName: 'Đỏ Nâu (Brown)', hexCode: '#8B0000' }
];

export const mockSizes = [
  { sizeId: 'SZ001', sizeName: 'S', categoryId: 'CAT001' },
  { sizeId: 'SZ002', sizeName: 'M', categoryId: 'CAT001' },
  { sizeId: 'SZ003', sizeName: 'L', categoryId: 'CAT001' },
  { sizeId: 'SZ004', sizeName: 'XL', categoryId: 'CAT001' },
  { sizeId: 'SZ005', sizeName: 'M', categoryId: 'CAT002' },
  { sizeId: 'SZ006', sizeName: 'L', categoryId: 'CAT002' },
  { sizeId: 'SZ007', sizeName: 'XL', categoryId: 'CAT002' },
  { sizeId: 'SZ008', sizeName: 'FreeSize', categoryId: 'CAT003' },
  { sizeId: 'SZ009', sizeName: 'S', categoryId: 'CAT004' },
  { sizeId: 'SZ010', sizeName: 'M', categoryId: 'CAT004' },
  { sizeId: 'SZ011', sizeName: 'L', categoryId: 'CAT004' },
  { sizeId: 'SZ012', sizeName: '29', categoryId: 'CAT005' },
  { sizeId: 'SZ013', sizeName: '30', categoryId: 'CAT005' },
  { sizeId: 'SZ014', sizeName: '31', categoryId: 'CAT005' },
  { sizeId: 'SZ015', sizeName: '32', categoryId: 'CAT005' }
];

export const mockProducts = [
  {
    productId: 'PROD001',
    categoryId: 'CAT001',
    categoryName: 'Tops & Tees',
    name: 'Áo Thun Shark Streetwear Oversize',
    tag: 'BESTSELLER',
    description: 'Chất liệu cotton 100% 2 chiều 250gsm dày dặn, form oversize chuẩn phong cách đường phố. Hình in lụa công nghệ cao, sắc nét, không bong tróc sau nhiều lần giặt. Cổ áo bo rib 2.5cm chống bai dão.',
    basePrice: 290000,
    rating: 4.9,
    reviewCount: 128,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'
    ],
    variants: [
      { variantId: 'VAR001', sizeId: 'SZ002', sizeName: 'M', colorId: 'COL001', colorName: 'Đen (Black)', hexCode: '#000000', sku: 'SHARK-M-BLK', stockQty: 50, reservedQty: 2, priceOverride: null },
      { variantId: 'VAR002', sizeId: 'SZ003', sizeName: 'L', colorId: 'COL001', colorName: 'Đen (Black)', hexCode: '#000000', sku: 'SHARK-L-BLK', stockQty: 45, reservedQty: 0, priceOverride: null },
      { variantId: 'VAR003', sizeId: 'SZ002', sizeName: 'M', colorId: 'COL002', colorName: 'Trắng (White)', hexCode: '#FFFFFF', sku: 'SHARK-M-WHT', stockQty: 30, reservedQty: 0, priceOverride: null },
      { variantId: 'VAR004', sizeId: 'SZ003', sizeName: 'L', colorId: 'COL002', colorName: 'Trắng (White)', hexCode: '#FFFFFF', sku: 'SHARK-L-WHT', stockQty: 25, reservedQty: 1, priceOverride: null }
    ]
  },
  {
    productId: 'PROD002',
    categoryId: 'CAT001',
    categoryName: 'Tops & Tees',
    name: 'Áo Thun Basic Boxy Fit Minimalist',
    tag: 'SALE -10%',
    description: 'Áo phông trơn chất vải cotton compact cao cấp chống nhăn, thoáng mát, dễ phối đồ hàng ngày. Form boxy fit hiện đại che khuyết điểm cực tốt.',
    basePrice: 220000,
    rating: 4.8,
    reviewCount: 95,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'
    ],
    variants: [
      { variantId: 'VAR005', sizeId: 'SZ002', sizeName: 'M', colorId: 'COL001', colorName: 'Đen (Black)', hexCode: '#000000', sku: 'BASIC-M-BLK', stockQty: 60, reservedQty: 0, priceOverride: 200000 },
      { variantId: 'VAR006', sizeId: 'SZ003', sizeName: 'L', colorId: 'COL003', colorName: 'Be (Beige)', hexCode: '#F5F5DC', sku: 'BASIC-L-BGE', stockQty: 40, reservedQty: 0, priceOverride: 200000 }
    ]
  },
  {
    productId: 'PROD003',
    categoryId: 'CAT001',
    categoryName: 'Tops & Tees',
    name: 'Áo Polo Vintage Classic Collar',
    tag: 'NEW ARRIVAL',
    description: 'Thiết kế phối bo cổ retro lịch lãm, vải cá sấu mè co giãn 4 chiều mềm mịn, thấm hút mồ hôi tối đa. Phù hợp cả đi làm và đi chơi.',
    basePrice: 350000,
    rating: 4.7,
    reviewCount: 64,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800',
      'https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=800'
    ],
    variants: [
      { variantId: 'VAR007', sizeId: 'SZ002', sizeName: 'M', colorId: 'COL005', colorName: 'Xanh Navy', hexCode: '#000080', sku: 'POLO-M-NVY', stockQty: 35, reservedQty: 0, priceOverride: null },
      { variantId: 'VAR008', sizeId: 'SZ003', sizeName: 'L', colorId: 'COL005', colorName: 'Xanh Navy', hexCode: '#000080', sku: 'POLO-L-NVY', stockQty: 30, reservedQty: 0, priceOverride: null }
    ]
  },
  {
    productId: 'PROD004',
    categoryId: 'CAT002',
    categoryName: 'Outerwear',
    name: 'Áo Hoodie Nỉ Bông Unisex Cyberpunk',
    tag: 'HOT',
    description: 'Vải nỉ bông định lượng 380gsm siêu ấm, mũ trùm 2 lớp đứng form cá tính với logo thêu sắc nét, túi kangaroo rộng rãi tiện lợi.',
    basePrice: 450000,
    rating: 5.0,
    reviewCount: 210,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800'
    ],
    variants: [
      { variantId: 'VAR009', sizeId: 'SZ005', sizeName: 'M', colorId: 'COL001', colorName: 'Đen (Black)', hexCode: '#000000', sku: 'HOOD-M-BLK', stockQty: 40, reservedQty: 1, priceOverride: null },
      { variantId: 'VAR010', sizeId: 'SZ006', sizeName: 'L', colorId: 'COL004', colorName: 'Xám (Grey)', hexCode: '#808080', sku: 'HOOD-L-GRY', stockQty: 35, reservedQty: 0, priceOverride: null }
    ]
  },
  {
    productId: 'PROD005',
    categoryId: 'CAT002',
    categoryName: 'Outerwear',
    name: 'Áo Khoác Da Biker Jacket Supreme',
    tag: 'LUXURY',
    description: 'Chất da PU nhân tạo cao cấp chống nổ, lót dù gió thoáng khí, khóa kéo kim loại mạ tĩnh điện sáng bóng phong trần đầy cuốn hút.',
    basePrice: 850000,
    rating: 4.9,
    reviewCount: 88,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800'
    ],
    variants: [
      { variantId: 'VAR011', sizeId: 'SZ005', sizeName: 'M', colorId: 'COL001', colorName: 'Đen (Black)', hexCode: '#000000', sku: 'LEATH-M-BLK', stockQty: 20, reservedQty: 0, priceOverride: null },
      { variantId: 'VAR012', sizeId: 'SZ006', sizeName: 'L', colorId: 'COL001', colorName: 'Đen (Black)', hexCode: '#000000', sku: 'LEATH-L-BLK', stockQty: 15, reservedQty: 0, priceOverride: null }
    ]
  },
  {
    productId: 'PROD006',
    categoryId: 'CAT002',
    categoryName: 'Outerwear',
    name: 'Áo Khoác Dù 2 Lớp Waterproof Windbreaker',
    tag: '',
    description: 'Vải dù miro 2 lớp cản gió chống nước chuẩn công nghệ Nhật Bản, dải viền phản quang trong đêm thể thao sành điệu.',
    basePrice: 390000,
    rating: 4.6,
    reviewCount: 42,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800'
    ],
    variants: [
      { variantId: 'VAR013', sizeId: 'SZ005', sizeName: 'M', colorId: 'COL005', colorName: 'Xanh Navy', hexCode: '#000080', sku: 'WIND-M-NVY', stockQty: 50, reservedQty: 0, priceOverride: null }
    ]
  },
  {
    productId: 'PROD007',
    categoryId: 'CAT004',
    categoryName: 'Dresses & Skirts',
    name: 'Chân Váy Tag Kim Loại EcoChic Pink',
    tag: 'TRENDING',
    description: 'Chân váy chữ A đính tag kim loại sang trọng, tone màu hồng pastel thời thượng, kèm quần bảo hộ bên trong tiện lợi cho nàng tự tin dạo phố.',
    basePrice: 320000,
    rating: 4.8,
    reviewCount: 76,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800'
    ],
    variants: [
      { variantId: 'VAR014', sizeId: 'SZ009', sizeName: 'S', colorId: 'COL006', colorName: 'Hồng (Pink)', hexCode: '#FFC0CB', sku: 'SKIRT-S-PNK', stockQty: 25, reservedQty: 0, priceOverride: null },
      { variantId: 'VAR015', sizeId: 'SZ010', sizeName: 'M', colorId: 'COL006', colorName: 'Hồng (Pink)', hexCode: '#FFC0CB', sku: 'SKIRT-M-PNK', stockQty: 20, reservedQty: 0, priceOverride: null }
    ]
  },
  {
    productId: 'PROD008',
    categoryId: 'CAT004',
    categoryName: 'Dresses & Skirts',
    name: 'Chân Váy Xếp Ly Tennis Skirt White',
    tag: 'POPULAR',
    description: 'Phong cách trẻ trung năng động K-Fashion, nếp gấp xếp ly sắc sảo không biến dạng sau khi giặt, chất tuyết mưa dày dặn tôn dáng.',
    basePrice: 280000,
    rating: 4.9,
    reviewCount: 114,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'
    ],
    variants: [
      { variantId: 'VAR016', sizeId: 'SZ009', sizeName: 'S', colorId: 'COL002', colorName: 'Trắng (White)', hexCode: '#FFFFFF', sku: 'TENNIS-S-WHT', stockQty: 30, reservedQty: 0, priceOverride: null },
      { variantId: 'VAR017', sizeId: 'SZ010', sizeName: 'M', colorId: 'COL001', colorName: 'Đen (Black)', hexCode: '#000000', sku: 'TENNIS-M-BLK', stockQty: 30, reservedQty: 0, priceOverride: null }
    ]
  },
  {
    productId: 'PROD009',
    categoryId: 'CAT005',
    categoryName: 'Pants & Jeans',
    name: 'Quần Tây Âu Nam Nữ Straight Fit',
    tag: 'ESSENTIAL',
    description: 'Chất vải tuyết hàn cao cấp rủ nhẹ đứng dáng, cạp chun ẩn co giãn thông minh không lo chật bụng khi ngồi lâu.',
    basePrice: 420000,
    rating: 4.8,
    reviewCount: 89,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
    ],
    variants: [
      { variantId: 'VAR018', sizeId: 'SZ013', sizeName: '30', colorId: 'COL001', colorName: 'Đen (Black)', hexCode: '#000000', sku: 'PANTS-30-BLK', stockQty: 40, reservedQty: 0, priceOverride: null },
      { variantId: 'VAR019', sizeId: 'SZ014', sizeName: '31', colorId: 'COL004', colorName: 'Xám (Grey)', hexCode: '#808080', sku: 'PANTS-31-GRY', stockQty: 35, reservedQty: 0, priceOverride: null }
    ]
  },
  {
    productId: 'PROD010',
    categoryId: 'CAT005',
    categoryName: 'Pants & Jeans',
    name: 'Quần Jean Baggy Rách Gối Wash Xám',
    tag: 'HOT ITEM',
    description: 'Vải denim 13.5oz dày dặn, wash acid tone xám khói vintage bụi bặm, form rộng thoải mái cá tính theo chuẩn xu hướng Y2K.',
    basePrice: 490000,
    rating: 4.7,
    reviewCount: 65,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'
    ],
    variants: [
      { variantId: 'VAR020', sizeId: 'SZ013', sizeName: '30', colorId: 'COL005', colorName: 'Xanh Navy', hexCode: '#000080', sku: 'JEAN-30-NVY', stockQty: 45, reservedQty: 0, priceOverride: null }
    ]
  },
  {
    productId: 'PROD011',
    categoryId: 'CAT003',
    categoryName: 'Accessories',
    name: 'Túi Canvas Đeo Chéo Multi-Pocket',
    tag: '',
    description: 'Túi vải bố canvas cao cấp dày dặn chống trầy, thiết kế nhiều ngăn tiện dụng vừa iPad, sổ tay và các vật dụng cá nhân.',
    basePrice: 180000,
    rating: 4.9,
    reviewCount: 156,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800'
    ],
    variants: [
      { variantId: 'VAR021', sizeId: 'SZ008', sizeName: 'FreeSize', colorId: 'COL003', colorName: 'Be (Beige)', hexCode: '#F5F5DC', sku: 'BAG-FREE-BGE', stockQty: 80, reservedQty: 0, priceOverride: null }
    ]
  },
  {
    productId: 'PROD012',
    categoryId: 'CAT003',
    categoryName: 'Accessories',
    name: 'Nón Lưỡi Trai Thêu Logo Minimalist',
    tag: '',
    description: 'Chất kaki 100% cotton thoáng mát, khóa kim loại dập nổi sang trọng, form nón chuẩn xuất khẩu không mất form khi đội.',
    basePrice: 150000,
    rating: 4.9,
    reviewCount: 140,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800'
    ],
    variants: [
      { variantId: 'VAR022', sizeId: 'SZ008', sizeName: 'FreeSize', colorId: 'COL001', colorName: 'Đen (Black)', hexCode: '#000000', sku: 'CAP-FREE-BLK', stockQty: 100, reservedQty: 0, priceOverride: null }
    ]
  }
];

export const mockUsers = [
  { id: 'EMP001', username: 'admin', fullName: 'Trần Minh Admin', email: 'admin@gmail.com', role: 'Admin', salary: 25000000, status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
  { id: 'EMP002', username: 'staff01', fullName: 'Nguyễn Thu Staff', email: 'staff@gmail.com', role: 'Staff', salary: 12000000, status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
  { id: 'CUST001', username: 'nguyenvana', fullName: 'Nguyễn Văn A', email: 'customer@gmail.com', role: 'Customer', phone: '0901112223', address: '12 Hai Bà Trưng, Hoàn Kiếm, Hà Nội', status: 'Active', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300' }
];

export const mockOrders = [
  {
    orderId: 'ORD001',
    customerId: 'CUST001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901112223',
    shippingAddress: '12 Hai Bà Trưng, Hoàn Kiếm, Hà Nội',
    orderStatus: 'Delivered',
    placedAt: '2026-08-22T14:30:00',
    totalAmount: 740000,
    paymentMethod: 'VNPay',
    paymentStatus: 'Paid',
    paidAmount: 740000,
    items: [
      { orderItemId: 'ITEM001', productId: 'PROD001', productName: 'Áo Thun Shark Streetwear Oversize', variantId: 'VAR001', sizeName: 'M', colorName: 'Đen (Black)', quantity: 1, unitPrice: 290000, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800' },
      { orderItemId: 'ITEM002', productId: 'PROD004', productName: 'Áo Hoodie Nỉ Bông Unisex Cyberpunk', variantId: 'VAR009', sizeName: 'M', colorName: 'Đen (Black)', quantity: 1, unitPrice: 450000, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800' }
    ]
  },
  {
    orderId: 'ORD002',
    customerId: 'CUST002',
    customerName: 'Trần Thị Bích',
    customerPhone: '0903334445',
    shippingAddress: '34 Điện Biên Phủ, Quận 3, TP.HCM',
    orderStatus: 'Shipping',
    placedAt: '2026-08-27T09:15:00',
    totalAmount: 320000,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    paidAmount: 0,
    items: [
      { orderItemId: 'ITEM003', productId: 'PROD007', productName: 'Chân Váy Tag Kim Loại EcoChic Pink', variantId: 'VAR014', sizeName: 'S', colorName: 'Hồng (Pink)', quantity: 1, unitPrice: 320000, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800' }
    ]
  },
  {
    orderId: 'ORD003',
    customerId: 'CUST001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901112223',
    shippingAddress: '12 Hai Bà Trưng, Hoàn Kiếm, Hà Nội',
    orderStatus: 'Pending',
    placedAt: '2026-08-29T10:00:00',
    totalAmount: 290000,
    paymentMethod: 'Wallet',
    paymentStatus: 'Paid',
    paidAmount: 290000,
    items: [
      { orderItemId: 'ITEM004', productId: 'PROD001', productName: 'Áo Thun Shark Streetwear Oversize', variantId: 'VAR001', sizeName: 'M', colorName: 'Đen (Black)', quantity: 1, unitPrice: 290000, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800' }
    ]
  }
];

export const mockWallet = {
  walletId: 'WAL001',
  customerId: 'CUST001',
  balance: 5000000,
  walletStatus: 'Active',
  transactions: [
    { transactionId: 'WTX001', type: 'Deposit', amount: 2000000, status: 'Completed', method: 'VNPay', description: 'Nạp tiền vào ví qua VNPay', createdAt: '2026-08-19T11:20:00' },
    { transactionId: 'WTX002', type: 'Purchase', amount: 290000, status: 'Completed', orderId: 'ORD003', description: 'Thanh toán đơn hàng #ORD003', createdAt: '2026-08-29T10:00:00' }
  ]
};

export const mockComments = [
  { commentId: 'CMT001', productId: 'PROD001', variantName: 'Size M - Đen', customerName: 'Nguyễn Văn A', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300', rating: 5, content: 'Áo chất vải rất dày dặn và mát mẻ, form oversize mặc cực kì ưng ý!', createdAt: '2026-08-24T15:20:00', status: 'Active' },
  { commentId: 'CMT002', productId: 'PROD004', variantName: 'Size M - Đen', customerName: 'Nguyễn Văn A', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300', rating: 5, content: 'Mũ áo hoodie dày dặn đứng form, lót nỉ mềm mịn giữ ấm siêu tốt.', createdAt: '2026-08-25T16:45:00', status: 'Active' },
  { commentId: 'CMT003', productId: 'PROD007', variantName: 'Size S - Hồng', customerName: 'Trần Thị Bích', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300', rating: 4, content: 'Chân váy xinh, form chuẩn, tag sắt sáng bóng xịn xò.', createdAt: '2026-08-28T12:10:00', status: 'Active' }
];

export const mockAnalytics = {
  totalRevenue: 154800000,
  monthlyRevenue: 38200000,
  totalOrders: 342,
  totalCustomers: 1280,
  salesOverTime: [
    { day: 'Thứ 2', revenue: 4200000, orders: 12 },
    { day: 'Thứ 3', revenue: 6800000, orders: 18 },
    { day: 'Thứ 4', revenue: 5100000, orders: 14 },
    { day: 'Thứ 5', revenue: 8900000, orders: 24 },
    { day: 'Thứ 6', revenue: 12400000, orders: 35 },
    { day: 'Thứ 7', revenue: 18500000, orders: 48 },
    { day: 'Chủ Nhật', revenue: 15200000, orders: 42 }
  ],
  categoryShare: [
    { name: 'Tops & Tees', value: 42, color: '#000000' },
    { name: 'Outerwear', value: 28, color: '#00ff66' },
    { name: 'Pants & Jeans', value: 16, color: '#7928ca' },
    { name: 'Dresses & Skirts', value: 8, color: '#ff4d00' },
    { name: 'Accessories', value: 6, color: '#f59e0b' }
  ],
  topProducts: [
    { id: 'PROD001', name: 'Áo Thun Shark Streetwear Oversize', sales: 340, revenue: 98600000 },
    { id: 'PROD004', name: 'Áo Hoodie Nỉ Bông Unisex Cyberpunk', sales: 185, revenue: 83250000 },
    { id: 'PROD005', name: 'Áo Khoác Da Biker Jacket Supreme', sales: 92, revenue: 78200000 },
    { id: 'PROD002', name: 'Áo Thun Basic Boxy Fit Minimalist', sales: 240, revenue: 48000000 },
    { id: 'PROD007', name: 'Chân Váy Tag Kim Loại EcoChic Pink', sales: 120, revenue: 38400000 }
  ]
};
