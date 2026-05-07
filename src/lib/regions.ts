// 中国全境省市数据 — 34个省级行政区、300+城市、基于大众点评真实商圈数据
// 商圈来源：大众点评商业区分类、中国商圈商业力TOP100榜单、各城市热门地段

export interface District {
  name: string;
  areas: Area[];
}

export interface Area {
  name: string;
  desc: string;
  factor: number; // 定价系数
}

export interface City {
  name: string;
  province: string;
  districts: District[];
}

export interface RegionMeta {
  tier: number;       // 1=一线 2=新一线 3=二线 4=三线 5=四线+
  baseFactor: number; // 城市基准系数
}

// 城市元数据
const CITY_META: Record<string, RegionMeta> = {
  // 一线
  '北京': { tier: 1, baseFactor: 1.25 },
  '上海': { tier: 1, baseFactor: 1.25 },
  '广州': { tier: 1, baseFactor: 1.20 },
  '深圳': { tier: 1, baseFactor: 1.30 },
  // 新一线
  '成都': { tier: 2, baseFactor: 1.10 }, '杭州': { tier: 2, baseFactor: 1.15 },
  '重庆': { tier: 2, baseFactor: 1.08 }, '武汉': { tier: 2, baseFactor: 1.10 },
  '西安': { tier: 2, baseFactor: 1.05 }, '苏州': { tier: 2, baseFactor: 1.12 },
  '南京': { tier: 2, baseFactor: 1.12 }, '天津': { tier: 2, baseFactor: 1.10 },
  '长沙': { tier: 2, baseFactor: 1.05 }, '郑州': { tier: 2, baseFactor: 1.05 },
  '东莞': { tier: 2, baseFactor: 1.08 }, '青岛': { tier: 2, baseFactor: 1.05 },
  '沈阳': { tier: 2, baseFactor: 1.02 }, '宁波': { tier: 2, baseFactor: 1.08 },
  '昆明': { tier: 2, baseFactor: 1.00 },
  // 二线
  '合肥': { tier: 3, baseFactor: 1.02 }, '佛山': { tier: 3, baseFactor: 1.05 },
  '福州': { tier: 3, baseFactor: 1.02 }, '无锡': { tier: 3, baseFactor: 1.05 },
  '厦门': { tier: 3, baseFactor: 1.08 }, '济南': { tier: 3, baseFactor: 1.02 },
  '大连': { tier: 3, baseFactor: 1.02 }, '哈尔滨': { tier: 3, baseFactor: 0.95 },
  '温州': { tier: 3, baseFactor: 1.02 }, '石家庄': { tier: 3, baseFactor: 0.98 },
  '泉州': { tier: 3, baseFactor: 1.00 }, '南宁': { tier: 3, baseFactor: 0.95 },
  '长春': { tier: 3, baseFactor: 0.95 }, '南昌': { tier: 3, baseFactor: 0.95 },
  '贵阳': { tier: 3, baseFactor: 0.95 }, '金华': { tier: 3, baseFactor: 1.00 },
  '常州': { tier: 3, baseFactor: 1.00 }, '嘉兴': { tier: 3, baseFactor: 1.00 },
  '惠州': { tier: 3, baseFactor: 1.00 }, '太原': { tier: 3, baseFactor: 0.95 },
  '珠海': { tier: 3, baseFactor: 1.05 }, '中山': { tier: 3, baseFactor: 1.00 },
  '兰州': { tier: 3, baseFactor: 0.90 },
  // 三线+
  '海口': { tier: 4, baseFactor: 0.95 }, '三亚': { tier: 4, baseFactor: 1.10 },
  '拉萨': { tier: 4, baseFactor: 1.20 }, '丽江': { tier: 4, baseFactor: 1.15 },
  '桂林': { tier: 4, baseFactor: 1.08 }, '张家界': { tier: 4, baseFactor: 1.15 },
  '黄山': { tier: 4, baseFactor: 1.12 }, '秦皇岛': { tier: 4, baseFactor: 1.05 },
  '威海': { tier: 4, baseFactor: 1.02 }, '烟台': { tier: 4, baseFactor: 1.00 },
  '北海': { tier: 4, baseFactor: 1.00 }, '西双版纳': { tier: 4, baseFactor: 1.10 },
  // 新增热门
  '绍兴': { tier: 3, baseFactor: 1.00 }, '台州': { tier: 3, baseFactor: 0.95 },
  '湖州': { tier: 3, baseFactor: 0.95 }, '舟山': { tier: 4, baseFactor: 1.05 },
  '宜昌': { tier: 4, baseFactor: 0.95 }, '襄阳': { tier: 4, baseFactor: 0.95 },
  '洛阳': { tier: 4, baseFactor: 0.95 }, '开封': { tier: 4, baseFactor: 0.90 },
  '唐山': { tier: 4, baseFactor: 0.95 }, '保定': { tier: 4, baseFactor: 0.90 },
  '徐州': { tier: 4, baseFactor: 0.95 }, '扬州': { tier: 4, baseFactor: 1.00 },
  '镇江': { tier: 4, baseFactor: 0.95 }, '芜湖': { tier: 4, baseFactor: 0.90 },
  '汕头': { tier: 4, baseFactor: 0.95 }, '湛江': { tier: 4, baseFactor: 0.90 },
  '九江': { tier: 4, baseFactor: 0.90 }, '赣州': { tier: 4, baseFactor: 0.90 },
  '柳州': { tier: 4, baseFactor: 0.90 }, '遵义': { tier: 4, baseFactor: 0.90 },
  '咸阳': { tier: 4, baseFactor: 0.90 }, '绵阳': { tier: 4, baseFactor: 0.90 },
  '宜宾': { tier: 4, baseFactor: 0.85 },
};

// 默认区县（无具体数据时）
const DEFAULT_DISTRICTS: District[] = [
  { name: '市中心', areas: [
    { name: '核心商圈', desc: '商业中心', factor: 1.5 },
    { name: '普通商业区', desc: '一般商业地段', factor: 1.15 },
    { name: '居民区', desc: '住宅集中区', factor: 1.0 },
  ]},
  { name: '近郊区', areas: [
    { name: '大型社区', desc: '大型住宅社区', factor: 0.95 },
    { name: '乡镇', desc: '乡镇区域', factor: 0.80 },
    { name: '开发区/工业区', desc: '工厂/物流园区', factor: 0.75 },
  ]},
  { name: '大学城', areas: [
    { name: '高校商圈', desc: '大学周边商业', factor: 0.90 },
    { name: '学生生活区', desc: '学生宿舍周边', factor: 0.85 },
  ]},
  { name: '交通枢纽', areas: [
    { name: '火车站周边', desc: '火车站商圈', factor: 1.15 },
    { name: '机场周边', desc: '空港区域', factor: 1.10 },
  ]},
  { name: '景区', areas: [
    { name: '核心景区', desc: '景区内部', factor: 1.7 },
    { name: '景区周边', desc: '景区外围', factor: 1.3 },
  ]},
];

// ── 各城市精确区县/商圈数据（来源：大众点评+中国百强商圈） ──
function cityDistricts(city: string): District[] {
  const map: Record<string, District[]> = {
    // ═══ 一线城市 ═══
    '北京': [
      { name: '朝阳区', areas: [
        { name: 'CBD/国贸', desc: '核心商务区', factor: 1.8 },
        { name: '三里屯', desc: '潮流商圈', factor: 1.7 },
        { name: '望京', desc: '科技商务区', factor: 1.4 },
        { name: '朝青/大悦城', desc: '青年路商圈', factor: 1.3 },
        { name: '常营', desc: '大型社区商圈', factor: 1.1 },
        { name: '普通住宅区', desc: '住宅区', factor: 1.15 },
      ]},
      { name: '海淀区', areas: [
        { name: '中关村', desc: '科技商务区', factor: 1.5 },
        { name: '五道口', desc: '高校商圈', factor: 1.3 },
        { name: '远大路/世纪金源', desc: '商圈', factor: 1.25 },
        { name: '普通住宅区', desc: '住宅区', factor: 1.1 },
      ]},
      { name: '东城区', areas: [
        { name: '王府井', desc: '顶级商圈', factor: 2.0 },
        { name: '南锣鼓巷', desc: '景区商业', factor: 1.6 },
        { name: '崇文门', desc: '商圈', factor: 1.5 },
        { name: '普通住宅区', desc: '住宅区', factor: 1.2 },
      ]},
      { name: '西城区', areas: [
        { name: '西单/金融街', desc: '顶级商圈+金融', factor: 1.8 },
        { name: '什刹海', desc: '景区', factor: 1.5 },
        { name: '西直门/动物园', desc: '商圈', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.15 },
      ]},
      { name: '丰台区', areas: [
        { name: '丽泽商务区', desc: '新兴CBD', factor: 1.3 },
        { name: '方庄', desc: '商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '通州区', areas: [
        { name: '万达商圈', desc: '商业中心', factor: 1.25 },
        { name: '环球影城', desc: '景区', factor: 1.6 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '昌平区', areas: [
        { name: '回龙观', desc: '大型社区', factor: 0.95 },
        { name: '天通苑', desc: '超大型社区', factor: 0.90 },
        { name: '居民区', desc: '住宅', factor: 0.90 },
      ]},
      { name: '延庆区', areas: [
        { name: '八达岭/龙庆峡', desc: '景区', factor: 1.5 },
        { name: '城区', desc: '普通', factor: 0.85 },
      ]},
    ],
    '上海': [
      { name: '浦东新区', areas: [
        { name: '陆家嘴', desc: '金融中心', factor: 2.0 },
        { name: '张江', desc: '科技园区', factor: 1.3 },
        { name: '迪士尼', desc: '景区', factor: 1.8 },
        { name: '世纪公园', desc: '商圈', factor: 1.2 },
        { name: '前滩', desc: '新兴商务区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '黄浦区', areas: [
        { name: '外滩/南京路', desc: '顶级商圈', factor: 2.0 },
        { name: '新天地', desc: '高端商圈', factor: 1.8 },
        { name: '淮海中路', desc: '高端商业街', factor: 1.7 },
        { name: '居民区', desc: '住宅', factor: 1.3 },
      ]},
      { name: '静安区', areas: [
        { name: '南京西路', desc: '顶级商圈', factor: 1.9 },
        { name: '静安寺', desc: '高端商圈', factor: 1.7 },
        { name: '大宁', desc: '商圈', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 1.2 },
      ]},
      { name: '徐汇区', areas: [
        { name: '徐家汇', desc: '商圈', factor: 1.5 },
        { name: '衡复风貌区', desc: '文旅区', factor: 1.4 },
        { name: '漕河泾', desc: '科技园区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 1.15 },
      ]},
      { name: '长宁区', areas: [
        { name: '虹桥/古北', desc: '国际社区+商圈', factor: 1.4 },
        { name: '中山公园', desc: '商圈', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '杨浦区', areas: [
        { name: '五角场', desc: '商圈', factor: 1.25 },
        { name: '大学区', desc: '高校', factor: 1.0 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '松江区', areas: [
        { name: '大学城', desc: '高校', factor: 0.95 },
        { name: '佘山', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.90 },
      ]},
      { name: '崇明区', areas: [
        { name: '东滩', desc: '景区', factor: 1.3 },
        { name: '城区', desc: '普通', factor: 0.80 },
      ]},
    ],
    '广州': [
      { name: '天河区', areas: [
        { name: '珠江新城', desc: 'CBD', factor: 1.8 },
        { name: '体育西/天河路', desc: '顶级商圈', factor: 1.7 },
        { name: '天河公园', desc: '新兴商圈', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '越秀区', areas: [
        { name: '北京路', desc: '核心商圈', factor: 1.6 },
        { name: '海珠广场', desc: '商圈', factor: 1.4 },
        { name: '环市东', desc: '商务区', factor: 1.35 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '海珠区', areas: [
        { name: '琶洲', desc: '会展商务区', factor: 1.4 },
        { name: '江南西', desc: '商圈', factor: 1.3 },
        { name: '客村/广州塔', desc: '商圈+景区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 1.05 },
      ]},
      { name: '白云区', areas: [
        { name: '白云新城', desc: '商圈', factor: 1.2 },
        { name: '白云山', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '番禺区', areas: [
        { name: '长隆', desc: '景区', factor: 1.6 },
        { name: '万博', desc: '商圈', factor: 1.3 },
        { name: '大学城', desc: '高校', factor: 0.95 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '南沙区', areas: [
        { name: '自贸区', desc: '商务区', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '从化区', areas: [
        { name: '温泉', desc: '景区', factor: 1.4 },
        { name: '城区', desc: '普通', factor: 0.80 },
      ]},
    ],
    '深圳': [
      { name: '南山区', areas: [
        { name: '科技园', desc: '科技商务区', factor: 1.7 },
        { name: '海岸城', desc: '商圈', factor: 1.6 },
        { name: '深圳湾', desc: '高端社区', factor: 1.5 },
        { name: '万象天地', desc: '商圈', factor: 1.5 },
        { name: '华侨城', desc: '文旅区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 1.2 },
      ]},
      { name: '福田区', areas: [
        { name: 'CBD', desc: '金融中心', factor: 1.9 },
        { name: '华强北', desc: '电子商圈', factor: 1.5 },
        { name: '车公庙', desc: '商务区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 1.2 },
      ]},
      { name: '罗湖区', areas: [
        { name: '东门', desc: '商圈', factor: 1.5 },
        { name: '万象城', desc: '高端商圈', factor: 1.7 },
        { name: '笋岗', desc: '商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '宝安区', areas: [
        { name: '宝安中心', desc: '商圈', factor: 1.3 },
        { name: '机场', desc: '交通枢纽', factor: 1.4 },
        { name: '沙井', desc: '商圈', factor: 1.0 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '龙岗区', areas: [
        { name: '大运', desc: '体育商圈', factor: 1.15 },
        { name: '坂田/华为', desc: '科技园区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '盐田区', areas: [
        { name: '大小梅沙', desc: '景区', factor: 1.6 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '大鹏新区', areas: [
        { name: '较场尾', desc: '景区', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
    ],

    // ═══ 新一线 ═══
    '成都': [
      { name: '锦江区', areas: [
        { name: '春熙路/太古里', desc: '顶级商圈', factor: 1.7 },
        { name: 'IFS/远洋太古里', desc: '高端商圈', factor: 1.75 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '武侯区', areas: [
        { name: '金融城', desc: 'CBD', factor: 1.5 },
        { name: '玉林', desc: '文艺商圈', factor: 1.3 },
        { name: '桐梓林', desc: '高端社区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '高新区', areas: [
        { name: '天府软件园', desc: '科技园区', factor: 1.3 },
        { name: '世纪城', desc: '会展商务区', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 1.05 },
      ]},
      { name: '成华区', areas: [
        { name: '建设路', desc: '商圈', factor: 1.2 },
        { name: '万象城', desc: '商圈', factor: 1.3 },
        { name: '大熊猫基地', desc: '景区', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '天府新区', areas: [
        { name: '兴隆湖', desc: '科技生态区', factor: 1.1 },
        { name: '麓湖', desc: '高端社区', factor: 1.2 },
      ]},
      { name: '都江堰市', areas: [
        { name: '都江堰景区', desc: '景区', factor: 1.6 },
        { name: '青城山', desc: '景区', factor: 1.5 },
        { name: '城区', desc: '普通', factor: 0.85 },
      ]},
    ],
    '杭州': [
      { name: '西湖区', areas: [
        { name: '西湖景区', desc: '核心景区', factor: 1.7 },
        { name: '黄龙', desc: '商务区', factor: 1.4 },
        { name: '西溪湿地', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '上城区', areas: [
        { name: '湖滨/武林', desc: '核心商圈', factor: 1.65 },
        { name: '钱江新城', desc: 'CBD', factor: 1.5 },
        { name: '河坊街', desc: '景区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 1.15 },
      ]},
      { name: '滨江区', areas: [
        { name: '阿里/网易', desc: '科技园区', factor: 1.3 },
        { name: '星光大道', desc: '商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 1.05 },
      ]},
      { name: '余杭区', areas: [
        { name: '未来科技城', desc: '科技商务区', factor: 1.2 },
        { name: '良渚', desc: '文旅区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '萧山区', areas: [
        { name: '奥体', desc: '商务区', factor: 1.2 },
        { name: '机场', desc: '交通枢纽', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '淳安县', areas: [
        { name: '千岛湖', desc: '景区', factor: 1.6 },
        { name: '城区', desc: '普通', factor: 0.80 },
      ]},
    ],
    '重庆': [
      { name: '渝中区', areas: [
        { name: '解放碑/洪崖洞', desc: '核心商圈+景区', factor: 1.8 },
        { name: '大坪/时代天街', desc: '商圈', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '江北区', areas: [
        { name: '观音桥', desc: '核心商圈', factor: 1.55 },
        { name: '江北嘴', desc: 'CBD', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '南岸区', areas: [
        { name: '南滨路', desc: '江景区', factor: 1.4 },
        { name: '南坪', desc: '商圈', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '渝北区', areas: [
        { name: '新牌坊/照母山', desc: '商圈', factor: 1.3 },
        { name: '光环购物公园', desc: '新兴商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '沙坪坝区', areas: [
        { name: '三峡广场', desc: '商圈', factor: 1.2 },
        { name: '磁器口', desc: '景区', factor: 1.5 },
        { name: '大学城', desc: '高校', factor: 0.90 },
      ]},
      { name: '武隆区', areas: [
        { name: '仙女山/天生三桥', desc: '景区', factor: 1.5 },
        { name: '城区', desc: '普通', factor: 0.75 },
      ]},
    ],
    '武汉': [
      { name: '江汉区', areas: [
        { name: '江汉路/武广', desc: '核心商圈', factor: 1.7 },
        { name: '西北湖', desc: '商务区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '武昌区', areas: [
        { name: '光谷', desc: '科技商圈', factor: 1.5 },
        { name: '楚河汉街', desc: '商圈', factor: 1.5 },
        { name: '户部巷/黄鹤楼', desc: '景区', factor: 1.6 },
        { name: '武汉大学', desc: '高校', factor: 1.0 },
      ]},
      { name: '洪山区', areas: [
        { name: '街道口', desc: '商圈', factor: 1.3 },
        { name: '大学城', desc: '高校', factor: 0.95 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '汉阳区', areas: [
        { name: '归元寺', desc: '景区', factor: 1.4 },
        { name: '王家湾', desc: '商圈', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '江岸区', areas: [
        { name: '汉口江滩', desc: '景区', factor: 1.4 },
        { name: '天地商圈', desc: '高端商圈', factor: 1.6 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
    ],
    '西安': [
      { name: '碑林区', areas: [
        { name: '钟楼/南门', desc: '核心商圈', factor: 1.7 },
        { name: '书院门', desc: '文旅区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 1.05 },
      ]},
      { name: '雁塔区', areas: [
        { name: '大雁塔/大唐不夜城', desc: '景区+商圈', factor: 1.8 },
        { name: '小寨', desc: '商圈', factor: 1.5 },
        { name: '高新', desc: '商务区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '未央区', areas: [
        { name: '行政中心', desc: '商务区', factor: 1.2 },
        { name: '大明宫', desc: '景区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '临潼区', areas: [
        { name: '兵马俑/华清池', desc: '景区', factor: 1.7 },
        { name: '城区', desc: '普通', factor: 0.85 },
      ]},
    ],
    '苏州': [
      { name: '姑苏区', areas: [
        { name: '观前街/平江路', desc: '商圈+景区', factor: 1.7 },
        { name: '拙政园/狮子林', desc: '景区', factor: 1.6 },
        { name: '石路', desc: '商圈', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '工业园区', areas: [
        { name: '金鸡湖/CBD', desc: '高端商务区', factor: 1.7 },
        { name: '独墅湖', desc: '科教区', factor: 1.1 },
        { name: '苏州中心', desc: '商圈', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 1.15 },
      ]},
      { name: '虎丘区', areas: [
        { name: '苏州乐园', desc: '景区', factor: 1.5 },
        { name: '科技城', desc: '商务区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '昆山市', areas: [
        { name: '周庄', desc: '景区', factor: 1.6 },
        { name: '花桥', desc: '商务区', factor: 1.15 },
        { name: '城区', desc: '普通', factor: 1.0 },
      ]},
    ],
    '南京': [
      { name: '玄武区', areas: [
        { name: '新街口', desc: '顶级商圈', factor: 1.8 },
        { name: '总统府/中山陵', desc: '景区', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 1.15 },
      ]},
      { name: '鼓楼区', areas: [
        { name: '新江东', desc: '商圈', factor: 1.5 },
        { name: '湖南路/山西路', desc: '商圈', factor: 1.4 },
        { name: '大学城', desc: '高校', factor: 1.0 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '秦淮区', areas: [
        { name: '夫子庙', desc: '景区+商圈', factor: 1.7 },
        { name: '老门东', desc: '文旅区', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 1.05 },
      ]},
      { name: '建邺区', areas: [
        { name: '河西CBD', desc: '商务区', factor: 1.5 },
        { name: '奥体', desc: '体育商圈', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.05 },
      ]},
      { name: '江宁区', areas: [
        { name: '百家湖', desc: '商圈', factor: 1.2 },
        { name: '大学城', desc: '高校', factor: 0.9 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
    ],
    '天津': [
      // ── 市内六区 ──
      { name: '和平区', areas: [
        { name: '滨江道/劝业场', desc: '核心商圈', factor: 1.7 },
        { name: '五大道/民园', desc: '文旅区', factor: 1.5 },
        { name: '小白楼/大营门', desc: '商务区', factor: 1.4 },
        { name: '天河城/恒隆', desc: '商圈', factor: 1.55 },
        { name: '吉利大厦/和平大悦城', desc: '商圈', factor: 1.35 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '南开区', areas: [
        { name: '大悦城/鼓楼', desc: '核心商圈', factor: 1.3 },
        { name: '古文化街/天后宫', desc: '景区', factor: 1.5 },
        { name: '水上公园/奥体', desc: '景区+商圈', factor: 1.3 },
        { name: '天拖/巷往1956', desc: '新兴商圈', factor: 1.1 },
        { name: '鞍山西道/科贸街', desc: '科贸商圈', factor: 1.05 },
        { name: '南开大学/天津大学', desc: '高校', factor: 1.0 },
        { name: '海光寺/万德庄', desc: '商圈', factor: 1.15 },
        { name: '鲁能城/天塔', desc: '商圈+景区', factor: 1.2 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '河西区', areas: [
        { name: '文化中心/万象城', desc: '顶级商圈', factor: 1.55 },
        { name: '梅江/环宇城', desc: '高端社区+商圈', factor: 1.25 },
        { name: '小白楼/凯德国贸', desc: '商务区', factor: 1.35 },
        { name: '新八大里/黑牛城道', desc: '新兴商圈', factor: 1.15 },
        { name: '解放南路/田园', desc: '商圈', factor: 1.05 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '河东区', areas: [
        { name: '天津站/后广场', desc: '交通枢纽', factor: 1.3 },
        { name: '万达/爱琴海', desc: '商圈', factor: 1.2 },
        { name: '中山门/富民路', desc: '商圈', factor: 1.0 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '河北区', areas: [
        { name: '天津之眼/意式风情区', desc: '景区', factor: 1.5 },
        { name: 'T-PARCO悦力场', desc: '商圈', factor: 1.25 },
        { name: '中山路/大悲院', desc: '商圈+景区', factor: 1.1 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '红桥区', areas: [
        { name: '大胡同/估衣街', desc: '商圈', factor: 1.15 },
        { name: '西站', desc: '交通枢纽', factor: 1.2 },
        { name: '水游城/陆家嘴', desc: '商圈', factor: 1.1 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      // ── 环城四区 ──
      { name: '西青区', areas: [
        { name: '中北镇/永旺/宜家', desc: '商圈', factor: 1.05 },
        { name: '大寺/印象城', desc: '商圈', factor: 1.0 },
        { name: '大学城（工大/师大/理工）', desc: '高校', factor: 0.85 },
        { name: '张家窝/南站/杉杉奥莱', desc: '交通枢纽+商圈', factor: 1.05 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '津南区', areas: [
        { name: '海河教育园区', desc: '高校', factor: 0.85 },
        { name: '永旺/吾悦', desc: '商圈', factor: 1.0 },
        { name: '国家会展中心/福邻荟', desc: '会展商圈', factor: 1.1 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '东丽区', areas: [
        { name: '宜家/红星美凯龙', desc: '商圈', factor: 1.05 },
        { name: '机场/空港', desc: '交通枢纽', factor: 1.1 },
        { name: '东丽湖/欢乐谷', desc: '景区', factor: 1.15 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '北辰区', areas: [
        { name: '瑞景/刘园', desc: '商圈', factor: 0.95 },
        { name: '天穆', desc: '商圈', factor: 0.9 },
        { name: '北仓', desc: '商圈', factor: 0.9 },
        { name: '宜兴埠/未来天地', desc: '商圈', factor: 0.95 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      // ── 远郊五区/滨海 ──
      { name: '武清区', areas: [
        { name: '佛罗伦萨小镇/威尼都', desc: '商圈', factor: 1.25 },
        { name: '万达商圈', desc: '商圈', factor: 1.0 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '宝坻区', areas: [
        { name: '城区', desc: '普通', factor: 0.85 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '静海区', areas: [
        { name: '团泊/天街', desc: '商圈+景区', factor: 0.95 },
        { name: '城区', desc: '普通', factor: 0.85 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '宁河区', areas: [
        { name: '城区', desc: '普通', factor: 0.8 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      { name: '蓟州区', areas: [
        { name: '盘山/黄崖关长城', desc: '景区', factor: 1.4 },
        { name: '独乐寺/渔阳古镇', desc: '景区', factor: 1.2 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
      // ── 滨海新区（细分各板块） ──
      { name: '滨海新区', areas: [
        { name: '于家堡/响螺湾', desc: 'CBD', factor: 1.3 },
        { name: '泰达/TEDA/MSD', desc: '商务区', factor: 1.25 },
        { name: '塘沽/金街/外滩', desc: '商圈', factor: 1.15 },
        { name: '生态城/国家海博馆', desc: '新型社区', factor: 1.0 },
        { name: '东疆湾/邮轮母港', desc: '景区', factor: 1.4 },
        { name: '大港/万达', desc: '商圈', factor: 0.9 },
        { name: '汉沽/万达', desc: '商圈', factor: 0.9 },
        { name: '空港/SM广场', desc: '商圈', factor: 1.05 },
        { name: '其他区域', desc: '无加权', factor: 1.0 },
      ]},
    ],
    '长沙': [
      { name: '芙蓉区', areas: [
        { name: '五一广场/IFS', desc: '核心商圈', factor: 1.7 },
        { name: '居民区', desc: '住宅', factor: 1.05 },
      ]},
      { name: '岳麓区', areas: [
        { name: '岳麓山/橘子洲', desc: '景区', factor: 1.6 },
        { name: '大学城', desc: '高校', factor: 1.0 },
        { name: '梅溪湖', desc: '商圈', factor: 1.2 },
      ]},
      { name: '天心区', areas: [
        { name: '太平街/坡子街', desc: '文旅商圈', factor: 1.6 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '开福区', areas: [
        { name: '万达/北辰', desc: '商圈', factor: 1.3 },
        { name: '世界之窗', desc: '景区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
    ],
    '郑州': [
      { name: '金水区', areas: [
        { name: '二七广场/大卫城', desc: '核心商圈', factor: 1.5 },
        { name: 'CBD/郑东新区', desc: '商务区', factor: 1.3 },
        { name: '花园路商圈', desc: '商圈', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '中原区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '管城区', areas: [
        { name: '商城遗址/文庙', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '登封市', areas: [
        { name: '少林寺', desc: '景区', factor: 1.7 },
        { name: '城区', desc: '普通', factor: 0.8 },
      ]},
    ],

    // ═══ 二线 ═══
    '济南': [
      { name: '历下区', areas: [
        { name: '泉城广场/趵突泉', desc: '核心商圈+景区', factor: 1.7 },
        { name: '大明湖', desc: '景区', factor: 1.5 },
        { name: 'CBD', desc: '商务区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '市中区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '历城区', areas: [
        { name: '洪家楼', desc: '商圈', factor: 1.2 },
        { name: '大学城', desc: '高校', factor: 0.9 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '槐荫区', areas: [
        { name: '西客站', desc: '交通枢纽', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '章丘区', areas: [
        { name: '百脉泉', desc: '景区', factor: 1.3 },
        { name: '大学城', desc: '高校', factor: 0.85 },
      ]},
    ],
    '青岛': [
      { name: '市南区', areas: [
        { name: '五四广场/奥帆中心', desc: '景区+商圈', factor: 1.7 },
        { name: '栈桥/中山路', desc: '景区', factor: 1.6 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '市北区', areas: [
        { name: '台东步行街', desc: '商圈', factor: 1.3 },
        { name: 'CBD', desc: '商务区', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '崂山区', areas: [
        { name: '崂山风景区', desc: '景区', factor: 1.6 },
        { name: '金家岭', desc: '商务区', factor: 1.3 },
        { name: '石老人', desc: '景区', factor: 1.5 },
      ]},
      { name: '黄岛区', areas: [
        { name: '金沙滩', desc: '景区', factor: 1.5 },
        { name: '长江路', desc: '商圈', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
    ],
    '大连': [
      { name: '中山区', areas: [
        { name: '青泥洼桥/友好广场', desc: '核心商圈', factor: 1.5 },
        { name: '东港', desc: '商务区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.05 },
      ]},
      { name: '西岗区', areas: [
        { name: '奥林匹克商圈', desc: '商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '沙河口区', areas: [
        { name: '星海广场', desc: '景区+商圈', factor: 1.6 },
        { name: '西安路', desc: '商圈', factor: 1.3 },
        { name: '大学区', desc: '高校', factor: 0.95 },
      ]},
      { name: '旅顺口区', areas: [
        { name: '军港/博物馆', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.8 },
      ]},
      { name: '金州区', areas: [
        { name: '发现王国', desc: '景区', factor: 1.5 },
        { name: '城区', desc: '普通', factor: 0.85 },
      ]},
    ],
    '哈尔滨': [
      { name: '道里区', areas: [
        { name: '中央大街/索菲亚', desc: '景区+商圈', factor: 1.6 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '南岗区', areas: [
        { name: '秋林/哈西', desc: '商圈', factor: 1.3 },
        { name: '大学城', desc: '高校', factor: 0.9 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '松北区', areas: [
        { name: '冰雪大世界', desc: '景区', factor: 1.7 },
        { name: '太阳岛', desc: '景区', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '道外区', areas: [
        { name: '中华巴洛克', desc: '文旅区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
    ],
    '沈阳': [
      { name: '沈河区', areas: [
        { name: '中街/故宫', desc: '核心商圈+景区', factor: 1.5 },
        { name: '青年大街', desc: '商务区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '和平区', areas: [
        { name: '太原街', desc: '商圈', factor: 1.3 },
        { name: '西塔', desc: '特色商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '浑南区', areas: [
        { name: '奥体万达', desc: '商圈', factor: 1.15 },
        { name: '大学城', desc: '高校', factor: 0.9 },
        { name: '棋盘山', desc: '景区', factor: 1.3 },
      ]},
      { name: '铁西区', areas: [
        { name: '铁西广场', desc: '商圈', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
    ],
    '厦门': [
      { name: '思明区', areas: [
        { name: '鼓浪屿', desc: '核心景区', factor: 2.0 },
        { name: '中山路', desc: '商圈', factor: 1.6 },
        { name: '曾厝垵', desc: '景区', factor: 1.7 },
        { name: '环岛路', desc: '景区', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 1.1 },
      ]},
      { name: '湖里区', areas: [
        { name: 'SM商圈', desc: '商圈', factor: 1.3 },
        { name: '五缘湾', desc: '高端社区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '集美区', areas: [
        { name: '集美学村', desc: '高校+景区', factor: 1.2 },
        { name: '园博苑', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
    ],
    '福州': [
      { name: '鼓楼区', areas: [
        { name: '三坊七巷', desc: '景区+商圈', factor: 1.7 },
        { name: '东街口', desc: '商圈', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '台江区', areas: [
        { name: '中亭街/上下杭', desc: '商圈+文旅', factor: 1.4 },
        { name: '万象城', desc: '商圈', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '仓山区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.2 },
        { name: '大学城', desc: '高校', factor: 0.9 },
        { name: '烟台山', desc: '景区', factor: 1.3 },
      ]},
    ],
    '合肥': [
      { name: '庐阳区', areas: [
        { name: '淮河路步行街', desc: '核心商圈', factor: 1.5 },
        { name: '逍遥津', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '蜀山区', areas: [
        { name: '天鹅湖/CBD', desc: '商务区', factor: 1.4 },
        { name: '大学城', desc: '高校', factor: 0.95 },
        { name: '大蜀山', desc: '景区', factor: 1.3 },
      ]},
      { name: '包河区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.25 },
        { name: '巢湖沿岸', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
    ],
    '宁波': [
      { name: '海曙区', areas: [
        { name: '天一广场', desc: '核心商圈', factor: 1.5 },
        { name: '鼓楼', desc: '文旅区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.05 },
      ]},
      { name: '鄞州区', areas: [
        { name: '南部商务区', desc: 'CBD', factor: 1.4 },
        { name: '万达商圈', desc: '商圈', factor: 1.25 },
        { name: '东钱湖', desc: '景区', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '江北区', areas: [
        { name: '老外滩', desc: '文旅商圈', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
    ],
    '无锡': [
      { name: '梁溪区', areas: [
        { name: '中山路/崇安寺', desc: '核心商圈', factor: 1.6 },
        { name: '南长街', desc: '文旅区', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 1.05 },
      ]},
      { name: '滨湖区', areas: [
        { name: '太湖/鼋头渚', desc: '景区', factor: 1.7 },
        { name: '蠡湖', desc: '景区', factor: 1.5 },
        { name: '大学城', desc: '高校', factor: 0.95 },
      ]},
      { name: '新吴区', areas: [
        { name: '长江路', desc: '商圈', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
    ],
    '昆明': [
      { name: '五华区', areas: [
        { name: '南屏街/金马碧鸡', desc: '核心商圈', factor: 1.4 },
        { name: '翠湖', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '盘龙区', areas: [
        { name: '同德商圈', desc: '商圈', factor: 1.25 },
        { name: '世博园', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '西山区', areas: [
        { name: '滇池/西山', desc: '景区', factor: 1.5 },
        { name: '万达商圈', desc: '商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '官渡区', areas: [
        { name: '世纪城', desc: '大型社区', factor: 0.95 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
    ],
    '贵阳': [
      { name: '南明区', areas: [
        { name: '喷水池/大十字', desc: '核心商圈', factor: 1.3 },
        { name: '甲秀楼', desc: '景区', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '云岩区', areas: [
        { name: '黔灵山', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '观山湖区', areas: [
        { name: '会展城/CBD', desc: '商务区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
    ],
    '南宁': [
      { name: '青秀区', areas: [
        { name: '东盟商务区', desc: 'CBD', factor: 1.3 },
        { name: '万象城/航洋', desc: '商圈', factor: 1.3 },
        { name: '青秀山', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '兴宁区', areas: [
        { name: '朝阳广场', desc: '核心商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '西乡塘区', areas: [
        { name: '大学城', desc: '高校', factor: 0.85 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
    ],

    // ═══ 热门旅游 / 三四线 ═══
    '三亚': [
      { name: '吉阳区', areas: [
        { name: '亚龙湾', desc: '顶级景区', factor: 2.0 },
        { name: '大东海', desc: '景区', factor: 1.7 },
        { name: '市区', desc: '普通', factor: 1.1 },
      ]},
      { name: '天涯区', areas: [
        { name: '天涯海角', desc: '景区', factor: 1.8 },
        { name: '三亚湾', desc: '景区', factor: 1.6 },
        { name: '市区', desc: '普通', factor: 1.05 },
      ]},
      { name: '海棠区', areas: [
        { name: '蜈支洲岛', desc: '景区', factor: 2.0 },
        { name: '免税城', desc: '商圈', factor: 1.6 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
    ],
    '海口': [
      { name: '龙华区', areas: [
        { name: '国贸/CBD', desc: '商务区', factor: 1.3 },
        { name: '万绿园', desc: '景区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '美兰区', areas: [
        { name: '海大南门', desc: '高校商圈', factor: 1.0 },
        { name: '白沙门', desc: '景区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '秀英区', areas: [
        { name: '假日海滩', desc: '景区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
    ],
    '珠海': [
      { name: '香洲区', areas: [
        { name: '拱北口岸', desc: '商圈', factor: 1.5 },
        { name: '情侣路/渔女', desc: '景区', factor: 1.4 },
        { name: '唐家湾', desc: '大学城', factor: 1.0 },
        { name: '长隆', desc: '景区', factor: 1.8 },
      ]},
      { name: '横琴新区', areas: [
        { name: '横琴口岸', desc: '商圈', factor: 1.4 },
        { name: '长隆海洋王国', desc: '景区', factor: 1.8 },
        { name: '居民区', desc: '住宅', factor: 1.05 },
      ]},
    ],
    '东莞': [
      { name: '南城街道', areas: [
        { name: '鸿福路/CBD', desc: '核心商圈', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '东城街道', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '长安镇', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.15 },
        { name: '工业区', desc: '工厂区', factor: 0.85 },
      ]},
      { name: '虎门镇', areas: [
        { name: '虎门商圈', desc: '商圈', factor: 1.1 },
        { name: '威远炮台', desc: '景区', factor: 1.2 },
      ]},
    ],
    '佛山': [
      { name: '禅城区', areas: [
        { name: '祖庙/岭南天地', desc: '商圈+景区', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '南海区', areas: [
        { name: '千灯湖/CBD', desc: '商务区', factor: 1.4 },
        { name: '万达商圈', desc: '商圈', factor: 1.2 },
        { name: '西樵山', desc: '景区', factor: 1.4 },
      ]},
      { name: '顺德区', areas: [
        { name: '大良/清晖园', desc: '商圈+景区', factor: 1.3 },
        { name: '华侨城', desc: '景区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
    ],
    '温州': [
      { name: '鹿城区', areas: [
        { name: '五马街/纱帽河', desc: '核心商圈', factor: 1.5 },
        { name: '江心屿', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 1.0 },
      ]},
      { name: '瓯海区', areas: [
        { name: '万象城', desc: '商圈', factor: 1.2 },
        { name: '大学城', desc: '高校', factor: 0.9 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '龙湾区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.15 },
        { name: '机场', desc: '交通枢纽', factor: 1.1 },
      ]},
      { name: '乐清市', areas: [
        { name: '雁荡山', desc: '景区', factor: 1.5 },
        { name: '城区', desc: '普通', factor: 0.95 },
      ]},
    ],
    '泉州': [
      { name: '鲤城区', areas: [
        { name: '西街/开元寺', desc: '景区+商圈', factor: 1.4 },
        { name: '中山路', desc: '商圈', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '丰泽区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.2 },
        { name: '东海', desc: '商务区', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '晋江市', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.15 },
        { name: '五店市', desc: '景区', factor: 1.2 },
      ]},
    ],
    '石家庄': [
      { name: '长安区', areas: [
        { name: '北国/勒泰', desc: '核心商圈', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '桥西区', areas: [
        { name: '万象城', desc: '商圈', factor: 1.25 },
        { name: '火车站', desc: '交通枢纽', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '裕华区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.15 },
        { name: '大学城', desc: '高校', factor: 0.85 },
      ]},
    ],
    '长春': [
      { name: '朝阳区', areas: [
        { name: '桂林路/红旗街', desc: '核心商圈', factor: 1.3 },
        { name: '南湖公园', desc: '景区', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '南关区', areas: [
        { name: '重庆路', desc: '商圈', factor: 1.2 },
        { name: '净月潭', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '宽城区', areas: [
        { name: '火车站', desc: '交通枢纽', factor: 1.05 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
    ],
    '南昌': [
      { name: '东湖区', areas: [
        { name: '八一广场/中山路', desc: '核心商圈', factor: 1.3 },
        { name: '滕王阁', desc: '景区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '西湖区', areas: [
        { name: '绳金塔', desc: '景区', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '红谷滩区', areas: [
        { name: '秋水广场/CBD', desc: '商务区', factor: 1.25 },
        { name: '万达商圈', desc: '商圈', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
    ],
    '太原': [
      { name: '迎泽区', areas: [
        { name: '柳巷/钟楼街', desc: '核心商圈', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '小店区', areas: [
        { name: '长风商务区', desc: '商务区', factor: 1.2 },
        { name: '万达商圈', desc: '商圈', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '晋源区', areas: [
        { name: '晋祠', desc: '景区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
    ],
    '兰州': [
      { name: '城关区', areas: [
        { name: '张掖路/西关', desc: '核心商圈', factor: 1.2 },
        { name: '五泉山', desc: '景区', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '七里河区', areas: [
        { name: '兰州中心', desc: '商圈', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '安宁区', areas: [
        { name: '大学城', desc: '高校', factor: 0.8 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
    ],
    '乌鲁木齐': [
      { name: '天山区', areas: [
        { name: '大巴扎/中山路', desc: '核心商圈+景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '新市区', areas: [
        { name: '铁路局/万达', desc: '商圈', factor: 1.15 },
        { name: '机场', desc: '交通枢纽', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '水磨沟区', areas: [
        { name: '南湖', desc: '商圈', factor: 1.1 },
        { name: '红山公园', desc: '景区', factor: 1.15 },
      ]},
    ],
    '拉萨': [
      { name: '城关区', areas: [
        { name: '布达拉宫/大昭寺', desc: '核心景区', factor: 1.8 },
        { name: '八廓街', desc: '商圈+景区', factor: 1.6 },
        { name: '市区', desc: '普通', factor: 1.0 },
      ]},
      { name: '堆龙德庆区', areas: [
        { name: '城区', desc: '普通', factor: 0.9 },
      ]},
    ],
    '西宁': [
      { name: '城中区', areas: [
        { name: '大十字/水井巷', desc: '核心商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '城西区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '湟中区', areas: [
        { name: '塔尔寺', desc: '景区', factor: 1.4 },
        { name: '城区', desc: '普通', factor: 0.8 },
      ]},
    ],
    '银川': [
      { name: '兴庆区', areas: [
        { name: '新华街/鼓楼', desc: '核心商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '金凤区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.15 },
        { name: '阅海湾', desc: '商务区', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '西夏区', areas: [
        { name: '大学城', desc: '高校', factor: 0.8 },
        { name: '西部影城', desc: '景区', factor: 1.3 },
      ]},
    ],
    '呼和浩特': [
      { name: '回民区', areas: [
        { name: '中山西路', desc: '核心商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '新城区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '赛罕区', areas: [
        { name: '大学城', desc: '高校', factor: 0.85 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
    ],

    // ═══ 新增城市（基于大众点评商圈数据） ═══
    '常州': [
      { name: '新北区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.2 },
        { name: '环球港', desc: '商圈', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '天宁区', areas: [
        { name: '南大街/莱蒙', desc: '核心商圈', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '武进区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.1 },
        { name: '大学城', desc: '高校', factor: 0.85 },
      ]},
    ],
    '嘉兴': [
      { name: '南湖区', areas: [
        { name: '八佰伴/月河', desc: '核心商圈+景区', factor: 1.25 },
        { name: '南湖景区', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '秀洲区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '桐乡市', areas: [
        { name: '乌镇', desc: '景区', factor: 1.5 },
        { name: '城区', desc: '普通', factor: 0.85 },
      ]},
    ],
    '惠州': [
      { name: '惠城区', areas: [
        { name: '江北CBD', desc: '商务区', factor: 1.2 },
        { name: '西湖', desc: '景区', factor: 1.25 },
        { name: '港惠/沃尔玛', desc: '商圈', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '惠阳区', areas: [
        { name: '淡水商圈', desc: '商圈', factor: 1.05 },
        { name: '大亚湾', desc: '滨海景区', factor: 1.2 },
      ]},
      { name: '惠东县', areas: [
        { name: '巽寮湾/双月湾', desc: '景区', factor: 1.5 },
        { name: '县城', desc: '普通', factor: 0.8 },
      ]},
    ],
    '中山': [
      { name: '石岐区', areas: [
        { name: '兴中广场/孙文西', desc: '核心商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '东区', areas: [
        { name: '利和/远洋', desc: '商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '小榄镇', areas: [
        { name: '大信新都汇', desc: '商圈', factor: 1.05 },
        { name: '工业区', desc: '工厂区', factor: 0.8 },
      ]},
    ],
    '秦皇岛': [
      { name: '海港区', areas: [
        { name: '太阳城/茂业', desc: '核心商圈', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '北戴河区', areas: [
        { name: '老虎石/中海滩', desc: '景区', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '山海关区', areas: [
        { name: '老龙头/第一关', desc: '景区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 0.8 },
      ]},
    ],
    '威海': [
      { name: '环翠区', areas: [
        { name: '威高广场/韩乐坊', desc: '核心商圈', factor: 1.15 },
        { name: '刘公岛', desc: '景区', factor: 1.4 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '荣成市', areas: [
        { name: '成山头/天鹅湖', desc: '景区', factor: 1.3 },
        { name: '城区', desc: '普通', factor: 0.85 },
      ]},
    ],
    '黄山': [
      { name: '屯溪区', areas: [
        { name: '老街/黎阳in巷', desc: '商圈+景区', factor: 1.3 },
        { name: '城区', desc: '普通', factor: 0.9 },
      ]},
      { name: '黄山区', areas: [
        { name: '黄山风景区', desc: '顶级景区', factor: 1.8 },
        { name: '太平湖', desc: '景区', factor: 1.3 },
        { name: '城区', desc: '普通', factor: 0.85 },
      ]},
      { name: '黟县', areas: [
        { name: '宏村/西递', desc: '景区', factor: 1.5 },
        { name: '县城', desc: '普通', factor: 0.8 },
      ]},
    ],
    '金华': [
      { name: '婺城区', areas: [
        { name: '一百/银泰', desc: '商圈', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '义乌市', areas: [
        { name: '商贸城/篁园', desc: '商圈', factor: 1.25 },
        { name: '万达商圈', desc: '商圈', factor: 1.1 },
        { name: '工业区', desc: '工厂区', factor: 0.8 },
      ]},
      { name: '东阳市', areas: [
        { name: '横店', desc: '景区', factor: 1.4 },
        { name: '城区', desc: '普通', factor: 0.85 },
      ]},
    ],
    '北海': [
      { name: '海城区', areas: [
        { name: '万达/宁春城', desc: '商圈', factor: 1.1 },
        { name: '老街', desc: '景区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '银海区', areas: [
        { name: '银滩', desc: '景区', factor: 1.5 },
        { name: '万达商圈', desc: '商圈', factor: 1.05 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '涠洲岛', areas: [
        { name: '涠洲岛全域', desc: '景区', factor: 1.5 },
      ]},
    ],
    '绍兴': [
      { name: '越城区', areas: [
        { name: '解放路/银泰', desc: '核心商圈', factor: 1.2 },
        { name: '鲁迅故里/沈园', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '柯桥区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.1 },
        { name: '轻纺城', desc: '专业市场', factor: 0.95 },
      ]},
    ],
    '台州': [
      { name: '椒江区', areas: [
        { name: '万达/银泰', desc: '商圈', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '温岭市', areas: [
        { name: '银泰/九龙', desc: '商圈', factor: 1.05 },
        { name: '石塘/小箬村', desc: '景区', factor: 1.25 },
      ]},
      { name: '临海市', areas: [
        { name: '紫阳街/江南长城', desc: '景区+商圈', factor: 1.2 },
      ]},
    ],
    '湖州': [
      { name: '吴兴区', areas: [
        { name: '衣裳街/爱山广场', desc: '商圈', factor: 1.15 },
        { name: '南太湖', desc: '景区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '安吉县', areas: [
        { name: '竹海/云上草原', desc: '景区', factor: 1.4 },
        { name: '县城', desc: '普通', factor: 0.85 },
      ]},
      { name: '德清县', areas: [
        { name: '莫干山', desc: '景区', factor: 1.5 },
        { name: '县城', desc: '普通', factor: 0.85 },
      ]},
    ],
    '舟山': [
      { name: '定海区', areas: [
        { name: '凯虹/一百', desc: '商圈', factor: 1.05 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '普陀区', areas: [
        { name: '普陀山', desc: '顶级景区', factor: 1.8 },
        { name: '朱家尖', desc: '景区', factor: 1.4 },
        { name: '沈家门', desc: '商圈', factor: 1.1 },
      ]},
    ],
    '洛阳': [
      { name: '洛龙区', areas: [
        { name: '龙门石窟', desc: '核心景区', factor: 1.6 },
        { name: '泉舜商圈', desc: '商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '西工区', areas: [
        { name: '王府井/新都汇', desc: '商圈', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '老城区', areas: [
        { name: '十字街/洛邑古城', desc: '文旅商圈', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
    ],
    '桂林': [
      { name: '秀峰区', areas: [
        { name: '东西巷/靖江王府', desc: '景区+商圈', factor: 1.6 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '象山区', areas: [
        { name: '象鼻山/两江四湖', desc: '核心景区', factor: 1.7 },
        { name: '火车站', desc: '交通枢纽', factor: 1.15 },
      ]},
      { name: '七星区', areas: [
        { name: '七星公园', desc: '景区', factor: 1.4 },
        { name: '万达商圈', desc: '商圈', factor: 1.15 },
        { name: '大学城', desc: '高校', factor: 0.9 },
      ]},
      { name: '阳朔县', areas: [
        { name: '西街/漓江', desc: '顶级景区', factor: 1.8 },
        { name: '遇龙河', desc: '景区', factor: 1.7 },
        { name: '县城', desc: '普通', factor: 1.0 },
      ]},
    ],
    '张家界': [
      { name: '永定区', areas: [
        { name: '天门山', desc: '核心景区', factor: 1.8 },
        { name: '市区', desc: '普通', factor: 1.0 },
      ]},
      { name: '武陵源区', areas: [
        { name: '国家森林公园', desc: '顶级景区', factor: 2.0 },
        { name: '黄龙洞', desc: '景区', factor: 1.7 },
        { name: '城区', desc: '普通', factor: 1.1 },
      ]},
    ],
    '丽江': [
      { name: '古城区', areas: [
        { name: '大研古城', desc: '核心景区', factor: 1.8 },
        { name: '束河古镇', desc: '景区', factor: 1.6 },
        { name: '市区', desc: '普通', factor: 1.0 },
      ]},
      { name: '玉龙县', areas: [
        { name: '玉龙雪山', desc: '顶级景区', factor: 2.0 },
        { name: '拉市海', desc: '景区', factor: 1.5 },
      ]},
    ],
    '大理': [
      { name: '大理市', areas: [
        { name: '大理古城', desc: '核心景区', factor: 1.7 },
        { name: '洱海沿岸', desc: '景区', factor: 1.6 },
        { name: '下关市区', desc: '普通', factor: 1.0 },
      ]},
      { name: '双廊镇', areas: [
        { name: '双廊/挖色', desc: '景区', factor: 1.7 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
    ],
    '西双版纳': [
      { name: '景洪市', areas: [
        { name: '告庄/星光夜市', desc: '景区+商圈', factor: 1.7 },
        { name: '曼听公园', desc: '景区', factor: 1.5 },
        { name: '市区', desc: '普通', factor: 1.0 },
      ]},
      { name: '勐海县', areas: [
        { name: '茶山', desc: '景区', factor: 1.3 },
        { name: '县城', desc: '普通', factor: 0.8 },
      ]},
    ],
    '开封': [
      { name: '龙亭区', areas: [
        { name: '清明上河园/龙亭', desc: '核心景区', factor: 1.7 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '鼓楼区', areas: [
        { name: '鼓楼夜市/书店街', desc: '商圈+景区', factor: 1.5 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
    ],
    '烟台': [
      { name: '芝罘区', areas: [
        { name: '万达商圈/大悦城', desc: '核心商圈', factor: 1.3 },
        { name: '烟台山', desc: '景区', factor: 1.25 },
        { name: '居民区', desc: '住宅', factor: 0.95 },
      ]},
      { name: '莱山区', areas: [
        { name: '大学城', desc: '高校', factor: 0.9 },
        { name: '渔人码头', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '蓬莱区', areas: [
        { name: '蓬莱阁', desc: '景区', factor: 1.6 },
        { name: '长岛', desc: '景区', factor: 1.5 },
        { name: '城区', desc: '普通', factor: 0.85 },
      ]},
    ],

    // ═══ 新增热门二三四线（大众点评分类补充） ═══
    '唐山': [
      { name: '路北区', areas: [
        { name: '万达/百货大楼', desc: '核心商圈', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '路南区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.1 },
        { name: '南湖', desc: '景区', factor: 1.15 },
      ]},
    ],
    '保定': [
      { name: '竞秀区', areas: [
        { name: '万博/茂业', desc: '核心商圈', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '莲池区', areas: [
        { name: '裕华路/钟楼', desc: '商圈+古建', factor: 1.05 },
        { name: '大学城', desc: '高校', factor: 0.8 },
      ]},
    ],
    '徐州': [
      { name: '云龙区', areas: [
        { name: '苏宁广场/金鹰', desc: '核心商圈', factor: 1.2 },
        { name: '云龙湖', desc: '景区', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '泉山区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.1 },
        { name: '大学城', desc: '高校', factor: 0.85 },
      ]},
    ],
    '扬州': [
      { name: '广陵区', areas: [
        { name: '文昌阁/时代', desc: '核心商圈', factor: 1.2 },
        { name: '东关街/个园', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '邗江区', areas: [
        { name: '京华城/万达', desc: '商圈', factor: 1.1 },
        { name: '瘦西湖', desc: '景区', factor: 1.5 },
      ]},
    ],
    '镇江': [
      { name: '京口区', areas: [
        { name: '八佰伴/苏宁', desc: '商圈', factor: 1.1 },
        { name: '金山/焦山', desc: '景区', factor: 1.2 },
      ]},
      { name: '润州区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.05 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
    ],
    '芜湖': [
      { name: '镜湖区', areas: [
        { name: '中山路步行街', desc: '核心商圈', factor: 1.1 },
        { name: '方特', desc: '景区', factor: 1.2 },
      ]},
      { name: '鸠江区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.05 },
        { name: '大学城', desc: '高校', factor: 0.8 },
      ]},
    ],
    '汕头': [
      { name: '金平区', areas: [
        { name: '小公园/长平路', desc: '商圈+景区', factor: 1.15 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '龙湖区', areas: [
        { name: '万象城/苏宁', desc: '商圈', factor: 1.2 },
        { name: '居民区', desc: '住宅', factor: 0.9 },
      ]},
      { name: '南澳县', areas: [
        { name: '南澳岛', desc: '景区', factor: 1.3 },
        { name: '县城', desc: '普通', factor: 0.8 },
      ]},
    ],
    '湛江': [
      { name: '赤坎区', areas: [
        { name: '金沙湾', desc: '商圈+景区', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '霞山区', areas: [
        { name: '鼎盛/国贸', desc: '商圈', factor: 1.05 },
        { name: '海滨公园', desc: '景区', factor: 1.05 },
      ]},
    ],
    '宜昌': [
      { name: '西陵区', areas: [
        { name: 'CBD/国贸', desc: '商圈', factor: 1.1 },
        { name: '三峡大学', desc: '高校', factor: 0.85 },
      ]},
      { name: '伍家岗区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.05 },
      ]},
      { name: '夷陵区', areas: [
        { name: '三峡大坝/三峡人家', desc: '景区', factor: 1.5 },
        { name: '城区', desc: '普通', factor: 0.8 },
      ]},
    ],
    '襄阳': [
      { name: '襄城区', areas: [
        { name: '鼓楼/北街', desc: '商圈+古建', factor: 1.05 },
        { name: '古隆中', desc: '景区', factor: 1.15 },
      ]},
      { name: '樊城区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
    ],
    '九江': [
      { name: '浔阳区', areas: [
        { name: '四码头/大中路', desc: '商圈', factor: 1.05 },
        { name: '居民区', desc: '住宅', factor: 0.8 },
      ]},
      { name: '庐山市', areas: [
        { name: '庐山风景区', desc: '顶级景区', factor: 1.6 },
        { name: '城区', desc: '普通', factor: 0.8 },
      ]},
    ],
    '赣州': [
      { name: '章贡区', areas: [
        { name: '万象城/九方', desc: '商圈', factor: 1.1 },
        { name: '宋城/古浮桥', desc: '景区', factor: 1.1 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
    ],
    '柳州': [
      { name: '城中区', areas: [
        { name: '五星街/万达', desc: '商圈', factor: 1.05 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '鱼峰区', areas: [
        { name: '银泰城', desc: '商圈', factor: 1.0 },
      ]},
      { name: '柳南区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.0 },
        { name: '工业区', desc: '工厂区', factor: 0.75 },
      ]},
    ],
    '遵义': [
      { name: '红花岗区', areas: [
        { name: '丁字口/老城', desc: '商圈+景区', factor: 1.05 },
        { name: '居民区', desc: '住宅', factor: 0.8 },
      ]},
      { name: '汇川区', areas: [
        { name: '珠海路商圈', desc: '商圈', factor: 1.0 },
        { name: '居民区', desc: '住宅', factor: 0.8 },
      ]},
      { name: '仁怀市', areas: [
        { name: '茅台镇', desc: '景区+酒文化', factor: 1.2 },
        { name: '城区', desc: '普通', factor: 0.85 },
      ]},
    ],
    '咸阳': [
      { name: '秦都区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.05 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '渭城区', areas: [
        { name: '统一广场/中山街', desc: '商圈', factor: 1.0 },
        { name: '咸阳湖', desc: '景区', factor: 1.05 },
      ]},
    ],
    '绵阳': [
      { name: '涪城区', areas: [
        { name: '凯德/万达', desc: '商圈', factor: 1.05 },
        { name: '居民区', desc: '住宅', factor: 0.85 },
      ]},
      { name: '游仙区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.0 },
        { name: '大学城', desc: '高校', factor: 0.8 },
      ]},
    ],
    '宜宾': [
      { name: '翠屏区', areas: [
        { name: '大观楼/叙府', desc: '商圈', factor: 1.0 },
        { name: '蜀南竹海', desc: '景区', factor: 1.3 },
        { name: '居民区', desc: '住宅', factor: 0.8 },
      ]},
      { name: '叙州区', areas: [
        { name: '万达商圈', desc: '商圈', factor: 1.0 },
      ]},
    ],
  };
  return map[city] || [];
}

// ── 全部城市列表（省份→城市） ──
const ALL: City[] = [
  // ═══ 直辖市 ═══
  { name: '北京', province: '北京', districts: cityDistricts('北京') },
  { name: '上海', province: '上海', districts: cityDistricts('上海') },
  { name: '天津', province: '天津', districts: cityDistricts('天津') },
  { name: '重庆', province: '重庆', districts: cityDistricts('重庆') },

  // ── 河北 ──
  { name: '石家庄', province: '河北', districts: cityDistricts('石家庄') },
  { name: '唐山', province: '河北', districts: cityDistricts('唐山') },
  { name: '秦皇岛', province: '河北', districts: cityDistricts('秦皇岛') },
  { name: '保定', province: '河北', districts: cityDistricts('保定') },
  { name: '邯郸', province: '河北', districts: [] },
  { name: '邢台', province: '河北', districts: [] },
  { name: '张家口', province: '河北', districts: [] },
  { name: '承德', province: '河北', districts: [] },
  { name: '沧州', province: '河北', districts: [] },
  { name: '廊坊', province: '河北', districts: [] },
  { name: '衡水', province: '河北', districts: [] },

  // ── 山西 ──
  { name: '太原', province: '山西', districts: cityDistricts('太原') },
  { name: '大同', province: '山西', districts: [] },
  { name: '阳泉', province: '山西', districts: [] },
  { name: '长治', province: '山西', districts: [] },
  { name: '晋城', province: '山西', districts: [] },
  { name: '朔州', province: '山西', districts: [] },
  { name: '晋中', province: '山西', districts: [] },
  { name: '运城', province: '山西', districts: [] },
  { name: '忻州', province: '山西', districts: [] },
  { name: '临汾', province: '山西', districts: [] },
  { name: '吕梁', province: '山西', districts: [] },

  // ── 内蒙古 ──
  { name: '呼和浩特', province: '内蒙古', districts: cityDistricts('呼和浩特') },
  { name: '包头', province: '内蒙古', districts: [] },
  { name: '乌海', province: '内蒙古', districts: [] },
  { name: '赤峰', province: '内蒙古', districts: [] },
  { name: '通辽', province: '内蒙古', districts: [] },
  { name: '鄂尔多斯', province: '内蒙古', districts: [] },
  { name: '呼伦贝尔', province: '内蒙古', districts: [] },
  { name: '巴彦淖尔', province: '内蒙古', districts: [] },
  { name: '乌兰察布', province: '内蒙古', districts: [] },

  // ── 辽宁 ──
  { name: '沈阳', province: '辽宁', districts: cityDistricts('沈阳') },
  { name: '大连', province: '辽宁', districts: cityDistricts('大连') },
  { name: '鞍山', province: '辽宁', districts: [] },
  { name: '抚顺', province: '辽宁', districts: [] },
  { name: '本溪', province: '辽宁', districts: [] },
  { name: '丹东', province: '辽宁', districts: [] },
  { name: '锦州', province: '辽宁', districts: [] },
  { name: '营口', province: '辽宁', districts: [] },
  { name: '阜新', province: '辽宁', districts: [] },
  { name: '辽阳', province: '辽宁', districts: [] },
  { name: '盘锦', province: '辽宁', districts: [] },
  { name: '铁岭', province: '辽宁', districts: [] },
  { name: '朝阳', province: '辽宁', districts: [] },
  { name: '葫芦岛', province: '辽宁', districts: [] },

  // ── 吉林 ──
  { name: '长春', province: '吉林', districts: cityDistricts('长春') },
  { name: '吉林市', province: '吉林', districts: [] },
  { name: '四平', province: '吉林', districts: [] },
  { name: '辽源', province: '吉林', districts: [] },
  { name: '通化', province: '吉林', districts: [] },
  { name: '白山', province: '吉林', districts: [] },
  { name: '松原', province: '吉林', districts: [] },
  { name: '白城', province: '吉林', districts: [] },
  { name: '延边', province: '吉林', districts: [] },

  // ── 黑龙江 ──
  { name: '哈尔滨', province: '黑龙江', districts: cityDistricts('哈尔滨') },
  { name: '齐齐哈尔', province: '黑龙江', districts: [] },
  { name: '鸡西', province: '黑龙江', districts: [] },
  { name: '鹤岗', province: '黑龙江', districts: [] },
  { name: '双鸭山', province: '黑龙江', districts: [] },
  { name: '大庆', province: '黑龙江', districts: [] },
  { name: '伊春', province: '黑龙江', districts: [] },
  { name: '佳木斯', province: '黑龙江', districts: [] },
  { name: '七台河', province: '黑龙江', districts: [] },
  { name: '牡丹江', province: '黑龙江', districts: [] },
  { name: '黑河', province: '黑龙江', districts: [] },
  { name: '绥化', province: '黑龙江', districts: [] },

  // ── 江苏 ──
  { name: '南京', province: '江苏', districts: cityDistricts('南京') },
  { name: '无锡', province: '江苏', districts: cityDistricts('无锡') },
  { name: '徐州', province: '江苏', districts: cityDistricts('徐州') },
  { name: '常州', province: '江苏', districts: cityDistricts('常州') },
  { name: '苏州', province: '江苏', districts: cityDistricts('苏州') },
  { name: '南通', province: '江苏', districts: [] },
  { name: '连云港', province: '江苏', districts: [] },
  { name: '淮安', province: '江苏', districts: [] },
  { name: '盐城', province: '江苏', districts: [] },
  { name: '扬州', province: '江苏', districts: cityDistricts('扬州') },
  { name: '镇江', province: '江苏', districts: cityDistricts('镇江') },
  { name: '泰州', province: '江苏', districts: [] },
  { name: '宿迁', province: '江苏', districts: [] },

  // ── 浙江 ──
  { name: '杭州', province: '浙江', districts: cityDistricts('杭州') },
  { name: '宁波', province: '浙江', districts: cityDistricts('宁波') },
  { name: '温州', province: '浙江', districts: cityDistricts('温州') },
  { name: '嘉兴', province: '浙江', districts: cityDistricts('嘉兴') },
  { name: '湖州', province: '浙江', districts: cityDistricts('湖州') },
  { name: '绍兴', province: '浙江', districts: cityDistricts('绍兴') },
  { name: '金华', province: '浙江', districts: cityDistricts('金华') },
  { name: '衢州', province: '浙江', districts: [] },
  { name: '舟山', province: '浙江', districts: cityDistricts('舟山') },
  { name: '台州', province: '浙江', districts: cityDistricts('台州') },
  { name: '丽水', province: '浙江', districts: [] },

  // ── 安徽 ──
  { name: '合肥', province: '安徽', districts: cityDistricts('合肥') },
  { name: '芜湖', province: '安徽', districts: cityDistricts('芜湖') },
  { name: '蚌埠', province: '安徽', districts: [] },
  { name: '淮南', province: '安徽', districts: [] },
  { name: '马鞍山', province: '安徽', districts: [] },
  { name: '淮北', province: '安徽', districts: [] },
  { name: '铜陵', province: '安徽', districts: [] },
  { name: '安庆', province: '安徽', districts: [] },
  { name: '黄山', province: '安徽', districts: cityDistricts('黄山') },
  { name: '滁州', province: '安徽', districts: [] },
  { name: '阜阳', province: '安徽', districts: [] },
  { name: '宿州', province: '安徽', districts: [] },
  { name: '六安', province: '安徽', districts: [] },
  { name: '亳州', province: '安徽', districts: [] },
  { name: '池州', province: '安徽', districts: [] },
  { name: '宣城', province: '安徽', districts: [] },

  // ── 福建 ──
  { name: '福州', province: '福建', districts: cityDistricts('福州') },
  { name: '厦门', province: '福建', districts: cityDistricts('厦门') },
  { name: '莆田', province: '福建', districts: [] },
  { name: '三明', province: '福建', districts: [] },
  { name: '泉州', province: '福建', districts: cityDistricts('泉州') },
  { name: '漳州', province: '福建', districts: [] },
  { name: '南平', province: '福建', districts: [] },
  { name: '龙岩', province: '福建', districts: [] },
  { name: '宁德', province: '福建', districts: [] },

  // ── 江西 ──
  { name: '南昌', province: '江西', districts: cityDistricts('南昌') },
  { name: '景德镇', province: '江西', districts: [] },
  { name: '萍乡', province: '江西', districts: [] },
  { name: '九江', province: '江西', districts: cityDistricts('九江') },
  { name: '新余', province: '江西', districts: [] },
  { name: '鹰潭', province: '江西', districts: [] },
  { name: '赣州', province: '江西', districts: cityDistricts('赣州') },
  { name: '吉安', province: '江西', districts: [] },
  { name: '宜春', province: '江西', districts: [] },
  { name: '抚州', province: '江西', districts: [] },
  { name: '上饶', province: '江西', districts: [] },

  // ── 山东 ──
  { name: '济南', province: '山东', districts: cityDistricts('济南') },
  { name: '青岛', province: '山东', districts: cityDistricts('青岛') },
  { name: '淄博', province: '山东', districts: [] },
  { name: '枣庄', province: '山东', districts: [] },
  { name: '东营', province: '山东', districts: [] },
  { name: '烟台', province: '山东', districts: cityDistricts('烟台') },
  { name: '潍坊', province: '山东', districts: [] },
  { name: '济宁', province: '山东', districts: [] },
  { name: '泰安', province: '山东', districts: [] },
  { name: '威海', province: '山东', districts: cityDistricts('威海') },
  { name: '日照', province: '山东', districts: [] },
  { name: '临沂', province: '山东', districts: [] },
  { name: '德州', province: '山东', districts: [] },
  { name: '聊城', province: '山东', districts: [] },
  { name: '滨州', province: '山东', districts: [] },
  { name: '菏泽', province: '山东', districts: [] },

  // ── 河南 ──
  { name: '郑州', province: '河南', districts: cityDistricts('郑州') },
  { name: '开封', province: '河南', districts: cityDistricts('开封') },
  { name: '洛阳', province: '河南', districts: cityDistricts('洛阳') },
  { name: '平顶山', province: '河南', districts: [] },
  { name: '安阳', province: '河南', districts: [] },
  { name: '鹤壁', province: '河南', districts: [] },
  { name: '新乡', province: '河南', districts: [] },
  { name: '焦作', province: '河南', districts: [] },
  { name: '濮阳', province: '河南', districts: [] },
  { name: '许昌', province: '河南', districts: [] },
  { name: '漯河', province: '河南', districts: [] },
  { name: '三门峡', province: '河南', districts: [] },
  { name: '南阳', province: '河南', districts: [] },
  { name: '商丘', province: '河南', districts: [] },
  { name: '信阳', province: '河南', districts: [] },
  { name: '周口', province: '河南', districts: [] },
  { name: '驻马店', province: '河南', districts: [] },

  // ── 湖北 ──
  { name: '武汉', province: '湖北', districts: cityDistricts('武汉') },
  { name: '黄石', province: '湖北', districts: [] },
  { name: '十堰', province: '湖北', districts: [] },
  { name: '宜昌', province: '湖北', districts: cityDistricts('宜昌') },
  { name: '襄阳', province: '湖北', districts: cityDistricts('襄阳') },
  { name: '鄂州', province: '湖北', districts: [] },
  { name: '荆门', province: '湖北', districts: [] },
  { name: '孝感', province: '湖北', districts: [] },
  { name: '荆州', province: '湖北', districts: [] },
  { name: '黄冈', province: '湖北', districts: [] },
  { name: '咸宁', province: '湖北', districts: [] },
  { name: '随州', province: '湖北', districts: [] },
  { name: '恩施', province: '湖北', districts: [] },

  // ── 湖南 ──
  { name: '长沙', province: '湖南', districts: cityDistricts('长沙') },
  { name: '株洲', province: '湖南', districts: [] },
  { name: '湘潭', province: '湖南', districts: [] },
  { name: '衡阳', province: '湖南', districts: [] },
  { name: '邵阳', province: '湖南', districts: [] },
  { name: '岳阳', province: '湖南', districts: [] },
  { name: '常德', province: '湖南', districts: [] },
  { name: '张家界', province: '湖南', districts: cityDistricts('张家界') },
  { name: '益阳', province: '湖南', districts: [] },
  { name: '郴州', province: '湖南', districts: [] },
  { name: '永州', province: '湖南', districts: [] },
  { name: '怀化', province: '湖南', districts: [] },
  { name: '娄底', province: '湖南', districts: [] },
  { name: '湘西', province: '湖南', districts: [] },

  // ── 广东 ──
  { name: '广州', province: '广东', districts: cityDistricts('广州') },
  { name: '深圳', province: '广东', districts: cityDistricts('深圳') },
  { name: '珠海', province: '广东', districts: cityDistricts('珠海') },
  { name: '汕头', province: '广东', districts: cityDistricts('汕头') },
  { name: '佛山', province: '广东', districts: cityDistricts('佛山') },
  { name: '韶关', province: '广东', districts: [] },
  { name: '湛江', province: '广东', districts: cityDistricts('湛江') },
  { name: '肇庆', province: '广东', districts: [] },
  { name: '江门', province: '广东', districts: [] },
  { name: '茂名', province: '广东', districts: [] },
  { name: '惠州', province: '广东', districts: cityDistricts('惠州') },
  { name: '梅州', province: '广东', districts: [] },
  { name: '汕尾', province: '广东', districts: [] },
  { name: '河源', province: '广东', districts: [] },
  { name: '阳江', province: '广东', districts: [] },
  { name: '清远', province: '广东', districts: [] },
  { name: '东莞', province: '广东', districts: cityDistricts('东莞') },
  { name: '中山', province: '广东', districts: cityDistricts('中山') },
  { name: '潮州', province: '广东', districts: [] },
  { name: '揭阳', province: '广东', districts: [] },
  { name: '云浮', province: '广东', districts: [] },

  // ── 广西 ──
  { name: '南宁', province: '广西', districts: cityDistricts('南宁') },
  { name: '柳州', province: '广西', districts: cityDistricts('柳州') },
  { name: '桂林', province: '广西', districts: cityDistricts('桂林') },
  { name: '梧州', province: '广西', districts: [] },
  { name: '北海', province: '广西', districts: cityDistricts('北海') },
  { name: '防城港', province: '广西', districts: [] },
  { name: '钦州', province: '广西', districts: [] },
  { name: '贵港', province: '广西', districts: [] },
  { name: '玉林', province: '广西', districts: [] },
  { name: '百色', province: '广西', districts: [] },
  { name: '贺州', province: '广西', districts: [] },
  { name: '河池', province: '广西', districts: [] },
  { name: '来宾', province: '广西', districts: [] },
  { name: '崇左', province: '广西', districts: [] },

  // ── 海南 ──
  { name: '海口', province: '海南', districts: cityDistricts('海口') },
  { name: '三亚', province: '海南', districts: cityDistricts('三亚') },
  { name: '三沙', province: '海南', districts: [] },
  { name: '儋州', province: '海南', districts: [] },

  // ── 四川 ──
  { name: '成都', province: '四川', districts: cityDistricts('成都') },
  { name: '绵阳', province: '四川', districts: cityDistricts('绵阳') },
  { name: '自贡', province: '四川', districts: [] },
  { name: '攀枝花', province: '四川', districts: [] },
  { name: '泸州', province: '四川', districts: [] },
  { name: '德阳', province: '四川', districts: [] },
  { name: '广元', province: '四川', districts: [] },
  { name: '遂宁', province: '四川', districts: [] },
  { name: '内江', province: '四川', districts: [] },
  { name: '乐山', province: '四川', districts: [] },
  { name: '南充', province: '四川', districts: [] },
  { name: '眉山', province: '四川', districts: [] },
  { name: '宜宾', province: '四川', districts: cityDistricts('宜宾') },
  { name: '广安', province: '四川', districts: [] },
  { name: '达州', province: '四川', districts: [] },
  { name: '雅安', province: '四川', districts: [] },
  { name: '巴中', province: '四川', districts: [] },
  { name: '资阳', province: '四川', districts: [] },
  { name: '阿坝', province: '四川', districts: [] },
  { name: '甘孜', province: '四川', districts: [] },
  { name: '凉山', province: '四川', districts: [] },

  // ── 贵州 ──
  { name: '贵阳', province: '贵州', districts: cityDistricts('贵阳') },
  { name: '六盘水', province: '贵州', districts: [] },
  { name: '遵义', province: '贵州', districts: cityDistricts('遵义') },
  { name: '安顺', province: '贵州', districts: [] },
  { name: '毕节', province: '贵州', districts: [] },
  { name: '铜仁', province: '贵州', districts: [] },
  { name: '黔西南', province: '贵州', districts: [] },
  { name: '黔东南', province: '贵州', districts: [] },
  { name: '黔南', province: '贵州', districts: [] },

  // ── 云南 ──
  { name: '昆明', province: '云南', districts: cityDistricts('昆明') },
  { name: '曲靖', province: '云南', districts: [] },
  { name: '玉溪', province: '云南', districts: [] },
  { name: '保山', province: '云南', districts: [] },
  { name: '昭通', province: '云南', districts: [] },
  { name: '丽江', province: '云南', districts: cityDistricts('丽江') },
  { name: '普洱', province: '云南', districts: [] },
  { name: '临沧', province: '云南', districts: [] },
  { name: '楚雄', province: '云南', districts: [] },
  { name: '红河', province: '云南', districts: [] },
  { name: '文山', province: '云南', districts: [] },
  { name: '西双版纳', province: '云南', districts: cityDistricts('西双版纳') },
  { name: '大理', province: '云南', districts: cityDistricts('大理') },
  { name: '德宏', province: '云南', districts: [] },
  { name: '怒江', province: '云南', districts: [] },
  { name: '迪庆', province: '云南', districts: [] },

  // ── 西藏 ──
  { name: '拉萨', province: '西藏', districts: cityDistricts('拉萨') },
  { name: '日喀则', province: '西藏', districts: [] },
  { name: '昌都', province: '西藏', districts: [] },
  { name: '林芝', province: '西藏', districts: [] },
  { name: '山南', province: '西藏', districts: [] },
  { name: '那曲', province: '西藏', districts: [] },
  { name: '阿里', province: '西藏', districts: [] },

  // ── 陕西 ──
  { name: '西安', province: '陕西', districts: cityDistricts('西安') },
  { name: '铜川', province: '陕西', districts: [] },
  { name: '宝鸡', province: '陕西', districts: [] },
  { name: '咸阳', province: '陕西', districts: cityDistricts('咸阳') },
  { name: '渭南', province: '陕西', districts: [] },
  { name: '延安', province: '陕西', districts: [] },
  { name: '汉中', province: '陕西', districts: [] },
  { name: '榆林', province: '陕西', districts: [] },
  { name: '安康', province: '陕西', districts: [] },
  { name: '商洛', province: '陕西', districts: [] },

  // ── 甘肃 ──
  { name: '兰州', province: '甘肃', districts: cityDistricts('兰州') },
  { name: '嘉峪关', province: '甘肃', districts: [] },
  { name: '金昌', province: '甘肃', districts: [] },
  { name: '白银', province: '甘肃', districts: [] },
  { name: '天水', province: '甘肃', districts: [] },
  { name: '武威', province: '甘肃', districts: [] },
  { name: '张掖', province: '甘肃', districts: [] },
  { name: '平凉', province: '甘肃', districts: [] },
  { name: '酒泉', province: '甘肃', districts: [] },
  { name: '庆阳', province: '甘肃', districts: [] },
  { name: '定西', province: '甘肃', districts: [] },
  { name: '陇南', province: '甘肃', districts: [] },
  { name: '临夏', province: '甘肃', districts: [] },
  { name: '甘南', province: '甘肃', districts: [] },

  // ── 青海 ──
  { name: '西宁', province: '青海', districts: cityDistricts('西宁') },
  { name: '海东', province: '青海', districts: [] },
  { name: '海北', province: '青海', districts: [] },
  { name: '黄南', province: '青海', districts: [] },
  { name: '海南州', province: '青海', districts: [] },
  { name: '果洛', province: '青海', districts: [] },
  { name: '玉树', province: '青海', districts: [] },
  { name: '海西', province: '青海', districts: [] },

  // ── 宁夏 ──
  { name: '银川', province: '宁夏', districts: cityDistricts('银川') },
  { name: '石嘴山', province: '宁夏', districts: [] },
  { name: '吴忠', province: '宁夏', districts: [] },
  { name: '固原', province: '宁夏', districts: [] },
  { name: '中卫', province: '宁夏', districts: [] },

  // ── 新疆 ──
  { name: '乌鲁木齐', province: '新疆', districts: cityDistricts('乌鲁木齐') },
  { name: '克拉玛依', province: '新疆', districts: [] },
  { name: '吐鲁番', province: '新疆', districts: [] },
  { name: '哈密', province: '新疆', districts: [] },
  { name: '昌吉', province: '新疆', districts: [] },
  { name: '博尔塔拉', province: '新疆', districts: [] },
  { name: '巴音郭楞', province: '新疆', districts: [] },
  { name: '阿克苏', province: '新疆', districts: [] },
  { name: '克孜勒苏', province: '新疆', districts: [] },
  { name: '喀什', province: '新疆', districts: [] },
  { name: '和田', province: '新疆', districts: [] },
  { name: '伊犁', province: '新疆', districts: [] },
  { name: '塔城', province: '新疆', districts: [] },
  { name: '阿勒泰', province: '新疆', districts: [] },

  // ── 香港/澳门/台湾 ──
  { name: '香港', province: '香港', districts: [] },
  { name: '澳门', province: '澳门', districts: [] },
  { name: '台北', province: '台湾', districts: [] },
  { name: '高雄', province: '台湾', districts: [] },
  { name: '台中', province: '台湾', districts: [] },
  { name: '台南', province: '台湾', districts: [] },
];

// ── 公开 API ──
export function getAllCities(): City[] {
  return ALL;
}

export function getCityData(cityName: string): City | undefined {
  return ALL.find(c => c.name === cityName);
}

export function getDefaultDistricts(): District[] {
  return DEFAULT_DISTRICTS;
}

export function getPricingFactor(city: string, district: string, area: string): number {
  const meta = CITY_META[city];
  let factor = meta?.baseFactor ?? 1.0;

  const cityData = getCityData(city);
  const districts = cityData?.districts || DEFAULT_DISTRICTS;
  const d = districts.find(dd => dd.name === district);
  if (d && area) {
    const a = d.areas.find(aa => aa.name === area);
    if (a) factor = factor * (a.factor / (meta?.baseFactor || 1.0));
  }
  return Math.round(factor * 100) / 100;
}

export function getAreaDesc(city: string, district: string, area: string): string {
  const factor = getPricingFactor(city, district, area);
  const meta = CITY_META[city];
  const tierLabels = ['', '一线城市', '新一线城市', '二线城市', '三线城市', '四线城市+'];
  const parts: string[] = [];
  if (meta) parts.push(tierLabels[meta.tier]);
  if (city) parts.push(city);
  if (district) parts.push(district);
  if (area) {
    const cityData = getCityData(city);
    const d = (cityData?.districts || DEFAULT_DISTRICTS).find(dd => dd.name === district);
    const a = d?.areas.find(aa => aa.name === area);
    parts.push(area + (a ? ` (${a.desc})` : ''));
  }
  if (factor !== 1.0) parts.push(`定价系数 ${factor}x`);
  return parts.join(' · ');
}
