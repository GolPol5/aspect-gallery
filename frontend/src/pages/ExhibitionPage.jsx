import { useState, useEffect } from 'react'
import { useApp } from '../context'
import { fmtDateRange, SEED } from '../data'
import { api } from '../api'
import { Icon, BgImage } from '../components'

const TICKET_PRICE = 500

export default function ExhibitionPage() {
  const { navigate, params } = useApp()
  const id = params.id

  const [exh, setExh]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.exhibitions.get(id)
      .then(setExh)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <main><div style={{padding:'120px 32px', textAlign:'center', color:'var(--ink-3)'}}>Загрузка…</div></main>
  if (!exh)    return <main><div style={{padding:'120px 32px', textAlign:'center', color:'var(--ink-3)'}}>Выставка не найдена.</div></main>

  const cover  = exh.coverImage || SEED('exh-' + exh.slug)
  const statusLabel = { soon: 'Скоро', current: 'Сейчас', past: 'Архив' }[exh.status] ?? ''
  const statusColor = exh.status === 'soon' ? 'var(--accent)' : exh.status === 'current' ? 'var(--ink)' : '#777'

  return (
    <main>
      <div className="exh-detail-page">

        {/* HERO */}
        <div className="exh-detail-hero">
          <BgImage
            className="exh-detail-cover"
            local={cover}
            fallback={SEED('exh-' + exh.slug)}
            style={exh.status === 'soon' ? { filter: 'grayscale(0.5) opacity(0.7)' } : {}}
          />
          <div className="exh-detail-hero-overlay">
            <div className="exh-detail-hero-inner">
              <div className="breadcrumbs" style={{color:'rgba(255,255,255,0.6)', marginBottom:20}}>
                <a onClick={() => navigate('home')} style={{cursor:'pointer', color:'rgba(255,255,255,0.6)'}}>Главная</a>
                {' / '}
                <a onClick={() => navigate('exhibitions')} style={{cursor:'pointer', color:'rgba(255,255,255,0.6)'}}>Выставки</a>
                {' / '}
                <span style={{color:'white'}}>{exh.title}</span>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
                <span className="exh-badge" style={{background: statusColor, position:'static'}}>
                  {statusLabel}
                </span>
                <span style={{fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.7)'}}>
                  {fmtDateRange(exh.dateStart, exh.dateEnd)}
                </span>
              </div>
              <h1 className="display exh-detail-title">{exh.title}<span style={{color:'var(--accent)'}}>.</span></h1>
              <p className="exh-detail-artists">{exh.artists}</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="exh-detail-body">
          <div className="exh-detail-info">
            <div className="eyebrow" style={{marginBottom:16}}>О выставке</div>
            <p className="exh-detail-teaser">{exh.teaser}</p>

            <div className="exh-detail-meta-row">
              <div className="exh-detail-meta-item">
                <span className="label">Художник{exh.artists?.includes(',') ? 'и' : ''}</span>
                <span className="value">{exh.artists}</span>
              </div>
              <div className="exh-detail-meta-item">
                <span className="label">Даты</span>
                <span className="value">{fmtDateRange(exh.dateStart, exh.dateEnd)}</span>
              </div>
              <div className="exh-detail-meta-item">
                <span className="label">Место</span>
                <span className="value">Галерея Аспект, зал 1</span>
              </div>
            </div>
          </div>

          <div className="exh-detail-cta">
            {exh.status !== 'past' ? (
              <>
                <div className="exh-detail-ticket-price">
                  <span className="eyebrow">Вход</span>
                  <span className="price">₽ {TICKET_PRICE.toLocaleString('ru-RU')}</span>
                </div>
                <button className="btn large full filled">
                  <Icon name="arrowne" size={16}/> Купить билет
                </button>
                <p style={{fontSize:12, color:'var(--ink-3)', marginTop:12, lineHeight:1.6}}>
                  Билет действителен в день посещения.<br/>
                  Режим работы: пн–вс, 11:00 – 21:00.
                </p>
              </>
            ) : (
              <div style={{padding:'24px', background:'var(--bg-alt)', borderTop:'2px solid var(--line-dark)'}}>
                <div className="eyebrow" style={{marginBottom:8}}>Архивная выставка</div>
                <p style={{fontSize:14, color:'var(--ink-3)', lineHeight:1.6}}>Эта выставка завершилась. Следите за анонсами новых проектов.</p>
                <button className="btn" style={{marginTop:16}} onClick={() => navigate('exhibitions')}>
                  Все выставки <Icon name="arrow" size={14}/>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
