import { openDB, type IDBPDatabase } from 'idb'
import type { Store, User, Product, Sale, SaleItem, StockAlert, SupplierAd } from '@/types'

const DB_NAME = 'shoppos'
const DB_VERSION = 2 // bump version for new fields

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains('stores')) {
          db.createObjectStore('stores', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' })
          userStore.createIndex('store_id', 'store_id')
        }
        if (!db.objectStoreNames.contains('products')) {
          const prodStore = db.createObjectStore('products', { keyPath: 'id' })
          prodStore.createIndex('store_barcode', ['store_id', 'barcode'])
          prodStore.createIndex('store_id', 'store_id')
        }
        if (!db.objectStoreNames.contains('sales')) {
          const saleStore = db.createObjectStore('sales', { keyPath: 'id' })
          saleStore.createIndex('store_id', 'store_id')
        }
        if (!db.objectStoreNames.contains('sale_items')) {
          const siStore = db.createObjectStore('sale_items', { keyPath: 'id' })
          siStore.createIndex('sale_id', 'sale_id')
        }
        if (!db.objectStoreNames.contains('supplier_ads')) {
          db.createObjectStore('supplier_ads', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('stock_alerts')) {
          const alertStore = db.createObjectStore('stock_alerts', { keyPath: 'id' })
          alertStore.createIndex('store_id', 'store_id')
        }
      },
    })
  }
  return dbPromise
}

// ── Utils ────────────────────────────────────────────
function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function now(): string {
  return new Date().toISOString()
}

// ── Stores ───────────────────────────────────────────
export async function createStore(name: string, city: string): Promise<Store> {
  const db = await getDB()
  const store: Store = {
    id: uid(),
    name,
    city,
    invite_code: Math.random().toString(36).slice(2, 8).toUpperCase(),
    created_at: now(),
  }
  await db.add('stores', store)
  return store
}

// ── Users ────────────────────────────────────────────
export async function createUser(store_id: string, name: string, role: 'owner' | 'staff', pin: string): Promise<User> {
  const db = await getDB()
  const user: User = { id: uid(), store_id, name, role, pin, created_at: now() }
  await db.add('users', user)
  return user
}

export async function loginByPin(pin: string): Promise<User | null> {
  const db = await getDB()
  const users = await db.getAll('users')
  return users.find(u => u.pin === pin) || null
}

export async function getStaffByStore(store_id: string): Promise<User[]> {
  const db = await getDB()
  return db.getAllFromIndex('users', 'store_id', store_id)
}

export async function removeUser(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('users', id)
}

// ── Products ─────────────────────────────────────────
export async function upsertProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>, existingId?: string): Promise<Product> {
  const db = await getDB()
  if (existingId) {
    const old = await db.get('products', existingId)
    const updated: Product = { ...old!, ...product, archived: false, updated_at: now() }
    await db.put('products', updated)
    return updated
  }
  const newProd: Product = {
    id: uid(),
    ...product,
    image_url: product.image_url || '',
    archived: false,
    created_at: now(),
    updated_at: now(),
  }
  await db.add('products', newProd)
  return newProd
}

export async function getProductByBarcode(store_id: string, barcode: string): Promise<Product | null> {
  const db = await getDB()
  const prods = await db.getAllFromIndex('products', 'store_barcode', [store_id, barcode])
  return prods.find(p => !p.archived) || null
}

export async function getProductsByStore(store_id: string): Promise<Product[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('products', 'store_id', store_id)
  return all.filter(p => !p.archived)
}

// 查找已归档商品（扫码重录时自动填充历史信息）
export async function getArchivedByBarcode(store_id: string, barcode: string): Promise<Product | null> {
  const db = await getDB()
  const prods = await db.getAllFromIndex('products', 'store_barcode', [store_id, barcode])
  return prods.find(p => p.archived) || null
}

// 软删除
export async function archiveProduct(id: string): Promise<void> {
  const db = await getDB()
  const p = await db.get('products', id)
  if (p) { p.archived = true; p.updated_at = now(); await db.put('products', p) }
}

// 恢复归档
export async function restoreProduct(product: Product): Promise<Product> {
  const db = await getDB()
  product.archived = false; product.updated_at = now()
  await db.put('products', product)
  return product
}

export async function updateProductStock(id: string, newStock: number): Promise<void> {
  const db = await getDB()
  const p = await db.get('products', id)
  if (p) {
    p.stock = newStock
    p.updated_at = now()
    await db.put('products', p)
  }
}

// ── Sales ────────────────────────────────────────────
export async function createSale(store_id: string, cashier_id: string, total_amount: number, item_count: number, items: { product_id: string; product_name: string; barcode: string; price: number; quantity: number }[]): Promise<Sale> {
  const db = await getDB()
  const sale: Sale = { id: uid(), store_id, cashier_id, total_amount, item_count, created_at: now() }
  await db.add('sales', sale)
  for (const item of items) {
    await db.add('sale_items', { id: uid(), sale_id: sale.id, ...item })
  }
  return sale
}

// ── Stock Alerts ─────────────────────────────────────
export async function createStockAlert(store_id: string, product_id: string, current_stock: number, min_stock: number): Promise<void> {
  const db = await getDB()
  await db.add('stock_alerts', {
    id: uid(),
    store_id,
    product_id,
    current_stock,
    min_stock,
    is_read: false,
    created_at: now(),
  } as StockAlert)
}

export async function getStockAlerts(store_id: string): Promise<StockAlert[]> {
  const db = await getDB()
  return db.getAllFromIndex('stock_alerts', 'store_id', store_id)
}

export async function markAlertsRead(store_id: string): Promise<void> {
  const db = await getDB()
  const all = await db.getAllFromIndex('stock_alerts', 'store_id', store_id)
  for (const a of all) {
    if (!a.is_read) { a.is_read = true; await db.put('stock_alerts', a); }
  }
}

// ── Supplier Ads (pre-populated mock data) ────────────
const MOCK_ADS: SupplierAd[] = [
  { id: 'ad1', product_name: '可口可乐 330ml 罐装', category: '饮料', spec: '330ml×24罐', supplier: '中粮供应链', sell_price: 3.5, wholesale_price: 2.2, contact: '400-810-8888', image_url: '', city: '全国' },
  { id: 'ad2', product_name: '康师傅红烧牛肉面', category: '食品', spec: '110g×24包', supplier: '顶新集团', sell_price: 4.5, wholesale_price: 2.8, contact: '400-618-8080', image_url: '', city: '全国' },
  { id: 'ad3', product_name: '农夫山泉 550ml', category: '饮料', spec: '550ml×24瓶', supplier: '农夫山泉', sell_price: 2.0, wholesale_price: 1.0, contact: '400-809-6666', image_url: '', city: '全国' },
  { id: 'ad4', product_name: '奥利奥饼干 原味', category: '零食', spec: '97g×24盒', supplier: '亿滋中国', sell_price: 8.0, wholesale_price: 5.0, contact: '400-820-8888', image_url: '', city: '全国' },
  { id: 'ad5', product_name: '海飞丝去屑洗发水', category: '日化', spec: '200ml', supplier: '宝洁中国', sell_price: 29.9, wholesale_price: 18.0, contact: '400-830-3333', image_url: '', city: '全国' },
]

export async function initSupplierAds(): Promise<void> {
  const db = await getDB()
  const existing = await db.getAll('supplier_ads')
  if (existing.length === 0) {
    for (const ad of MOCK_ADS) {
      await db.add('supplier_ads', ad)
    }
  }
}

export async function getSupplierAds(category?: string): Promise<SupplierAd[]> {
  const db = await getDB()
  const all = await db.getAll('supplier_ads')
  if (!category) return all
  return all.filter(a => a.category === category)
}

// ── Export / Import (backup) ──────────────────────────
export async function exportAllData(): Promise<Record<string, any[]>> {
  const db = await getDB()
  const result: Record<string, any[]> = {}
  const storeNames = Array.from(db.objectStoreNames)
  for (const storeName of storeNames) {
    result[storeName] = await db.getAll(storeName)
  }
  return result
}
