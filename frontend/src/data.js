// Utility helpers — no mock data

export const fmtRub = (n) => `₽ ${Number(n).toLocaleString('ru-RU').replace(/,/g, ' ')}`

export const COLORS_SWATCH = [
  { id: 'black',  hex: '#111111' },
  { id: 'white',  hex: '#FFFFFF' },
  { id: 'pink',   hex: '#E8A0B4' },
  { id: 'blue',   hex: '#2A4C8C' },
  { id: 'green',  hex: '#2E6B50' },
  { id: 'orange', hex: '#D4622A' },
]

// Image helpers
const IMG_BASE = '/images'
export const localArtwork    = (seed) => `${IMG_BASE}/artworks/${seed}.png`
export const localExhibition = (seed) => `${IMG_BASE}/exhibitions/${seed}.jpg`
export const localHero       = (name) => `${IMG_BASE}/hero/${name}.jpg`
export const localInterior   = (name) => `${IMG_BASE}/interior/${name}.jpg`
export const localTeam       = (name) => `${IMG_BASE}/team/${name}.jpg`

// Picsum fallbacks
export const SEED   = (s) => `https://picsum.photos/seed/aspect-${s}/1200/1500`
export const SEEDSQ = (s) => `https://picsum.photos/seed/aspect-${s}/800/800`

// Format ISO date to "10 МАЯ 2026"
export const fmtDate = (iso) =>
  new Date(iso)
    .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    .replace(' г.', '')
    .toUpperCase()

// Format exhibition date range
export const fmtDateRange = (start, end) => `${fmtDate(start)} – ${fmtDate(end)}`

// Local image lookup by artwork title (files in public/images/exhibitions/)
const ARTWORK_LOCAL_IMAGES = {
  'Внутренний жест':              '/images/exhibitions/%D0%B2%D0%BD%D1%83%D1%82%D1%80%D0%B5%D0%BD%D0%BD%D0%B8%D0%B9%20%D0%B6%D0%B5%D1%81%D1%82.png',
  'Город террас':                 '/images/exhibitions/%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%20%D1%82%D0%B5%D1%80%D1%80%D0%B0%D1%81.png',
  'Городской ритм':               '/images/exhibitions/%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%BE%D0%B9%20%D1%80%D0%B8%D1%82%D0%BC.png',
  'Конструкция на розовом поле':  '/images/exhibitions/%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D1%80%D0%BE%D0%B7%D0%BE%D0%B2%D0%B0%D0%BE%D0%BC%20%D0%BF%D0%BE%D0%BB%D0%B5.png',
  'Облако вместо голоса':         '/images/exhibitions/%D0%BE%D0%B1%D0%BB%D0%B0%D0%BA%D0%BE%20%D0%B2%D0%BC%D0%B5%D1%81%D1%82%D0%BE%20%D0%B3%D0%BE%D0%BB%D0%BE%D1%81%D0%B0.png',
  'Оранжевая река':               '/images/exhibitions/%D0%BE%D1%80%D0%B0%D0%BD%D0%B6%D0%B5%D0%B2%D0%B0%D1%8F%20%D1%80%D0%B5%D0%BA%D0%B0.png',
  'Пересечение плоскостей':       '/images/exhibitions/%D0%BF%D0%B5%D1%80%D0%B5%D1%81%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BB%D0%BE%D1%81%D0%BA%D0%BE%D1%81%D1%82%D0%B5%D0%B9.png',
  'Пламя формы':                  '/images/exhibitions/%D0%BF%D0%BB%D0%B0%D0%BC%D1%8F%20%D1%84%D0%BE%D1%80%D0%BC%D1%8B.png',
  'Розовая долина наблюдения':    '/images/exhibitions/%D1%80%D0%BE%D0%B7%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%B4%D0%BE%D0%BB%D0%B8%D1%8F%20%D0%BD%D0%B0%D0%B1%D0%BB%D1%8E%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F.png',
  'Сад луны':                     '/images/exhibitions/%D1%81%D0%B0%D0%B4%20%D0%BB%D1%83%D0%BD%D1%8B.png',
  'Система равновесия':           '/images/exhibitions/%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0%20%D1%80%D0%B0%D0%B2%D0%BD%D0%BE%D0%B2%D0%B5%D1%81%D0%B8%D1%8F.png',
  'Узел тишины':                  '/images/exhibitions/%D1%83%D0%B7%D0%B5%D0%BB%20%D1%82%D0%B8%D1%88%D0%B8%D0%BD%D1%8B.png',
}

// Primary image from API artwork (first in images array), fallback to local by title
export const artworkImg = (artwork) =>
  artwork?.images?.[0] || ARTWORK_LOCAL_IMAGES[artwork?.title] || ''
