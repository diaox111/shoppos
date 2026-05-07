export interface Store {
  id: string;
  name: string;
  city: string;
  address: string;           // 详细地址
  phone: string;             // 联系电话
  license_no: string;        // 营业执照号
  license_image?: string;    // 证照图片 base64
  business_scope: string;    // 经营范围
  owner_name: string;        // 店主姓名
  invite_code: string;
  owner_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  store_id: string;
  name: string;
  role: 'owner' | 'staff';
  pin: string;
  phone?: string;
  avatar?: string;
  created_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  barcode: string;
  name: string;
  category: string;
  spec: string;
  cost_price: number;
  sell_price: number;
  stock: number;
  min_stock: number;
  image_url?: string;
  ai_suggested_price?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // 保质期
  production_date?: string;
  shelf_life_value?: number;
  shelf_life_unit?: '年' | '月' | '周' | '日';
  expiry_date?: string;
  // 软删除
  archived?: boolean;
}

export interface Sale {
  id: string;
  store_id: string;
  cashier_id: string;
  cashier_name: string;
  total_amount: number;
  item_count: number;
  profit: number;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  barcode: string;
  price: number;
  cost_price: number;
  quantity: number;
}

export interface CartItem extends Product {
  cartQty: number;
}

export interface SupplierAd {
  id: string;
  product_name: string;
  category: string;
  spec: string;
  supplier: string;
  sell_price: number;
  wholesale_price: number;
  contact: string;
  image_url: string;
  city: string;
}

export interface StockAlert {
  id: string;
  store_id: string;
  product_id: string;
  product_name?: string;
  current_stock: number;
  min_stock: number;
  is_read: boolean;
  created_at: string;
}

// ── 营收统计 ──
export interface RevenueStats {
  today: { count: number; amount: number; profit: number };
  yesterday: { count: number; amount: number; profit: number };
  thisMonth: { count: number; amount: number; profit: number };
  thisWeek: { count: number; amount: number; profit: number };
}
