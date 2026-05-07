// AI 商品识别 — MiniMax M2.7

const MINIMAX_KEY = process.env.NEXT_PUBLIC_MINIMAX_API_KEY || '';
const MINIMAX_URL = 'https://api.minimaxi.com/v1/text/chatcompletion_v2';

export interface AIResult {
  name: string;
  category: string;
  spec: string;
  cost_price: number;
  sell_price: number;
  carton_price?: number;
}

export async function recognizeBarcode(
  barcode: string,
  locationHint?: string,
  signal?: AbortSignal
): Promise<AIResult> {
  const fallback: AIResult = { name: '商品-' + barcode.slice(-6), category: '其他', spec: '', cost_price: 0, sell_price: 0 };
  if (!MINIMAX_KEY) return fallback;

  const locInfo = locationHint ? '店铺位置: ' + locationHint + '。请根据该地区的消费水平调整建议零售价。' : '';
  const prompt = `作为商品识别专家，识别条形码 "${barcode}"。

${locInfo}

返回JSON：{"name":"商品名称","category":"分类(饮料/零食/日用品/调味品/乳制品/粮油主食/冷冻食品/烟酒/其他)","spec":"规格","cost_price":进价,"sell_price":售价}

- 690-699开头为中国商品条码
- cost_price约为sell_price的60-75%
- 商圈/景区 sell_price可上浮10-30%
- 香烟类额外 "carton_price": 整条价
- 只返回JSON`;

  try {
    const res = await fetch(MINIMAX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${MINIMAX_KEY}` },
      body: JSON.stringify({ model: 'MiniMax-M2.7', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 500 }),
      signal,
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    let result: any;
    try { result = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim()); }
    catch { const m = content.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : {}; }
    return { name: result.name || fallback.name, category: result.category || '其他', spec: result.spec || '', cost_price: result.cost_price || 0, sell_price: result.sell_price || 0, carton_price: result.carton_price || undefined };
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
    return fallback;
  }
}

export async function recognizePhoto(
  imageBase64: string,
  locationHint?: string,
  signal?: AbortSignal
): Promise<AIResult> {
  const fallback: AIResult = { name: '未识别商品', category: '其他', spec: '', cost_price: 0, sell_price: 0 };
  if (!MINIMAX_KEY) return fallback;

  const locInfo = locationHint ? '店铺位置: ' + locationHint + '。请根据该地区的消费水平调整建议零售价。' : '';
  const prompt = `仔细观察图片中商品包装上的文字，提取商品名称和规格信息。

${locInfo}

返回JSON：{"name":"从包装读取的商品名称","category":"分类","spec":"净含量/规格","cost_price":进价估算,"sell_price":建议零售价}

- 优先读取包装上的商品名称文字
- cost_price约为sell_price的60-75%
- 香烟类额外 "carton_price": 整条价
- 只返回JSON`;

  try {
    const res = await fetch(MINIMAX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${MINIMAX_KEY}` },
      body: JSON.stringify({ model: 'MiniMax-M2.7', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 500 }),
      signal,
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    let result: any;
    try { result = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim()); }
    catch { const m = content.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : {}; }
    return { name: result.name || fallback.name, category: result.category || '其他', spec: result.spec || '', cost_price: result.cost_price || 0, sell_price: result.sell_price || 0, carton_price: result.carton_price || undefined };
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
    return fallback;
  }
}
