-- ==============================================================================================
-- FASHION SHOP DATABASE - COMPLETE SCHEMA & SEED DATA SCRIPT (SQL SERVER)
-- Bao gồm: Toàn bộ bảng chuẩn hóa, Ràng buộc, Triggers, Views, Indexes và Dữ liệu mẫu phong phú.
-- Mật khẩu mặc định cho tất cả tài khoản (admin, staff01, staff02, nguyenvana, tranthib, lequangc): 123456
-- BCrypt Hash: $2a$12$LAP8w3oqvBEr9mCCZvzW0eKSKZIfSXVLLtFvlg1FuPlsrZ4/pRibO
-- ==============================================================================================

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

-- 1. TẠO HOẶC SỬ DỤNG DATABASE
IF DB_ID(N'NovaApparelDB') IS NULL
BEGIN
    CREATE DATABASE NovaApparelDB;
END;
GO

USE NovaApparelDB;
GO

-- 2. XÓA CÁC BẢNG CŨ NẾU ĐÃ TỒN TẠI (THEO THỨ TỰ RÀNG BUỘC KHÓA NGOẠI)
IF OBJECT_ID(N'dbo.WalletTransactions', N'U') IS NOT NULL DROP TABLE dbo.WalletTransactions;
IF OBJECT_ID(N'dbo.Wallets', N'U') IS NOT NULL DROP TABLE dbo.Wallets;
IF OBJECT_ID(N'dbo.Comments', N'U') IS NOT NULL DROP TABLE dbo.Comments;
IF OBJECT_ID(N'dbo.Wishlists', N'U') IS NOT NULL DROP TABLE dbo.Wishlists;
IF OBJECT_ID(N'dbo.Cart', N'U') IS NOT NULL DROP TABLE dbo.Cart;
IF OBJECT_ID(N'dbo.OrderDetails', N'V') IS NOT NULL DROP VIEW dbo.OrderDetails;
IF OBJECT_ID(N'dbo.OrderItems', N'U') IS NOT NULL DROP TABLE dbo.OrderItems;
IF OBJECT_ID(N'dbo.Orders', N'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID(N'dbo.WarehouseImports', N'U') IS NOT NULL DROP TABLE dbo.WarehouseImports;
IF OBJECT_ID(N'dbo.ProductVariants', N'U') IS NOT NULL DROP TABLE dbo.ProductVariants;
IF OBJECT_ID(N'dbo.ProductImages', N'U') IS NOT NULL DROP TABLE dbo.ProductImages;
IF OBJECT_ID(N'dbo.Products', N'U') IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID(N'dbo.Sizes', N'U') IS NOT NULL DROP TABLE dbo.Sizes;
IF OBJECT_ID(N'dbo.Colors', N'U') IS NOT NULL DROP TABLE dbo.Colors;
IF OBJECT_ID(N'dbo.Categories', N'U') IS NOT NULL DROP TABLE dbo.Categories;
IF OBJECT_ID(N'dbo.Employees', N'U') IS NOT NULL DROP TABLE dbo.Employees;
IF OBJECT_ID(N'dbo.Customers', N'U') IS NOT NULL DROP TABLE dbo.Customers;
GO

-- ==============================================================================================
-- 3. ĐỊNH NGHĨA CẤU TRÚC BẢNG (DDL SCHEMA)
-- ==============================================================================================

-- A. BẢNG KHÁCH HÀNG (dbo.Customers)
CREATE TABLE dbo.Customers (
    customerId VARCHAR(20) NOT NULL,
    username VARCHAR(100) NOT NULL,
    fullName NVARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NULL,
    address NVARCHAR(255) NULL,
    passwordHash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_Customers_Status DEFAULT ('Active'),
    avatar VARCHAR(500) NULL,
    createdAt DATETIME NOT NULL CONSTRAINT DF_Customers_CreatedAt DEFAULT (GETDATE()),

    CONSTRAINT PK_Customers PRIMARY KEY (customerId),
    CONSTRAINT UQ_Customers_Username UNIQUE (username),
    CONSTRAINT UQ_Customers_Email UNIQUE (email),
    CONSTRAINT CK_Customers_Status CHECK (status IN ('Active', 'Inactive', 'Locked'))
);
GO

-- B. BẢNG NHÂN VIÊN & QUẢN TRỊ VIÊN (dbo.Employees)
CREATE TABLE dbo.Employees (
    employeeId VARCHAR(20) NOT NULL,
    username VARCHAR(100) NOT NULL,
    fullName NVARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NULL,
    address NVARCHAR(255) NULL,
    passwordHash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CONSTRAINT DF_Employees_Role DEFAULT ('Staff'),
    salary DECIMAL(12,2) NOT NULL CONSTRAINT DF_Employees_Salary DEFAULT (0),
    status VARCHAR(20) NOT NULL CONSTRAINT DF_Employees_Status DEFAULT ('Active'),
    avatar VARCHAR(500) NULL,
    createdAt DATETIME NOT NULL CONSTRAINT DF_Employees_CreatedAt DEFAULT (GETDATE()),

    CONSTRAINT PK_Employees PRIMARY KEY (employeeId),
    CONSTRAINT UQ_Employees_Username UNIQUE (username),
    CONSTRAINT UQ_Employees_Email UNIQUE (email),
    CONSTRAINT CK_Employees_Role CHECK (role IN ('Staff', 'Admin')),
    CONSTRAINT CK_Employees_Status CHECK (status IN ('Active', 'Inactive', 'Locked')),
    CONSTRAINT CK_Employees_Salary CHECK (salary >= 0)
);
GO

-- TRIGGERS: Tránh xung đột trùng username/email giữa Customer và Employee
CREATE TRIGGER dbo.TR_Customers_NoEmployeeCollision
ON dbo.Customers
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1 FROM inserted i
        INNER JOIN dbo.Employees e ON e.username = i.username OR e.email = i.email
    )
    BEGIN
        THROW 51001, 'Username hoặc Email của Khách hàng trùng với Nhân viên hệ thống.', 1;
    END;
END;
GO

CREATE TRIGGER dbo.TR_Employees_NoCustomerCollision
ON dbo.Employees
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1 FROM inserted i
        INNER JOIN dbo.Customers c ON c.username = i.username OR c.email = i.email
    )
    BEGIN
        THROW 51002, 'Username hoặc Email của Nhân viên trùng với Khách hàng hệ thống.', 1;
    END;
END;
GO

-- C. DANH MỤC SẢN PHẨM (dbo.Categories)
CREATE TABLE dbo.Categories (
    categoryId VARCHAR(20) NOT NULL,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500) NULL,

    CONSTRAINT PK_Categories PRIMARY KEY (categoryId),
    CONSTRAINT UQ_Categories_Name UNIQUE (name)
);
GO

-- D. BẢNG MÀU SẮC (dbo.Colors)
CREATE TABLE dbo.Colors (
    colorId VARCHAR(20) NOT NULL,
    colorName NVARCHAR(50) NOT NULL,
    hexCode VARCHAR(10) NULL,

    CONSTRAINT PK_Colors PRIMARY KEY (colorId),
    CONSTRAINT UQ_Colors_ColorName UNIQUE (colorName),
    CONSTRAINT CK_Colors_HexCode CHECK (
        hexCode IS NULL 
        OR hexCode LIKE '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'
    )
);
GO

-- E. KÍCH THƯỚC (dbo.Sizes)
CREATE TABLE dbo.Sizes (
    sizeId VARCHAR(20) NOT NULL,
    sizeName VARCHAR(20) NOT NULL,
    categoryId VARCHAR(20) NOT NULL,

    CONSTRAINT PK_Sizes PRIMARY KEY (sizeId),
    CONSTRAINT UQ_Sizes_SizeName_Category UNIQUE (sizeName, categoryId),
    CONSTRAINT FK_Sizes_Categories FOREIGN KEY (categoryId) REFERENCES dbo.Categories(categoryId)
);
GO

-- F. SẢN PHẨM (dbo.Products)
CREATE TABLE dbo.Products (
    productId VARCHAR(20) NOT NULL,
    categoryId VARCHAR(20) NOT NULL,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NULL,
    basePrice DECIMAL(12,2) NOT NULL CONSTRAINT DF_Products_BasePrice DEFAULT (0),
    status VARCHAR(20) NOT NULL CONSTRAINT DF_Products_Status DEFAULT ('Available'),
    createdAt DATETIME NOT NULL CONSTRAINT DF_Products_CreatedAt DEFAULT (GETDATE()),
    updatedAt DATETIME NOT NULL CONSTRAINT DF_Products_UpdatedAt DEFAULT (GETDATE()),

    CONSTRAINT PK_Products PRIMARY KEY (productId),
    CONSTRAINT CK_Products_BasePrice CHECK (basePrice >= 0),
    CONSTRAINT CK_Products_Status CHECK (status IN ('Available', 'OutOfStock', 'Inactive')),
    CONSTRAINT FK_Products_Categories FOREIGN KEY (categoryId) REFERENCES dbo.Categories(categoryId)
);
GO

-- G. HÌNH ẢNH SẢN PHẨM (dbo.ProductImages)
CREATE TABLE dbo.ProductImages (
    imageId VARCHAR(20) NOT NULL,
    productId VARCHAR(20) NOT NULL,
    imageUrl VARCHAR(500) NOT NULL,
    isPrimary BIT NOT NULL CONSTRAINT DF_ProductImages_IsPrimary DEFAULT (0),

    CONSTRAINT PK_ProductImages PRIMARY KEY (imageId),
    CONSTRAINT FK_ProductImages_Products FOREIGN KEY (productId) REFERENCES dbo.Products(productId) ON DELETE CASCADE
);
GO

-- H. BIẾN THỂ SẢN PHẨM (dbo.ProductVariants)
CREATE TABLE dbo.ProductVariants (
    variantId VARCHAR(20) NOT NULL,
    productId VARCHAR(20) NOT NULL,
    sizeId VARCHAR(20) NOT NULL,
    colorId VARCHAR(20) NOT NULL,
    sku VARCHAR(50) NULL,
    stockQty INT NOT NULL CONSTRAINT DF_ProductVariants_StockQty DEFAULT (0),
    reservedQty INT NOT NULL CONSTRAINT DF_ProductVariants_ReservedQty DEFAULT (0),
    priceOverride DECIMAL(12,2) NULL,
    createdAt DATETIME NOT NULL CONSTRAINT DF_ProductVariants_CreatedAt DEFAULT (GETDATE()),

    CONSTRAINT PK_ProductVariants PRIMARY KEY (variantId),
    CONSTRAINT UQ_ProductVariants_Product_Size_Color UNIQUE (productId, sizeId, colorId),
    CONSTRAINT CK_ProductVariants_StockQty CHECK (stockQty >= 0),
    CONSTRAINT CK_ProductVariants_ReservedQty CHECK (reservedQty >= 0 AND reservedQty <= stockQty),
    CONSTRAINT CK_ProductVariants_PriceOverride CHECK (priceOverride IS NULL OR priceOverride >= 0),
    CONSTRAINT FK_ProductVariants_Products FOREIGN KEY (productId) REFERENCES dbo.Products(productId) ON DELETE CASCADE,
    CONSTRAINT FK_ProductVariants_Sizes FOREIGN KEY (sizeId) REFERENCES dbo.Sizes(sizeId),
    CONSTRAINT FK_ProductVariants_Colors FOREIGN KEY (colorId) REFERENCES dbo.Colors(colorId)
);
GO

-- I. GIỎ HÀNG (dbo.Cart)
CREATE TABLE dbo.Cart (
    cartId VARCHAR(20) NOT NULL,
    customerId VARCHAR(20) NOT NULL,
    variantId VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,

    CONSTRAINT PK_Cart PRIMARY KEY (cartId),
    CONSTRAINT UQ_Cart_Customer_Variant UNIQUE (customerId, variantId),
    CONSTRAINT CK_Cart_Quantity CHECK (quantity > 0),
    CONSTRAINT FK_Cart_Customers FOREIGN KEY (customerId) REFERENCES dbo.Customers(customerId) ON DELETE CASCADE,
    CONSTRAINT FK_Cart_ProductVariants FOREIGN KEY (variantId) REFERENCES dbo.ProductVariants(variantId) ON DELETE CASCADE
);
GO

-- J. ĐƠN HÀNG (dbo.Orders)
CREATE TABLE dbo.Orders (
    orderId VARCHAR(20) NOT NULL,
    customerId VARCHAR(20) NOT NULL,
    orderStatus VARCHAR(30) NOT NULL CONSTRAINT DF_Orders_Status DEFAULT ('Pending'),
    shippingAddress NVARCHAR(255) NULL,
    shippingPhone VARCHAR(15) NULL,
    placedAt DATETIME NOT NULL CONSTRAINT DF_Orders_PlacedAt DEFAULT (GETDATE()),
    totalAmount DECIMAL(12,2) NOT NULL CONSTRAINT DF_Orders_TotalAmount DEFAULT (0),
    paymentMethod VARCHAR(30) NULL,
    paymentStatus VARCHAR(30) NOT NULL CONSTRAINT DF_Orders_PaymentStatus DEFAULT ('Pending'),
    paidAmount DECIMAL(12,2) NOT NULL CONSTRAINT DF_Orders_PaidAmount DEFAULT (0),
    issuedDate DATETIME NOT NULL CONSTRAINT DF_Orders_IssuedDate DEFAULT (GETDATE()),

    CONSTRAINT PK_Orders PRIMARY KEY (orderId),
    CONSTRAINT CK_Orders_Status CHECK (orderStatus IN ('Pending', 'Confirmed', 'Processing', 'Shipping', 'Delivered', 'Cancelled')),
    CONSTRAINT CK_Orders_TotalAmount CHECK (totalAmount >= 0),
    CONSTRAINT CK_Orders_PaymentMethod CHECK (paymentMethod IS NULL OR paymentMethod IN ('VNPay', 'Wallet', 'COD')),
    CONSTRAINT CK_Orders_PaymentStatus CHECK (paymentStatus IN ('Pending', 'Paid', 'Failed', 'Cancelled', 'Refunded')),
    CONSTRAINT CK_Orders_PaidAmount CHECK (paidAmount >= 0 AND paidAmount <= totalAmount),
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (customerId) REFERENCES dbo.Customers(customerId)
);
GO

-- K. CHI TIẾT ĐƠN HÀNG (dbo.OrderItems)
CREATE TABLE dbo.OrderItems (
    orderItemId VARCHAR(20) NOT NULL,
    orderId VARCHAR(20) NOT NULL,
    variantId VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    unitPrice DECIMAL(12,2) NOT NULL,
    discountAmount DECIMAL(12,2) NOT NULL CONSTRAINT DF_OrderItems_DiscountAmount DEFAULT (0),

    CONSTRAINT PK_OrderItems PRIMARY KEY (orderItemId),
    CONSTRAINT CK_OrderItems_Quantity CHECK (quantity > 0),
    CONSTRAINT CK_OrderItems_UnitPrice CHECK (unitPrice >= 0),
    CONSTRAINT CK_OrderItems_DiscountAmount CHECK (discountAmount >= 0),
    CONSTRAINT CK_OrderItems_DiscountWithinLineTotal CHECK (discountAmount <= unitPrice * quantity),
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (orderId) REFERENCES dbo.Orders(orderId) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_ProductVariants FOREIGN KEY (variantId) REFERENCES dbo.ProductVariants(variantId)
);
GO

CREATE VIEW dbo.OrderDetails AS
SELECT
    orderItemId AS orderDetailId,
    orderId,
    variantId,
    quantity,
    unitPrice,
    discountAmount
FROM dbo.OrderItems;
GO

-- L. VÍ TIỀN KHÁCH HÀNG (dbo.Wallets)
CREATE TABLE dbo.Wallets (
    walletId VARCHAR(20) NOT NULL,
    customerId VARCHAR(20) NOT NULL,
    balance DECIMAL(12,2) NOT NULL CONSTRAINT DF_Wallets_Balance DEFAULT (0),
    walletStatus VARCHAR(20) NOT NULL CONSTRAINT DF_Wallets_Status DEFAULT ('Active'),
    createdAt DATETIME NOT NULL CONSTRAINT DF_Wallets_CreatedAt DEFAULT (GETDATE()),
    updatedAt DATETIME NOT NULL CONSTRAINT DF_Wallets_UpdatedAt DEFAULT (GETDATE()),

    CONSTRAINT PK_Wallets PRIMARY KEY (walletId),
    CONSTRAINT UQ_Wallets_CustomerId UNIQUE (customerId),
    CONSTRAINT CK_Wallets_Balance CHECK (balance >= 0),
    CONSTRAINT CK_Wallets_Status CHECK (walletStatus IN ('Active', 'Locked')),
    CONSTRAINT FK_Wallets_Customers FOREIGN KEY (customerId) REFERENCES dbo.Customers(customerId) ON DELETE CASCADE
);
GO

-- M. LỊCH SỬ GIAO DỊCH VÍ (dbo.WalletTransactions)
CREATE TABLE dbo.WalletTransactions (
    transactionId VARCHAR(20) NOT NULL,
    walletId VARCHAR(20) NOT NULL,
    orderId VARCHAR(20) NULL,
    transactionType VARCHAR(30) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    transactionStatus VARCHAR(30) NOT NULL CONSTRAINT DF_WalletTransactions_Status DEFAULT ('Pending'),
    externalMethod VARCHAR(30) NULL,
    description NVARCHAR(255) NULL,
    createdAt DATETIME NOT NULL CONSTRAINT DF_WalletTransactions_CreatedAt DEFAULT (GETDATE()),
    completedAt DATETIME NULL,

    CONSTRAINT PK_WalletTransactions PRIMARY KEY (transactionId),
    CONSTRAINT CK_WalletTransactions_Type CHECK (transactionType IN ('Deposit', 'Purchase', 'Refund')),
    CONSTRAINT CK_WalletTransactions_Amount CHECK (amount > 0),
    CONSTRAINT CK_WalletTransactions_Status CHECK (transactionStatus IN ('Pending', 'Completed', 'Failed', 'Cancelled')),
    CONSTRAINT CK_WalletTransactions_ExternalMethod CHECK (externalMethod IS NULL OR externalMethod IN ('VNPay')),
    CONSTRAINT CK_WalletTransactions_CompletedAt CHECK (
        (transactionStatus = 'Completed' AND completedAt IS NOT NULL)
        OR (transactionStatus <> 'Completed')
    ),
    CONSTRAINT FK_WalletTransactions_Wallets FOREIGN KEY (walletId) REFERENCES dbo.Wallets(walletId) ON DELETE CASCADE,
    CONSTRAINT FK_WalletTransactions_Orders FOREIGN KEY (orderId) REFERENCES dbo.Orders(orderId)
);
GO

-- N. ĐÁNH GIÁ & BÌNH LUẬN (dbo.Comments)
CREATE TABLE dbo.Comments (
    commentId VARCHAR(20) NOT NULL,
    variantId VARCHAR(20) NOT NULL,
    customerId VARCHAR(20) NOT NULL,
    rating INT NULL,
    content NVARCHAR(1000) NULL,
    createdAt DATETIME NOT NULL CONSTRAINT DF_Comments_CreatedAt DEFAULT (GETDATE()),
    status VARCHAR(20) NOT NULL CONSTRAINT DF_Comments_Status DEFAULT ('Active'),

    CONSTRAINT PK_Comments PRIMARY KEY (commentId),
    CONSTRAINT CK_Comments_Rating CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
    CONSTRAINT CK_Comments_Status CHECK (status IN ('Active', 'Hidden')),
    CONSTRAINT FK_Comments_ProductVariants FOREIGN KEY (variantId) REFERENCES dbo.ProductVariants(variantId),
    CONSTRAINT FK_Comments_Customers FOREIGN KEY (customerId) REFERENCES dbo.Customers(customerId) ON DELETE CASCADE
);
GO

-- O. DANH SÁCH YÊU THÍCH (dbo.Wishlists)
CREATE TABLE dbo.Wishlists (
    wishlistId VARCHAR(20) NOT NULL,
    customerId VARCHAR(20) NOT NULL,
    productId VARCHAR(20) NOT NULL,
    createdAt DATETIME NOT NULL CONSTRAINT DF_Wishlists_CreatedAt DEFAULT (GETDATE()),

    CONSTRAINT PK_Wishlists PRIMARY KEY (wishlistId),
    CONSTRAINT UQ_Wishlists_Customer_Product UNIQUE (customerId, productId),
    CONSTRAINT FK_Wishlists_Customers FOREIGN KEY (customerId) REFERENCES dbo.Customers(customerId) ON DELETE CASCADE,
    CONSTRAINT FK_Wishlists_Products FOREIGN KEY (productId) REFERENCES dbo.Products(productId) ON DELETE CASCADE
);
GO

-- P. NHẬP KHO (dbo.WarehouseImports)
CREATE TABLE dbo.WarehouseImports (
    importId VARCHAR(20) NOT NULL,
    variantId VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    importPrice DECIMAL(12,2) NOT NULL,
    employeeId VARCHAR(20) NOT NULL,
    importedAt DATETIME NOT NULL CONSTRAINT DF_WarehouseImports_ImportedAt DEFAULT (GETDATE()),

    CONSTRAINT PK_WarehouseImports PRIMARY KEY (importId),
    CONSTRAINT CK_WarehouseImports_Quantity CHECK (quantity > 0),
    CONSTRAINT CK_WarehouseImports_ImportPrice CHECK (importPrice >= 0),
    CONSTRAINT FK_WarehouseImports_ProductVariants FOREIGN KEY (variantId) REFERENCES dbo.ProductVariants(variantId),
    CONSTRAINT FK_WarehouseImports_Employees FOREIGN KEY (employeeId) REFERENCES dbo.Employees(employeeId)
);
GO

-- ==============================================================================================
-- 4. TẠO INDEX TỐI ƯU TRUY VẤN
-- ==============================================================================================
CREATE INDEX IX_Orders_CustomerId_PlacedAt ON dbo.Orders(customerId, placedAt DESC);
CREATE INDEX IX_Orders_Status_PlacedAt ON dbo.Orders(orderStatus, placedAt) INCLUDE (customerId, totalAmount, paymentMethod, paymentStatus, paidAmount);
CREATE INDEX IX_OrderItems_OrderId ON dbo.OrderItems(orderId);
CREATE UNIQUE INDEX UX_ProductVariants_SKU_NotNull ON dbo.ProductVariants(sku) WHERE sku IS NOT NULL;
CREATE INDEX IX_ProductVariants_AvailableStock ON dbo.ProductVariants(productId) INCLUDE (variantId, sizeId, colorId, sku, stockQty, reservedQty, priceOverride);
CREATE INDEX IX_ProductImages_ProductId_Primary ON dbo.ProductImages(productId, isPrimary DESC, imageId);
CREATE INDEX IX_Cart_CustomerId ON dbo.Cart(customerId) INCLUDE (variantId, quantity);
CREATE INDEX IX_Comments_VariantId_CreatedAt ON dbo.Comments(variantId, createdAt DESC) INCLUDE (customerId, rating, status);
CREATE INDEX IX_WalletTransactions_WalletId_CreatedAt ON dbo.WalletTransactions(walletId, createdAt DESC) INCLUDE (orderId, transactionType, transactionStatus, amount, completedAt);
GO

-- ==============================================================================================
-- 5. CHÈN DỮ LIỆU MẪU (MOCK SEED DATA)
-- ==============================================================================================

-- A. EMPLOYEES
INSERT INTO dbo.Employees (employeeId, username, fullName, email, phone, address, passwordHash, role, salary, status, avatar)
VALUES
('EMP001', 'admin', N'Trần Minh Admin', 'admin@gmail.com', '0987654321', N'123 Cầu Giấy, Hà Nội', '$2a$12$LAP8w3oqvBEr9mCCZvzW0eKSKZIfSXVLLtFvlg1FuPlsrZ4/pRibO', 'Admin', 25000000, 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'),
('EMP002', 'staff01', N'Nguyễn Thu Staff', 'staff@gmail.com', '0912345678', N'456 Lê Duẩn, Đà Nẵng', '$2a$12$LAP8w3oqvBEr9mCCZvzW0eKSKZIfSXVLLtFvlg1FuPlsrZ4/pRibO', 'Staff', 12000000, 'Active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'),
('EMP003', 'staff02', N'Lê Hoàng Kho', 'staff2@gmail.com', '0934567890', N'789 Nguyễn Huệ, TP.HCM', '$2a$12$LAP8w3oqvBEr9mCCZvzW0eKSKZIfSXVLLtFvlg1FuPlsrZ4/pRibO', 'Staff', 10000000, 'Active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300');
GO

-- B. CUSTOMERS
INSERT INTO dbo.Customers (customerId, username, fullName, email, phone, address, passwordHash, status, avatar)
VALUES
('CUST001', 'nguyenvana', N'Nguyễn Văn A', 'customer@gmail.com', '0901112223', N'12 Hai Bà Trưng, Hoàn Kiếm, Hà Nội', '$2a$12$LAP8w3oqvBEr9mCCZvzW0eKSKZIfSXVLLtFvlg1FuPlsrZ4/pRibO', 'Active', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'),
('CUST002', 'tranthib', N'Trần Thị Bích', 'customer2@gmail.com', '0903334445', N'34 Điện Biên Phủ, Quận 3, TP.HCM', '$2a$12$LAP8w3oqvBEr9mCCZvzW0eKSKZIfSXVLLtFvlg1FuPlsrZ4/pRibO', 'Active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300'),
('CUST003', 'lequangc', N'Lê Quang Cường', 'customer3@gmail.com', '0905556667', N'56 Hùng Vương, Hải Châu, Đà Nẵng', '$2a$12$LAP8w3oqvBEr9mCCZvzW0eKSKZIfSXVLLtFvlg1FuPlsrZ4/pRibO', 'Active', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300');
GO

-- C. WALLETS
INSERT INTO dbo.Wallets (walletId, customerId, balance, walletStatus)
VALUES
('WAL001', 'CUST001', 5000000, 'Active'),
('WAL002', 'CUST002', 2500000, 'Active'),
('WAL003', 'CUST003', 1000000, 'Active');
GO

-- D. CATEGORIES
INSERT INTO dbo.Categories (categoryId, name, description)
VALUES
('CAT001', 'Tops & Tees', N'Áo thun, áo phông streetwear, polo và áo kiểu thời trang cao cấp'),
('CAT002', 'Outerwear', N'Áo khoác gió, áo jacket da, bomber, hoodie và sweater phong cách'),
('CAT003', 'Accessories', N'Phụ kiện thời trang, nón bucket, túi xách canvas, thắt lưng cá tính'),
('CAT004', 'Dresses & Skirts', N'Váy đầm, chân váy xếp ly, chân váy chữ A sành điệu'),
('CAT005', 'Pants & Jeans', N'Quần tây âu, quần jean baggy xám khói, quần short năng động');
GO

-- E. COLORS
INSERT INTO dbo.Colors (colorId, colorName, hexCode)
VALUES
('COL001', N'Đen (Black)', '#000000'),
('COL002', N'Trắng (White)', '#FFFFFF'),
('COL003', N'Be (Beige)', '#F5F5DC'),
('COL004', N'Xám (Grey)', '#808080'),
('COL005', N'Xanh Navy', '#000080'),
('COL006', N'Hồng (Pink)', '#FFC0CB'),
('COL007', N'Đỏ Nâu (Brown/Red)', '#8B0000');
GO

-- F. SIZES
INSERT INTO dbo.Sizes (sizeId, sizeName, categoryId)
VALUES
('SZ001', 'S', 'CAT001'),
('SZ002', 'M', 'CAT001'),
('SZ003', 'L', 'CAT001'),
('SZ004', 'XL', 'CAT001'),
('SZ005', 'M', 'CAT002'),
('SZ006', 'L', 'CAT002'),
('SZ007', 'XL', 'CAT002'),
('SZ008', 'FreeSize', 'CAT003'),
('SZ009', 'S', 'CAT004'),
('SZ010', 'M', 'CAT004'),
('SZ011', 'L', 'CAT004'),
('SZ012', '29', 'CAT005'),
('SZ013', '30', 'CAT005'),
('SZ014', '31', 'CAT005'),
('SZ015', '32', 'CAT005');
GO

-- G. PRODUCTS
INSERT INTO dbo.Products (productId, categoryId, name, description, basePrice, status)
VALUES
('PROD001', 'CAT001', N'Áo Thun Shark Streetwear Oversize', N'Chất liệu cotton 100% 2 chiều 250gsm dày dặn, form oversize chuẩn streetwear sành điệu, in lụa cao cấp không bong tróc.', 290000, 'Available'),
('PROD002', 'CAT001', N'Áo Thun Basic Boxy Fit Minimalist', N'Áo phông trơn form boxy tôn dáng, chất vải cotton compact chống nhăn, thoáng mát cho ngày hè năng động.', 220000, 'Available'),
('PROD003', 'CAT001', N'Áo Polo Vintage Classic Collar', N'Thiết kế phối bo cổ retro lịch lãm, vải cá sấu mè co giãn 4 chiều mềm mịn, thấm hút mồ hôi tối đa.', 350000, 'Available'),
('PROD004', 'CAT002', N'Áo Hoodie Nỉ Bông Unisex Cyberpunk', N'Vải nỉ bông định lượng 380gsm siêu ấm, mũ trùm 2 lớp đứng form cá tính với logo thêu sắc nét.', 450000, 'Available'),
('PROD005', 'CAT002', N'Áo Khoác Da Biker Jacket Supreme', N'Chất da PU nhân tạo cao cấp chống nổ, lót dù gió thoáng khí, khóa kéo kim loại mạ tĩnh điện sáng bóng.', 850000, 'Available'),
('PROD006', 'CAT002', N'Áo Khoác Dù 2 Lớp Waterproof Windbreaker', N'Vải dù miro 2 lớp cản gió chống nước chuẩn công nghệ Nhật Bản, phản quang trong đêm thể thao.', 390000, 'Available'),
('PROD007', 'CAT004', N'Chân Váy Tag Kim Loại EcoChic Pink', N'Chân váy chữ A đính tag kim loại sang trọng, phối tone hồng pastel thời thượng, kèm quần bảo hộ bên trong.', 320000, 'Available'),
('PROD008', 'CAT004', N'Chân Váy Xếp Ly Tennis Skirt White', N'Phong cách trẻ trung năng động K-Fashion, nếp gấp xếp ly sắc sảo không biến dạng sau khi giặt.', 280000, 'Available'),
('PROD009', 'CAT005', N'Quần Tây Âu Nam Nữ Straight Fit', N'Chất vải tuyết hàn cao cấp rủ nhẹ đứng dáng, cạp chun ẩn co giãn thông minh không lo chật bụng.', 420000, 'Available'),
('PROD010', 'CAT005', N'Quần Jean Baggy Rách Gối Wash Xám', N'Vải denim 13.5oz dày dặn, wash acid tone xám khói vintage bụi bặm, form rộng thoải mái.', 490000, 'Available'),
('PROD011', 'CAT003', N'Túi Canvas Đeo Chéo Multi-Pocket', N'Túi vải bố canvas cao cấp dày dặn chống trầy, thiết kế nhiều ngăn tiện dụng vừa iPad và phụ kiện.', 180000, 'Available'),
('PROD012', 'CAT003', N'Nón Lưỡi Trai Thêu Logo Minimalist', N'Chất kaki 100% cotton thoáng mát, khóa kim loại dập nổi sang trọng, form nón chuẩn xuất khẩu.', 150000, 'Available');
GO

-- H. PRODUCT IMAGES
INSERT INTO dbo.ProductImages (imageId, productId, imageUrl, isPrimary)
VALUES
('IMG001', 'PROD001', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', 1),
('IMG002', 'PROD001', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', 0),
('IMG003', 'PROD002', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 1),
('IMG004', 'PROD002', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', 0),
('IMG005', 'PROD003', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800', 1),
('IMG006', 'PROD004', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800', 1),
('IMG007', 'PROD004', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800', 0),
('IMG008', 'PROD005', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 1),
('IMG009', 'PROD005', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800', 0),
('IMG010', 'PROD006', 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800', 1),
('IMG011', 'PROD007', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800', 1),
('IMG012', 'PROD008', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 1),
('IMG013', 'PROD009', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800', 1),
('IMG014', 'PROD010', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', 1),
('IMG015', 'PROD011', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800', 1),
('IMG016', 'PROD012', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', 1);
GO

-- I. PRODUCT VARIANTS
INSERT INTO dbo.ProductVariants (variantId, productId, sizeId, colorId, sku, stockQty, reservedQty, priceOverride)
VALUES
('VAR001', 'PROD001', 'SZ002', 'COL001', 'SHARK-M-BLK', 50, 2, NULL),
('VAR002', 'PROD001', 'SZ003', 'COL001', 'SHARK-L-BLK', 45, 0, NULL),
('VAR003', 'PROD001', 'SZ002', 'COL002', 'SHARK-M-WHT', 30, 0, NULL),
('VAR004', 'PROD001', 'SZ003', 'COL002', 'SHARK-L-WHT', 25, 1, NULL),
('VAR005', 'PROD002', 'SZ002', 'COL001', 'BASIC-M-BLK', 60, 0, 200000),
('VAR006', 'PROD002', 'SZ003', 'COL003', 'BASIC-L-BGE', 40, 0, 200000),
('VAR007', 'PROD003', 'SZ002', 'COL005', 'POLO-M-NVY', 35, 0, NULL),
('VAR008', 'PROD003', 'SZ003', 'COL005', 'POLO-L-NVY', 30, 0, NULL),
('VAR009', 'PROD004', 'SZ005', 'COL001', 'HOOD-M-BLK', 40, 1, NULL),
('VAR010', 'PROD004', 'SZ006', 'COL004', 'HOOD-L-GRY', 35, 0, NULL),
('VAR011', 'PROD005', 'SZ005', 'COL001', 'LEATH-M-BLK', 20, 0, NULL),
('VAR012', 'PROD005', 'SZ006', 'COL001', 'LEATH-L-BLK', 15, 0, NULL),
('VAR013', 'PROD006', 'SZ005', 'COL005', 'WIND-M-NVY', 50, 0, NULL),
('VAR014', 'PROD007', 'SZ009', 'COL006', 'SKIRT-S-PNK', 25, 0, NULL),
('VAR015', 'PROD007', 'SZ010', 'COL006', 'SKIRT-M-PNK', 20, 0, NULL),
('VAR016', 'PROD008', 'SZ009', 'COL002', 'TENNIS-S-WHT', 30, 0, NULL),
('VAR017', 'PROD008', 'SZ010', 'COL001', 'TENNIS-M-BLK', 30, 0, NULL),
('VAR018', 'PROD009', 'SZ013', 'COL001', 'PANTS-30-BLK', 40, 0, NULL),
('VAR019', 'PROD009', 'SZ014', 'COL004', 'PANTS-31-GRY', 35, 0, NULL),
('VAR020', 'PROD010', 'SZ013', 'COL005', 'JEAN-30-NVY', 45, 0, NULL),
('VAR021', 'PROD011', 'SZ008', 'COL003', 'BAG-FREE-BGE', 80, 0, NULL),
('VAR022', 'PROD012', 'SZ008', 'COL001', 'CAP-FREE-BLK', 100, 0, NULL);
GO

-- J. WAREHOUSE IMPORTS
INSERT INTO dbo.WarehouseImports (importId, variantId, quantity, importPrice, employeeId, importedAt)
VALUES
('IMP001', 'VAR001', 50, 150000, 'EMP002', DATEADD(DAY, -10, GETDATE())),
('IMP002', 'VAR002', 45, 150000, 'EMP002', DATEADD(DAY, -10, GETDATE())),
('IMP003', 'VAR009', 40, 250000, 'EMP002', DATEADD(DAY, -8, GETDATE())),
('IMP004', 'VAR011', 20, 500000, 'EMP002', DATEADD(DAY, -5, GETDATE())),
('IMP005', 'VAR014', 25, 180000, 'EMP002', DATEADD(DAY, -3, GETDATE())),
('IMP006', 'VAR021', 80, 90000, 'EMP002', DATEADD(DAY, -2, GETDATE()));
GO

-- K. CART
INSERT INTO dbo.Cart (cartId, customerId, variantId, quantity)
VALUES
('CART001', 'CUST001', 'VAR001', 1),
('CART002', 'CUST001', 'VAR021', 2),
('CART003', 'CUST002', 'VAR014', 1);
GO

-- L. WISHLISTS
INSERT INTO dbo.Wishlists (wishlistId, customerId, productId, createdAt)
VALUES
('WISH001', 'CUST001', 'PROD001', DATEADD(DAY, -5, GETDATE())),
('WISH002', 'CUST001', 'PROD004', DATEADD(DAY, -4, GETDATE())),
('WISH003', 'CUST001', 'PROD007', DATEADD(DAY, -2, GETDATE())),
('WISH004', 'CUST002', 'PROD005', DATEADD(DAY, -1, GETDATE()));
GO

-- M. ORDERS & ORDER ITEMS
-- Đơn 1: Đã giao thành công (VNPay)
INSERT INTO dbo.Orders (orderId, customerId, orderStatus, shippingAddress, shippingPhone, placedAt, totalAmount, paymentMethod, paymentStatus, paidAmount, issuedDate)
VALUES ('ORD001', 'CUST001', 'Delivered', N'12 Hai Bà Trưng, Hoàn Kiếm, Hà Nội', '0901112223', DATEADD(DAY, -7, GETDATE()), 740000, 'VNPay', 'Paid', 740000, DATEADD(DAY, -7, GETDATE()));

INSERT INTO dbo.OrderItems (orderItemId, orderId, variantId, quantity, unitPrice, discountAmount)
VALUES
('ITEM001', 'ORD001', 'VAR001', 1, 290000, 0),
('ITEM002', 'ORD001', 'VAR009', 1, 450000, 0);

-- Đơn 2: Đang vận chuyển (COD)
INSERT INTO dbo.Orders (orderId, customerId, orderStatus, shippingAddress, shippingPhone, placedAt, totalAmount, paymentMethod, paymentStatus, paidAmount, issuedDate)
VALUES ('ORD002', 'CUST002', 'Shipping', N'34 Điện Biên Phủ, Quận 3, TP.HCM', '0903334445', DATEADD(DAY, -2, GETDATE()), 320000, 'COD', 'Pending', 0, DATEADD(DAY, -2, GETDATE()));

INSERT INTO dbo.OrderItems (orderItemId, orderId, variantId, quantity, unitPrice, discountAmount)
VALUES
('ITEM003', 'ORD002', 'VAR014', 1, 320000, 0);

-- Đơn 3: Chờ xác nhận (Pending - Thanh toán bằng ví)
INSERT INTO dbo.Orders (orderId, customerId, orderStatus, shippingAddress, shippingPhone, placedAt, totalAmount, paymentMethod, paymentStatus, paidAmount, issuedDate)
VALUES ('ORD003', 'CUST001', 'Pending', N'12 Hai Bà Trưng, Hoàn Kiếm, Hà Nội', '0901112223', GETDATE(), 290000, 'Wallet', 'Paid', 290000, GETDATE());

INSERT INTO dbo.OrderItems (orderItemId, orderId, variantId, quantity, unitPrice, discountAmount)
VALUES
('ITEM004', 'ORD003', 'VAR001', 1, 290000, 0);
GO

-- N. WALLET TRANSACTIONS
INSERT INTO dbo.WalletTransactions (transactionId, walletId, orderId, transactionType, amount, transactionStatus, externalMethod, description, createdAt, completedAt)
VALUES
('WTX001', 'WAL001', NULL, 'Deposit', 2000000, 'Completed', 'VNPay', N'Nạp tiền vào ví qua cổng thanh toán VNPay', DATEADD(DAY, -10, GETDATE()), DATEADD(DAY, -10, GETDATE())),
('WTX002', 'WAL001', 'ORD003', 'Purchase', 290000, 'Completed', NULL, N'Thanh toán cho đơn hàng #ORD003', GETDATE(), GETDATE());
GO

-- O. COMMENTS & REVIEWS
INSERT INTO dbo.Comments (commentId, variantId, customerId, rating, content, createdAt, status)
VALUES
('CMT001', 'VAR001', 'CUST001', 5, N'Áo chất vải rất dày dặn và mát mẻ, form oversize mặc cực kì ưng ý!', DATEADD(DAY, -5, GETDATE()), 'Active'),
('CMT002', 'VAR009', 'CUST001', 5, N'Mũ áo hoodie dày dặn đứng form, lót nỉ mềm mịn giữ ấm siêu tốt.', DATEADD(DAY, -4, GETDATE()), 'Active'),
('CMT003', 'VAR014', 'CUST002', 4, N'Chân váy xinh, form chuẩn, tag sắt sáng bóng xịn xò.', DATEADD(DAY, -1, GETDATE()), 'Active'),
('CMT004', 'VAR005', 'CUST003', 5, N'Áo thun basic giá hợp lý, chất lượng vượt mong đợi.', DATEADD(DAY, -2, GETDATE()), 'Active');
GO

PRINT N'================================================================================';
PRINT N'✅ ĐÃ KHỞI TẠO TOÀN DIỆN CƠ SỞ DỮ LIỆU FASHION SHOP DB VÀ DỮ LIỆU MẪU THÀNH CÔNG!';
PRINT N'================================================================================';
GO
