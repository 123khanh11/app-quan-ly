# 🛍️ Hướng Dẫn Tích Hợp Khuyến Mại - App Bán Hàng

## 📌 Giới Thiệu

App bán hàng sẽ **hiển thị khuyến mại từ app quản lý** một cách tự động, giúp khách hàng thấy được ưu đãi khi mua hàng.

---

## 🏗️ Kiến Trúc

```
App Quản Lý (Admin)
    ↓ Tạo khuyến mại
Supabase Database (product_promotions)
    ↓ Dữ liệu
App Bán Hàng (Customer)
    ↓ Hiển thị & Tính toán
Khách hàng thấy khuyến mại
```

---

## 🔧 Bước 1: Setup Service

### Tạo file `src/lib/promotionService.js`:

```javascript
import { supabase } from './supabaseClient';

export const promotionService = {
  // Lấy khuyến mại của sản phẩm
  async getProductPromotions(productId) {
    try {
      const { data, error } = await supabase
        .from('product_promotions')
        .select('*')
        .eq('product_id', productId)
        .order('min_quantity', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }
  },

  // Lấy khuyến mại của variant
  async getVariantPromotions(variant) {
    if (variant?.product_id) {
      return await this.getProductPromotions(variant.product_id);
    }
    return [];
  },

  // Tính khuyến mại dựa trên số lượng
  calculatePromotion(promotions, quantity) {
    if (!promotions || promotions.length === 0) return null;

    // Tìm khuyến mại phù hợp (cao nhất)
    for (let i = promotions.length - 1; i >= 0; i--) {
      if (quantity >= promotions[i].min_quantity) {
        return promotions[i];
      }
    }
    return null;
  },

  // Tính giá sau khuyến mại
  calculateDiscountedPrice(originalPrice, promotion) {
    if (!promotion) return originalPrice;

    switch (promotion.promotion_type) {
      case 'percentage_discount':
        return originalPrice * (1 - promotion.promotion_value / 100);
      
      case 'fixed_discount':
        return Math.max(0, originalPrice - promotion.promotion_value);
      
      case 'free_shipping':
        return originalPrice;
      
      default:
        return originalPrice;
    }
  },

  // Tính phí ship sau khuyến mại
  calculateShippingFee(originalFee, promotion) {
    if (!promotion || promotion.promotion_type !== 'free_shipping') {
      return originalFee;
    }
    return 0;
  },

  // Lấy nhãn khuyến mại
  getPromoLabel(promotion) {
    if (!promotion) return '';

    switch (promotion.promotion_type) {
      case 'free_shipping':
        return '📦 Miễn phí ship';
      case 'percentage_discount':
        return `💰 Giảm ${promotion.promotion_value}%`;
      case 'fixed_discount':
        return `💵 Giảm ${promotion.promotion_value?.toLocaleString('vi-VN')}₫`;
      default:
        return 'Khuyến mại';
    }
  },

  // Tính giá trị chiết khấu
  getDiscountValue(originalPrice, promotion, quantity = 1) {
    if (!promotion) return 0;

    switch (promotion.promotion_type) {
      case 'percentage_discount':
        return (originalPrice * promotion.promotion_value / 100) * quantity;
      
      case 'fixed_discount':
        return promotion.promotion_value * quantity;
      
      case 'free_shipping':
        return 0;
      
      default:
        return 0;
    }
  }
};
```

---

## 🎨 Bước 2: Hiển Thị Khuyến Mại Trên Chi Tiết Sản Phẩm

Tích hợp vào component đã có (ProductDetailPage.tsx) bằng cách import promotionService và sử dụng.

---

## 🛒 Bước 3: Tích Hợp Giỏ Hàng

Cập nhật logic tính toán giỏ hàng để áp dụng khuyến mại.

---

## 🎨 Bước 4: CSS Styling

Thêm CSS cho các phần tử khuyến mại.

---

## 📋 Checklist Triển Khai

- [ ] Copy file `promotionService.js` vào `src/lib/`
- [ ] Tích hợp vào ProductDetailPage
- [ ] Tích hợp vào CartPage
- [ ] Thêm CSS
- [ ] Kiểm tra Supabase connection
- [ ] Test: Hiển thị khuyến mại trên chi tiết sản phẩm
- [ ] Test: Hiển thị khuyến mại trên giỏ hàng
- [ ] Deploy

---

**Chúc bạn thành công! 🎉**
