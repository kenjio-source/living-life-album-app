export const STYLES = [
  { id: 'ehon', label: '昭和絵本風SVG' },
  { id: 'water', label: 'AI水彩' },
  { id: 'sepia', label: '昭和セピア' },
]

const PALETTES = {
  ehon: { sky: '#bfe3f2', far: '#9ccf8b', ground: '#7fb86a', wood: '#c98b55', skin: '#f6d2b0', dark: '#5b3a29', red: '#e0524a', light: '#fff6d8', cloth: '#4f86c6' },
  water: { sky: '#d6ecf5', far: '#b9dcc0', ground: '#a8d19a', wood: '#dcae85', skin: '#fbe3cf', dark: '#8a6a5a', red: '#ee8b84', light: '#fffaf0', cloth: '#8fb6dd' },
  sepia: { sky: '#e6d3b0', far: '#b69a72', ground: '#a48a64', wood: '#7d6244', skin: '#d8bf98', dark: '#3d2e1f', red: '#6b4a32', light: '#f3e6c8', cloth: '#8a7352' },
}

/* ───────── 情景イラスト（SVG） ───────── */
function Person({ x, y, s = 1, p, hat }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="26" rx="14" ry="22" fill={p.cloth} stroke={p.dark} strokeWidth="1.5" />
      <circle cx="0" cy="-2" r="11" fill={p.skin} stroke={p.dark} strokeWidth="1.5" />
      {hat && <path d="M-12 -6 Q0 -22 12 -6 Z" fill={p.red} stroke={p.dark} strokeWidth="1.2" />}
      <circle cx="-4" cy="-3" r="1.2" fill={p.dark} />
      <circle cx="4" cy="-3" r="1.2" fill={p.dark} />
      <path d="M-3 3 Q0 6 3 3" stroke={p.dark} strokeWidth="1.2" fill="none" />
    </g>
  )
}

function SceneBody({ id, p }) {
  if (id === 'engawa')
    return (
      <>
        <rect width="400" height="300" fill={p.sky} />
        <rect y="0" width="400" height="150" fill={p.light} stroke={p.dark} strokeWidth="2" />
        <rect x="20" y="20" width="150" height="110" fill={p.sky} stroke={p.dark} strokeWidth="3" />
        <path d="M95 20 V130 M20 75 H170" stroke={p.dark} strokeWidth="2" />
        <ellipse cx="320" cy="60" rx="38" ry="12" fill={p.far} opacity=".6" />
        <rect y="150" width="400" height="150" fill={p.wood} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M0 ${170 + i * 28} H400`} stroke={p.dark} strokeWidth="1.2" opacity=".5" />
        ))}
        <path d="M230 190 A60 60 0 0 0 350 190 Z" fill={p.red} stroke={p.dark} strokeWidth="2.5" />
        <path d="M238 190 A52 52 0 0 0 342 190 Z" fill={p.light} opacity=".35" />
        {[270, 290, 310, 285, 305].map((cx, i) => (
          <ellipse key={i} cx={cx} cy={200 + (i % 2) * 8} rx="2.5" ry="4" fill={p.dark} />
        ))}
        <Person x="110" y="190" s="1.3" p={p} />
        <Person x="175" y="215" s="0.9" p={p} hat />
        <circle cx="45" cy="260" r="10" fill="none" stroke={p.dark} strokeWidth="2" />
        <path d="M45 250 q12 -8 0 -16" stroke={p.dark} strokeWidth="1.5" fill="none" />
      </>
    )
  if (id === 'kamishibai')
    return (
      <>
        <rect width="400" height="300" fill={p.sky} />
        <circle cx="330" cy="70" r="34" fill={p.light} opacity=".9" />
        <path d="M0 150 L70 90 L140 150 Z M110 150 L190 70 L270 150 Z" fill={p.far} />
        <rect y="170" width="400" height="130" fill={p.ground} />
        <path d="M0 215 Q200 195 400 215" stroke={p.wood} strokeWidth="26" fill="none" />
        <circle cx="90" cy="235" r="24" fill="none" stroke={p.dark} strokeWidth="3" />
        <circle cx="190" cy="235" r="24" fill="none" stroke={p.dark} strokeWidth="3" />
        <path d="M90 235 L130 200 L190 235 M130 200 L120 190" stroke={p.dark} strokeWidth="3" fill="none" />
        <rect x="95" y="150" width="70" height="52" fill={p.wood} stroke={p.dark} strokeWidth="2.5" />
        <rect x="103" y="158" width="54" height="36" fill={p.light} stroke={p.dark} strokeWidth="1.5" />
        <path d="M115 185 q15 -22 30 0" fill={p.red} />
        <Person x="260" y="205" s="0.9" p={p} hat />
        <Person x="310" y="215" s="0.8" p={p} />
        <Person x="350" y="222" s="0.7" p={p} hat />
      </>
    )
  return (
    <>
      <rect width="400" height="300" fill={p.sky} />
      <circle cx="70" cy="60" r="30" fill={p.light} />
      <path d="M0 130 Q100 70 200 125 T400 120 V160 H0 Z" fill={p.far} />
      <rect y="150" width="400" height="150" fill={p.ground} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M0 ${170 + i * 32} H400`} stroke={p.sky} strokeWidth="14" opacity=".55" />
      ))}
      {[40, 90, 150, 230, 300, 350].map((x, i) => (
        <path key={x} d={`M${x} ${200 + (i % 3) * 32} l-3 -14 M${x + 6} ${200 + (i % 3) * 32} l3 -14`} stroke={p.dark} strokeWidth="2" />
      ))}
      <g transform="rotate(25 120 200)"><Person x="120" y="190" s="1.1" p={p} hat /></g>
      <g transform="rotate(25 250 235)"><Person x="250" y="225" s="1" p={p} /></g>
    </>
  )
}

export function Illustration({ scene, style }) {
  const p = PALETTES[style]
  return (
    <svg viewBox="0 0 400 300" className="w-full rounded-xl shadow-md" role="img" aria-label={`${scene.title}のイラスト`}>
      <defs>
        <filter id="f-water" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
        <filter id="f-sepia">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="g" />
          <feColorMatrix in="g" type="saturate" values="0" result="gg" />
          <feComposite in="gg" in2="SourceGraphic" operator="in" result="gc" />
          <feBlend in="SourceGraphic" in2="gc" mode="multiply" />
        </filter>
        <radialGradient id="vig">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#3d2a12" stopOpacity=".55" />
        </radialGradient>
      </defs>
      <g filter={style === 'ehon' ? undefined : `url(#f-${style})`}>
        <SceneBody id={scene.id} p={p} />
      </g>
      {style === 'sepia' && <rect width="400" height="300" fill="url(#vig)" />}
      {style === 'water' && <rect width="400" height="300" fill="#fff" opacity=".12" />}
    </svg>
  )
}
