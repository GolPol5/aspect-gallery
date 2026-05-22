import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context'
import { COLORS_SWATCH } from '../data'
import { api } from '../api'
import { CatalogCard } from '../components'

export default function CatalogPage() {
  const { navigate, addToCart } = useApp()

  const [search,    setSearch]    = useState('')
  const [type,      setType]      = useState('all')
  const [priceMin,  setPriceMin]  = useState('')
  const [priceMax,  setPriceMax]  = useState('')
  const [sizes,     setSizes]     = useState(new Set())
  const [genres,    setGenres]    = useState(new Set())
  const [artistId,  setArtistId]  = useState('')
  const [color,     setColor]     = useState('')

  const [artists,   setArtists]   = useState([])
  const [artworks,  setArtworks]  = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [page,      setPage]      = useState(1)
  const LIMIT = 20

  const toggleSet = (setter, val) => setter(prev => {
    const next = new Set(prev)
    next.has(val) ? next.delete(val) : next.add(val)
    return next
  })

  useEffect(() => {
    api.artists.list().then(setArtists).catch(() => {})
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    const params = {
      page,
      limit: LIMIT,
      ...(type !== 'all' && { type }),
      ...(priceMin && { priceMin }),
      ...(priceMax && { priceMax }),
      ...(sizes.size && { size: [...sizes].join(',') }),
      ...(genres.size && { genre: [...genres].join(',') }),
      ...(artistId && { artistId }),
      ...(search && { search }),
    }
    // size/genre are arrays — API accepts single value, so fetch for each
    // For simplicity send first selected value; multi-select can be extended later
    if (sizes.size)  params.size  = [...sizes][0]
    if (genres.size) params.genre = [...genres][0]

    const TYPE_ORDER = { painting: 0, graphic: 1, sculpture: 2 }
    api.artworks.list(params)
      .then(res => {
        const sorted = (res.data ?? []).sort((a, b) =>
          (TYPE_ORDER[a.type] ?? 99) - (TYPE_ORDER[b.type] ?? 99)
        )
        setArtworks(sorted)
        setTotal(res.total ?? 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, type, priceMin, priceMax, sizes, genres, artistId, search])

  // Debounce search
  useEffect(() => {
    setPage(1)
    const t = setTimeout(load, 350)
    return () => clearTimeout(t)
  }, [search, type, priceMin, priceMax, sizes, genres, artistId])

  useEffect(() => { load() }, [page])

  const reset = () => {
    setSearch(''); setType('all'); setPriceMin(''); setPriceMax('')
    setSizes(new Set()); setGenres(new Set()); setArtistId(''); setColor('')
    setPage(1)
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <main>
      <div className="page-hero">
        <div className="breadcrumbs"><a onClick={() => navigate('home')} style={{cursor:'pointer'}}>Главная</a> / <span>Каталог</span></div>
        <h1>Каталог<span style={{color:'var(--accent)'}}>.</span></h1>
        <div className="page-hero-meta">
          <span style={{fontSize:'14px', color:'var(--ink-3)', maxWidth:'600px'}}>Живопись, графика и скульптура. Все работы в наличии. Доставка по России и за рубеж.</span>
          <span className="count">{artworks.length.toString().padStart(3,'0')} / {total.toString().padStart(3,'0')} работ</span>
        </div>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <div className="filter-group">
            <input className="search-input" placeholder="Поиск по названию..." value={search} onChange={e => setSearch(e.target.value)}/>
          </div>

          <div className="filter-group">
            <h5>Тип</h5>
            {[['all','Все'],['painting','Живопись'],['graphic','Графика'],['sculpture','Скульптура']].map(([v,l]) => (
              <label className="radio" key={v}>
                <input type="radio" name="type" checked={type===v} onChange={() => { setType(v); setPage(1) }}/><span className="radio-mark"></span>{l}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h5>Цена, ₽</h5>
            <div className="price-row">
              <input placeholder="от" type="number" value={priceMin} onChange={e => { setPriceMin(e.target.value); setPage(1) }}/>
              <input placeholder="до" type="number" value={priceMax} onChange={e => { setPriceMax(e.target.value); setPage(1) }}/>
            </div>
          </div>

          <div className="filter-group">
            <h5>Размер</h5>
            {[['small','Малый (до 50 см)'],['medium','Средний (50–120 см)'],['large','Большой (120+ см)']].map(([v,l]) => (
              <label className="check" key={v}>
                <input type="checkbox" checked={sizes.has(v)} onChange={() => { toggleSet(setSizes, v); setPage(1) }}/><span className="check-mark"></span>{l}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h5>Жанр</h5>
            {[['abstract','Абстракция'],['portrait','Портрет'],['landscape','Пейзаж'],['still','Натюрморт'],['conceptual','Концептуальное']].map(([v,l]) => (
              <label className="check" key={v}>
                <input type="checkbox" checked={genres.has(v)} onChange={() => { toggleSet(setGenres, v); setPage(1) }}/><span className="check-mark"></span>{l}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h5>Художник</h5>
            <select className="select" value={artistId} onChange={e => { setArtistId(e.target.value); setPage(1) }}>
              <option value="">Все художники</option>
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="filter-group" style={{borderBottom:0}}>
            <h5>Цвет</h5>
            <div className="swatches">
              {COLORS_SWATCH.map(s => (
                <div key={s.id} className={'swatch ' + (color === s.id ? 'active' : '')} style={{background:s.hex}} onClick={() => setColor(color === s.id ? '' : s.id)}/>
              ))}
            </div>
          </div>

          <div style={{marginTop:24}}>
            <button className="text-link" onClick={reset}>Сбросить фильтры</button>
          </div>
        </aside>

        <div>
          {loading ? (
            <div style={{padding:'80px 32px', textAlign:'center', color:'var(--ink-3)'}}>Загрузка…</div>
          ) : (
            <>
              <div className="catalog-grid">
                {artworks.map(w => (
                  <CatalogCard key={w.id} artwork={w} onClick={a => navigate('artwork', { id: a.id })} onAddToCart={addToCart}/>
                ))}
              </div>
              {artworks.length === 0 && (
                <div style={{padding:'120px 32px', textAlign:'center', color:'var(--ink-3)'}}>
                  <p style={{fontSize:'14px'}}>По заданным фильтрам ничего не найдено.</p>
                </div>
              )}
              {totalPages > 1 && (
                <div style={{display:'flex', justifyContent:'center', gap:8, padding:'40px 32px'}}>
                  {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
                    <button key={p}
                      className={'btn' + (p === page ? ' filled' : '')}
                      style={{minWidth:40, padding:'0 12px'}}
                      onClick={() => setPage(p)}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
