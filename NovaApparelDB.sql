-- ==============================================================================
-- NOVA APPAREL DATABASE SCHEMA (MYSQL 8.0+)
-- Database: NovaApparelDB
-- Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==============================================================================

DROP DATABASE IF EXISTS NovaApparelDB;
CREATE DATABASE NovaApparelDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE NovaApparelDB;

-- ------------------------------------------------------------------------------
-- 1. USERS & ACTORS (Customers & Employees)
-- ------------------------------------------------------------------------------

CREATE TABLE Customers (
    customerId VARCHAR(20) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NULL,
    address VARCHAR(255) NULL,
    passwordHash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    avatar VARCHAR(500) NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT CHK_Customer_Status CHECK (status IN ('Active', 'Inactive', 'Locked'))
);

CREATE TABLE Employees (
    employeeId VARCHAR(20) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NULL,
    address VARCHAR(255) NULL,
    passwordHash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'Staff',
    salary DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    avatar VARCHAR(500) NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT CHK_Employee_Role CHECK (role IN ('Admin', 'Staff')),
    CONSTRAINT CHK_Employee_Status CHECK (status IN ('Active', 'Inactive', 'Locked'))
);

-- ------------------------------------------------------------------------------
-- 2. CATALOG SPECIFICATIONS (Categories, Sizes, Colors)
-- ------------------------------------------------------------------------------

CREATE TABLE Categories (
    categoryId VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500) NULL
);

CREATE TABLE Sizes (
    sizeId VARCHAR(20) PRIMARY KEY,
    sizeName VARCHAR(20) NOT NULL,
    categoryId VARCHAR(20) NOT NULL,
    CONSTRAINT FK_Sizes_Category FOREIGN KEY (categoryId) REFERENCES Categories(categoryId) ON DELETE CASCADE
);

CREATE TABLE Colors (
    colorId VARCHAR(20) PRIMARY KEY,
    colorName VARCHAR(50) NOT NULL UNIQUE,
    hexCode VARCHAR(10) NULL
);

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS & VARIANTS
-- ------------------------------------------------------------------------------

CREATE TABLE Products (
    productId VARCHAR(20) PRIMARY KEY,
    categoryId VARCHAR(20) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NULL,
    basePrice DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'Available',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_Products_Category FOREIGN KEY (categoryId) REFERENCES Categories(categoryId),
    CONSTRAINT CHK_Product_Status CHECK (status IN ('Available', 'Hidden', 'Discontinued'))
);

CREATE TABLE ProductImages (
    imageId VARCHAR(20) PRIMARY KEY,
    productId VARCHAR(20) NOT NULL,
    imageUrl VARCHAR(500) NOT NULL,
    isPrimary BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT FK_ProductImages_Product FOREIGN KEY (productId) REFERENCES Products(productId) ON DELETE CASCADE
);

CREATE TABLE ProductVariants (
    variantId VARCHAR(20) PRIMARY KEY,
    productId VARCHAR(20) NOT NULL,
    sizeId VARCHAR(20) NOT NULL,
    colorId VARCHAR(20) NOT NULL,
    sku VARCHAR(50) NULL UNIQUE,
    stockQty INT NOT NULL DEFAULT 0,
    reservedQty INT NOT NULL DEFAULT 0,
    priceOverride DECIMAL(12, 2) NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Variants_Product FOREIGN KEY (productId) REFERENCES Products(productId) ON DELETE CASCADE,
    CONSTRAINT FK_Variants_Size FOREIGN KEY (sizeId) REFERENCES Sizes(sizeId),
    CONSTRAINT FK_Variants_Color FOREIGN KEY (colorId) REFERENCES Colors(colorId),
    CONSTRAINT UQ_Variant_Combination UNIQUE (productId, sizeId, colorId),
    CONSTRAINT CHK_Variant_Stock CHECK (stockQty >= 0),
    CONSTRAINT CHK_Variant_Reserved CHECK (reservedQty >= 0)
);

CREATE TABLE WarehouseImports (
    importId VARCHAR(20) PRIMARY KEY,
    variantId VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    importPrice DECIMAL(12, 2) NOT NULL,
    employeeId VARCHAR(20) NOT NULL,
    importedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Imports_Variant FOREIGN KEY (variantId) REFERENCES ProductVariants(variantId) ON DELETE CASCADE,
    CONSTRAINT FK_Imports_Employee FOREIGN KEY (employeeId) REFERENCES Employees(employeeId)
);

-- ------------------------------------------------------------------------------
-- 4. CART & ORDERS
-- ------------------------------------------------------------------------------

CREATE TABLE Cart (
    cartId VARCHAR(20) PRIMARY KEY,
    customerId VARCHAR(20) NOT NULL,
    variantId VARCHAR(20) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Cart_Customer FOREIGN KEY (customerId) REFERENCES Customers(customerId) ON DELETE CASCADE,
    CONSTRAINT FK_Cart_Variant FOREIGN KEY (variantId) REFERENCES ProductVariants(variantId) ON DELETE CASCADE,
    CONSTRAINT UQ_Customer_CartItem UNIQUE (customerId, variantId),
    CONSTRAINT CHK_Cart_Qty CHECK (quantity > 0)
);

CREATE TABLE Orders (
    orderId VARCHAR(20) PRIMARY KEY,
    customerId VARCHAR(20) NOT NULL,
    orderStatus VARCHAR(30) NOT NULL DEFAULT 'Pending',
    shippingAddress VARCHAR(255) NULL,
    shippingPhone VARCHAR(15) NULL,
    placedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    totalAmount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    paymentMethod VARCHAR(30) NULL,
    paymentStatus VARCHAR(30) NOT NULL DEFAULT 'Pending',
    paidAmount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    issuedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Orders_Customer FOREIGN KEY (customerId) REFERENCES Customers(customerId),
    CONSTRAINT CHK_Order_Status CHECK (orderStatus IN ('Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled', 'Returned')),
    CONSTRAINT CHK_Payment_Status CHECK (paymentStatus IN ('Pending', 'Paid', 'Failed', 'Cancelled', 'Refunded'))
);

CREATE TABLE OrderItems (
    orderItemId VARCHAR(20) PRIMARY KEY,
    orderId VARCHAR(20) NOT NULL,
    variantId VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    unitPrice DECIMAL(12, 2) NOT NULL,
    discountAmount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    CONSTRAINT FK_OrderItems_Order FOREIGN KEY (orderId) REFERENCES Orders(orderId) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Variant FOREIGN KEY (variantId) REFERENCES ProductVariants(variantId),
    CONSTRAINT CHK_OrderItem_Qty CHECK (quantity > 0)
);

-- ------------------------------------------------------------------------------
-- 5. WALLET & USER INTERACTIONS (Reviews, Wishlist)
-- ------------------------------------------------------------------------------

CREATE TABLE Wallets (
    walletId VARCHAR(20) PRIMARY KEY,
    customerId VARCHAR(20) NOT NULL UNIQUE,
    balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    walletStatus VARCHAR(20) NOT NULL DEFAULT 'Active',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_Wallets_Customer FOREIGN KEY (customerId) REFERENCES Customers(customerId) ON DELETE CASCADE,
    CONSTRAINT CHK_Wallet_Balance CHECK (balance >= 0.00),
    CONSTRAINT CHK_Wallet_Status CHECK (walletStatus IN ('Active', 'Locked', 'Suspended'))
);

CREATE TABLE WalletTransactions (
    transactionId VARCHAR(20) PRIMARY KEY,
    walletId VARCHAR(20) NOT NULL,
    orderId VARCHAR(20) NULL,
    transactionType VARCHAR(30) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    transactionStatus VARCHAR(30) NOT NULL DEFAULT 'Pending',
    externalMethod VARCHAR(30) NULL,
    description VARCHAR(255) NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completedAt DATETIME NULL,
    CONSTRAINT FK_WalletTx_Wallet FOREIGN KEY (walletId) REFERENCES Wallets(walletId) ON DELETE CASCADE,
    CONSTRAINT FK_WalletTx_Order FOREIGN KEY (orderId) REFERENCES Orders(orderId),
    CONSTRAINT CHK_WalletTx_Type CHECK (transactionType IN ('Deposit', 'Purchase', 'Refund', 'Withdrawal')),
    CONSTRAINT CHK_WalletTx_Status CHECK (transactionStatus IN ('Pending', 'Completed', 'Failed', 'Cancelled'))
);

CREATE TABLE Comments (
    commentId VARCHAR(20) PRIMARY KEY,
    variantId VARCHAR(20) NOT NULL,
    customerId VARCHAR(20) NOT NULL,
    rating INT NULL,
    content TEXT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    CONSTRAINT FK_Comments_Variant FOREIGN KEY (variantId) REFERENCES ProductVariants(variantId) ON DELETE CASCADE,
    CONSTRAINT FK_Comments_Customer FOREIGN KEY (customerId) REFERENCES Customers(customerId) ON DELETE CASCADE,
    CONSTRAINT CHK_Comment_Rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT CHK_Comment_Status CHECK (status IN ('Active', 'Hidden'))
);

CREATE TABLE Wishlists (
    wishlistId VARCHAR(20) PRIMARY KEY,
    customerId VARCHAR(20) NOT NULL,
    productId VARCHAR(20) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Wishlist_Customer FOREIGN KEY (customerId) REFERENCES Customers(customerId) ON DELETE CASCADE,
    CONSTRAINT FK_Wishlist_Product FOREIGN KEY (productId) REFERENCES Products(productId) ON DELETE CASCADE,
    CONSTRAINT UQ_Customer_Wishlist UNIQUE (customerId, productId)
);

-- ------------------------------------------------------------------------------
-- 6. COMPATIBILITY VIEW
-- ------------------------------------------------------------------------------

CREATE OR REPLACE VIEW OrderDetails AS
SELECT 
    oi.orderItemId AS orderDetailId,
    oi.orderId,
    oi.variantId,
    p.name AS productName,
    s.sizeName,
    c.colorName,
    oi.quantity,
    oi.unitPrice,
    oi.discountAmount,
    (oi.quantity * oi.unitPrice - oi.discountAmount) AS subtotal
FROM OrderItems oi
JOIN ProductVariants pv ON oi.variantId = pv.variantId
JOIN Products p ON pv.productId = p.productId
JOIN Sizes s ON pv.sizeId = s.sizeId
JOIN Colors c ON pv.colorId = c.colorId;

-- ==============================================================================
-- 7. SEED DATA (MOCK DATA)
-- Password for all accounts is '123456' (BCrypt hash)
-- ==============================================================================

-- 1. Employees (Admin & Staff)
INSERT INTO Employees (employeeId, username, fullName, email, phone, address, passwordHash, role, salary, status, avatar) VALUES
('EMP001', 'admin', 'Quản Trị Viên Hệ Thống', 'admin@novaapparel.vn', '0901234567', 'Tòa nhà Landmark 81, TP.HCM', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Admin', 25000000.00, 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'),
('EMP002', 'staff01', 'Nguyễn Văn Kho', 'staff01@novaapparel.vn', '0912345678', '12 Hai Bà Trưng, Hà Nội', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Staff', 12000000.00, 'Active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'),
('EMP003', 'staff02', 'Lê Thị Thu Ngân', 'staff02@novaapparel.vn', '0923456789', '34 Điện Biên Phủ, TP.HCM', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Staff', 11500000.00, 'Active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300');

-- 2. Customers
INSERT INTO Customers (customerId, username, fullName, email, phone, address, passwordHash, status, avatar) VALUES
('CUST001', 'nguyenvana', 'Nguyễn Văn A', 'nguyenvana@gmail.com', '0987654321', '123 Đường Cầu Giấy, Hà Nội', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Active', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'),
('CUST002', 'tranthib', 'Trần Thị Bích', 'tranthib@gmail.com', '0978123456', '456 Lê Duẩn, Đà Nẵng', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Active', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300'),
('CUST003', 'lequangc', 'Lê Quang Cường', 'lequangc@gmail.com', '0965987123', '789 Nguyễn Huệ, TP.HCM', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Active', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300');

-- 3. Categories
INSERT INTO Categories (categoryId, name, description) VALUES
('CAT001', 'Tops & Tees', 'Áo thun, áo phông, áo croptop phong cách thời trang đường phố'),
('CAT002', 'Outerwear', 'Áo khoác biker da, bomber, varsity jackets và áo nỉ hoodie'),
('CAT003', 'Pants & Jeans', 'Quần túi hộp cargo, quần jeans ống suông và jogger thể thao'),
('CAT004', 'Dresses & Skirts', 'Đầm bodycon, chân váy xếp ly và váy phong cách Cyberpunk'),
('CAT005', 'Accessories', 'Mũ lưỡi trai, túi đeo chéo mini và thắt lưng thời trang');

-- 4. Sizes
INSERT INTO Sizes (sizeId, sizeName, categoryId) VALUES
('SZ001', 'S', 'CAT001'),
('SZ002', 'M', 'CAT001'),
('SZ003', 'L', 'CAT001'),
('SZ004', 'XL', 'CAT001'),
('SZ005', 'M', 'CAT002'),
('SZ006', 'L', 'CAT002'),
('SZ007', 'XL', 'CAT002'),
('SZ008', '29', 'CAT003'),
('SZ009', '30', 'CAT003'),
('SZ010', '31', 'CAT003'),
('SZ011', '32', 'CAT003'),
('SZ012', 'S', 'CAT004'),
('SZ013', 'M', 'CAT004'),
('SZ014', 'L', 'CAT004'),
('SZ015', 'FreeSize', 'CAT005');

-- 5. Colors
INSERT INTO Colors (colorId, colorName, hexCode) VALUES
('COL001', 'Đen (Black)', '#000000'),
('COL002', 'Trắng (White)', '#FFFFFF'),
('COL003', 'Beige (Be)', '#F5F5DC'),
('COL004', 'Xám Khói (Smoke Grey)', '#808080'),
('COL005', 'Xanh Navy (Navy Blue)', '#000080'),
('COL006', 'Hồng Pastel (Pastel Pink)', '#FFC0CB'),
('COL007', 'Đỏ Rượu (Burgundy)', '#8B0000');

-- 6. Products
INSERT INTO Products (productId, categoryId, name, description, basePrice, status) VALUES
('PROD001', 'CAT001', 'Áo Thun Oversize Shark Streetwear Graphic', 'Chất liệu 100% Cotton 2 chiều định lượng 250gsm, form áo rộng thoải mái, hình in cao thành bền màu sắc nét.', 350000.00, 'Available'),
('PROD002', 'CAT002', 'Áo Khoác Da Biker Jacket Asymmetric Zip', 'Da PU cao cấp chống thấm nước, lót dù gió thoáng khí, khóa kéo kim loại tĩnh điện sáng bóng phong cách Rockstar.', 1450000.00, 'Available'),
('PROD003', 'CAT003', 'Quần Cargo Pants Multi-Pocket Tactical', 'Vải Kaki thun co giãn nhẹ, thiết kế 6 túi hộp đa năng, lai quần có khóa rút linh hoạt tạo kiểu.', 680000.00, 'Available'),
('PROD004', 'CAT004', 'Chân Váy Xếp Ly Pleated Tennis Skirt', 'Phong cách trẻ trung năng động K-Fashion, nếp gấp xếp ly sắc sảo không biến dạng sau khi giặt, chất tuyết mưa dày dặn.', 420000.00, 'Available'),
('PROD005', 'CAT002', 'Áo Hoodie Cyber Graphic Heavyweight 380gsm', 'Vải nỉ chân cua 100% cotton định lượng 380gsm siêu dày dặn, nón 2 lớp đứng form, họa tiết Cyberpunk dập nổi phản quang.', 750000.00, 'Available'),
('PROD006', 'CAT003', 'Quần Wide-Leg Raw Denim Ripped Jeans', 'Chất vải Jean Denim 100% cotton wash màu xám khói, rách gối cá tính, phom suông rộng tôn dáng cực đỉnh.', 790000.00, 'Available'),
('PROD007', 'CAT001', 'Áo Thun Vintage Washed Acid Drop Shoulder', 'Xử lý wash màu Acid độc bản, cổ áo bo dệt dày dặn 3cm chống dão, phong cách Retro 90s.', 390000.00, 'Available'),
('PROD008', 'CAT005', 'Mũ Cap NOVA Minimalist Distressed Metal Tag', 'Chất liệu vải Canvas thô cao cấp, form nón cứng cáp, tag kim loại NOVA đính bên hông sang trọng.', 290000.00, 'Available');

-- 7. Product Images
INSERT INTO ProductImages (imageId, productId, imageUrl, isPrimary) VALUES
('IMG001', 'PROD001', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', TRUE),
('IMG002', 'PROD001', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', FALSE),
('IMG003', 'PROD002', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', TRUE),
('IMG004', 'PROD002', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800', FALSE),
('IMG005', 'PROD003', 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800', TRUE),
('IMG006', 'PROD004', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800', TRUE),
('IMG007', 'PROD005', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800', TRUE),
('IMG008', 'PROD006', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', TRUE),
('IMG009', 'PROD007', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', TRUE),
('IMG010', 'PROD008', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', TRUE);

-- 8. Product Variants
INSERT INTO ProductVariants (variantId, productId, sizeId, colorId, sku, stockQty, reservedQty, priceOverride) VALUES
('VAR001', 'PROD001', 'SZ002', 'COL001', 'SHARK-M-BLK', 50, 0, 350000.00),
('VAR002', 'PROD001', 'SZ003', 'COL001', 'SHARK-L-BLK', 40, 2, 350000.00),
('VAR003', 'PROD001', 'SZ002', 'COL002', 'SHARK-M-WHT', 35, 0, 350000.00),
('VAR004', 'PROD001', 'SZ003', 'COL002', 'SHARK-L-WHT', 30, 0, 350000.00),
('VAR005', 'PROD002', 'SZ005', 'COL001', 'BIKER-M-BLK', 15, 0, 1450000.00),
('VAR006', 'PROD002', 'SZ006', 'COL001', 'BIKER-L-BLK', 10, 1, 1450000.00),
('VAR007', 'PROD003', 'SZ009', 'COL001', 'CARGO-30-BLK', 25, 0, 680000.00),
('VAR008', 'PROD003', 'SZ010', 'COL004', 'CARGO-31-GRY', 20, 0, 680000.00),
('VAR009', 'PROD004', 'SZ012', 'COL001', 'SKIRT-S-BLK', 30, 0, 420000.00),
('VAR010', 'PROD004', 'SZ013', 'COL003', 'SKIRT-M-BGE', 25, 0, 420000.00),
('VAR011', 'PROD005', 'SZ006', 'COL001', 'HOODIE-L-BLK', 45, 0, 750000.00),
('VAR012', 'PROD006', 'SZ010', 'COL004', 'JEAN-31-GRY', 18, 0, 790000.00),
('VAR013', 'PROD007', 'SZ003', 'COL004', 'VINTAGE-L-GRY', 35, 0, 390000.00),
('VAR014', 'PROD008', 'SZ015', 'COL001', 'CAP-FS-BLK', 60, 0, 290000.00);

-- 9. Wallets & Initial Balance
INSERT INTO Wallets (walletId, customerId, balance, walletStatus) VALUES
('WAL001', 'CUST001', 5000000.00, 'Active'),
('WAL002', 'CUST002', 2500000.00, 'Active'),
('WAL003', 'CUST003', 10000000.00, 'Active');

-- 10. Sample Orders
INSERT INTO Orders (orderId, customerId, orderStatus, shippingAddress, shippingPhone, totalAmount, paymentMethod, paymentStatus, paidAmount) VALUES
('ORD1001', 'CUST001', 'Delivered', '123 Đường Cầu Giấy, Hà Nội', '0987654321', 1800000.00, 'Wallet', 'Paid', 1800000.00),
('ORD1002', 'CUST002', 'Shipping', '456 Lê Duẩn, Đà Nẵng', '0978123456', 750000.00, 'COD', 'Pending', 0.00),
('ORD1003', 'CUST001', 'Pending', '123 Đường Cầu Giấy, Hà Nội', '0987654321', 1450000.00, 'VNPay', 'Paid', 1450000.00);

-- 11. Order Items
INSERT INTO OrderItems (orderItemId, orderId, variantId, quantity, unitPrice, discountAmount) VALUES
('ITEM001', 'ORD1001', 'VAR001', 1, 350000.00, 0.00),
('ORDIT002', 'ORD1001', 'VAR006', 1, 1450000.00, 0.00),
('ITEM003', 'ORD1002', 'VAR011', 1, 750000.00, 0.00),
('ITEM004', 'ORD1003', 'VAR006', 1, 1450000.00, 0.00);

-- 12. Wallet Transactions
INSERT INTO WalletTransactions (transactionId, walletId, orderId, transactionType, amount, transactionStatus, externalMethod, description, completedAt) VALUES
('WTX001', 'WAL001', NULL, 'Deposit', 2000000.00, 'Completed', 'VNPay', 'Nạp tiền vào ví qua cổng VNPay', NOW()),
('WTX002', 'WAL001', 'ORD1001', 'Purchase', -1800000.00, 'Completed', NULL, 'Thanh toán đơn hàng ORD1001', NOW());
