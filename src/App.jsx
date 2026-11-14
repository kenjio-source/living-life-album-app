import { useState, useRef } from 'react'
import { FileText, BookOpen, MessageCircleQuestion, Sparkles, Check, Palette, Mic, KeyRound, ShieldAlert } from 'lucide-react'
import { Illustration, STYLES } from './Illustration.jsx'
import { generateAlbum } from './gemini.js'

const MOTIFS = ['engawa', 'kamishibai', 'taue']

function Card({ icon: Icon, title, badge, children, active }) {
  return (
    <section className={`rounded-2xl border bg-white p-5 shadow-sm ${active ? 'border-amber-400 ring-2 ring-amber-200' : 'border-stone-200'}`}>
      <header className="mb-3 flex items-center gap-2 text-stone-800">
        <Icon className="h-5 w-5 text-amber-600" />
        <h3 className="font-bold">{title}</h3>
        {badge && <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">{badge}</span>}
      </header>
      {children}
    </section>
  )
}

export default function App() {
  const [apiKey, setApiKey] = useState('') // メモリ内のみ（保存しません）
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [sceneIdx, setSceneIdx] = useState(0)
  const [style, setStyle] = useState('ehon')
  const [chosen, setChosen] = useState(false)
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

  const toggleMic = () => {
    if (listening) { recRef.current?.stop(); return }
    const rec = new SR()
    rec.lang = 'ja-JP'
    rec.continuous = true
    rec.interimResults = false
    rec.onresult = (e) => {
      const t = Array.from(e.results).slice(e.resultIndex).map((r) => r[0].transcript).join('')
      setText((prev) => prev + t)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  const run = async () => {
    setError('')
    setLoading(true)
    try {
      const r = await generateAlbum(apiKey.trim(), text.trim())
      setResult(r)
      setSceneIdx(0)
      setChosen(false)
    } catch (e) {
      setError(e.message || '生成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const canRun = apiKey.trim() && text.trim().length >= 10 && !loading
  const scenes = result?.scenes || []
  const scene = scenes[sceneIdx]
  const sceneForDraw = scene && { id: MOTIFS.includes(scene.motif) ? scene.motif : 'engawa', title: scene.title }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 text-stone-800" style={{ fontFamily: '"Hiragino Sans","Noto Sans JP","Yu Gothic",sans-serif' }}>
      <header className="border-b border-amber-200 bg-amber-50/90">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <BookOpen className="h-6 w-6 text-amber-700" />
          <div>
            <h1 className="text-lg font-bold leading-tight">Living Life Album <span className="text-sm font-normal text-stone-500">実装版</span></h1>
            <p className="text-xs text-stone-500">週刊・人生のアルバム</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-6">
        <div className="flex gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <p>入力した文章は Google の Gemini API に送信されます。<b>実在の利用者の氏名・住所などの個人情報は入力しないでください。</b>APIキーはこの画面を開いている間だけメモリに保持され、保存・送信先は Google のみです。</p>
        </div>

        <section>
          <h2 className="mb-2 text-sm font-bold text-amber-800">STEP 1　入力</h2>
          <Card icon={KeyRound} title="Gemini APIキー">
            <input type="password" autoComplete="off" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Google AI Studio で発行したAPIキーを貼り付け" className="w-full rounded-lg border border-stone-300 p-2 text-sm" />
          </Card>
          <div className="mt-4" />
          <Card icon={Mic} title="ケア音声の文字起こし" active={listening}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="30秒ほどのケア音声の内容を入力、または「音声入力」で話してください（例：昼食後、〇〇さんが昔の夏の思い出を笑顔で話されました…）" className="w-full rounded-lg border border-stone-300 p-3 text-sm leading-relaxed" />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {SR && (
                <button onClick={toggleMic} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm text-white ${listening ? 'bg-red-600' : 'bg-stone-800'}`}>
                  <Mic className="h-4 w-4" />{listening ? '音声入力を止める' : '音声入力'}
                </button>
              )}
              <button onClick={run} disabled={!canRun} className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
                <Sparkles className="h-4 w-4" />{loading ? '生成中…' : '3つに変換する'}
              </button>
              {!SR && <span className="text-xs text-stone-500">※ このブラウザは音声入力に未対応です（文章を直接入力してください）</span>}
            </div>
            {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          </Card>
        </section>

        {result && (
          <>
            <section>
              <h2 className="mb-2 text-sm font-bold text-amber-800">STEP 2　3つの変換</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Card icon={FileText} title="公的ケア記録" badge="提出前に要確認">
                  <dl className="space-y-2 text-sm">
                    {result.record.map((r, i) => (<div key={i}><dt className="text-xs font-bold text-stone-500">{r.label}</dt><dd>{r.text}</dd></div>))}
                  </dl>
                </Card>
                <Card icon={BookOpen} title="AI人生年表アルバム" badge="伝記マガジン">
                  <ol className="space-y-3 border-l-2 border-amber-300 pl-3 text-sm">
                    {result.timeline.map((t, i) => (<li key={i}><p className="text-xs font-bold text-amber-700">{t.year}（{t.age}）</p><p>{t.text}</p></li>))}
                  </ol>
                </Card>
                <Card icon={MessageCircleQuestion} title="面会用質問ガイド" badge="家族向け">
                  <ul className="space-y-3 text-sm">
                    {result.questions.map((q, i) => (<li key={i} className="rounded-lg bg-amber-50 p-2">💬 {q}</li>))}
                  </ul>
                </Card>
              </div>
              <p className="mt-2 text-xs text-stone-500">※ AIの出力です。内容は必ず職員が確認・修正してから使用してください。</p>
            </section>

            <section>
              <h2 className="mb-2 text-sm font-bold text-amber-800">STEP 3　情景を選び、画風を切り替える</h2>
              <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
                <Card icon={Palette} title="時代考証に基づく3つの情景候補">
                  <ul className="space-y-2">
                    {scenes.map((s, i) => (
                      <li key={i}>
                        <button onClick={() => { setSceneIdx(i); setChosen(false) }} className={`w-full rounded-lg border p-3 text-left text-sm ${i === sceneIdx ? 'border-amber-500 bg-amber-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                          <span className="font-bold">候補{i + 1}：{s.title}</span>
                          <span className="block text-xs text-stone-500">{s.note}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-1 mt-4 text-xs font-bold text-stone-500">画風</p>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map((st) => (
                      <button key={st.id} onClick={() => setStyle(st.id)} className={`rounded-full border px-3 py-1.5 text-sm ${style === st.id ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300 bg-white'}`}>{st.label}</button>
                    ))}
                  </div>
                  <button onClick={() => setChosen(true)} className="mt-4 flex items-center gap-1.5 rounded-lg bg-stone-800 px-4 py-2 text-sm text-white"><Check className="h-4 w-4" />この情景を採用する</button>
                </Card>
                <Card icon={BookOpen} title="アルバムのページ" badge={chosen ? '採用済み' : 'プレビュー'} active={chosen}>
                  {sceneForDraw && <Illustration scene={sceneForDraw} style={style} />}
                  <p className="mt-3 text-center text-sm text-stone-600">「{scene.title}」— {STYLES.find((s) => s.id === style).label}</p>
                  <p className="mt-1 text-center text-xs text-stone-400">イラストは3種の定型情景から、AIが選んだモチーフを描画しています。</p>
                </Card>
              </div>
            </section>
          </>
        )}

        <footer className="pb-8 text-center text-xs text-stone-400">Google AI Challenge 2026 応募作品　実装版</footer>
      </main>
    </div>
  )
}
