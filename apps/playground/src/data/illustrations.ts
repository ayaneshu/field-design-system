// AUTO-GENERATED from https://github.com/mundhratamanna-ux/noon-illustration-system
// Do not edit by hand.

export type IllustrationBrand = "base" | "noon" | "noon-food" | "minutes" | "nownow" | "supermall";

export type Illustration = {
  id: string;
  name: string;
  brand: IllustrationBrand;
  svg: string;
};

export const illustrations: Illustration[] = [
  {
    id: "base/apple",
    name: "apple",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="345" rx="90" ry="8" fill="#B27800" opacity="0.3"/>
  <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#FFCD00"/>
  <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#E8A500"/>
  <ellipse cx="160" cy="180" rx="22" ry="40" fill="#FFF2A8" opacity="0.85"/>
  <ellipse cx="155" cy="170" rx="10" ry="20" fill="#FFFFFF" opacity="0.9"/>
  <path d="M 200 130 Q 205 105 220 95" stroke="#B27800" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#E8A500"/>
  <path d="M 222 105 Q 245 95 265 108" stroke="#B27800" stroke-width="2" fill="none"/>
</svg>`,
  },
  {
    id: "base/bottle",
    name: "bottle",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="60" ry="8" fill="#B27800" opacity="0.3"/>
  <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#FFCD00"/>
  <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E8A500"/>
  <rect x="175" y="60" width="50" height="20" fill="#B27800" rx="3"/>
  <rect x="175" y="60" width="50" height="6" fill="#1A1A1A" rx="3"/>
  <rect x="170" y="160" width="8" height="160" fill="#FFF2A8" rx="4" opacity="0.85"/>
  <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  <rect x="160" y="200" width="80" height="14" fill="#E8A500"/>
  <rect x="160" y="266" width="80" height="14" fill="#E8A500"/>
</svg>`,
  },
  {
    id: "base/bread",
    name: "bread",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="170" ry="10" fill="#B27800" opacity="0.25"/>
  <path d="M 50 240 Q 50 180 110 180 L 290 180 Q 350 180 350 240 Q 350 290 290 290 L 110 290 Q 50 290 50 240 Z" fill="#FFCD00"/>
  <path d="M 50 250 Q 50 290 110 290 L 290 290 Q 350 290 350 250 Q 320 285 200 285 Q 80 285 50 250 Z" fill="#E8A500"/>
  <path d="M 80 200 Q 130 188 200 188 Q 270 188 320 200 Q 270 195 200 195 Q 130 195 80 200 Z" fill="#FFE066"/>
  <path d="M 90 220 Q 100 240 90 260" stroke="#B27800" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 150 215 Q 160 240 150 265" stroke="#B27800" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 210 215 Q 220 240 210 265" stroke="#B27800" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 270 215 Q 280 240 270 265" stroke="#B27800" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 320 220 Q 330 240 320 260" stroke="#B27800" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="60" cy="240" rx="10" ry="35" fill="#FFF2A8" opacity="0.7"/>
</svg>`,
  },
  {
    id: "base/building",
    name: "building",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="378" rx="180" ry="8" fill="#B27800" opacity="0.2"/>
  <rect x="280" y="80" width="60" height="290" fill="#E8A500"/>
  <rect x="280" y="80" width="60" height="290" fill="url(#hatch)" opacity="0.5"/>
  <rect x="80" y="80" width="200" height="290" fill="#FFCD00"/>
  <rect x="80" y="80" width="260" height="20" fill="#FFE066"/>
  <rect x="80" y="170" width="260" height="8" fill="#E8A500"/>
  <rect x="80" y="250" width="260" height="8" fill="#E8A500"/>
  <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  <polygon points="100,115 130,115 100,135" fill="#FFF2A8"/>
  <polygon points="160,115 190,115 160,135" fill="#FFF2A8"/>
  <polygon points="220,115 250,115 220,135" fill="#FFF2A8"/>
  <rect x="95" y="190" width="170" height="50" fill="#FFE066"/>
  <rect x="95" y="190" width="170" height="6" fill="#E8A500"/>
  <line x1="115" y1="200" x2="115" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="145" y1="200" x2="145" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="175" y1="200" x2="175" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="205" y1="200" x2="205" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="235" y1="200" x2="235" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <rect x="100" y="280" width="80" height="80" fill="#FFFFFF"/>
  <rect x="100" y="280" width="80" height="14" fill="#E8A500"/>
  <rect x="200" y="280" width="60" height="90" fill="#E8A500"/>
  <rect x="208" y="290" width="20" height="80" fill="#B27800"/>
  <rect x="232" y="290" width="20" height="80" fill="#B27800"/>
  <circle cx="120" cy="290" r="3" fill="#FFF2A8"/>
  <circle cx="140" cy="290" r="3" fill="#FFF2A8"/>
  <circle cx="160" cy="290" r="3" fill="#FFF2A8"/>
</svg>`,
  },
  {
    id: "base/cupcake",
    name: "cupcake",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="100" ry="8" fill="#B27800" opacity="0.3"/>
  <path d="M 110 230 L 290 230 L 270 360 L 130 360 Z" fill="#E8A500"/>
  <line x1="135" y1="240" x2="142" y2="355" stroke="#B27800" stroke-width="3"/>
  <line x1="170" y1="240" x2="172" y2="355" stroke="#B27800" stroke-width="3"/>
  <line x1="200" y1="240" x2="200" y2="358" stroke="#B27800" stroke-width="3"/>
  <line x1="230" y1="240" x2="228" y2="355" stroke="#B27800" stroke-width="3"/>
  <line x1="265" y1="240" x2="258" y2="355" stroke="#B27800" stroke-width="3"/>
  <rect x="105" y="220" width="190" height="20" fill="#B27800"/>
  <path d="M 120 230 Q 150 130 200 130 Q 250 130 280 230 Z" fill="#FFCD00"/>
  <path d="M 140 200 Q 165 150 200 150 Q 235 150 260 200 Q 240 215 200 215 Q 160 215 140 200 Z" fill="#FFE066"/>
  <path d="M 165 175 Q 180 145 200 145 Q 220 145 235 175 Q 220 188 200 188 Q 180 188 165 175 Z" fill="#FFF2A8"/>
  <circle cx="200" cy="135" r="14" fill="#B27800"/>
  <circle cx="195" cy="130" r="14" fill="#E8A500"/>
  <ellipse cx="190" cy="125" rx="4" ry="6" fill="#FFFFFF"/>
  <path d="M 200 122 Q 215 100 230 95" stroke="#B27800" stroke-width="3" fill="none"/>
</svg>`,
  },
  {
    id: "base/donut",
    name: "donut",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="120" ry="14" fill="#B27800" opacity="0.25"/>
  <circle cx="200" cy="220" r="120" fill="#E8A500"/>
  <circle cx="200" cy="210" r="120" fill="#FFCD00"/>
  <path d="M 80 210 Q 80 250 110 250 Q 130 250 140 230 L 140 210 Z" fill="#FFE066"/>
  <path d="M 320 210 Q 320 240 290 240 Q 270 240 260 220 L 260 210 Z" fill="#FFE066"/>
  <path d="M 140 110 Q 200 90 260 110 L 260 130 Q 230 120 200 120 Q 170 120 140 130 Z" fill="#FFE066"/>
  <circle cx="200" cy="210" r="35" fill="#B27800"/>
  <circle cx="200" cy="205" r="35" fill="#E8A500"/>
  <rect x="155" y="145" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(20 158 152)"/>
  <rect x="245" y="155" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-30 248 162)"/>
  <rect x="170" y="265" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(45 173 272)"/>
  <rect x="240" y="255" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-15 243 262)"/>
  <rect x="125" y="200" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(70 128 207)"/>
  <rect x="270" y="195" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(60 273 202)"/>
</svg>`,
  },
  {
    id: "base/headphones",
    name: "headphones",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="360" rx="140" ry="12" fill="#B27800" opacity="0.25"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#E8A500" stroke-width="22" stroke-linecap="round"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#FFCD00" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="95" cy="240" rx="65" ry="80" fill="#E8A500"/>
  <ellipse cx="95" cy="235" rx="55" ry="70" fill="#FFCD00"/>
  <ellipse cx="95" cy="235" rx="35" ry="50" fill="#B27800"/>
  <ellipse cx="80" cy="215" rx="10" ry="20" fill="#FFE066" opacity="0.7"/>
  <ellipse cx="305" cy="240" rx="65" ry="80" fill="#E8A500"/>
  <ellipse cx="305" cy="235" rx="55" ry="70" fill="#FFCD00"/>
  <ellipse cx="305" cy="235" rx="35" ry="50" fill="#B27800"/>
  <ellipse cx="290" cy="215" rx="10" ry="20" fill="#FFE066" opacity="0.7"/>
  <circle cx="95" cy="235" r="12" fill="#FFFFFF"/>
  <circle cx="305" cy="235" r="12" fill="#FFFFFF"/>
</svg>`,
  },
  {
    id: "base/hero-composition",
    name: "hero-composition",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 540" width="600" height="540"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="300" cy="500" rx="280" ry="20" fill="#B27800" opacity="0.2"/>
  <!-- Background back item: bottle (peeking behind on right) -->
  <g transform="translate(350,80) scale(0.5)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#FFCD00"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E8A500"/>
    <rect x="175" y="60" width="50" height="20" fill="#B27800" rx="3"/>
    <rect x="160" y="200" width="80" height="60" fill="#FFFFFF"/>
  </g>
  <!-- Background back item: building (peeking behind on far left) -->
  <g transform="translate(-30,150) scale(0.45)">
    <rect x="80" y="80" width="200" height="290" fill="#E8A500"/>
    <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  </g>
  <!-- HERO: paper bag center -->
  <g transform="translate(120,120)">
    <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#FFCD00"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#E8A500"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
    <rect x="90" y="140" width="220" height="14" fill="#FFE066"/>
    <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#E8A500" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#E8A500" stroke-width="8" fill="none" stroke-linecap="round"/>
    <rect x="130" y="210" width="140" height="80" fill="#FFFFFF" rx="6"/>
    <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
          font-size="22" text-anchor="middle" fill="#1A1A1A">noon</text>
  </g>
  <!-- Front-left item: apple/produce -->
  <g transform="translate(-20,330) scale(0.5)">
    <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#FFCD00"/>
    <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#E8A500"/>
    <ellipse cx="160" cy="180" rx="22" ry="40" fill="#FFF2A8" opacity="0.85"/>
    <path d="M 200 130 Q 205 105 220 95" stroke="#B27800" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#E8A500"/>
  </g>
  <!-- Front-right item: bottle small -->
  <g transform="translate(440,300) scale(0.45)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#FFCD00"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E8A500"/>
    <rect x="175" y="60" width="50" height="20" fill="#B27800" rx="3"/>
    <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  </g>
</svg>`,
  },
  {
    id: "base/package-box",
    name: "package-box",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="360" rx="140" ry="14" fill="#B27800" opacity="0.25"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="#E8A500"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="url(#hatch)" opacity="0.55"/>
  <polygon points="80,110 200,60 320,110 200,160" fill="#FFE066"/>
  <polygon points="80,110 320,110 320,360 80,360" fill="#FFCD00"/>
  <rect x="80" y="220" width="240" height="22" fill="#E8A500"/>
  <rect x="80" y="220" width="240" height="3" fill="#FFE066"/>
  <rect x="130" y="135" width="140" height="70" fill="#FFFFFF" rx="4"/>
  <text x="200" y="180" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="30" text-anchor="middle" fill="#1A1A1A">noon</text>
  <polygon points="80,110 200,60 320,110 200,160" fill="#FFF2A8" opacity="0.35"/>
</svg>`,
  },
  {
    id: "base/palm-tree",
    name: "palm-tree",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="378" rx="60" ry="6" fill="#B27800" opacity="0.25"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#E8A500" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#FFCD00" stroke-width="12" fill="none" stroke-linecap="round"/>
  <line x1="180" y1="320" x2="200" y2="320" stroke="#B27800" stroke-width="3"/>
  <line x1="183" y1="270" x2="200" y2="270" stroke="#B27800" stroke-width="3"/>
  <line x1="190" y1="220" x2="205" y2="220" stroke="#B27800" stroke-width="3"/>
  <line x1="195" y1="170" x2="208" y2="170" stroke="#B27800" stroke-width="3"/>
  <path d="M 200 100 Q 130 80 70 100 Q 100 110 200 110 Z" fill="#E8A500"/>
  <path d="M 200 100 Q 270 80 330 100 Q 300 110 200 110 Z" fill="#FFCD00"/>
  <path d="M 200 100 Q 110 110 50 150 Q 90 145 195 115 Z" fill="#FFCD00"/>
  <path d="M 200 100 Q 290 110 350 150 Q 310 145 205 115 Z" fill="#E8A500"/>
  <path d="M 200 100 Q 200 60 200 30 Q 215 70 215 110 Z" fill="#FFE066"/>
  <line x1="195" y1="105" x2="80" y2="100" stroke="#FFE066" stroke-width="2" opacity="0.7"/>
  <line x1="205" y1="105" x2="320" y2="100" stroke="#FFE066" stroke-width="2" opacity="0.7"/>
  <circle cx="195" cy="115" r="9" fill="#B27800"/>
  <circle cx="210" cy="120" r="9" fill="#B27800"/>
</svg>`,
  },
  {
    id: "base/paper-bag",
    name: "paper-bag",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="370" rx="130" ry="12" fill="#B27800" opacity="0.25"/>
  <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#FFCD00"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#E8A500"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
  <rect x="90" y="140" width="220" height="14" fill="#FFE066"/>
  <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#E8A500" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#E8A500" stroke-width="8" fill="none" stroke-linecap="round"/>
  <rect x="130" y="210" width="140" height="80" fill="#FFFFFF" rx="6"/>
  <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="22" text-anchor="middle" fill="#1A1A1A">noon</text>
  <line x1="200" y1="155" x2="205" y2="358" stroke="#E8A500" stroke-width="2" opacity="0.4"/>
</svg>`,
  },
  {
    id: "base/perfume",
    name: "perfume",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="8" fill="#B27800" opacity="0.3"/>
  <rect x="180" y="50" width="40" height="40" fill="#B27800" rx="3"/>
  <rect x="180" y="50" width="40" height="10" fill="#1A1A1A" rx="3"/>
  <rect x="190" y="90" width="20" height="14" fill="#E8A500"/>
  <rect x="170" y="104" width="60" height="22" fill="#E8A500"/>
  <path d="M 130 130 L 270 130 L 280 360 L 120 360 Z" fill="#FFCD00"/>
  <path d="M 230 130 L 270 130 L 280 360 L 240 360 Z" fill="#E8A500"/>
  <rect x="135" y="150" width="14" height="180" fill="#FFF2A8" opacity="0.85"/>
  <rect x="150" y="220" width="100" height="80" fill="#FFFFFF"/>
  <rect x="150" y="220" width="100" height="6" fill="#E8A500"/>
  <rect x="150" y="294" width="100" height="6" fill="#E8A500"/>
  <text x="200" y="265" font-family="Helvetica, Arial, sans-serif" font-weight="700"
        font-size="20" text-anchor="middle" fill="#1A1A1A">SCENT</text>
</svg>`,
  },
  {
    id: "base/pizza-slice",
    name: "pizza-slice",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="345" rx="120" ry="8" fill="#B27800" opacity="0.3"/>
  <path d="M 200 80 L 80 320 L 320 320 Z" fill="#FFCD00"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="#E8A500"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="url(#hatch)" opacity="0.4"/>
  <path d="M 90 305 Q 110 295 130 305 Q 160 295 180 305 Q 210 295 240 305 Q 270 295 290 305 Q 310 295 320 320 L 80 320 Z" fill="#FFE066"/>
  <circle cx="160" cy="240" r="20" fill="#B27800"/>
  <circle cx="155" cy="235" r="18" fill="#E8A500"/>
  <circle cx="240" cy="240" r="20" fill="#B27800"/>
  <circle cx="235" cy="235" r="18" fill="#E8A500"/>
  <circle cx="200" cy="180" r="16" fill="#B27800"/>
  <circle cx="195" cy="175" r="14" fill="#E8A500"/>
  <circle cx="195" cy="290" r="14" fill="#B27800"/>
  <circle cx="190" cy="285" r="12" fill="#E8A500"/>
  <path d="M 200 80 L 130 220 Q 160 215 175 175 Z" fill="#FFF2A8" opacity="0.4"/>
</svg>`,
  },
  {
    id: "base/smartphone",
    name: "smartphone",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="6" fill="#B27800" opacity="0.25"/>
  <rect x="135" y="60" width="135" height="305" rx="22" fill="#E8A500"/>
  <rect x="125" y="55" width="135" height="305" rx="22" fill="#FFCD00"/>
  <rect x="140" y="80" width="105" height="255" rx="6" fill="#B27800"/>
  <polygon points="140,80 245,80 245,110 140,180" fill="#E8A500" opacity="0.6"/>
  <circle cx="192" cy="73" r="4" fill="#1A1A1A"/>
  <rect x="215" y="80" width="35" height="45" rx="8" fill="#B27800"/>
  <circle cx="225" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="225" cy="108" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="108" r="6" fill="#1A1A1A"/>
  <rect x="123" y="130" width="4" height="35" fill="#B27800"/>
  <rect x="125" y="55" width="5" height="305" rx="2" fill="#FFE066" opacity="0.8"/>
</svg>`,
  },
  {
    id: "base/sneaker",
    name: "sneaker",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="320" rx="160" ry="10" fill="#B27800" opacity="0.25"/>
  <path d="M 50 280 L 350 270 Q 360 305 340 310 L 60 310 Q 45 305 50 280 Z" fill="#B27800"/>
  <path d="M 50 270 L 350 260 Q 358 280 340 285 L 60 290 Q 45 285 50 270 Z" fill="#FFFFFF"/>
  <path d="M 90 270 Q 75 220 100 180 Q 130 140 200 145 Q 280 150 320 200 Q 345 230 350 270 Z" fill="#FFCD00"/>
  <path d="M 280 200 Q 320 215 340 250 Q 345 265 320 270 L 270 270 Q 250 250 260 220 Z" fill="#E8A500"/>
  <path d="M 120 200 Q 130 175 160 165 Q 200 160 230 175 Q 240 200 230 240 L 130 245 Z" fill="#FFE066"/>
  <line x1="150" y1="195" x2="220" y2="195" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="145" y1="215" x2="225" y2="210" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="140" y1="235" x2="225" y2="225" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 250 250 Q 230 220 255 200 L 280 200 Q 270 230 290 250 Z" fill="#FFFFFF"/>
  <path d="M 75 245 L 105 245 L 105 270 L 75 270 Z" fill="url(#hatch)" opacity="0.6"/>
</svg>`,
  },
  {
    id: "base/sunglasses",
    name: "sunglasses",
    brand: "base",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="160" ry="8" fill="#B27800" opacity="0.25"/>
  <rect x="180" y="180" width="40" height="14" fill="#E8A500"/>
  <ellipse cx="120" cy="200" rx="80" ry="55" fill="#B27800"/>
  <ellipse cx="120" cy="200" rx="70" ry="46" fill="#E8A500"/>
  <ellipse cx="120" cy="200" rx="62" ry="40" fill="#FFCD00"/>
  <ellipse cx="280" cy="200" rx="80" ry="55" fill="#B27800"/>
  <ellipse cx="280" cy="200" rx="70" ry="46" fill="#E8A500"/>
  <ellipse cx="280" cy="200" rx="62" ry="40" fill="#FFCD00"/>
  <ellipse cx="100" cy="185" rx="20" ry="14" fill="#FFF2A8" opacity="0.85"/>
  <ellipse cx="260" cy="185" rx="20" ry="14" fill="#FFF2A8" opacity="0.85"/>
  <ellipse cx="95" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <ellipse cx="255" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <path d="M 200 200 L 360 175" stroke="#E8A500" stroke-width="10" stroke-linecap="round"/>
  <path d="M 200 200 L 40 175" stroke="#E8A500" stroke-width="10" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: "noon/apple",
    name: "apple",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="345" rx="90" ry="8" fill="#B27800" opacity="0.3"/>
  <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#FFCD00"/>
  <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#E8A500"/>
  <ellipse cx="160" cy="180" rx="22" ry="40" fill="#FFF2A8" opacity="0.85"/>
  <ellipse cx="155" cy="170" rx="10" ry="20" fill="#FFFFFF" opacity="0.9"/>
  <path d="M 200 130 Q 205 105 220 95" stroke="#B27800" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#E8A500"/>
  <path d="M 222 105 Q 245 95 265 108" stroke="#B27800" stroke-width="2" fill="none"/>
</svg>`,
  },
  {
    id: "noon/bottle",
    name: "bottle",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="60" ry="8" fill="#B27800" opacity="0.3"/>
  <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#FFCD00"/>
  <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E8A500"/>
  <rect x="175" y="60" width="50" height="20" fill="#B27800" rx="3"/>
  <rect x="175" y="60" width="50" height="6" fill="#1A1A1A" rx="3"/>
  <rect x="170" y="160" width="8" height="160" fill="#FFF2A8" rx="4" opacity="0.85"/>
  <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  <rect x="160" y="200" width="80" height="14" fill="#E8A500"/>
  <rect x="160" y="266" width="80" height="14" fill="#E8A500"/>
</svg>`,
  },
  {
    id: "noon/bread",
    name: "bread",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="170" ry="10" fill="#B27800" opacity="0.25"/>
  <path d="M 50 240 Q 50 180 110 180 L 290 180 Q 350 180 350 240 Q 350 290 290 290 L 110 290 Q 50 290 50 240 Z" fill="#FFCD00"/>
  <path d="M 50 250 Q 50 290 110 290 L 290 290 Q 350 290 350 250 Q 320 285 200 285 Q 80 285 50 250 Z" fill="#E8A500"/>
  <path d="M 80 200 Q 130 188 200 188 Q 270 188 320 200 Q 270 195 200 195 Q 130 195 80 200 Z" fill="#FFE066"/>
  <path d="M 90 220 Q 100 240 90 260" stroke="#B27800" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 150 215 Q 160 240 150 265" stroke="#B27800" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 210 215 Q 220 240 210 265" stroke="#B27800" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 270 215 Q 280 240 270 265" stroke="#B27800" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 320 220 Q 330 240 320 260" stroke="#B27800" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="60" cy="240" rx="10" ry="35" fill="#FFF2A8" opacity="0.7"/>
</svg>`,
  },
  {
    id: "noon/building",
    name: "building",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="378" rx="180" ry="8" fill="#B27800" opacity="0.2"/>
  <rect x="280" y="80" width="60" height="290" fill="#E8A500"/>
  <rect x="280" y="80" width="60" height="290" fill="url(#hatch)" opacity="0.5"/>
  <rect x="80" y="80" width="200" height="290" fill="#FFCD00"/>
  <rect x="80" y="80" width="260" height="20" fill="#FFE066"/>
  <rect x="80" y="170" width="260" height="8" fill="#E8A500"/>
  <rect x="80" y="250" width="260" height="8" fill="#E8A500"/>
  <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  <polygon points="100,115 130,115 100,135" fill="#FFF2A8"/>
  <polygon points="160,115 190,115 160,135" fill="#FFF2A8"/>
  <polygon points="220,115 250,115 220,135" fill="#FFF2A8"/>
  <rect x="95" y="190" width="170" height="50" fill="#FFE066"/>
  <rect x="95" y="190" width="170" height="6" fill="#E8A500"/>
  <line x1="115" y1="200" x2="115" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="145" y1="200" x2="145" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="175" y1="200" x2="175" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="205" y1="200" x2="205" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="235" y1="200" x2="235" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <rect x="100" y="280" width="80" height="80" fill="#FFFFFF"/>
  <rect x="100" y="280" width="80" height="14" fill="#E8A500"/>
  <rect x="200" y="280" width="60" height="90" fill="#E8A500"/>
  <rect x="208" y="290" width="20" height="80" fill="#B27800"/>
  <rect x="232" y="290" width="20" height="80" fill="#B27800"/>
  <circle cx="120" cy="290" r="3" fill="#FFF2A8"/>
  <circle cx="140" cy="290" r="3" fill="#FFF2A8"/>
  <circle cx="160" cy="290" r="3" fill="#FFF2A8"/>
</svg>`,
  },
  {
    id: "noon/cupcake",
    name: "cupcake",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="100" ry="8" fill="#B27800" opacity="0.3"/>
  <path d="M 110 230 L 290 230 L 270 360 L 130 360 Z" fill="#E8A500"/>
  <line x1="135" y1="240" x2="142" y2="355" stroke="#B27800" stroke-width="3"/>
  <line x1="170" y1="240" x2="172" y2="355" stroke="#B27800" stroke-width="3"/>
  <line x1="200" y1="240" x2="200" y2="358" stroke="#B27800" stroke-width="3"/>
  <line x1="230" y1="240" x2="228" y2="355" stroke="#B27800" stroke-width="3"/>
  <line x1="265" y1="240" x2="258" y2="355" stroke="#B27800" stroke-width="3"/>
  <rect x="105" y="220" width="190" height="20" fill="#B27800"/>
  <path d="M 120 230 Q 150 130 200 130 Q 250 130 280 230 Z" fill="#FFCD00"/>
  <path d="M 140 200 Q 165 150 200 150 Q 235 150 260 200 Q 240 215 200 215 Q 160 215 140 200 Z" fill="#FFE066"/>
  <path d="M 165 175 Q 180 145 200 145 Q 220 145 235 175 Q 220 188 200 188 Q 180 188 165 175 Z" fill="#FFF2A8"/>
  <circle cx="200" cy="135" r="14" fill="#B27800"/>
  <circle cx="195" cy="130" r="14" fill="#E8A500"/>
  <ellipse cx="190" cy="125" rx="4" ry="6" fill="#FFFFFF"/>
  <path d="M 200 122 Q 215 100 230 95" stroke="#B27800" stroke-width="3" fill="none"/>
</svg>`,
  },
  {
    id: "noon/donut",
    name: "donut",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="120" ry="14" fill="#B27800" opacity="0.25"/>
  <circle cx="200" cy="220" r="120" fill="#E8A500"/>
  <circle cx="200" cy="210" r="120" fill="#FFCD00"/>
  <path d="M 80 210 Q 80 250 110 250 Q 130 250 140 230 L 140 210 Z" fill="#FFE066"/>
  <path d="M 320 210 Q 320 240 290 240 Q 270 240 260 220 L 260 210 Z" fill="#FFE066"/>
  <path d="M 140 110 Q 200 90 260 110 L 260 130 Q 230 120 200 120 Q 170 120 140 130 Z" fill="#FFE066"/>
  <circle cx="200" cy="210" r="35" fill="#B27800"/>
  <circle cx="200" cy="205" r="35" fill="#E8A500"/>
  <rect x="155" y="145" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(20 158 152)"/>
  <rect x="245" y="155" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-30 248 162)"/>
  <rect x="170" y="265" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(45 173 272)"/>
  <rect x="240" y="255" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-15 243 262)"/>
  <rect x="125" y="200" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(70 128 207)"/>
  <rect x="270" y="195" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(60 273 202)"/>
</svg>`,
  },
  {
    id: "noon/headphones",
    name: "headphones",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="360" rx="140" ry="12" fill="#B27800" opacity="0.25"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#E8A500" stroke-width="22" stroke-linecap="round"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#FFCD00" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="95" cy="240" rx="65" ry="80" fill="#E8A500"/>
  <ellipse cx="95" cy="235" rx="55" ry="70" fill="#FFCD00"/>
  <ellipse cx="95" cy="235" rx="35" ry="50" fill="#B27800"/>
  <ellipse cx="80" cy="215" rx="10" ry="20" fill="#FFE066" opacity="0.7"/>
  <ellipse cx="305" cy="240" rx="65" ry="80" fill="#E8A500"/>
  <ellipse cx="305" cy="235" rx="55" ry="70" fill="#FFCD00"/>
  <ellipse cx="305" cy="235" rx="35" ry="50" fill="#B27800"/>
  <ellipse cx="290" cy="215" rx="10" ry="20" fill="#FFE066" opacity="0.7"/>
  <circle cx="95" cy="235" r="12" fill="#FFFFFF"/>
  <circle cx="305" cy="235" r="12" fill="#FFFFFF"/>
</svg>`,
  },
  {
    id: "noon/hero-composition",
    name: "hero-composition",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 540" width="600" height="540"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="300" cy="500" rx="280" ry="20" fill="#B27800" opacity="0.2"/>
  <!-- Background back item: bottle (peeking behind on right) -->
  <g transform="translate(350,80) scale(0.5)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#FFCD00"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E8A500"/>
    <rect x="175" y="60" width="50" height="20" fill="#B27800" rx="3"/>
    <rect x="160" y="200" width="80" height="60" fill="#FFFFFF"/>
  </g>
  <!-- Background back item: building (peeking behind on far left) -->
  <g transform="translate(-30,150) scale(0.45)">
    <rect x="80" y="80" width="200" height="290" fill="#E8A500"/>
    <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  </g>
  <!-- HERO: paper bag center -->
  <g transform="translate(120,120)">
    <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#FFCD00"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#E8A500"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
    <rect x="90" y="140" width="220" height="14" fill="#FFE066"/>
    <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#E8A500" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#E8A500" stroke-width="8" fill="none" stroke-linecap="round"/>
    <rect x="130" y="210" width="140" height="80" fill="#FFFFFF" rx="6"/>
    <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
          font-size="22" text-anchor="middle" fill="#1A1A1A">noon</text>
  </g>
  <!-- Front-left item: apple/produce -->
  <g transform="translate(-20,330) scale(0.5)">
    <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#FFCD00"/>
    <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#E8A500"/>
    <ellipse cx="160" cy="180" rx="22" ry="40" fill="#FFF2A8" opacity="0.85"/>
    <path d="M 200 130 Q 205 105 220 95" stroke="#B27800" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#E8A500"/>
  </g>
  <!-- Front-right item: bottle small -->
  <g transform="translate(440,300) scale(0.45)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#FFCD00"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E8A500"/>
    <rect x="175" y="60" width="50" height="20" fill="#B27800" rx="3"/>
    <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  </g>
</svg>`,
  },
  {
    id: "noon/package-box",
    name: "package-box",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="360" rx="140" ry="14" fill="#B27800" opacity="0.25"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="#E8A500"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="url(#hatch)" opacity="0.55"/>
  <polygon points="80,110 200,60 320,110 200,160" fill="#FFE066"/>
  <polygon points="80,110 320,110 320,360 80,360" fill="#FFCD00"/>
  <rect x="80" y="220" width="240" height="22" fill="#E8A500"/>
  <rect x="80" y="220" width="240" height="3" fill="#FFE066"/>
  <rect x="130" y="135" width="140" height="70" fill="#FFFFFF" rx="4"/>
  <text x="200" y="180" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="30" text-anchor="middle" fill="#1A1A1A">noon</text>
  <polygon points="80,110 200,60 320,110 200,160" fill="#FFF2A8" opacity="0.35"/>
</svg>`,
  },
  {
    id: "noon/palm-tree",
    name: "palm-tree",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="378" rx="60" ry="6" fill="#B27800" opacity="0.25"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#E8A500" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#FFCD00" stroke-width="12" fill="none" stroke-linecap="round"/>
  <line x1="180" y1="320" x2="200" y2="320" stroke="#B27800" stroke-width="3"/>
  <line x1="183" y1="270" x2="200" y2="270" stroke="#B27800" stroke-width="3"/>
  <line x1="190" y1="220" x2="205" y2="220" stroke="#B27800" stroke-width="3"/>
  <line x1="195" y1="170" x2="208" y2="170" stroke="#B27800" stroke-width="3"/>
  <path d="M 200 100 Q 130 80 70 100 Q 100 110 200 110 Z" fill="#E8A500"/>
  <path d="M 200 100 Q 270 80 330 100 Q 300 110 200 110 Z" fill="#FFCD00"/>
  <path d="M 200 100 Q 110 110 50 150 Q 90 145 195 115 Z" fill="#FFCD00"/>
  <path d="M 200 100 Q 290 110 350 150 Q 310 145 205 115 Z" fill="#E8A500"/>
  <path d="M 200 100 Q 200 60 200 30 Q 215 70 215 110 Z" fill="#FFE066"/>
  <line x1="195" y1="105" x2="80" y2="100" stroke="#FFE066" stroke-width="2" opacity="0.7"/>
  <line x1="205" y1="105" x2="320" y2="100" stroke="#FFE066" stroke-width="2" opacity="0.7"/>
  <circle cx="195" cy="115" r="9" fill="#B27800"/>
  <circle cx="210" cy="120" r="9" fill="#B27800"/>
</svg>`,
  },
  {
    id: "noon/paper-bag",
    name: "paper-bag",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="370" rx="130" ry="12" fill="#B27800" opacity="0.25"/>
  <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#FFCD00"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#E8A500"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
  <rect x="90" y="140" width="220" height="14" fill="#FFE066"/>
  <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#E8A500" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#E8A500" stroke-width="8" fill="none" stroke-linecap="round"/>
  <rect x="130" y="210" width="140" height="80" fill="#FFFFFF" rx="6"/>
  <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="22" text-anchor="middle" fill="#1A1A1A">noon</text>
  <line x1="200" y1="155" x2="205" y2="358" stroke="#E8A500" stroke-width="2" opacity="0.4"/>
</svg>`,
  },
  {
    id: "noon/perfume",
    name: "perfume",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="8" fill="#B27800" opacity="0.3"/>
  <rect x="180" y="50" width="40" height="40" fill="#B27800" rx="3"/>
  <rect x="180" y="50" width="40" height="10" fill="#1A1A1A" rx="3"/>
  <rect x="190" y="90" width="20" height="14" fill="#E8A500"/>
  <rect x="170" y="104" width="60" height="22" fill="#E8A500"/>
  <path d="M 130 130 L 270 130 L 280 360 L 120 360 Z" fill="#FFCD00"/>
  <path d="M 230 130 L 270 130 L 280 360 L 240 360 Z" fill="#E8A500"/>
  <rect x="135" y="150" width="14" height="180" fill="#FFF2A8" opacity="0.85"/>
  <rect x="150" y="220" width="100" height="80" fill="#FFFFFF"/>
  <rect x="150" y="220" width="100" height="6" fill="#E8A500"/>
  <rect x="150" y="294" width="100" height="6" fill="#E8A500"/>
  <text x="200" y="265" font-family="Helvetica, Arial, sans-serif" font-weight="700"
        font-size="20" text-anchor="middle" fill="#1A1A1A">SCENT</text>
</svg>`,
  },
  {
    id: "noon/pizza-slice",
    name: "pizza-slice",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="345" rx="120" ry="8" fill="#B27800" opacity="0.3"/>
  <path d="M 200 80 L 80 320 L 320 320 Z" fill="#FFCD00"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="#E8A500"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="url(#hatch)" opacity="0.4"/>
  <path d="M 90 305 Q 110 295 130 305 Q 160 295 180 305 Q 210 295 240 305 Q 270 295 290 305 Q 310 295 320 320 L 80 320 Z" fill="#FFE066"/>
  <circle cx="160" cy="240" r="20" fill="#B27800"/>
  <circle cx="155" cy="235" r="18" fill="#E8A500"/>
  <circle cx="240" cy="240" r="20" fill="#B27800"/>
  <circle cx="235" cy="235" r="18" fill="#E8A500"/>
  <circle cx="200" cy="180" r="16" fill="#B27800"/>
  <circle cx="195" cy="175" r="14" fill="#E8A500"/>
  <circle cx="195" cy="290" r="14" fill="#B27800"/>
  <circle cx="190" cy="285" r="12" fill="#E8A500"/>
  <path d="M 200 80 L 130 220 Q 160 215 175 175 Z" fill="#FFF2A8" opacity="0.4"/>
</svg>`,
  },
  {
    id: "noon/smartphone",
    name: "smartphone",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="6" fill="#B27800" opacity="0.25"/>
  <rect x="135" y="60" width="135" height="305" rx="22" fill="#E8A500"/>
  <rect x="125" y="55" width="135" height="305" rx="22" fill="#FFCD00"/>
  <rect x="140" y="80" width="105" height="255" rx="6" fill="#B27800"/>
  <polygon points="140,80 245,80 245,110 140,180" fill="#E8A500" opacity="0.6"/>
  <circle cx="192" cy="73" r="4" fill="#1A1A1A"/>
  <rect x="215" y="80" width="35" height="45" rx="8" fill="#B27800"/>
  <circle cx="225" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="225" cy="108" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="108" r="6" fill="#1A1A1A"/>
  <rect x="123" y="130" width="4" height="35" fill="#B27800"/>
  <rect x="125" y="55" width="5" height="305" rx="2" fill="#FFE066" opacity="0.8"/>
</svg>`,
  },
  {
    id: "noon/sneaker",
    name: "sneaker",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B27800" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="320" rx="160" ry="10" fill="#B27800" opacity="0.25"/>
  <path d="M 50 280 L 350 270 Q 360 305 340 310 L 60 310 Q 45 305 50 280 Z" fill="#B27800"/>
  <path d="M 50 270 L 350 260 Q 358 280 340 285 L 60 290 Q 45 285 50 270 Z" fill="#FFFFFF"/>
  <path d="M 90 270 Q 75 220 100 180 Q 130 140 200 145 Q 280 150 320 200 Q 345 230 350 270 Z" fill="#FFCD00"/>
  <path d="M 280 200 Q 320 215 340 250 Q 345 265 320 270 L 270 270 Q 250 250 260 220 Z" fill="#E8A500"/>
  <path d="M 120 200 Q 130 175 160 165 Q 200 160 230 175 Q 240 200 230 240 L 130 245 Z" fill="#FFE066"/>
  <line x1="150" y1="195" x2="220" y2="195" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="145" y1="215" x2="225" y2="210" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="140" y1="235" x2="225" y2="225" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 250 250 Q 230 220 255 200 L 280 200 Q 270 230 290 250 Z" fill="#FFFFFF"/>
  <path d="M 75 245 L 105 245 L 105 270 L 75 270 Z" fill="url(#hatch)" opacity="0.6"/>
</svg>`,
  },
  {
    id: "noon/sunglasses",
    name: "sunglasses",
    brand: "noon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="160" ry="8" fill="#B27800" opacity="0.25"/>
  <rect x="180" y="180" width="40" height="14" fill="#E8A500"/>
  <ellipse cx="120" cy="200" rx="80" ry="55" fill="#B27800"/>
  <ellipse cx="120" cy="200" rx="70" ry="46" fill="#E8A500"/>
  <ellipse cx="120" cy="200" rx="62" ry="40" fill="#FFCD00"/>
  <ellipse cx="280" cy="200" rx="80" ry="55" fill="#B27800"/>
  <ellipse cx="280" cy="200" rx="70" ry="46" fill="#E8A500"/>
  <ellipse cx="280" cy="200" rx="62" ry="40" fill="#FFCD00"/>
  <ellipse cx="100" cy="185" rx="20" ry="14" fill="#FFF2A8" opacity="0.85"/>
  <ellipse cx="260" cy="185" rx="20" ry="14" fill="#FFF2A8" opacity="0.85"/>
  <ellipse cx="95" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <ellipse cx="255" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <path d="M 200 200 L 360 175" stroke="#E8A500" stroke-width="10" stroke-linecap="round"/>
  <path d="M 200 200 L 40 175" stroke="#E8A500" stroke-width="10" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: "noon-food/apple",
    name: "apple",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="345" rx="90" ry="8" fill="#B71F4F" opacity="0.3"/>
  <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#F47CA0"/>
  <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#E94679"/>
  <ellipse cx="160" cy="180" rx="22" ry="40" fill="#FFE5EE" opacity="0.85"/>
  <ellipse cx="155" cy="170" rx="10" ry="20" fill="#FFFFFF" opacity="0.9"/>
  <path d="M 200 130 Q 205 105 220 95" stroke="#B71F4F" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#E94679"/>
  <path d="M 222 105 Q 245 95 265 108" stroke="#B71F4F" stroke-width="2" fill="none"/>
</svg>`,
  },
  {
    id: "noon-food/bottle",
    name: "bottle",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="60" ry="8" fill="#B71F4F" opacity="0.3"/>
  <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#F47CA0"/>
  <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E94679"/>
  <rect x="175" y="60" width="50" height="20" fill="#B71F4F" rx="3"/>
  <rect x="175" y="60" width="50" height="6" fill="#1A1A1A" rx="3"/>
  <rect x="170" y="160" width="8" height="160" fill="#FFE5EE" rx="4" opacity="0.85"/>
  <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  <rect x="160" y="200" width="80" height="14" fill="#E94679"/>
  <rect x="160" y="266" width="80" height="14" fill="#E94679"/>
</svg>`,
  },
  {
    id: "noon-food/bread",
    name: "bread",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="170" ry="10" fill="#B71F4F" opacity="0.25"/>
  <path d="M 50 240 Q 50 180 110 180 L 290 180 Q 350 180 350 240 Q 350 290 290 290 L 110 290 Q 50 290 50 240 Z" fill="#F47CA0"/>
  <path d="M 50 250 Q 50 290 110 290 L 290 290 Q 350 290 350 250 Q 320 285 200 285 Q 80 285 50 250 Z" fill="#E94679"/>
  <path d="M 80 200 Q 130 188 200 188 Q 270 188 320 200 Q 270 195 200 195 Q 130 195 80 200 Z" fill="#FFB3C9"/>
  <path d="M 90 220 Q 100 240 90 260" stroke="#B71F4F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 150 215 Q 160 240 150 265" stroke="#B71F4F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 210 215 Q 220 240 210 265" stroke="#B71F4F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 270 215 Q 280 240 270 265" stroke="#B71F4F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 320 220 Q 330 240 320 260" stroke="#B71F4F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="60" cy="240" rx="10" ry="35" fill="#FFE5EE" opacity="0.7"/>
</svg>`,
  },
  {
    id: "noon-food/building",
    name: "building",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B71F4F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="378" rx="180" ry="8" fill="#B71F4F" opacity="0.2"/>
  <rect x="280" y="80" width="60" height="290" fill="#E94679"/>
  <rect x="280" y="80" width="60" height="290" fill="url(#hatch)" opacity="0.5"/>
  <rect x="80" y="80" width="200" height="290" fill="#F47CA0"/>
  <rect x="80" y="80" width="260" height="20" fill="#FFB3C9"/>
  <rect x="80" y="170" width="260" height="8" fill="#E94679"/>
  <rect x="80" y="250" width="260" height="8" fill="#E94679"/>
  <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  <polygon points="100,115 130,115 100,135" fill="#FFE5EE"/>
  <polygon points="160,115 190,115 160,135" fill="#FFE5EE"/>
  <polygon points="220,115 250,115 220,135" fill="#FFE5EE"/>
  <rect x="95" y="190" width="170" height="50" fill="#FFB3C9"/>
  <rect x="95" y="190" width="170" height="6" fill="#E94679"/>
  <line x1="115" y1="200" x2="115" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="145" y1="200" x2="145" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="175" y1="200" x2="175" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="205" y1="200" x2="205" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="235" y1="200" x2="235" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <rect x="100" y="280" width="80" height="80" fill="#FFFFFF"/>
  <rect x="100" y="280" width="80" height="14" fill="#E94679"/>
  <rect x="200" y="280" width="60" height="90" fill="#E94679"/>
  <rect x="208" y="290" width="20" height="80" fill="#B71F4F"/>
  <rect x="232" y="290" width="20" height="80" fill="#B71F4F"/>
  <circle cx="120" cy="290" r="3" fill="#FFE5EE"/>
  <circle cx="140" cy="290" r="3" fill="#FFE5EE"/>
  <circle cx="160" cy="290" r="3" fill="#FFE5EE"/>
</svg>`,
  },
  {
    id: "noon-food/cupcake",
    name: "cupcake",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="100" ry="8" fill="#B71F4F" opacity="0.3"/>
  <path d="M 110 230 L 290 230 L 270 360 L 130 360 Z" fill="#E94679"/>
  <line x1="135" y1="240" x2="142" y2="355" stroke="#B71F4F" stroke-width="3"/>
  <line x1="170" y1="240" x2="172" y2="355" stroke="#B71F4F" stroke-width="3"/>
  <line x1="200" y1="240" x2="200" y2="358" stroke="#B71F4F" stroke-width="3"/>
  <line x1="230" y1="240" x2="228" y2="355" stroke="#B71F4F" stroke-width="3"/>
  <line x1="265" y1="240" x2="258" y2="355" stroke="#B71F4F" stroke-width="3"/>
  <rect x="105" y="220" width="190" height="20" fill="#B71F4F"/>
  <path d="M 120 230 Q 150 130 200 130 Q 250 130 280 230 Z" fill="#F47CA0"/>
  <path d="M 140 200 Q 165 150 200 150 Q 235 150 260 200 Q 240 215 200 215 Q 160 215 140 200 Z" fill="#FFB3C9"/>
  <path d="M 165 175 Q 180 145 200 145 Q 220 145 235 175 Q 220 188 200 188 Q 180 188 165 175 Z" fill="#FFE5EE"/>
  <circle cx="200" cy="135" r="14" fill="#B71F4F"/>
  <circle cx="195" cy="130" r="14" fill="#E94679"/>
  <ellipse cx="190" cy="125" rx="4" ry="6" fill="#FFFFFF"/>
  <path d="M 200 122 Q 215 100 230 95" stroke="#B71F4F" stroke-width="3" fill="none"/>
</svg>`,
  },
  {
    id: "noon-food/donut",
    name: "donut",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="120" ry="14" fill="#B71F4F" opacity="0.25"/>
  <circle cx="200" cy="220" r="120" fill="#E94679"/>
  <circle cx="200" cy="210" r="120" fill="#F47CA0"/>
  <path d="M 80 210 Q 80 250 110 250 Q 130 250 140 230 L 140 210 Z" fill="#FFB3C9"/>
  <path d="M 320 210 Q 320 240 290 240 Q 270 240 260 220 L 260 210 Z" fill="#FFB3C9"/>
  <path d="M 140 110 Q 200 90 260 110 L 260 130 Q 230 120 200 120 Q 170 120 140 130 Z" fill="#FFB3C9"/>
  <circle cx="200" cy="210" r="35" fill="#B71F4F"/>
  <circle cx="200" cy="205" r="35" fill="#E94679"/>
  <rect x="155" y="145" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(20 158 152)"/>
  <rect x="245" y="155" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-30 248 162)"/>
  <rect x="170" y="265" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(45 173 272)"/>
  <rect x="240" y="255" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-15 243 262)"/>
  <rect x="125" y="200" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(70 128 207)"/>
  <rect x="270" y="195" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(60 273 202)"/>
</svg>`,
  },
  {
    id: "noon-food/headphones",
    name: "headphones",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="360" rx="140" ry="12" fill="#B71F4F" opacity="0.25"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#E94679" stroke-width="22" stroke-linecap="round"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#F47CA0" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="95" cy="240" rx="65" ry="80" fill="#E94679"/>
  <ellipse cx="95" cy="235" rx="55" ry="70" fill="#F47CA0"/>
  <ellipse cx="95" cy="235" rx="35" ry="50" fill="#B71F4F"/>
  <ellipse cx="80" cy="215" rx="10" ry="20" fill="#FFB3C9" opacity="0.7"/>
  <ellipse cx="305" cy="240" rx="65" ry="80" fill="#E94679"/>
  <ellipse cx="305" cy="235" rx="55" ry="70" fill="#F47CA0"/>
  <ellipse cx="305" cy="235" rx="35" ry="50" fill="#B71F4F"/>
  <ellipse cx="290" cy="215" rx="10" ry="20" fill="#FFB3C9" opacity="0.7"/>
  <circle cx="95" cy="235" r="12" fill="#FFFFFF"/>
  <circle cx="305" cy="235" r="12" fill="#FFFFFF"/>
</svg>`,
  },
  {
    id: "noon-food/hero-composition",
    name: "hero-composition",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 540" width="600" height="540"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B71F4F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="300" cy="500" rx="280" ry="20" fill="#B71F4F" opacity="0.2"/>
  <!-- Background back item: bottle (peeking behind on right) -->
  <g transform="translate(350,80) scale(0.5)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#F47CA0"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E94679"/>
    <rect x="175" y="60" width="50" height="20" fill="#B71F4F" rx="3"/>
    <rect x="160" y="200" width="80" height="60" fill="#FFFFFF"/>
  </g>
  <!-- Background back item: building (peeking behind on far left) -->
  <g transform="translate(-30,150) scale(0.45)">
    <rect x="80" y="80" width="200" height="290" fill="#E94679"/>
    <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  </g>
  <!-- HERO: paper bag center -->
  <g transform="translate(120,120)">
    <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#F47CA0"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#E94679"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
    <rect x="90" y="140" width="220" height="14" fill="#FFB3C9"/>
    <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#E94679" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#E94679" stroke-width="8" fill="none" stroke-linecap="round"/>
    <rect x="130" y="210" width="140" height="80" fill="#FFFFFF" rx="6"/>
    <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
          font-size="22" text-anchor="middle" fill="#1A1A1A">noon</text>
  </g>
  <!-- Front-left item: apple/produce -->
  <g transform="translate(-20,330) scale(0.5)">
    <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#F47CA0"/>
    <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#E94679"/>
    <ellipse cx="160" cy="180" rx="22" ry="40" fill="#FFE5EE" opacity="0.85"/>
    <path d="M 200 130 Q 205 105 220 95" stroke="#B71F4F" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#E94679"/>
  </g>
  <!-- Front-right item: bottle small -->
  <g transform="translate(440,300) scale(0.45)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#F47CA0"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E94679"/>
    <rect x="175" y="60" width="50" height="20" fill="#B71F4F" rx="3"/>
    <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  </g>
</svg>`,
  },
  {
    id: "noon-food/package-box",
    name: "package-box",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B71F4F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="360" rx="140" ry="14" fill="#B71F4F" opacity="0.25"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="#E94679"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="url(#hatch)" opacity="0.55"/>
  <polygon points="80,110 200,60 320,110 200,160" fill="#FFB3C9"/>
  <polygon points="80,110 320,110 320,360 80,360" fill="#F47CA0"/>
  <rect x="80" y="220" width="240" height="22" fill="#E94679"/>
  <rect x="80" y="220" width="240" height="3" fill="#FFB3C9"/>
  <rect x="130" y="135" width="140" height="70" fill="#FFFFFF" rx="4"/>
  <text x="200" y="180" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="30" text-anchor="middle" fill="#1A1A1A">noon</text>
  <polygon points="80,110 200,60 320,110 200,160" fill="#FFE5EE" opacity="0.35"/>
</svg>`,
  },
  {
    id: "noon-food/palm-tree",
    name: "palm-tree",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="378" rx="60" ry="6" fill="#B71F4F" opacity="0.25"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#E94679" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#F47CA0" stroke-width="12" fill="none" stroke-linecap="round"/>
  <line x1="180" y1="320" x2="200" y2="320" stroke="#B71F4F" stroke-width="3"/>
  <line x1="183" y1="270" x2="200" y2="270" stroke="#B71F4F" stroke-width="3"/>
  <line x1="190" y1="220" x2="205" y2="220" stroke="#B71F4F" stroke-width="3"/>
  <line x1="195" y1="170" x2="208" y2="170" stroke="#B71F4F" stroke-width="3"/>
  <path d="M 200 100 Q 130 80 70 100 Q 100 110 200 110 Z" fill="#E94679"/>
  <path d="M 200 100 Q 270 80 330 100 Q 300 110 200 110 Z" fill="#F47CA0"/>
  <path d="M 200 100 Q 110 110 50 150 Q 90 145 195 115 Z" fill="#F47CA0"/>
  <path d="M 200 100 Q 290 110 350 150 Q 310 145 205 115 Z" fill="#E94679"/>
  <path d="M 200 100 Q 200 60 200 30 Q 215 70 215 110 Z" fill="#FFB3C9"/>
  <line x1="195" y1="105" x2="80" y2="100" stroke="#FFB3C9" stroke-width="2" opacity="0.7"/>
  <line x1="205" y1="105" x2="320" y2="100" stroke="#FFB3C9" stroke-width="2" opacity="0.7"/>
  <circle cx="195" cy="115" r="9" fill="#B71F4F"/>
  <circle cx="210" cy="120" r="9" fill="#B71F4F"/>
</svg>`,
  },
  {
    id: "noon-food/paper-bag",
    name: "paper-bag",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B71F4F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="370" rx="130" ry="12" fill="#B71F4F" opacity="0.25"/>
  <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#F47CA0"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#E94679"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
  <rect x="90" y="140" width="220" height="14" fill="#FFB3C9"/>
  <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#E94679" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#E94679" stroke-width="8" fill="none" stroke-linecap="round"/>
  <rect x="130" y="210" width="140" height="80" fill="#FFFFFF" rx="6"/>
  <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="22" text-anchor="middle" fill="#1A1A1A">noon</text>
  <line x1="200" y1="155" x2="205" y2="358" stroke="#E94679" stroke-width="2" opacity="0.4"/>
</svg>`,
  },
  {
    id: "noon-food/perfume",
    name: "perfume",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="8" fill="#B71F4F" opacity="0.3"/>
  <rect x="180" y="50" width="40" height="40" fill="#B71F4F" rx="3"/>
  <rect x="180" y="50" width="40" height="10" fill="#1A1A1A" rx="3"/>
  <rect x="190" y="90" width="20" height="14" fill="#E94679"/>
  <rect x="170" y="104" width="60" height="22" fill="#E94679"/>
  <path d="M 130 130 L 270 130 L 280 360 L 120 360 Z" fill="#F47CA0"/>
  <path d="M 230 130 L 270 130 L 280 360 L 240 360 Z" fill="#E94679"/>
  <rect x="135" y="150" width="14" height="180" fill="#FFE5EE" opacity="0.85"/>
  <rect x="150" y="220" width="100" height="80" fill="#FFFFFF"/>
  <rect x="150" y="220" width="100" height="6" fill="#E94679"/>
  <rect x="150" y="294" width="100" height="6" fill="#E94679"/>
  <text x="200" y="265" font-family="Helvetica, Arial, sans-serif" font-weight="700"
        font-size="20" text-anchor="middle" fill="#1A1A1A">SCENT</text>
</svg>`,
  },
  {
    id: "noon-food/pizza-slice",
    name: "pizza-slice",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B71F4F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="345" rx="120" ry="8" fill="#B71F4F" opacity="0.3"/>
  <path d="M 200 80 L 80 320 L 320 320 Z" fill="#F47CA0"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="#E94679"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="url(#hatch)" opacity="0.4"/>
  <path d="M 90 305 Q 110 295 130 305 Q 160 295 180 305 Q 210 295 240 305 Q 270 295 290 305 Q 310 295 320 320 L 80 320 Z" fill="#FFB3C9"/>
  <circle cx="160" cy="240" r="20" fill="#B71F4F"/>
  <circle cx="155" cy="235" r="18" fill="#E94679"/>
  <circle cx="240" cy="240" r="20" fill="#B71F4F"/>
  <circle cx="235" cy="235" r="18" fill="#E94679"/>
  <circle cx="200" cy="180" r="16" fill="#B71F4F"/>
  <circle cx="195" cy="175" r="14" fill="#E94679"/>
  <circle cx="195" cy="290" r="14" fill="#B71F4F"/>
  <circle cx="190" cy="285" r="12" fill="#E94679"/>
  <path d="M 200 80 L 130 220 Q 160 215 175 175 Z" fill="#FFE5EE" opacity="0.4"/>
</svg>`,
  },
  {
    id: "noon-food/smartphone",
    name: "smartphone",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="6" fill="#B71F4F" opacity="0.25"/>
  <rect x="135" y="60" width="135" height="305" rx="22" fill="#E94679"/>
  <rect x="125" y="55" width="135" height="305" rx="22" fill="#F47CA0"/>
  <rect x="140" y="80" width="105" height="255" rx="6" fill="#B71F4F"/>
  <polygon points="140,80 245,80 245,110 140,180" fill="#E94679" opacity="0.6"/>
  <circle cx="192" cy="73" r="4" fill="#1A1A1A"/>
  <rect x="215" y="80" width="35" height="45" rx="8" fill="#B71F4F"/>
  <circle cx="225" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="225" cy="108" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="108" r="6" fill="#1A1A1A"/>
  <rect x="123" y="130" width="4" height="35" fill="#B71F4F"/>
  <rect x="125" y="55" width="5" height="305" rx="2" fill="#FFB3C9" opacity="0.8"/>
</svg>`,
  },
  {
    id: "noon-food/sneaker",
    name: "sneaker",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#B71F4F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="320" rx="160" ry="10" fill="#B71F4F" opacity="0.25"/>
  <path d="M 50 280 L 350 270 Q 360 305 340 310 L 60 310 Q 45 305 50 280 Z" fill="#B71F4F"/>
  <path d="M 50 270 L 350 260 Q 358 280 340 285 L 60 290 Q 45 285 50 270 Z" fill="#FFFFFF"/>
  <path d="M 90 270 Q 75 220 100 180 Q 130 140 200 145 Q 280 150 320 200 Q 345 230 350 270 Z" fill="#F47CA0"/>
  <path d="M 280 200 Q 320 215 340 250 Q 345 265 320 270 L 270 270 Q 250 250 260 220 Z" fill="#E94679"/>
  <path d="M 120 200 Q 130 175 160 165 Q 200 160 230 175 Q 240 200 230 240 L 130 245 Z" fill="#FFB3C9"/>
  <line x1="150" y1="195" x2="220" y2="195" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="145" y1="215" x2="225" y2="210" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="140" y1="235" x2="225" y2="225" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 250 250 Q 230 220 255 200 L 280 200 Q 270 230 290 250 Z" fill="#FFFFFF"/>
  <path d="M 75 245 L 105 245 L 105 270 L 75 270 Z" fill="url(#hatch)" opacity="0.6"/>
</svg>`,
  },
  {
    id: "noon-food/sunglasses",
    name: "sunglasses",
    brand: "noon-food",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="160" ry="8" fill="#B71F4F" opacity="0.25"/>
  <rect x="180" y="180" width="40" height="14" fill="#E94679"/>
  <ellipse cx="120" cy="200" rx="80" ry="55" fill="#B71F4F"/>
  <ellipse cx="120" cy="200" rx="70" ry="46" fill="#E94679"/>
  <ellipse cx="120" cy="200" rx="62" ry="40" fill="#F47CA0"/>
  <ellipse cx="280" cy="200" rx="80" ry="55" fill="#B71F4F"/>
  <ellipse cx="280" cy="200" rx="70" ry="46" fill="#E94679"/>
  <ellipse cx="280" cy="200" rx="62" ry="40" fill="#F47CA0"/>
  <ellipse cx="100" cy="185" rx="20" ry="14" fill="#FFE5EE" opacity="0.85"/>
  <ellipse cx="260" cy="185" rx="20" ry="14" fill="#FFE5EE" opacity="0.85"/>
  <ellipse cx="95" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <ellipse cx="255" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <path d="M 200 200 L 360 175" stroke="#E94679" stroke-width="10" stroke-linecap="round"/>
  <path d="M 200 200 L 40 175" stroke="#E94679" stroke-width="10" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: "minutes/apple",
    name: "apple",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="345" rx="90" ry="8" fill="#8B2A1F" opacity="0.3"/>
  <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#F47C5A"/>
  <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#D54B33"/>
  <ellipse cx="160" cy="180" rx="22" ry="40" fill="#FFD4B8" opacity="0.85"/>
  <ellipse cx="155" cy="170" rx="10" ry="20" fill="#FFFFFF" opacity="0.9"/>
  <path d="M 200 130 Q 205 105 220 95" stroke="#8B2A1F" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#D54B33"/>
  <path d="M 222 105 Q 245 95 265 108" stroke="#8B2A1F" stroke-width="2" fill="none"/>
</svg>`,
  },
  {
    id: "minutes/bottle",
    name: "bottle",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="60" ry="8" fill="#8B2A1F" opacity="0.3"/>
  <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#F47C5A"/>
  <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#D54B33"/>
  <rect x="175" y="60" width="50" height="20" fill="#8B2A1F" rx="3"/>
  <rect x="175" y="60" width="50" height="6" fill="#1A1A1A" rx="3"/>
  <rect x="170" y="160" width="8" height="160" fill="#FFD4B8" rx="4" opacity="0.85"/>
  <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  <rect x="160" y="200" width="80" height="14" fill="#D54B33"/>
  <rect x="160" y="266" width="80" height="14" fill="#D54B33"/>
</svg>`,
  },
  {
    id: "minutes/bread",
    name: "bread",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="170" ry="10" fill="#8B2A1F" opacity="0.25"/>
  <path d="M 50 240 Q 50 180 110 180 L 290 180 Q 350 180 350 240 Q 350 290 290 290 L 110 290 Q 50 290 50 240 Z" fill="#F47C5A"/>
  <path d="M 50 250 Q 50 290 110 290 L 290 290 Q 350 290 350 250 Q 320 285 200 285 Q 80 285 50 250 Z" fill="#D54B33"/>
  <path d="M 80 200 Q 130 188 200 188 Q 270 188 320 200 Q 270 195 200 195 Q 130 195 80 200 Z" fill="#FFB088"/>
  <path d="M 90 220 Q 100 240 90 260" stroke="#8B2A1F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 150 215 Q 160 240 150 265" stroke="#8B2A1F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 210 215 Q 220 240 210 265" stroke="#8B2A1F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 270 215 Q 280 240 270 265" stroke="#8B2A1F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 320 220 Q 330 240 320 260" stroke="#8B2A1F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="60" cy="240" rx="10" ry="35" fill="#FFD4B8" opacity="0.7"/>
</svg>`,
  },
  {
    id: "minutes/building",
    name: "building",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8B2A1F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="378" rx="180" ry="8" fill="#8B2A1F" opacity="0.2"/>
  <rect x="280" y="80" width="60" height="290" fill="#D54B33"/>
  <rect x="280" y="80" width="60" height="290" fill="url(#hatch)" opacity="0.5"/>
  <rect x="80" y="80" width="200" height="290" fill="#F47C5A"/>
  <rect x="80" y="80" width="260" height="20" fill="#FFB088"/>
  <rect x="80" y="170" width="260" height="8" fill="#D54B33"/>
  <rect x="80" y="250" width="260" height="8" fill="#D54B33"/>
  <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  <polygon points="100,115 130,115 100,135" fill="#FFD4B8"/>
  <polygon points="160,115 190,115 160,135" fill="#FFD4B8"/>
  <polygon points="220,115 250,115 220,135" fill="#FFD4B8"/>
  <rect x="95" y="190" width="170" height="50" fill="#FFB088"/>
  <rect x="95" y="190" width="170" height="6" fill="#D54B33"/>
  <line x1="115" y1="200" x2="115" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="145" y1="200" x2="145" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="175" y1="200" x2="175" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="205" y1="200" x2="205" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="235" y1="200" x2="235" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <rect x="100" y="280" width="80" height="80" fill="#FFFFFF"/>
  <rect x="100" y="280" width="80" height="14" fill="#D54B33"/>
  <rect x="200" y="280" width="60" height="90" fill="#D54B33"/>
  <rect x="208" y="290" width="20" height="80" fill="#8B2A1F"/>
  <rect x="232" y="290" width="20" height="80" fill="#8B2A1F"/>
  <circle cx="120" cy="290" r="3" fill="#FFD4B8"/>
  <circle cx="140" cy="290" r="3" fill="#FFD4B8"/>
  <circle cx="160" cy="290" r="3" fill="#FFD4B8"/>
</svg>`,
  },
  {
    id: "minutes/cupcake",
    name: "cupcake",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="100" ry="8" fill="#8B2A1F" opacity="0.3"/>
  <path d="M 110 230 L 290 230 L 270 360 L 130 360 Z" fill="#D54B33"/>
  <line x1="135" y1="240" x2="142" y2="355" stroke="#8B2A1F" stroke-width="3"/>
  <line x1="170" y1="240" x2="172" y2="355" stroke="#8B2A1F" stroke-width="3"/>
  <line x1="200" y1="240" x2="200" y2="358" stroke="#8B2A1F" stroke-width="3"/>
  <line x1="230" y1="240" x2="228" y2="355" stroke="#8B2A1F" stroke-width="3"/>
  <line x1="265" y1="240" x2="258" y2="355" stroke="#8B2A1F" stroke-width="3"/>
  <rect x="105" y="220" width="190" height="20" fill="#8B2A1F"/>
  <path d="M 120 230 Q 150 130 200 130 Q 250 130 280 230 Z" fill="#F47C5A"/>
  <path d="M 140 200 Q 165 150 200 150 Q 235 150 260 200 Q 240 215 200 215 Q 160 215 140 200 Z" fill="#FFB088"/>
  <path d="M 165 175 Q 180 145 200 145 Q 220 145 235 175 Q 220 188 200 188 Q 180 188 165 175 Z" fill="#FFD4B8"/>
  <circle cx="200" cy="135" r="14" fill="#8B2A1F"/>
  <circle cx="195" cy="130" r="14" fill="#D54B33"/>
  <ellipse cx="190" cy="125" rx="4" ry="6" fill="#FFFFFF"/>
  <path d="M 200 122 Q 215 100 230 95" stroke="#8B2A1F" stroke-width="3" fill="none"/>
</svg>`,
  },
  {
    id: "minutes/donut",
    name: "donut",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="120" ry="14" fill="#8B2A1F" opacity="0.25"/>
  <circle cx="200" cy="220" r="120" fill="#D54B33"/>
  <circle cx="200" cy="210" r="120" fill="#F47C5A"/>
  <path d="M 80 210 Q 80 250 110 250 Q 130 250 140 230 L 140 210 Z" fill="#FFB088"/>
  <path d="M 320 210 Q 320 240 290 240 Q 270 240 260 220 L 260 210 Z" fill="#FFB088"/>
  <path d="M 140 110 Q 200 90 260 110 L 260 130 Q 230 120 200 120 Q 170 120 140 130 Z" fill="#FFB088"/>
  <circle cx="200" cy="210" r="35" fill="#8B2A1F"/>
  <circle cx="200" cy="205" r="35" fill="#D54B33"/>
  <rect x="155" y="145" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(20 158 152)"/>
  <rect x="245" y="155" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-30 248 162)"/>
  <rect x="170" y="265" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(45 173 272)"/>
  <rect x="240" y="255" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-15 243 262)"/>
  <rect x="125" y="200" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(70 128 207)"/>
  <rect x="270" y="195" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(60 273 202)"/>
</svg>`,
  },
  {
    id: "minutes/headphones",
    name: "headphones",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="360" rx="140" ry="12" fill="#8B2A1F" opacity="0.25"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#D54B33" stroke-width="22" stroke-linecap="round"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#F47C5A" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="95" cy="240" rx="65" ry="80" fill="#D54B33"/>
  <ellipse cx="95" cy="235" rx="55" ry="70" fill="#F47C5A"/>
  <ellipse cx="95" cy="235" rx="35" ry="50" fill="#8B2A1F"/>
  <ellipse cx="80" cy="215" rx="10" ry="20" fill="#FFB088" opacity="0.7"/>
  <ellipse cx="305" cy="240" rx="65" ry="80" fill="#D54B33"/>
  <ellipse cx="305" cy="235" rx="55" ry="70" fill="#F47C5A"/>
  <ellipse cx="305" cy="235" rx="35" ry="50" fill="#8B2A1F"/>
  <ellipse cx="290" cy="215" rx="10" ry="20" fill="#FFB088" opacity="0.7"/>
  <circle cx="95" cy="235" r="12" fill="#FFFFFF"/>
  <circle cx="305" cy="235" r="12" fill="#FFFFFF"/>
</svg>`,
  },
  {
    id: "minutes/hero-composition",
    name: "hero-composition",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 540" width="600" height="540"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8B2A1F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="300" cy="500" rx="280" ry="20" fill="#8B2A1F" opacity="0.2"/>
  <!-- Background back item: bottle (peeking behind on right) -->
  <g transform="translate(350,80) scale(0.5)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#F47C5A"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#D54B33"/>
    <rect x="175" y="60" width="50" height="20" fill="#8B2A1F" rx="3"/>
    <rect x="160" y="200" width="80" height="60" fill="#FFFFFF"/>
  </g>
  <!-- Background back item: building (peeking behind on far left) -->
  <g transform="translate(-30,150) scale(0.45)">
    <rect x="80" y="80" width="200" height="290" fill="#D54B33"/>
    <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  </g>
  <!-- HERO: paper bag center -->
  <g transform="translate(120,120)">
    <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#F47C5A"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#D54B33"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
    <rect x="90" y="140" width="220" height="14" fill="#FFB088"/>
    <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#D54B33" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#D54B33" stroke-width="8" fill="none" stroke-linecap="round"/>
    <rect x="130" y="210" width="140" height="80" fill="#E63223" rx="6"/>
    <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
          font-size="22" text-anchor="middle" fill="#FFFFFF">MINUTES</text>
  </g>
  <!-- Front-left item: apple/produce -->
  <g transform="translate(-20,330) scale(0.5)">
    <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#F47C5A"/>
    <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#D54B33"/>
    <ellipse cx="160" cy="180" rx="22" ry="40" fill="#FFD4B8" opacity="0.85"/>
    <path d="M 200 130 Q 205 105 220 95" stroke="#8B2A1F" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#D54B33"/>
  </g>
  <!-- Front-right item: bottle small -->
  <g transform="translate(440,300) scale(0.45)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#F47C5A"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#D54B33"/>
    <rect x="175" y="60" width="50" height="20" fill="#8B2A1F" rx="3"/>
    <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  </g>
</svg>`,
  },
  {
    id: "minutes/package-box",
    name: "package-box",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8B2A1F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="360" rx="140" ry="14" fill="#8B2A1F" opacity="0.25"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="#D54B33"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="url(#hatch)" opacity="0.55"/>
  <polygon points="80,110 200,60 320,110 200,160" fill="#FFB088"/>
  <polygon points="80,110 320,110 320,360 80,360" fill="#F47C5A"/>
  <rect x="80" y="220" width="240" height="22" fill="#D54B33"/>
  <rect x="80" y="220" width="240" height="3" fill="#FFB088"/>
  <rect x="130" y="135" width="140" height="70" fill="#E63223" rx="4"/>
  <text x="200" y="180" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="30" text-anchor="middle" fill="#FFFFFF">MINUTES</text>
  <polygon points="80,110 200,60 320,110 200,160" fill="#FFD4B8" opacity="0.35"/>
</svg>`,
  },
  {
    id: "minutes/palm-tree",
    name: "palm-tree",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="378" rx="60" ry="6" fill="#8B2A1F" opacity="0.25"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#D54B33" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#F47C5A" stroke-width="12" fill="none" stroke-linecap="round"/>
  <line x1="180" y1="320" x2="200" y2="320" stroke="#8B2A1F" stroke-width="3"/>
  <line x1="183" y1="270" x2="200" y2="270" stroke="#8B2A1F" stroke-width="3"/>
  <line x1="190" y1="220" x2="205" y2="220" stroke="#8B2A1F" stroke-width="3"/>
  <line x1="195" y1="170" x2="208" y2="170" stroke="#8B2A1F" stroke-width="3"/>
  <path d="M 200 100 Q 130 80 70 100 Q 100 110 200 110 Z" fill="#D54B33"/>
  <path d="M 200 100 Q 270 80 330 100 Q 300 110 200 110 Z" fill="#F47C5A"/>
  <path d="M 200 100 Q 110 110 50 150 Q 90 145 195 115 Z" fill="#F47C5A"/>
  <path d="M 200 100 Q 290 110 350 150 Q 310 145 205 115 Z" fill="#D54B33"/>
  <path d="M 200 100 Q 200 60 200 30 Q 215 70 215 110 Z" fill="#FFB088"/>
  <line x1="195" y1="105" x2="80" y2="100" stroke="#FFB088" stroke-width="2" opacity="0.7"/>
  <line x1="205" y1="105" x2="320" y2="100" stroke="#FFB088" stroke-width="2" opacity="0.7"/>
  <circle cx="195" cy="115" r="9" fill="#8B2A1F"/>
  <circle cx="210" cy="120" r="9" fill="#8B2A1F"/>
</svg>`,
  },
  {
    id: "minutes/paper-bag",
    name: "paper-bag",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8B2A1F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="370" rx="130" ry="12" fill="#8B2A1F" opacity="0.25"/>
  <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#F47C5A"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#D54B33"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
  <rect x="90" y="140" width="220" height="14" fill="#FFB088"/>
  <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#D54B33" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#D54B33" stroke-width="8" fill="none" stroke-linecap="round"/>
  <rect x="130" y="210" width="140" height="80" fill="#E63223" rx="6"/>
  <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="22" text-anchor="middle" fill="#FFFFFF">MINUTES</text>
  <line x1="200" y1="155" x2="205" y2="358" stroke="#D54B33" stroke-width="2" opacity="0.4"/>
</svg>`,
  },
  {
    id: "minutes/perfume",
    name: "perfume",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="8" fill="#8B2A1F" opacity="0.3"/>
  <rect x="180" y="50" width="40" height="40" fill="#8B2A1F" rx="3"/>
  <rect x="180" y="50" width="40" height="10" fill="#1A1A1A" rx="3"/>
  <rect x="190" y="90" width="20" height="14" fill="#D54B33"/>
  <rect x="170" y="104" width="60" height="22" fill="#D54B33"/>
  <path d="M 130 130 L 270 130 L 280 360 L 120 360 Z" fill="#F47C5A"/>
  <path d="M 230 130 L 270 130 L 280 360 L 240 360 Z" fill="#D54B33"/>
  <rect x="135" y="150" width="14" height="180" fill="#FFD4B8" opacity="0.85"/>
  <rect x="150" y="220" width="100" height="80" fill="#FFFFFF"/>
  <rect x="150" y="220" width="100" height="6" fill="#D54B33"/>
  <rect x="150" y="294" width="100" height="6" fill="#D54B33"/>
  <text x="200" y="265" font-family="Helvetica, Arial, sans-serif" font-weight="700"
        font-size="20" text-anchor="middle" fill="#1A1A1A">SCENT</text>
</svg>`,
  },
  {
    id: "minutes/pizza-slice",
    name: "pizza-slice",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8B2A1F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="345" rx="120" ry="8" fill="#8B2A1F" opacity="0.3"/>
  <path d="M 200 80 L 80 320 L 320 320 Z" fill="#F47C5A"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="#D54B33"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="url(#hatch)" opacity="0.4"/>
  <path d="M 90 305 Q 110 295 130 305 Q 160 295 180 305 Q 210 295 240 305 Q 270 295 290 305 Q 310 295 320 320 L 80 320 Z" fill="#FFB088"/>
  <circle cx="160" cy="240" r="20" fill="#8B2A1F"/>
  <circle cx="155" cy="235" r="18" fill="#D54B33"/>
  <circle cx="240" cy="240" r="20" fill="#8B2A1F"/>
  <circle cx="235" cy="235" r="18" fill="#D54B33"/>
  <circle cx="200" cy="180" r="16" fill="#8B2A1F"/>
  <circle cx="195" cy="175" r="14" fill="#D54B33"/>
  <circle cx="195" cy="290" r="14" fill="#8B2A1F"/>
  <circle cx="190" cy="285" r="12" fill="#D54B33"/>
  <path d="M 200 80 L 130 220 Q 160 215 175 175 Z" fill="#FFD4B8" opacity="0.4"/>
</svg>`,
  },
  {
    id: "minutes/smartphone",
    name: "smartphone",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="6" fill="#8B2A1F" opacity="0.25"/>
  <rect x="135" y="60" width="135" height="305" rx="22" fill="#D54B33"/>
  <rect x="125" y="55" width="135" height="305" rx="22" fill="#F47C5A"/>
  <rect x="140" y="80" width="105" height="255" rx="6" fill="#8B2A1F"/>
  <polygon points="140,80 245,80 245,110 140,180" fill="#D54B33" opacity="0.6"/>
  <circle cx="192" cy="73" r="4" fill="#1A1A1A"/>
  <rect x="215" y="80" width="35" height="45" rx="8" fill="#8B2A1F"/>
  <circle cx="225" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="225" cy="108" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="108" r="6" fill="#1A1A1A"/>
  <rect x="123" y="130" width="4" height="35" fill="#8B2A1F"/>
  <rect x="125" y="55" width="5" height="305" rx="2" fill="#FFB088" opacity="0.8"/>
</svg>`,
  },
  {
    id: "minutes/sneaker",
    name: "sneaker",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8B2A1F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="320" rx="160" ry="10" fill="#8B2A1F" opacity="0.25"/>
  <path d="M 50 280 L 350 270 Q 360 305 340 310 L 60 310 Q 45 305 50 280 Z" fill="#8B2A1F"/>
  <path d="M 50 270 L 350 260 Q 358 280 340 285 L 60 290 Q 45 285 50 270 Z" fill="#FFFFFF"/>
  <path d="M 90 270 Q 75 220 100 180 Q 130 140 200 145 Q 280 150 320 200 Q 345 230 350 270 Z" fill="#F47C5A"/>
  <path d="M 280 200 Q 320 215 340 250 Q 345 265 320 270 L 270 270 Q 250 250 260 220 Z" fill="#D54B33"/>
  <path d="M 120 200 Q 130 175 160 165 Q 200 160 230 175 Q 240 200 230 240 L 130 245 Z" fill="#FFB088"/>
  <line x1="150" y1="195" x2="220" y2="195" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="145" y1="215" x2="225" y2="210" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="140" y1="235" x2="225" y2="225" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 250 250 Q 230 220 255 200 L 280 200 Q 270 230 290 250 Z" fill="#FFFFFF"/>
  <path d="M 75 245 L 105 245 L 105 270 L 75 270 Z" fill="url(#hatch)" opacity="0.6"/>
</svg>`,
  },
  {
    id: "minutes/sunglasses",
    name: "sunglasses",
    brand: "minutes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="160" ry="8" fill="#8B2A1F" opacity="0.25"/>
  <rect x="180" y="180" width="40" height="14" fill="#D54B33"/>
  <ellipse cx="120" cy="200" rx="80" ry="55" fill="#8B2A1F"/>
  <ellipse cx="120" cy="200" rx="70" ry="46" fill="#D54B33"/>
  <ellipse cx="120" cy="200" rx="62" ry="40" fill="#F47C5A"/>
  <ellipse cx="280" cy="200" rx="80" ry="55" fill="#8B2A1F"/>
  <ellipse cx="280" cy="200" rx="70" ry="46" fill="#D54B33"/>
  <ellipse cx="280" cy="200" rx="62" ry="40" fill="#F47C5A"/>
  <ellipse cx="100" cy="185" rx="20" ry="14" fill="#FFD4B8" opacity="0.85"/>
  <ellipse cx="260" cy="185" rx="20" ry="14" fill="#FFD4B8" opacity="0.85"/>
  <ellipse cx="95" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <ellipse cx="255" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <path d="M 200 200 L 360 175" stroke="#D54B33" stroke-width="10" stroke-linecap="round"/>
  <path d="M 200 200 L 40 175" stroke="#D54B33" stroke-width="10" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: "nownow/apple",
    name: "apple",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="345" rx="90" ry="8" fill="#8C3D0F" opacity="0.3"/>
  <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#FF8533"/>
  <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#E0651A"/>
  <ellipse cx="160" cy="180" rx="22" ry="40" fill="#FFE0B5" opacity="0.85"/>
  <ellipse cx="155" cy="170" rx="10" ry="20" fill="#FFFFFF" opacity="0.9"/>
  <path d="M 200 130 Q 205 105 220 95" stroke="#8C3D0F" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#E0651A"/>
  <path d="M 222 105 Q 245 95 265 108" stroke="#8C3D0F" stroke-width="2" fill="none"/>
</svg>`,
  },
  {
    id: "nownow/bottle",
    name: "bottle",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="60" ry="8" fill="#8C3D0F" opacity="0.3"/>
  <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#FF8533"/>
  <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E0651A"/>
  <rect x="175" y="60" width="50" height="20" fill="#8C3D0F" rx="3"/>
  <rect x="175" y="60" width="50" height="6" fill="#1A1A1A" rx="3"/>
  <rect x="170" y="160" width="8" height="160" fill="#FFE0B5" rx="4" opacity="0.85"/>
  <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  <rect x="160" y="200" width="80" height="14" fill="#E0651A"/>
  <rect x="160" y="266" width="80" height="14" fill="#E0651A"/>
</svg>`,
  },
  {
    id: "nownow/bread",
    name: "bread",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="170" ry="10" fill="#8C3D0F" opacity="0.25"/>
  <path d="M 50 240 Q 50 180 110 180 L 290 180 Q 350 180 350 240 Q 350 290 290 290 L 110 290 Q 50 290 50 240 Z" fill="#FF8533"/>
  <path d="M 50 250 Q 50 290 110 290 L 290 290 Q 350 290 350 250 Q 320 285 200 285 Q 80 285 50 250 Z" fill="#E0651A"/>
  <path d="M 80 200 Q 130 188 200 188 Q 270 188 320 200 Q 270 195 200 195 Q 130 195 80 200 Z" fill="#FFB870"/>
  <path d="M 90 220 Q 100 240 90 260" stroke="#8C3D0F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 150 215 Q 160 240 150 265" stroke="#8C3D0F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 210 215 Q 220 240 210 265" stroke="#8C3D0F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 270 215 Q 280 240 270 265" stroke="#8C3D0F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 320 220 Q 330 240 320 260" stroke="#8C3D0F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="60" cy="240" rx="10" ry="35" fill="#FFE0B5" opacity="0.7"/>
</svg>`,
  },
  {
    id: "nownow/building",
    name: "building",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8C3D0F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="378" rx="180" ry="8" fill="#8C3D0F" opacity="0.2"/>
  <rect x="280" y="80" width="60" height="290" fill="#E0651A"/>
  <rect x="280" y="80" width="60" height="290" fill="url(#hatch)" opacity="0.5"/>
  <rect x="80" y="80" width="200" height="290" fill="#FF8533"/>
  <rect x="80" y="80" width="260" height="20" fill="#FFB870"/>
  <rect x="80" y="170" width="260" height="8" fill="#E0651A"/>
  <rect x="80" y="250" width="260" height="8" fill="#E0651A"/>
  <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  <polygon points="100,115 130,115 100,135" fill="#FFE0B5"/>
  <polygon points="160,115 190,115 160,135" fill="#FFE0B5"/>
  <polygon points="220,115 250,115 220,135" fill="#FFE0B5"/>
  <rect x="95" y="190" width="170" height="50" fill="#FFB870"/>
  <rect x="95" y="190" width="170" height="6" fill="#E0651A"/>
  <line x1="115" y1="200" x2="115" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="145" y1="200" x2="145" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="175" y1="200" x2="175" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="205" y1="200" x2="205" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="235" y1="200" x2="235" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <rect x="100" y="280" width="80" height="80" fill="#FFFFFF"/>
  <rect x="100" y="280" width="80" height="14" fill="#E0651A"/>
  <rect x="200" y="280" width="60" height="90" fill="#E0651A"/>
  <rect x="208" y="290" width="20" height="80" fill="#8C3D0F"/>
  <rect x="232" y="290" width="20" height="80" fill="#8C3D0F"/>
  <circle cx="120" cy="290" r="3" fill="#FFE0B5"/>
  <circle cx="140" cy="290" r="3" fill="#FFE0B5"/>
  <circle cx="160" cy="290" r="3" fill="#FFE0B5"/>
</svg>`,
  },
  {
    id: "nownow/cupcake",
    name: "cupcake",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="100" ry="8" fill="#8C3D0F" opacity="0.3"/>
  <path d="M 110 230 L 290 230 L 270 360 L 130 360 Z" fill="#E0651A"/>
  <line x1="135" y1="240" x2="142" y2="355" stroke="#8C3D0F" stroke-width="3"/>
  <line x1="170" y1="240" x2="172" y2="355" stroke="#8C3D0F" stroke-width="3"/>
  <line x1="200" y1="240" x2="200" y2="358" stroke="#8C3D0F" stroke-width="3"/>
  <line x1="230" y1="240" x2="228" y2="355" stroke="#8C3D0F" stroke-width="3"/>
  <line x1="265" y1="240" x2="258" y2="355" stroke="#8C3D0F" stroke-width="3"/>
  <rect x="105" y="220" width="190" height="20" fill="#8C3D0F"/>
  <path d="M 120 230 Q 150 130 200 130 Q 250 130 280 230 Z" fill="#FF8533"/>
  <path d="M 140 200 Q 165 150 200 150 Q 235 150 260 200 Q 240 215 200 215 Q 160 215 140 200 Z" fill="#FFB870"/>
  <path d="M 165 175 Q 180 145 200 145 Q 220 145 235 175 Q 220 188 200 188 Q 180 188 165 175 Z" fill="#FFE0B5"/>
  <circle cx="200" cy="135" r="14" fill="#8C3D0F"/>
  <circle cx="195" cy="130" r="14" fill="#E0651A"/>
  <ellipse cx="190" cy="125" rx="4" ry="6" fill="#FFFFFF"/>
  <path d="M 200 122 Q 215 100 230 95" stroke="#8C3D0F" stroke-width="3" fill="none"/>
</svg>`,
  },
  {
    id: "nownow/donut",
    name: "donut",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="120" ry="14" fill="#8C3D0F" opacity="0.25"/>
  <circle cx="200" cy="220" r="120" fill="#E0651A"/>
  <circle cx="200" cy="210" r="120" fill="#FF8533"/>
  <path d="M 80 210 Q 80 250 110 250 Q 130 250 140 230 L 140 210 Z" fill="#FFB870"/>
  <path d="M 320 210 Q 320 240 290 240 Q 270 240 260 220 L 260 210 Z" fill="#FFB870"/>
  <path d="M 140 110 Q 200 90 260 110 L 260 130 Q 230 120 200 120 Q 170 120 140 130 Z" fill="#FFB870"/>
  <circle cx="200" cy="210" r="35" fill="#8C3D0F"/>
  <circle cx="200" cy="205" r="35" fill="#E0651A"/>
  <rect x="155" y="145" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(20 158 152)"/>
  <rect x="245" y="155" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-30 248 162)"/>
  <rect x="170" y="265" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(45 173 272)"/>
  <rect x="240" y="255" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-15 243 262)"/>
  <rect x="125" y="200" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(70 128 207)"/>
  <rect x="270" y="195" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(60 273 202)"/>
</svg>`,
  },
  {
    id: "nownow/headphones",
    name: "headphones",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="360" rx="140" ry="12" fill="#8C3D0F" opacity="0.25"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#E0651A" stroke-width="22" stroke-linecap="round"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#FF8533" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="95" cy="240" rx="65" ry="80" fill="#E0651A"/>
  <ellipse cx="95" cy="235" rx="55" ry="70" fill="#FF8533"/>
  <ellipse cx="95" cy="235" rx="35" ry="50" fill="#8C3D0F"/>
  <ellipse cx="80" cy="215" rx="10" ry="20" fill="#FFB870" opacity="0.7"/>
  <ellipse cx="305" cy="240" rx="65" ry="80" fill="#E0651A"/>
  <ellipse cx="305" cy="235" rx="55" ry="70" fill="#FF8533"/>
  <ellipse cx="305" cy="235" rx="35" ry="50" fill="#8C3D0F"/>
  <ellipse cx="290" cy="215" rx="10" ry="20" fill="#FFB870" opacity="0.7"/>
  <circle cx="95" cy="235" r="12" fill="#FFFFFF"/>
  <circle cx="305" cy="235" r="12" fill="#FFFFFF"/>
</svg>`,
  },
  {
    id: "nownow/hero-composition",
    name: "hero-composition",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 540" width="600" height="540"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8C3D0F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="300" cy="500" rx="280" ry="20" fill="#8C3D0F" opacity="0.2"/>
  <!-- Background back item: bottle (peeking behind on right) -->
  <g transform="translate(350,80) scale(0.5)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#FF8533"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E0651A"/>
    <rect x="175" y="60" width="50" height="20" fill="#8C3D0F" rx="3"/>
    <rect x="160" y="200" width="80" height="60" fill="#FFFFFF"/>
  </g>
  <!-- Background back item: building (peeking behind on far left) -->
  <g transform="translate(-30,150) scale(0.45)">
    <rect x="80" y="80" width="200" height="290" fill="#E0651A"/>
    <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  </g>
  <!-- HERO: paper bag center -->
  <g transform="translate(120,120)">
    <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#FF8533"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#E0651A"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
    <rect x="90" y="140" width="220" height="14" fill="#FFB870"/>
    <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#E0651A" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#E0651A" stroke-width="8" fill="none" stroke-linecap="round"/>
    <rect x="130" y="210" width="140" height="80" fill="#1A1A1A" rx="6"/>
    <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
          font-size="22" text-anchor="middle" fill="#FFFFFF">nowNow</text>
  </g>
  <!-- Front-left item: apple/produce -->
  <g transform="translate(-20,330) scale(0.5)">
    <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#FF8533"/>
    <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#E0651A"/>
    <ellipse cx="160" cy="180" rx="22" ry="40" fill="#FFE0B5" opacity="0.85"/>
    <path d="M 200 130 Q 205 105 220 95" stroke="#8C3D0F" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#E0651A"/>
  </g>
  <!-- Front-right item: bottle small -->
  <g transform="translate(440,300) scale(0.45)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#FF8533"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#E0651A"/>
    <rect x="175" y="60" width="50" height="20" fill="#8C3D0F" rx="3"/>
    <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  </g>
</svg>`,
  },
  {
    id: "nownow/package-box",
    name: "package-box",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8C3D0F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="360" rx="140" ry="14" fill="#8C3D0F" opacity="0.25"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="#E0651A"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="url(#hatch)" opacity="0.55"/>
  <polygon points="80,110 200,60 320,110 200,160" fill="#FFB870"/>
  <polygon points="80,110 320,110 320,360 80,360" fill="#FF8533"/>
  <rect x="80" y="220" width="240" height="22" fill="#E0651A"/>
  <rect x="80" y="220" width="240" height="3" fill="#FFB870"/>
  <rect x="130" y="135" width="140" height="70" fill="#1A1A1A" rx="4"/>
  <text x="200" y="180" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="30" text-anchor="middle" fill="#FFFFFF">nowNow</text>
  <polygon points="80,110 200,60 320,110 200,160" fill="#FFE0B5" opacity="0.35"/>
</svg>`,
  },
  {
    id: "nownow/palm-tree",
    name: "palm-tree",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="378" rx="60" ry="6" fill="#8C3D0F" opacity="0.25"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#E0651A" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#FF8533" stroke-width="12" fill="none" stroke-linecap="round"/>
  <line x1="180" y1="320" x2="200" y2="320" stroke="#8C3D0F" stroke-width="3"/>
  <line x1="183" y1="270" x2="200" y2="270" stroke="#8C3D0F" stroke-width="3"/>
  <line x1="190" y1="220" x2="205" y2="220" stroke="#8C3D0F" stroke-width="3"/>
  <line x1="195" y1="170" x2="208" y2="170" stroke="#8C3D0F" stroke-width="3"/>
  <path d="M 200 100 Q 130 80 70 100 Q 100 110 200 110 Z" fill="#E0651A"/>
  <path d="M 200 100 Q 270 80 330 100 Q 300 110 200 110 Z" fill="#FF8533"/>
  <path d="M 200 100 Q 110 110 50 150 Q 90 145 195 115 Z" fill="#FF8533"/>
  <path d="M 200 100 Q 290 110 350 150 Q 310 145 205 115 Z" fill="#E0651A"/>
  <path d="M 200 100 Q 200 60 200 30 Q 215 70 215 110 Z" fill="#FFB870"/>
  <line x1="195" y1="105" x2="80" y2="100" stroke="#FFB870" stroke-width="2" opacity="0.7"/>
  <line x1="205" y1="105" x2="320" y2="100" stroke="#FFB870" stroke-width="2" opacity="0.7"/>
  <circle cx="195" cy="115" r="9" fill="#8C3D0F"/>
  <circle cx="210" cy="120" r="9" fill="#8C3D0F"/>
</svg>`,
  },
  {
    id: "nownow/paper-bag",
    name: "paper-bag",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8C3D0F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="370" rx="130" ry="12" fill="#8C3D0F" opacity="0.25"/>
  <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#FF8533"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#E0651A"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
  <rect x="90" y="140" width="220" height="14" fill="#FFB870"/>
  <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#E0651A" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#E0651A" stroke-width="8" fill="none" stroke-linecap="round"/>
  <rect x="130" y="210" width="140" height="80" fill="#1A1A1A" rx="6"/>
  <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="22" text-anchor="middle" fill="#FFFFFF">nowNow</text>
  <line x1="200" y1="155" x2="205" y2="358" stroke="#E0651A" stroke-width="2" opacity="0.4"/>
</svg>`,
  },
  {
    id: "nownow/perfume",
    name: "perfume",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="8" fill="#8C3D0F" opacity="0.3"/>
  <rect x="180" y="50" width="40" height="40" fill="#8C3D0F" rx="3"/>
  <rect x="180" y="50" width="40" height="10" fill="#1A1A1A" rx="3"/>
  <rect x="190" y="90" width="20" height="14" fill="#E0651A"/>
  <rect x="170" y="104" width="60" height="22" fill="#E0651A"/>
  <path d="M 130 130 L 270 130 L 280 360 L 120 360 Z" fill="#FF8533"/>
  <path d="M 230 130 L 270 130 L 280 360 L 240 360 Z" fill="#E0651A"/>
  <rect x="135" y="150" width="14" height="180" fill="#FFE0B5" opacity="0.85"/>
  <rect x="150" y="220" width="100" height="80" fill="#FFFFFF"/>
  <rect x="150" y="220" width="100" height="6" fill="#E0651A"/>
  <rect x="150" y="294" width="100" height="6" fill="#E0651A"/>
  <text x="200" y="265" font-family="Helvetica, Arial, sans-serif" font-weight="700"
        font-size="20" text-anchor="middle" fill="#1A1A1A">SCENT</text>
</svg>`,
  },
  {
    id: "nownow/pizza-slice",
    name: "pizza-slice",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8C3D0F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="345" rx="120" ry="8" fill="#8C3D0F" opacity="0.3"/>
  <path d="M 200 80 L 80 320 L 320 320 Z" fill="#FF8533"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="#E0651A"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="url(#hatch)" opacity="0.4"/>
  <path d="M 90 305 Q 110 295 130 305 Q 160 295 180 305 Q 210 295 240 305 Q 270 295 290 305 Q 310 295 320 320 L 80 320 Z" fill="#FFB870"/>
  <circle cx="160" cy="240" r="20" fill="#8C3D0F"/>
  <circle cx="155" cy="235" r="18" fill="#E0651A"/>
  <circle cx="240" cy="240" r="20" fill="#8C3D0F"/>
  <circle cx="235" cy="235" r="18" fill="#E0651A"/>
  <circle cx="200" cy="180" r="16" fill="#8C3D0F"/>
  <circle cx="195" cy="175" r="14" fill="#E0651A"/>
  <circle cx="195" cy="290" r="14" fill="#8C3D0F"/>
  <circle cx="190" cy="285" r="12" fill="#E0651A"/>
  <path d="M 200 80 L 130 220 Q 160 215 175 175 Z" fill="#FFE0B5" opacity="0.4"/>
</svg>`,
  },
  {
    id: "nownow/smartphone",
    name: "smartphone",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="6" fill="#8C3D0F" opacity="0.25"/>
  <rect x="135" y="60" width="135" height="305" rx="22" fill="#E0651A"/>
  <rect x="125" y="55" width="135" height="305" rx="22" fill="#FF8533"/>
  <rect x="140" y="80" width="105" height="255" rx="6" fill="#8C3D0F"/>
  <polygon points="140,80 245,80 245,110 140,180" fill="#E0651A" opacity="0.6"/>
  <circle cx="192" cy="73" r="4" fill="#1A1A1A"/>
  <rect x="215" y="80" width="35" height="45" rx="8" fill="#8C3D0F"/>
  <circle cx="225" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="225" cy="108" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="108" r="6" fill="#1A1A1A"/>
  <rect x="123" y="130" width="4" height="35" fill="#8C3D0F"/>
  <rect x="125" y="55" width="5" height="305" rx="2" fill="#FFB870" opacity="0.8"/>
</svg>`,
  },
  {
    id: "nownow/sneaker",
    name: "sneaker",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#8C3D0F" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="320" rx="160" ry="10" fill="#8C3D0F" opacity="0.25"/>
  <path d="M 50 280 L 350 270 Q 360 305 340 310 L 60 310 Q 45 305 50 280 Z" fill="#8C3D0F"/>
  <path d="M 50 270 L 350 260 Q 358 280 340 285 L 60 290 Q 45 285 50 270 Z" fill="#FFFFFF"/>
  <path d="M 90 270 Q 75 220 100 180 Q 130 140 200 145 Q 280 150 320 200 Q 345 230 350 270 Z" fill="#FF8533"/>
  <path d="M 280 200 Q 320 215 340 250 Q 345 265 320 270 L 270 270 Q 250 250 260 220 Z" fill="#E0651A"/>
  <path d="M 120 200 Q 130 175 160 165 Q 200 160 230 175 Q 240 200 230 240 L 130 245 Z" fill="#FFB870"/>
  <line x1="150" y1="195" x2="220" y2="195" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="145" y1="215" x2="225" y2="210" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="140" y1="235" x2="225" y2="225" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 250 250 Q 230 220 255 200 L 280 200 Q 270 230 290 250 Z" fill="#FFFFFF"/>
  <path d="M 75 245 L 105 245 L 105 270 L 75 270 Z" fill="url(#hatch)" opacity="0.6"/>
</svg>`,
  },
  {
    id: "nownow/sunglasses",
    name: "sunglasses",
    brand: "nownow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="160" ry="8" fill="#8C3D0F" opacity="0.25"/>
  <rect x="180" y="180" width="40" height="14" fill="#E0651A"/>
  <ellipse cx="120" cy="200" rx="80" ry="55" fill="#8C3D0F"/>
  <ellipse cx="120" cy="200" rx="70" ry="46" fill="#E0651A"/>
  <ellipse cx="120" cy="200" rx="62" ry="40" fill="#FF8533"/>
  <ellipse cx="280" cy="200" rx="80" ry="55" fill="#8C3D0F"/>
  <ellipse cx="280" cy="200" rx="70" ry="46" fill="#E0651A"/>
  <ellipse cx="280" cy="200" rx="62" ry="40" fill="#FF8533"/>
  <ellipse cx="100" cy="185" rx="20" ry="14" fill="#FFE0B5" opacity="0.85"/>
  <ellipse cx="260" cy="185" rx="20" ry="14" fill="#FFE0B5" opacity="0.85"/>
  <ellipse cx="95" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <ellipse cx="255" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <path d="M 200 200 L 360 175" stroke="#E0651A" stroke-width="10" stroke-linecap="round"/>
  <path d="M 200 200 L 40 175" stroke="#E0651A" stroke-width="10" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: "supermall/apple",
    name: "apple",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="345" rx="90" ry="8" fill="#1A1A66" opacity="0.3"/>
  <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#4B4BCC"/>
  <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#2E2E99"/>
  <ellipse cx="160" cy="180" rx="22" ry="40" fill="#D6D6F5" opacity="0.85"/>
  <ellipse cx="155" cy="170" rx="10" ry="20" fill="#FFFFFF" opacity="0.9"/>
  <path d="M 200 130 Q 205 105 220 95" stroke="#1A1A66" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#2E2E99"/>
  <path d="M 222 105 Q 245 95 265 108" stroke="#1A1A66" stroke-width="2" fill="none"/>
</svg>`,
  },
  {
    id: "supermall/bottle",
    name: "bottle",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="60" ry="8" fill="#1A1A66" opacity="0.3"/>
  <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#4B4BCC"/>
  <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#2E2E99"/>
  <rect x="175" y="60" width="50" height="20" fill="#1A1A66" rx="3"/>
  <rect x="175" y="60" width="50" height="6" fill="#1A1A1A" rx="3"/>
  <rect x="170" y="160" width="8" height="160" fill="#D6D6F5" rx="4" opacity="0.85"/>
  <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  <rect x="160" y="200" width="80" height="14" fill="#2E2E99"/>
  <rect x="160" y="266" width="80" height="14" fill="#2E2E99"/>
</svg>`,
  },
  {
    id: "supermall/bread",
    name: "bread",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="170" ry="10" fill="#1A1A66" opacity="0.25"/>
  <path d="M 50 240 Q 50 180 110 180 L 290 180 Q 350 180 350 240 Q 350 290 290 290 L 110 290 Q 50 290 50 240 Z" fill="#4B4BCC"/>
  <path d="M 50 250 Q 50 290 110 290 L 290 290 Q 350 290 350 250 Q 320 285 200 285 Q 80 285 50 250 Z" fill="#2E2E99"/>
  <path d="M 80 200 Q 130 188 200 188 Q 270 188 320 200 Q 270 195 200 195 Q 130 195 80 200 Z" fill="#9999E5"/>
  <path d="M 90 220 Q 100 240 90 260" stroke="#1A1A66" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 150 215 Q 160 240 150 265" stroke="#1A1A66" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 210 215 Q 220 240 210 265" stroke="#1A1A66" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 270 215 Q 280 240 270 265" stroke="#1A1A66" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 320 220 Q 330 240 320 260" stroke="#1A1A66" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="60" cy="240" rx="10" ry="35" fill="#D6D6F5" opacity="0.7"/>
</svg>`,
  },
  {
    id: "supermall/building",
    name: "building",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#1A1A66" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="378" rx="180" ry="8" fill="#1A1A66" opacity="0.2"/>
  <rect x="280" y="80" width="60" height="290" fill="#2E2E99"/>
  <rect x="280" y="80" width="60" height="290" fill="url(#hatch)" opacity="0.5"/>
  <rect x="80" y="80" width="200" height="290" fill="#4B4BCC"/>
  <rect x="80" y="80" width="260" height="20" fill="#9999E5"/>
  <rect x="80" y="170" width="260" height="8" fill="#2E2E99"/>
  <rect x="80" y="250" width="260" height="8" fill="#2E2E99"/>
  <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
  <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  <polygon points="100,115 130,115 100,135" fill="#D6D6F5"/>
  <polygon points="160,115 190,115 160,135" fill="#D6D6F5"/>
  <polygon points="220,115 250,115 220,135" fill="#D6D6F5"/>
  <rect x="95" y="190" width="170" height="50" fill="#9999E5"/>
  <rect x="95" y="190" width="170" height="6" fill="#2E2E99"/>
  <line x1="115" y1="200" x2="115" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="145" y1="200" x2="145" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="175" y1="200" x2="175" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="205" y1="200" x2="205" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <line x1="235" y1="200" x2="235" y2="240" stroke="#FFFFFF" stroke-width="3"/>
  <rect x="100" y="280" width="80" height="80" fill="#FFFFFF"/>
  <rect x="100" y="280" width="80" height="14" fill="#2E2E99"/>
  <rect x="200" y="280" width="60" height="90" fill="#2E2E99"/>
  <rect x="208" y="290" width="20" height="80" fill="#1A1A66"/>
  <rect x="232" y="290" width="20" height="80" fill="#1A1A66"/>
  <circle cx="120" cy="290" r="3" fill="#D6D6F5"/>
  <circle cx="140" cy="290" r="3" fill="#D6D6F5"/>
  <circle cx="160" cy="290" r="3" fill="#D6D6F5"/>
</svg>`,
  },
  {
    id: "supermall/cupcake",
    name: "cupcake",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="100" ry="8" fill="#1A1A66" opacity="0.3"/>
  <path d="M 110 230 L 290 230 L 270 360 L 130 360 Z" fill="#2E2E99"/>
  <line x1="135" y1="240" x2="142" y2="355" stroke="#1A1A66" stroke-width="3"/>
  <line x1="170" y1="240" x2="172" y2="355" stroke="#1A1A66" stroke-width="3"/>
  <line x1="200" y1="240" x2="200" y2="358" stroke="#1A1A66" stroke-width="3"/>
  <line x1="230" y1="240" x2="228" y2="355" stroke="#1A1A66" stroke-width="3"/>
  <line x1="265" y1="240" x2="258" y2="355" stroke="#1A1A66" stroke-width="3"/>
  <rect x="105" y="220" width="190" height="20" fill="#1A1A66"/>
  <path d="M 120 230 Q 150 130 200 130 Q 250 130 280 230 Z" fill="#4B4BCC"/>
  <path d="M 140 200 Q 165 150 200 150 Q 235 150 260 200 Q 240 215 200 215 Q 160 215 140 200 Z" fill="#9999E5"/>
  <path d="M 165 175 Q 180 145 200 145 Q 220 145 235 175 Q 220 188 200 188 Q 180 188 165 175 Z" fill="#D6D6F5"/>
  <circle cx="200" cy="135" r="14" fill="#1A1A66"/>
  <circle cx="195" cy="130" r="14" fill="#2E2E99"/>
  <ellipse cx="190" cy="125" rx="4" ry="6" fill="#FFFFFF"/>
  <path d="M 200 122 Q 215 100 230 95" stroke="#1A1A66" stroke-width="3" fill="none"/>
</svg>`,
  },
  {
    id: "supermall/donut",
    name: "donut",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="120" ry="14" fill="#1A1A66" opacity="0.25"/>
  <circle cx="200" cy="220" r="120" fill="#2E2E99"/>
  <circle cx="200" cy="210" r="120" fill="#4B4BCC"/>
  <path d="M 80 210 Q 80 250 110 250 Q 130 250 140 230 L 140 210 Z" fill="#9999E5"/>
  <path d="M 320 210 Q 320 240 290 240 Q 270 240 260 220 L 260 210 Z" fill="#9999E5"/>
  <path d="M 140 110 Q 200 90 260 110 L 260 130 Q 230 120 200 120 Q 170 120 140 130 Z" fill="#9999E5"/>
  <circle cx="200" cy="210" r="35" fill="#1A1A66"/>
  <circle cx="200" cy="205" r="35" fill="#2E2E99"/>
  <rect x="155" y="145" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(20 158 152)"/>
  <rect x="245" y="155" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-30 248 162)"/>
  <rect x="170" y="265" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(45 173 272)"/>
  <rect x="240" y="255" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(-15 243 262)"/>
  <rect x="125" y="200" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(70 128 207)"/>
  <rect x="270" y="195" width="6" height="14" fill="#FFFFFF" rx="2" transform="rotate(60 273 202)"/>
</svg>`,
  },
  {
    id: "supermall/headphones",
    name: "headphones",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="360" rx="140" ry="12" fill="#1A1A66" opacity="0.25"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#2E2E99" stroke-width="22" stroke-linecap="round"/>
  <path d="M 100 220 Q 100 80 200 80 Q 300 80 300 220" fill="none" stroke="#4B4BCC" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="95" cy="240" rx="65" ry="80" fill="#2E2E99"/>
  <ellipse cx="95" cy="235" rx="55" ry="70" fill="#4B4BCC"/>
  <ellipse cx="95" cy="235" rx="35" ry="50" fill="#1A1A66"/>
  <ellipse cx="80" cy="215" rx="10" ry="20" fill="#9999E5" opacity="0.7"/>
  <ellipse cx="305" cy="240" rx="65" ry="80" fill="#2E2E99"/>
  <ellipse cx="305" cy="235" rx="55" ry="70" fill="#4B4BCC"/>
  <ellipse cx="305" cy="235" rx="35" ry="50" fill="#1A1A66"/>
  <ellipse cx="290" cy="215" rx="10" ry="20" fill="#9999E5" opacity="0.7"/>
  <circle cx="95" cy="235" r="12" fill="#FFFFFF"/>
  <circle cx="305" cy="235" r="12" fill="#FFFFFF"/>
</svg>`,
  },
  {
    id: "supermall/hero-composition",
    name: "hero-composition",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 540" width="600" height="540"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#1A1A66" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="300" cy="500" rx="280" ry="20" fill="#1A1A66" opacity="0.2"/>
  <!-- Background back item: bottle (peeking behind on right) -->
  <g transform="translate(350,80) scale(0.5)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#4B4BCC"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#2E2E99"/>
    <rect x="175" y="60" width="50" height="20" fill="#1A1A66" rx="3"/>
    <rect x="160" y="200" width="80" height="60" fill="#FFFFFF"/>
  </g>
  <!-- Background back item: building (peeking behind on far left) -->
  <g transform="translate(-30,150) scale(0.45)">
    <rect x="80" y="80" width="200" height="290" fill="#2E2E99"/>
    <rect x="100" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="160" y="115" width="50" height="40" fill="#FFFFFF"/>
    <rect x="220" y="115" width="50" height="40" fill="#FFFFFF"/>
  </g>
  <!-- HERO: paper bag center -->
  <g transform="translate(120,120)">
    <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#4B4BCC"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#2E2E99"/>
    <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
    <rect x="90" y="140" width="220" height="14" fill="#9999E5"/>
    <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#2E2E99" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#2E2E99" stroke-width="8" fill="none" stroke-linecap="round"/>
    <rect x="130" y="210" width="140" height="80" fill="#4B4BCC" rx="6"/>
    <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
          font-size="22" text-anchor="middle" fill="#FFD700">supermall</text>
  </g>
  <!-- Front-left item: apple/produce -->
  <g transform="translate(-20,330) scale(0.5)">
    <path d="M 200 130 Q 130 130 110 220 Q 100 320 200 335 Q 300 320 290 220 Q 270 130 200 130 Z" fill="#4B4BCC"/>
    <path d="M 250 145 Q 290 165 290 220 Q 300 320 200 335 Q 240 320 250 220 Q 240 165 250 145 Z" fill="#2E2E99"/>
    <ellipse cx="160" cy="180" rx="22" ry="40" fill="#D6D6F5" opacity="0.85"/>
    <path d="M 200 130 Q 205 105 220 95" stroke="#1A1A66" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M 220 100 Q 250 85 270 105 Q 250 125 220 110 Z" fill="#2E2E99"/>
  </g>
  <!-- Front-right item: bottle small -->
  <g transform="translate(440,300) scale(0.45)">
    <path d="M 160 130 Q 160 110 175 105 L 175 80 Q 175 70 200 70 Q 225 70 225 80 L 225 105 Q 240 110 240 130 L 240 350 Q 240 365 225 365 L 175 365 Q 160 365 160 350 Z" fill="#4B4BCC"/>
    <path d="M 220 130 L 240 130 L 240 350 Q 240 365 225 365 L 215 365 Z" fill="#2E2E99"/>
    <rect x="175" y="60" width="50" height="20" fill="#1A1A66" rx="3"/>
    <rect x="160" y="200" width="80" height="80" fill="#FFFFFF"/>
  </g>
</svg>`,
  },
  {
    id: "supermall/package-box",
    name: "package-box",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#1A1A66" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="360" rx="140" ry="14" fill="#1A1A66" opacity="0.25"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="#2E2E99"/>
  <polygon points="320,140 380,170 380,330 320,360" fill="url(#hatch)" opacity="0.55"/>
  <polygon points="80,110 200,60 320,110 200,160" fill="#9999E5"/>
  <polygon points="80,110 320,110 320,360 80,360" fill="#4B4BCC"/>
  <rect x="80" y="220" width="240" height="22" fill="#2E2E99"/>
  <rect x="80" y="220" width="240" height="3" fill="#9999E5"/>
  <rect x="130" y="135" width="140" height="70" fill="#4B4BCC" rx="4"/>
  <text x="200" y="180" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="30" text-anchor="middle" fill="#FFD700">supermall</text>
  <polygon points="80,110 200,60 320,110 200,160" fill="#D6D6F5" opacity="0.35"/>
</svg>`,
  },
  {
    id: "supermall/palm-tree",
    name: "palm-tree",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="378" rx="60" ry="6" fill="#1A1A66" opacity="0.25"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#2E2E99" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M 190 370 Q 180 280 195 200 Q 200 150 205 100" stroke="#4B4BCC" stroke-width="12" fill="none" stroke-linecap="round"/>
  <line x1="180" y1="320" x2="200" y2="320" stroke="#1A1A66" stroke-width="3"/>
  <line x1="183" y1="270" x2="200" y2="270" stroke="#1A1A66" stroke-width="3"/>
  <line x1="190" y1="220" x2="205" y2="220" stroke="#1A1A66" stroke-width="3"/>
  <line x1="195" y1="170" x2="208" y2="170" stroke="#1A1A66" stroke-width="3"/>
  <path d="M 200 100 Q 130 80 70 100 Q 100 110 200 110 Z" fill="#2E2E99"/>
  <path d="M 200 100 Q 270 80 330 100 Q 300 110 200 110 Z" fill="#4B4BCC"/>
  <path d="M 200 100 Q 110 110 50 150 Q 90 145 195 115 Z" fill="#4B4BCC"/>
  <path d="M 200 100 Q 290 110 350 150 Q 310 145 205 115 Z" fill="#2E2E99"/>
  <path d="M 200 100 Q 200 60 200 30 Q 215 70 215 110 Z" fill="#9999E5"/>
  <line x1="195" y1="105" x2="80" y2="100" stroke="#9999E5" stroke-width="2" opacity="0.7"/>
  <line x1="205" y1="105" x2="320" y2="100" stroke="#9999E5" stroke-width="2" opacity="0.7"/>
  <circle cx="195" cy="115" r="9" fill="#1A1A66"/>
  <circle cx="210" cy="120" r="9" fill="#1A1A66"/>
</svg>`,
  },
  {
    id: "supermall/paper-bag",
    name: "paper-bag",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#1A1A66" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="370" rx="130" ry="12" fill="#1A1A66" opacity="0.25"/>
  <path d="M 90 140 L 310 140 L 320 360 L 80 360 Z" fill="#4B4BCC"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="#2E2E99"/>
  <path d="M 250 140 L 310 140 L 320 360 L 260 360 Z" fill="url(#hatch)" opacity="0.45"/>
  <rect x="90" y="140" width="220" height="14" fill="#9999E5"/>
  <path d="M 130 140 Q 130 90 170 90 Q 210 90 210 140" stroke="#2E2E99" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 200 140 Q 200 90 240 90 Q 280 90 280 140" stroke="#2E2E99" stroke-width="8" fill="none" stroke-linecap="round"/>
  <rect x="130" y="210" width="140" height="80" fill="#4B4BCC" rx="6"/>
  <text x="200" y="260" font-family="Helvetica, Arial, sans-serif" font-weight="900"
        font-size="22" text-anchor="middle" fill="#FFD700">supermall</text>
  <line x1="200" y1="155" x2="205" y2="358" stroke="#2E2E99" stroke-width="2" opacity="0.4"/>
</svg>`,
  },
  {
    id: "supermall/perfume",
    name: "perfume",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="8" fill="#1A1A66" opacity="0.3"/>
  <rect x="180" y="50" width="40" height="40" fill="#1A1A66" rx="3"/>
  <rect x="180" y="50" width="40" height="10" fill="#1A1A1A" rx="3"/>
  <rect x="190" y="90" width="20" height="14" fill="#2E2E99"/>
  <rect x="170" y="104" width="60" height="22" fill="#2E2E99"/>
  <path d="M 130 130 L 270 130 L 280 360 L 120 360 Z" fill="#4B4BCC"/>
  <path d="M 230 130 L 270 130 L 280 360 L 240 360 Z" fill="#2E2E99"/>
  <rect x="135" y="150" width="14" height="180" fill="#D6D6F5" opacity="0.85"/>
  <rect x="150" y="220" width="100" height="80" fill="#FFFFFF"/>
  <rect x="150" y="220" width="100" height="6" fill="#2E2E99"/>
  <rect x="150" y="294" width="100" height="6" fill="#2E2E99"/>
  <text x="200" y="265" font-family="Helvetica, Arial, sans-serif" font-weight="700"
        font-size="20" text-anchor="middle" fill="#1A1A1A">SCENT</text>
</svg>`,
  },
  {
    id: "supermall/pizza-slice",
    name: "pizza-slice",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#1A1A66" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="345" rx="120" ry="8" fill="#1A1A66" opacity="0.3"/>
  <path d="M 200 80 L 80 320 L 320 320 Z" fill="#4B4BCC"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="#2E2E99"/>
  <path d="M 80 320 L 320 320 L 305 340 L 95 340 Z" fill="url(#hatch)" opacity="0.4"/>
  <path d="M 90 305 Q 110 295 130 305 Q 160 295 180 305 Q 210 295 240 305 Q 270 295 290 305 Q 310 295 320 320 L 80 320 Z" fill="#9999E5"/>
  <circle cx="160" cy="240" r="20" fill="#1A1A66"/>
  <circle cx="155" cy="235" r="18" fill="#2E2E99"/>
  <circle cx="240" cy="240" r="20" fill="#1A1A66"/>
  <circle cx="235" cy="235" r="18" fill="#2E2E99"/>
  <circle cx="200" cy="180" r="16" fill="#1A1A66"/>
  <circle cx="195" cy="175" r="14" fill="#2E2E99"/>
  <circle cx="195" cy="290" r="14" fill="#1A1A66"/>
  <circle cx="190" cy="285" r="12" fill="#2E2E99"/>
  <path d="M 200 80 L 130 220 Q 160 215 175 175 Z" fill="#D6D6F5" opacity="0.4"/>
</svg>`,
  },
  {
    id: "supermall/smartphone",
    name: "smartphone",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="370" rx="80" ry="6" fill="#1A1A66" opacity="0.25"/>
  <rect x="135" y="60" width="135" height="305" rx="22" fill="#2E2E99"/>
  <rect x="125" y="55" width="135" height="305" rx="22" fill="#4B4BCC"/>
  <rect x="140" y="80" width="105" height="255" rx="6" fill="#1A1A66"/>
  <polygon points="140,80 245,80 245,110 140,180" fill="#2E2E99" opacity="0.6"/>
  <circle cx="192" cy="73" r="4" fill="#1A1A1A"/>
  <rect x="215" y="80" width="35" height="45" rx="8" fill="#1A1A66"/>
  <circle cx="225" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="92" r="6" fill="#1A1A1A"/>
  <circle cx="225" cy="108" r="6" fill="#1A1A1A"/>
  <circle cx="240" cy="108" r="6" fill="#1A1A1A"/>
  <rect x="123" y="130" width="4" height="35" fill="#1A1A66"/>
  <rect x="125" y="55" width="5" height="305" rx="2" fill="#9999E5" opacity="0.8"/>
</svg>`,
  },
  {
    id: "supermall/sneaker",
    name: "sneaker",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
  <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#1A1A66" stroke-width="2"/>
  </pattern>
</defs>
  <ellipse cx="200" cy="320" rx="160" ry="10" fill="#1A1A66" opacity="0.25"/>
  <path d="M 50 280 L 350 270 Q 360 305 340 310 L 60 310 Q 45 305 50 280 Z" fill="#1A1A66"/>
  <path d="M 50 270 L 350 260 Q 358 280 340 285 L 60 290 Q 45 285 50 270 Z" fill="#FFFFFF"/>
  <path d="M 90 270 Q 75 220 100 180 Q 130 140 200 145 Q 280 150 320 200 Q 345 230 350 270 Z" fill="#4B4BCC"/>
  <path d="M 280 200 Q 320 215 340 250 Q 345 265 320 270 L 270 270 Q 250 250 260 220 Z" fill="#2E2E99"/>
  <path d="M 120 200 Q 130 175 160 165 Q 200 160 230 175 Q 240 200 230 240 L 130 245 Z" fill="#9999E5"/>
  <line x1="150" y1="195" x2="220" y2="195" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="145" y1="215" x2="225" y2="210" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="140" y1="235" x2="225" y2="225" stroke="#FFFFFF" stroke-width="4"/>
  <path d="M 250 250 Q 230 220 255 200 L 280 200 Q 270 230 290 250 Z" fill="#FFFFFF"/>
  <path d="M 75 245 L 105 245 L 105 270 L 75 270 Z" fill="url(#hatch)" opacity="0.6"/>
</svg>`,
  },
  {
    id: "supermall/sunglasses",
    name: "sunglasses",
    brand: "supermall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <ellipse cx="200" cy="320" rx="160" ry="8" fill="#1A1A66" opacity="0.25"/>
  <rect x="180" y="180" width="40" height="14" fill="#2E2E99"/>
  <ellipse cx="120" cy="200" rx="80" ry="55" fill="#1A1A66"/>
  <ellipse cx="120" cy="200" rx="70" ry="46" fill="#2E2E99"/>
  <ellipse cx="120" cy="200" rx="62" ry="40" fill="#4B4BCC"/>
  <ellipse cx="280" cy="200" rx="80" ry="55" fill="#1A1A66"/>
  <ellipse cx="280" cy="200" rx="70" ry="46" fill="#2E2E99"/>
  <ellipse cx="280" cy="200" rx="62" ry="40" fill="#4B4BCC"/>
  <ellipse cx="100" cy="185" rx="20" ry="14" fill="#D6D6F5" opacity="0.85"/>
  <ellipse cx="260" cy="185" rx="20" ry="14" fill="#D6D6F5" opacity="0.85"/>
  <ellipse cx="95" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <ellipse cx="255" cy="180" rx="8" ry="6" fill="#FFFFFF"/>
  <path d="M 200 200 L 360 175" stroke="#2E2E99" stroke-width="10" stroke-linecap="round"/>
  <path d="M 200 200 L 40 175" stroke="#2E2E99" stroke-width="10" stroke-linecap="round"/>
</svg>`,
  },
];

export const illustrationBrands: IllustrationBrand[] = ["base", "noon", "noon-food", "minutes", "nownow", "supermall"];