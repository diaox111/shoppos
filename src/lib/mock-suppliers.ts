// 虚拟供货商 + 批发商品数据（用于占位测试）
// 后期将替换为真实供应商投放

export interface MockSupplier {
  id: string;
  name: string;
  logo: string;         // emoji
  city: string;
  district: string;
  distance: number;     // km
  supplyCount: number;  // 供货次数
  rating: number;       // 1-5
  categories: string[]; // 经营品类
  contact: string;
  desc: string;
}

export interface MockWholesaleProduct {
  id: string;
  name: string;
  category: string;       // 大类
  subcategory: string;    // 细分类
  spec: string;
  suppliers: { supplierId: string; price: number; minOrder: number }[];
  marketPrice: number;    // 市场零售价参考
}

export const MOCK_SUPPLIERS: MockSupplier[] = [
  { id: 's1', name: '中粮供应链', logo: '🌾', city: '北京', district: '朝阳区', distance: 3.2, supplyCount: 156, rating: 4.8, categories: ['饮料','食品','粮油主食','调味品'], contact: '400-810-8888', desc: '央企供应链，华北区总代理' },
  { id: 's2', name: '京东新通路', logo: '🐶', city: '北京', district: '通州区', distance: 12.5, supplyCount: 89, rating: 4.5, categories: ['零食','饮料','日化','乳制品'], contact: '400-606-5500', desc: '京东旗下B2B供货平台' },
  { id: 's3', name: '阿里零售通', logo: '🐱', city: '杭州', district: '余杭区', distance: 1120, supplyCount: 234, rating: 4.6, categories: ['零食','饮料','日化','调味品','冷冻食品'], contact: '400-800-1688', desc: '阿里巴巴新零售供货平台' },
  { id: 's4', name: '百世店加', logo: '📦', city: '上海', district: '青浦区', distance: 1060, supplyCount: 67, rating: 4.2, categories: ['零食','饮料','日化'], contact: '400-885-6565', desc: '百世集团旗下快消品B2B' },
  { id: 's5', name: '易酒批', logo: '🍺', city: '北京', district: '丰台区', distance: 8.1, supplyCount: 45, rating: 4.3, categories: ['烟酒','饮料'], contact: '400-610-9797', desc: '酒水饮料垂直供应链' },
  { id: 's6', name: '美菜网', logo: '🥬', city: '北京', district: '大兴区', distance: 15.3, supplyCount: 312, rating: 4.4, categories: ['粮油主食','调味品','冷冻食品','乳制品'], contact: '400-060-8585', desc: '生鲜食材供应链平台' },
  { id: 's7', name: '汇通达', logo: '🏘️', city: '南京', district: '建邺区', distance: 890, supplyCount: 178, rating: 4.1, categories: ['零食','饮料','日化','冷冻食品'], contact: '400-828-7000', desc: '农村电商供应链' },
  { id: 's8', name: '大润发e路发', logo: '🛒', city: '上海', district: '静安区', distance: 1055, supplyCount: 92, rating: 4.5, categories: ['零食','饮料','日化','乳制品','粮油主食'], contact: '400-828-8288', desc: '大润发B2B供货' },
  { id: 's9', name: '永辉彩食鲜', logo: '🥦', city: '福州', district: '鼓楼区', distance: 1580, supplyCount: 201, rating: 4.3, categories: ['冷冻食品','乳制品','调味品','粮油主食'], contact: '400-060-9595', desc: '永辉超市供应链' },
  { id: 's10', name: '怡亚通', logo: '🔗', city: '深圳', district: '福田区', distance: 1950, supplyCount: 567, rating: 4.7, categories: ['零食','饮料','日化','调味品','乳制品','冷冻食品','粮油主食','烟酒'], contact: '400-830-2888', desc: '中国最大快消品供应链' },
  { id: 's11', name: '易久批', logo: '📊', city: '天津', district: '西青区', distance: 98, supplyCount: 34, rating: 3.9, categories: ['零食','饮料'], contact: '400-852-7788', desc: '区域快消品批发' },
  { id: 's12', name: '本来鲜', logo: '🍎', city: '北京', district: '海淀区', distance: 5.6, supplyCount: 78, rating: 4.4, categories: ['乳制品','冷冻食品','粮油主食'], contact: '400-898-0666', desc: '社区生鲜供应链' },
  { id: 's13', name: '华润五丰', logo: '🌿', city: '深圳', district: '南山区', distance: 1945, supplyCount: 445, rating: 4.6, categories: ['粮油主食','调味品','冷冻食品','零食'], contact: '400-810-9339', desc: '华润集团食品供应链' },
  { id: 's14', name: '苏宁易购零售云', logo: '🟡', city: '南京', district: '玄武区', distance: 885, supplyCount: 156, rating: 4.2, categories: ['日化','零食','饮料'], contact: '400-836-5365', desc: '苏宁B2B供货' },
  { id: 's15', name: '宝洁分销商（华北）', logo: '🧴', city: '天津', district: '滨海新区', distance: 120, supplyCount: 89, rating: 4.5, categories: ['日化'], contact: '400-830-3333', desc: '宝洁华北授权分销' },
  { id: 's16', name: '亿滋经销商', logo: '🍪', city: '北京', district: '大兴区', distance: 16.8, supplyCount: 56, rating: 4.0, categories: ['零食'], contact: '400-820-8888', desc: '奥利奥/炫迈等品牌代理' },
  { id: 's17', name: '农夫山泉代理商', logo: '💧', city: '杭州', district: '西湖区', distance: 1105, supplyCount: 34, rating: 4.1, categories: ['饮料'], contact: '400-809-6666', desc: '农夫山泉区域代理' },
  { id: 's18', name: '统一企业直供', logo: '🍜', city: '上海', district: '长宁区', distance: 1058, supplyCount: 67, rating: 4.4, categories: ['食品','饮料'], contact: '400-820-3155', desc: '统一方便面/饮料直供' },
  { id: 's19', name: '中烟供应链', logo: '🚬', city: '北京', district: '西城区', distance: 4.2, supplyCount: 890, rating: 4.9, categories: ['烟酒'], contact: '400-810-8889', desc: '烟草专卖供应链' },
  { id: 's20', name: '蒙牛直供', logo: '🐄', city: '呼和浩特', district: '新城区', distance: 480, supplyCount: 123, rating: 4.5, categories: ['乳制品'], contact: '400-660-3333', desc: '蒙牛乳业直供渠道' },
];

export const MOCK_PRODUCTS: MockWholesaleProduct[] = [
  // ── 饮料 ──
  { id: 'wp1', name: '可口可乐 330ml', category: '饮料', subcategory: '碳酸饮料', spec: '330ml×24罐', suppliers: [{ supplierId: 's1', price: 52, minOrder: 5 }, { supplierId: 's3', price: 50, minOrder: 10 }, { supplierId: 's10', price: 48, minOrder: 20 }], marketPrice: 3.5 },
  { id: 'wp2', name: '百事可乐 330ml', category: '饮料', subcategory: '碳酸饮料', spec: '330ml×24罐', suppliers: [{ supplierId: 's2', price: 51, minOrder: 5 }, { supplierId: 's10', price: 47, minOrder: 20 }], marketPrice: 3.5 },
  { id: 'wp3', name: '农夫山泉 550ml', category: '饮料', subcategory: '饮用水', spec: '550ml×24瓶', suppliers: [{ supplierId: 's17', price: 24, minOrder: 10 }, { supplierId: 's3', price: 26, minOrder: 5 }, { supplierId: 's1', price: 25, minOrder: 15 }], marketPrice: 2.0 },
  { id: 'wp4', name: '康师傅冰红茶 500ml', category: '饮料', subcategory: '茶饮料', spec: '500ml×15瓶', suppliers: [{ supplierId: 's18', price: 38, minOrder: 5 }, { supplierId: 's10', price: 36, minOrder: 15 }], marketPrice: 4.0 },
  { id: 'wp5', name: '蒙牛纯牛奶 250ml', category: '饮料', subcategory: '乳饮料', spec: '250ml×16盒', suppliers: [{ supplierId: 's20', price: 48, minOrder: 3 }, { supplierId: 's6', price: 52, minOrder: 5 }], marketPrice: 4.5 },
  { id: 'wp6', name: '红牛 250ml', category: '饮料', subcategory: '功能饮料', spec: '250ml×24罐', suppliers: [{ supplierId: 's10', price: 108, minOrder: 5 }, { supplierId: 's3', price: 112, minOrder: 3 }], marketPrice: 6.5 },
  { id: 'wp7', name: '元气森林 480ml', category: '饮料', subcategory: '气泡水', spec: '480ml×15瓶', suppliers: [{ supplierId: 's2', price: 56, minOrder: 5 }, { supplierId: 's10', price: 54, minOrder: 10 }], marketPrice: 5.5 },
  // ── 零食 ──
  { id: 'wp8', name: '奥利奥 原味 97g', category: '零食', subcategory: '饼干', spec: '97g×24盒', suppliers: [{ supplierId: 's16', price: 96, minOrder: 3 }, { supplierId: 's10', price: 90, minOrder: 10 }], marketPrice: 8.0 },
  { id: 'wp9', name: '乐事薯片 75g', category: '零食', subcategory: '膨化食品', spec: '75g×12包', suppliers: [{ supplierId: 's3', price: 65, minOrder: 3 }, { supplierId: 's10', price: 62, minOrder: 8 }], marketPrice: 8.5 },
  { id: 'wp10', name: '德芙巧克力 80g', category: '零食', subcategory: '糖果巧克力', spec: '80g×12条', suppliers: [{ supplierId: 's10', price: 144, minOrder: 3 }, { supplierId: 's2', price: 150, minOrder: 2 }], marketPrice: 16.0 },
  // ── 日化 ──
  { id: 'wp11', name: '海飞丝洗发水 200ml', category: '日化', subcategory: '洗发护发', spec: '200ml×12瓶', suppliers: [{ supplierId: 's15', price: 180, minOrder: 2 }, { supplierId: 's10', price: 175, minOrder: 5 }], marketPrice: 29.9 },
  { id: 'wp12', name: '蓝月亮洗衣液 1kg', category: '日化', subcategory: '清洁用品', spec: '1kg×6瓶', suppliers: [{ supplierId: 's15', price: 72, minOrder: 2 }, { supplierId: 's3', price: 75, minOrder: 3 }], marketPrice: 19.9 },
  // ── 调味品 ──
  { id: 'wp13', name: '海天酱油 500ml', category: '调味品', subcategory: '酱油', spec: '500ml×12瓶', suppliers: [{ supplierId: 's6', price: 72, minOrder: 3 }, { supplierId: 's13', price: 70, minOrder: 5 }], marketPrice: 8.9 },
  { id: 'wp14', name: '老干妈 280g', category: '调味品', subcategory: '辣酱', spec: '280g×24瓶', suppliers: [{ supplierId: 's3', price: 168, minOrder: 2 }, { supplierId: 's13', price: 162, minOrder: 5 }], marketPrice: 10.0 },
  // ── 乳制品 ──
  { id: 'wp15', name: '伊利纯牛奶 250ml', category: '乳制品', subcategory: '纯牛奶', spec: '250ml×16盒', suppliers: [{ supplierId: 's6', price: 46, minOrder: 3 }, { supplierId: 's12', price: 48, minOrder: 5 }], marketPrice: 4.0 },
  { id: 'wp16', name: '安慕希酸奶 205g', category: '乳制品', subcategory: '酸奶', spec: '205g×12瓶', suppliers: [{ supplierId: 's8', price: 54, minOrder: 3 }, { supplierId: 's3', price: 56, minOrder: 5 }], marketPrice: 6.5 },
  // ── 粮油主食 ──
  { id: 'wp17', name: '金龙鱼调和油 5L', category: '粮油主食', subcategory: '食用油', spec: '5L×4桶', suppliers: [{ supplierId: 's13', price: 220, minOrder: 2 }, { supplierId: 's6', price: 228, minOrder: 3 }], marketPrice: 75.0 },
  { id: 'wp18', name: '五常大米 5kg', category: '粮油主食', subcategory: '大米', spec: '5kg×4袋', suppliers: [{ supplierId: 's13', price: 120, minOrder: 2 }, { supplierId: 's10', price: 116, minOrder: 5 }], marketPrice: 39.9 },
  // ── 冷冻食品 ──
  { id: 'wp19', name: '湾仔码头水饺 720g', category: '冷冻食品', subcategory: '速冻水饺', spec: '720g×6袋', suppliers: [{ supplierId: 's9', price: 108, minOrder: 2 }, { supplierId: 's6', price: 115, minOrder: 3 }], marketPrice: 25.0 },
  { id: 'wp20', name: '思念汤圆 400g', category: '冷冻食品', subcategory: '速冻汤圆', spec: '400g×12袋', suppliers: [{ supplierId: 's9', price: 96, minOrder: 2 }, { supplierId: 's7', price: 100, minOrder: 3 }], marketPrice: 12.0 },
  // ── 烟酒 ──
  { id: 'wp21', name: '中华（软）', category: '烟酒', subcategory: '香烟', spec: '1条(10盒)', suppliers: [{ supplierId: 's19', price: 580, minOrder: 1 }], marketPrice: 70.0 },
  { id: 'wp22', name: '青岛啤酒 500ml', category: '烟酒', subcategory: '啤酒', spec: '500ml×12罐', suppliers: [{ supplierId: 's5', price: 48, minOrder: 3 }, { supplierId: 's10', price: 45, minOrder: 10 }], marketPrice: 6.0 },
];
