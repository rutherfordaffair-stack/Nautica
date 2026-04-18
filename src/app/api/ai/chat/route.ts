import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const systemPrompt = `Ou se asistan AI ofisyèl Nautica — yon platfòm pou lwe bato (tankou Airbnb pou bato).

RÈG OU:
- Reponn an Kreyòl Ayisyen pa defò, men si moun nan ekri an fransè, reponn an fransè. Si yo ekri an anglè, reponn an anglè.
- Toujou reyèl, itil, epi konsiz
- Si ou pa konnen yon repons, di yo kontakte support@nautica.com
- Pa janm bay konsèy medikal, legal, oubyen finansye

ENFÒMASYON SOU NAUTICA:
- Platfòm pou lwe bato (vwayè, yacht, katamaran, jetski, etc.)
- Moun ka lwe pa jou oubyen pa zè
- Nautica pran 12% frè sèvis, pwopriyetè resevwa 88%
- Peman sekirize via Stripe
- Disponib nan 40+ peyi
- 3 politik anilasyon: Fleksib, Modere, Strict
- Avis verifye sèlman apre yon lokasyon reyèl
- Sipò 24/7 via support@nautica.com

REPONS POU KESYON KOMEN:
- Lwe bato: Chèche → Chwazi dat → Peye → Monte bato!
- Mete bato: Kreye kont → Dashboard → Mete Bato → Ranpli fòm
- Peman: Stripe (kat kredi/debi), peman pwoteje jiskaske konfime
- Anilasyon: Depann sou politik pwopriyetè a (Fleksib/Modere/Strict)
- Lisans: Depann sou peyi ak kalite bato — verifye ak pwopriyetè a`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: systemPrompt,
        messages: messages.slice(-10).map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    const data = await response.json()
    const reply = data.content?.[0]?.text || 'Eskize mwen, mwen pa ka reponn kounye a. Kontakte support@nautica.com'

    return NextResponse.json({ reply })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ reply: 'Gen yon erè. Tanpri kontakte support@nautica.com' })
  }
}
