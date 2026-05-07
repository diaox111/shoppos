// 商品分类层级数据

export interface SubCategory {
  value: string;
  label: string;
}

export interface Category {
  value: string;
  label: string;
  icon: string;
  children: SubCategory[];
}

export const CATEGORIES: Category[] = [
  {
    value: 'beverage', label: '饮料', icon: '🥤',
    children: [
      { value: 'carbonated', label: '碳酸饮料' },
      { value: 'juice', label: '果汁' },
      { value: 'tea', label: '茶饮' },
      { value: 'dairy_drink', label: '乳饮料' },
      { value: 'energy', label: '功能饮料' },
      { value: 'water', label: '饮用水' },
      { value: 'coffee', label: '咖啡' },
      { value: 'other_drink', label: '其他饮品' },
    ],
  },
  {
    value: 'snack', label: '零食', icon: '🍪',
    children: [
      { value: 'puffed', label: '膨化食品' },
      { value: 'biscuit', label: '饼干糕点' },
      { value: 'candy', label: '糖果/巧克力' },
      { value: 'nuts', label: '坚果/果干' },
      { value: 'meat_snack', label: '肉干/卤味' },
      { value: 'jelly', label: '果冻/布丁' },
      { value: 'other_snack', label: '其他零食' },
    ],
  },
  {
    value: 'daily', label: '日用品', icon: '🧴',
    children: [
      { value: 'tooth', label: '口腔护理' },
      { value: 'bath', label: '洗浴用品' },
      { value: 'paper', label: '纸品/湿巾' },
      { value: 'clean', label: '清洁用品' },
      { value: 'kitchen', label: '厨房用品' },
      { value: 'laundry', label: '洗衣用品' },
      { value: 'other_daily', label: '其他日用品' },
    ],
  },
  {
    value: 'condiment', label: '调味品', icon: '🧂',
    children: [
      { value: 'soy', label: '酱油/老抽' },
      { value: 'vinegar', label: '醋/料酒' },
      { value: 'salt_sugar', label: '盐/糖/味精' },
      { value: 'spice', label: '香辛料' },
      { value: 'sauce', label: '酱料/火锅料' },
      { value: 'oil_sauce', label: '蚝油/鱼露' },
      { value: 'other_seasoning', label: '其他调料' },
    ],
  },
  {
    value: 'dairy', label: '乳制品', icon: '🥛',
    children: [
      { value: 'milk', label: '纯牛奶' },
      { value: 'yogurt', label: '酸奶' },
      { value: 'cheese', label: '奶酪/黄油' },
      { value: 'milk_powder', label: '奶粉' },
      { value: 'ice_cream', label: '冰淇淋' },
      { value: 'other_dairy', label: '其他乳品' },
    ],
  },
  {
    value: 'grain', label: '粮油主食', icon: '🍚',
    children: [
      { value: 'rice', label: '大米' },
      { value: 'flour', label: '面粉/面条' },
      { value: 'oil', label: '食用油' },
      { value: 'grain_mix', label: '杂粮/豆类' },
      { value: 'bread', label: '面包/馒头' },
      { value: 'other_grain', label: '其他主食' },
    ],
  },
  {
    value: 'frozen', label: '冷冻食品', icon: '🧊',
    children: [
      { value: 'dumpling', label: '水饺/馄饨' },
      { value: 'meat_frozen', label: '冷冻肉类' },
      { value: 'seafood', label: '冷冻海鲜' },
      { value: 'ice_bar', label: '雪糕/冰棍' },
      { value: 'other_frozen', label: '其他冷冻' },
    ],
  },
  {
    value: 'alcohol', label: '烟酒', icon: '🍺',
    children: [
      { value: 'beer', label: '啤酒' },
      { value: 'liquor', label: '白酒' },
      { value: 'wine', label: '葡萄酒' },
      { value: 'cigarette', label: '香烟' },
      { value: 'other_alcohol', label: '其他烟酒' },
    ],
  },
  {
    value: 'other', label: '其他', icon: '📦',
    children: [
      { value: 'stationery', label: '文具' },
      { value: 'toy', label: '玩具' },
      { value: 'digital', label: '数码配件' },
      { value: 'medicine', label: '常备药品' },
      { value: 'pet', label: '宠物食品' },
      { value: 'other_misc', label: '其他商品' },
    ],
  },
];

export function getCategoryLabel(value: string): string {
  for (const cat of CATEGORIES) {
    if (cat.value === value) return cat.label;
    for (const sub of cat.children) {
      if (sub.value === value) return `${cat.label} - ${sub.label}`;
    }
  }
  return value;
}
