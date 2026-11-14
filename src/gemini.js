const MODEL = 'gemini-2.5-flash'

const PROMPT = `あなたは介護施設の記録支援AIです。次のケア音声の文字起こしから、JSONのみを出力してください。
- record: 公的ケア記録。{label, text}の配列。事実のみを簡潔に。推測や診断は書かない。
- timeline: 語られた思い出から読み取れる人生年表。{year, age, text}の配列。年齢や年代は本文から推定できる範囲のみ。不明なら「不明」と書く。
- questions: 家族が面会で使える質問を3つ（文字列の配列）。
- scenes: 時代考証に基づく情景候補をちょうど3つ。{title, note, motif}。motifは "engawa"（縁側・家の中）, "kamishibai"（街・路地）, "taue"（田畑・自然）のいずれか。
記載内容は文字起こしにあることを根拠にし、ないことは作らないこと。`

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    record: { type: 'ARRAY', items: { type: 'OBJECT', properties: { label: { type: 'STRING' }, text: { type: 'STRING' } }, required: ['label', 'text'] } },
    timeline: { type: 'ARRAY', items: { type: 'OBJECT', properties: { year: { type: 'STRING' }, age: { type: 'STRING' }, text: { type: 'STRING' } }, required: ['year', 'age', 'text'] } },
    questions: { type: 'ARRAY', items: { type: 'STRING' } },
    scenes: { type: 'ARRAY', items: { type: 'OBJECT', properties: { title: { type: 'STRING' }, note: { type: 'STRING' }, motif: { type: 'STRING', enum: ['engawa', 'kamishibai', 'taue'] } }, required: ['title', 'note', 'motif'] } },
  },
  required: ['record', 'timeline', 'questions', 'scenes'],
}

export async function generateAlbum(apiKey, transcript) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${PROMPT}\n\n【文字起こし】\n${transcript}` }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMA, temperature: 0.3 },
    }),
  })
  if (!res.ok) {
    let msg = ''
    try { msg = (await res.json()).error?.message || '' } catch { /* ignore */ }
    throw new Error(`Gemini APIエラー（${res.status}）${msg ? '：' + msg : ''}`)
  }
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  let json
  try { json = JSON.parse(text) } catch { throw new Error('AIの応答を読み取れませんでした。もう一度お試しください。') }
  const ok = ['record', 'timeline', 'questions', 'scenes'].every((k) => Array.isArray(json[k]))
  if (!ok || json.scenes.length === 0) throw new Error('AIの応答の形式が想定と異なりました。もう一度お試しください。')
  return json
}
