export interface Store {
  id: string;
  name: string;
  city: string;
  invite_code: string;
  owner_user_id?: string;
  created_at: string;
}

export interface User {
  id: string;
  store_id: string;
  name: string;
  role: 'owner' | 'staff';
  pin: string;
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
  production_date?: string;   // 生产日期 ISO
  shelf_life_value?: number;  // 保质期数值
  shelf_life_unit?: '年' | '月' | '周' | '日';  // 单位
  expiry_date?: string;       // 到期日期 ISO
  // 软删除
  archived?: boolean;
}

export interface Sale {
  id: string;
  store_id: string;
  cashier_id: string;
  total_amount: number;
  item_count: number;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  barcode: string;
  price: number;
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
