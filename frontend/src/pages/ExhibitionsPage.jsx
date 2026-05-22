import { useState, useEffect } from 'react'
import { useApp } from '../context'
import { SEED, localExhibition, fmtDateRange } from '../data'
import { api } from '../api'
import { Icon, BgImage } from '../components'

const TICKET_PRICE = 500

export default function ExhibitionsPage() {
  const { navigate, addToCart, cart } = useApp()
  const isInCart = (exhId) => cart.some(w => w.id === 'ticket-' + exhId)
  const [filter, setFilter]         = useState('all')
  const [allExhibitions, setAll]    = useState([])
  const [loading, setLoading]       = useState(true)
  const [subEmail, setSubEmail]     = useState('')
  const [subDone, setSubDone]       = useState(false)

  const filters = [
    { id:'all',     label:'Все типы' },
    { id:'current', label:'Текущие' },
    { id:'soon',    label:'Предстоящие' },
    { id:'past',    label:'Прошедшие' },
  ]

  useEffect(() => {
    setLoading(true)
    api.exhibitions.list().then(data => {
      setAll(data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? allExhibitions : allExhibitions.filter(e => e.status === filter)

  const subscribe = async (e) => {
    e.preventDefault()
    if (!subEmail) return
    try {
      await api.newsletter.subscribe({ email: subEmail, source: 'exhibitions' })
      setSubDone(true)
      setSubEmail('')
    } catch { /* silent */ }
  }

  return (
    <main>
      <div className="page-hero">
        <div className="breadcrumbs"><a onClick={() => navigate('home')} style={{cursor:'pointer'}}>Главная</a> / <span>Выставки</span></div>
        <h1>Выставки<span style={{color:'var(--accent)'}}>.</span></h1>
        <div className="page-hero-meta">
          <span style={{fontSize:'14px', color:'var(--ink-3)', maxWidth:'600px'}}>Текущие и предстоящие выставочные проекты в двух залах галереи. Куратор сезона — Елена Дворецкая.</span>
          <span className="count">{filtered.length.toString().padStart(2,'0')} / {allExhibitions.length.toString().padStart(2,'0')}</span>
        </div>
      </div>

      <div className="filter-bar">
        {filters.map(f => (
          <button key={f.id} className={'chip ' + (filter === f.id ? 'active' : '')} onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{padding:'80px 32px', textAlign:'center', color:'var(--ink-3)'}}>Загрузка…</div>
      ) : (
        <div className="exh-page-grid">
          {filtered.map(exh => {
            const cover = exh.coverImage || localExhibition(exh.slug)
            return (
              <div className={'exh-page-card ' + (exh.status === 'soon' ? 'soon' : '')} key={exh.id} onClick={() => navigate('exhibition', { id: exh.id })}>
                <BgImage className="img-wrap" local={cover} fallback={SEED('exh-' + exh.slug)}>
                  {exh.status === 'soon'    && <span className="exh-badge">Скоро</span>}
                  {exh.status === 'current' && <span className="exh-badge dark">Сейчас</span>}
                  {exh.status === 'past'    && <span className="exh-badge" style={{background:'#777'}}>Архив</span>}
                </BgImage>
                <div className="body">
                  <div className="dates">{fmtDateRange(exh.dateStart, exh.dateEnd)}</div>
                  <div className="title">{exh.title}</div>
                  <div className="artists">{exh.artists}</div>
                  <div className="teaser">{exh.teaser}</div>
                  <div className="exh-card-actions">
                    <span className="text-link">Подробнее <Icon name="arrow" size={14}/></span>
                    {exh.status !== 'past' && (
                      <button
                        className={'btn-pill ' + (isInCart(exh.id) ? '' : 'accent')}
                        style={{fontSize:11, height:32, padding:'0 14px', gap:6}}
                        onClick={e => {
                          e.stopPropagation()
                          addToCart({
                            id: 'ticket-' + exh.id,
                            type: 'ticket',
                            title: exh.title,
                            dateStart: exh.dateStart,
                            dateEnd: exh.dateEnd,
                            coverImage: exh.coverImage,
                            price: TICKET_PRICE,
                          })
                        }}
                      >
                        <Icon name={isInCart(exh.id) ? 'package' : 'arrowne'} size={12}/>
                        {isInCart(exh.id) ? 'В корзине' : 'Купить билет'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{padding:'80px 32px', textAlign:'center', color:'var(--ink-3)', gridColumn:'1 / -1'}}>
              Выставок в этой категории нет.
            </div>
          )}
        </div>
      )}

      <section className="section tight alt" style={{textAlign:'center'}}>
        <div className="eyebrow" style={{marginBottom:24, justifyContent:'center'}}>Календарь выставок</div>
        <h3 className="display" style={{fontSize:'clamp(40px, 6vw, 80px)', marginBottom:32}}>Получать программу<br/>сезона раз в месяц<span style={{color:'var(--accent)'}}>.</span></h3>
        {subDone ? (
          <p style={{fontSize:'16px', color:'var(--accent)'}}>Вы подписаны на новости!</p>
        ) : (
          <form style={{maxWidth:480, margin:'0 auto', display:'flex', gap:8}} onSubmit={subscribe}>
            <input className="input" type="email" placeholder="ваш@email.ru" style={{flex:1}} value={subEmail} onChange={e => setSubEmail(e.target.value)}/>
            <button className="btn filled" type="submit">Подписаться</button>
          </form>
        )}
      </section>
    </main>
  )
}
