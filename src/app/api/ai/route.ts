import { NextRequest, NextResponse } from 'next/server'

// DeepSeek API for product recognition
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions'

export async function POST(request: NextRequest) {
  try {
    const { barcode } = await request.json()
    if (!barcode) return NextResponse.json({ error: 'barcode required' }, { status: 400 })

    // Try to identify product from barcode
    const prompt = `你是一个商品识别专家。给定一个商品条形码 "${barcode}"，请尽可能识别这个商品。

请按以下 JSON 格式返回（如果无法确定，请根据条码前缀推测合理的商品信息）：
{
  "name": "商品名称",
  "category": "分类（如：饮料、零食、日用品、调味品、乳制品等）",
  "spec": "规格（如：500ml、100g、1包等）",
  "cost_price": 进价估算（元）,
  "sell_price": 建议零售价（元，中国便利店/小商店市场价）
}

注意：
- 如果这是中国常见商品条码（以690-699开头），请给出合理的中国市场价格
- sell_price 请给出中国二三线城市小商店的常规售价
- cost_price 大约为 sell_price 的 60%-75%
- 如果完全无法识别，name 填 "未知商品"，category 填 "其他"
- 只返回 JSON，不要有其他文字`

    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      // Fallback: return mock result
      return NextResponse.json({
        name: '未知商品',
        category: '其他',
        spec: '',
        cost_price: 0,
        sell_price: 0,
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || '{}'
    
    // Parse JSON from response
    let result
    try {
      result = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim())
    } catch {
      // Try to extract JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    }

    return NextResponse.json({
      name: result.name || '未知商品',
      category: result.category || '其他',
      spec: result.spec || '',
      cost_price: result.cost_price || 0,
      sell_price: result.sell_price || 0,
    })
  } catch (error) {
    console.error('AI recognition error:', error)
    return NextResponse.json({
      name: '未知商品',
      category: '其他',
      spec: '',
      cost_price: 0,
      sell_price: 0,
    })
  }
}
