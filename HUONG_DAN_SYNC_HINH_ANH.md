# 📸 HƯỚNG DẪN: SYNC HÌNH ẢNH GIỮA APP QUẢN LÝ & WEBSITE BÁN HÀNG

## 🎯 MỤC TIÊU

Khi bạn **thêm hình ảnh ở app quản lý**, **website bán hàng tự động hiển thị** hình đó.

```
App Quản Lý (Admin)
    ↓
    Thêm sản phẩm + hình ảnh
    ↓
    Lưu vào product_images table
    ↓
    ↓
    ↓
Website Bán Hàng (Customer)
    ↑
    Hiển thị hình ảnh từ product_images
```

---

## 🗄️ CẤU TRÚC DATABASE

### Table: `product_images`

```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Columns:**
- `id` - Mã ảnh
- `product_id` - Mã sản phẩm (link đến products table)
- `image_url` - Link ảnh
- `alt_text` - Mô tả ảnh
- `is_primary` - Ảnh chính không?
- `sort_order` - Thứ tự sắp xếp
- `created_at` - Ngày tạo

---

## 📝 BƯỚC 1: SETUP DATABASE

### Tạo Table (nếu chưa có):

Mở **Supabase Dashboard → SQL Editor**, chạy:

```sql
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT 'Product Image',
  is_primary BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tạo index để tìm kiếm nhanh
CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- Setup RLS Policy
CREATE POLICY "Allow all to read product_images"
ON product_images
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated to insert product_images"
ON product_images
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete product_images"
ON product_images
FOR DELETE
TO authenticated
USING (true);
```

✅ Xong!

---

## 🔄 BƯỚC 2: APP QUẢN LÝ - THÊM HÌNH ẢNH

### Cách dùng:

1. Mở app quản lý: **https://appmanagement-six.vercel.app**
2. Đăng nhập: `admin@example.com / password123`
3. Vào **Sản Phẩm** → Click **+**
4. **Nhập link ảnh:**
   ```
   https://via.placeholder.com/400x300?text=iPhone15
   ```
5. Điền tên, giá, danh mục
6. Click **Lưu sản phẩm**

✅ **Hình ảnh được lưu vào `product_images` table!**

---

## 🌐 BƯỚC 3: WEBSITE BÁN HÀNG - HIỂN THỊ HÌNH ẢNH

### Code: HomeScreen/ProductListScreen

```dart
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/product_service.dart';
import '../models/product.dart';

class ProductListScreen extends StatefulWidget {
  const ProductListScreen({super.key});

  @override
  State<ProductListScreen> createState() => _ProductListScreenState();
}

class _ProductListScreenState extends State<ProductListScreen> {
  final _productService = ProductService();
  List<Product> _products = [];
  List<Map<String, dynamic>> _productImages = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() => _isLoading = true);
    try {
      final products = await _productService.getProducts();
      
      // Lấy ảnh cho mỗi sản phẩm
      final images = <String, List<Map<String, dynamic>>>{};
      for (var product in products) {
        final productImages = await _productService.getProductImages(product.id);
        images[product.id] = productImages;
      }

      setState(() {
        _products = products;
        _productImages = images;
        _isLoading = false;
      });
    } catch (e) {
      print('Lỗi: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sản Phẩm'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.75,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: _products.length,
              itemBuilder: (context, index) {
                final product = _products[index];
                final images = _productImages[product.id] ?? [];
                final firstImage = images.isNotEmpty 
                    ? images[0]['image_url'] 
                    : 'https://via.placeholder.com/300x300?text=No+Image';

                return Card(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Hình ảnh
                      Expanded(
                        child: Container(
                          color: Colors.grey.shade200,
                          width: double.infinity,
                          child: Image.network(
                            firstImage,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Center(
                              child: Icon(
                                Icons.image_not_supported,
                                color: Colors.grey.shade400,
                              ),
                            ),
                          ),
                        ),
                      ),
                      // Thông tin
                      Padding(
                        padding: const EdgeInsets.all(8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              product.name,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              formatter.format(product.price),
                              style: TextStyle(
                                color: Colors.green.shade600,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
```

---

## 🔗 QUAN HỆ DỮ LIỆU

```
products table
├── id
├── name
├── price
└── ...
    ↓
product_images table
├── id
├── product_id ← (link đến products)
├── image_url
└── ...
```

**Khi lấy ảnh:** `SELECT * FROM product_images WHERE product_id = 'xxx'`

---

## 📋 WORKFLOW ĐẦY ĐỦ

### 1. Admin thêm sản phẩm

```
App Quản Lý:
├── Nhập tên sản phẩm: "iPhone 15"
├── Nhập link ảnh: "https://..."
├── Click Lưu
└── Ảnh được lưu vào product_images table
```

### 2. Website hiển thị ảnh

```
Website Bán Hàng:
├── Load danh sách sản phẩm
├── Với mỗi sản phẩm:
│  ├── Lấy ảnh từ product_images
│  ├── Hiển thị ảnh đầu tiên
│  └── Hiển thị tên, giá
└── Khách hàng thấy ảnh sản phẩm
```

---

## ✅ CHECKLIST

- [ ] Tạo table `product_images` trong Supabase
- [ ] Setup RLS Policy cho `product_images`
- [ ] Thêm hàm `getProductImages()` vào ProductService
- [ ] Thêm code hiển thị ảnh vào ProductListScreen
- [ ] Build & deploy
- [ ] Test: Thêm sản phẩm + ảnh ở admin
- [ ] Kiểm tra website hiển thị ảnh

---

## 🚀 DEPLOY

```bash
# Build
flutter build web --release --no-tree-shake-icons

# Copy
xcopy /E /Y "build\web\*" "..\app_management\public\"

# Deploy
cd ..\app_management
vercel deploy --prod --yes
```

---

## 💡 LƯU Ý

1. **Tất cả ảnh đều public** - khách hàng có thể xem
2. **Ảnh lưu vào `product_images`** - không phải `products`
3. **Mỗi sản phẩm có thể có nhiều ảnh** - hỗ trợ ảnh chính + phụ
4. **Có thể thêm, sửa, xóa ảnh riêng** - không cần chỉnh sản phẩm

---

**Làm theo hướng dẫn này để sync hình ảnh! 🎉**
