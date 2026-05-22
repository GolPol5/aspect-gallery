import { useState, useEffect } from 'react'
import { useApp } from '../context'
import { fmtRub, artworkImg } from '../data'
import { api } from '../api'
import { Icon, CatalogCard } from '../components'

export default function ArtworkPage() {
  const { navigate, params, addToCart, addQuestion } = useApp()
  const id = params.id

  const [artwork,       setArtwork]       = useState(null)
  const [related,       setRelated]       = useState([])
  const [loading,       setLoading]       = useState(true)
  const [activeThumb,   setActiveThumb]   = useState(0)
  const [showQuestion,  setShowQuestion]  = useState(false)
  const [showAR,        setShowAR]        = useState(false)
  const [qName,         setQName]         = useState('')
  const [qEmail,        setQEmail]        = useState('')
  const [qText,         setQText]         = useState('')
  const [questionSent,  setQuestionSent]  = useState(false)
  const [qError,        setQError]        = useState('')

  useEffect(() => {
    if (!id) {
      // Load first available artwork when navigating from PageSwitcher without id
      api.artworks.list({ limit: 1 }).then(res => {
        const first = res.data?.[0]
        if (first) setArtwork(first)
      }).catch(() => {}).finally(() => setLoading(false))
      return
    }
    setLoading(true)
    setActiveThumb(0)
    api.artworks.get(id).then(data => {
      setArtwork(data)
      // Load related artworks by same artist
      return api.artworks.list({ artistId: data.artistId, limit: 6 }).then(res => {
        setRelated((res.data ?? []).filter(w => w.id !== id))
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const submitQuestion = async (e) => {
    e.preventDefault()
    setQError('')
    if (!qName || !qEmail || !qText) return
    try {
      await api.inquiries.create({ artworkId: artwork.id, name: qName, email: qEmail, text: qText })
      addQuestion({ artworkId: artwork.id, artworkTitle: artwork.title, artwork, name: qName, email: qEmail, text: qText })
      setQuestionSent(true)
      setTimeout(() => { setShowQuestion(false); setQuestionSent(false); setQName(''); setQEmail(''); setQText('') }, 1800)
    } catch (err) {
      setQError(err.message || 'Не удалось отправить вопрос')
    }
  }

  if (loading) return <main><div style={{padding:'120px 32px', textAlign:'center', color:'var(--ink-3)'}}>Загрузка…</div></main>
  if (!artwork) return <main><div style={{padding:'120px 32px', textAlign:'center', color:'var(--ink-3)'}}>Работа не найдена.</div></main>

  const artist    = artwork.artist ?? {}
  const images    = artwork.images ?? []
  const typeLabel = { painting:'Живопись', sculpture:'Скульптура', graphic:'Графика' }[artwork.type] ?? artwork.type
  const primaryImg = images.length > 0 ? (images[activeThumb] ?? images[0]) : artworkImg(artwork)

  return (
    <main>
      <div className="artwork-page">
        <div className="breadcrumbs">
          <a onClick={() => navigate('catalog')} style={{cursor:'pointer'}}>Каталог</a> / <a onClick={() => navigate('catalog')} style={{cursor:'pointer'}}>{typeLabel}</a> / <span>{artwork.title}</span>
        </div>

        <div className="artwork-grid">
          <div className="artwork-images">
            {images.length > 1 && (
              <div className="artwork-thumbs">
                {images.map((src, i) => (
                  <div key={i} className={'artwork-thumb ' + (activeThumb === i ? 'active' : '')}
                    style={{backgroundImage:`url(${src})`}}
                    onClick={() => setActiveThumb(i)}/>
                ))}
              </div>
            )}
            <div className="artwork-main">
              {primaryImg ? (
                <div className="artwork-primary" style={{backgroundImage:`url(${primaryImg})`}}/>
              ) : (
                <div className="artwork-primary" style={{background:'#F0EDE8'}}/>
              )}
              <div className="artwork-actions">
                <button className="btn" onClick={() => setShowAR(true)}><Icon name="ar" size={16}/> AR-просмотр</button>
              </div>
            </div>
          </div>

          <aside className="artwork-info">
            <div className="artwork-artist">
              <a href="#" style={{borderBottom:'1px solid var(--accent)', paddingBottom:2}}>{(artist.name || '').toUpperCase()}</a>
            </div>
            <h1 className="artwork-title">{artwork.title}</h1>
            <div className="artwork-meta">
              <span>Год <strong>{artwork.year}</strong></span>
              <span>Техника <strong>{artwork.technique}</strong></span>
              <span>Размер <strong>{artwork.dimensions}</strong></span>
            </div>
            <div className="artwork-desc">
              <p>{artwork.description}</p>
              <p>Работа поставляется с авторским сертификатом подлинности. Возможна организация просмотра в галерее или выезд куратора с произведением.</p>
              {artist.bio && (
                <p style={{fontSize:'13px', color:'var(--ink-3)', borderLeft:'1px solid var(--line)', paddingLeft:14}}>Об авторе: {artist.bio}</p>
              )}
            </div>
            <div className="artwork-price">{fmtRub(artwork.price)}</div>
            <div className="artwork-cta">
              <button className="btn filled large full" onClick={() => addToCart(artwork)}>
                <Icon name="plus" size={14}/> Добавить в корзину
              </button>
              <button className="btn large full" onClick={() => setShowQuestion(s => !s)}>
                Задать вопрос о работе
              </button>
              {showQuestion && (
                <div className="question-form">
                  {questionSent ? (
                    <p style={{textAlign:'center', padding:'24px 0', color:'var(--accent)'}}>Вопрос отправлен. Мы ответим в течение суток.</p>
                  ) : (
                    <form onSubmit={submitQuestion}>
                      {qError && <p style={{color:'#A8302A', fontSize:13, marginBottom:12}}>{qError}</p>}
                      <div className="field"><label className="field-label">Имя</label><input className="input" value={qName} onChange={e => setQName(e.target.value)} required/></div>
                      <div className="field"><label className="field-label">Email</label><input className="input" type="email" value={qEmail} onChange={e => setQEmail(e.target.value)} required/></div>
                      <div className="field"><label className="field-label">Вопрос</label><textarea className="textarea" value={qText} onChange={e => setQText(e.target.value)} required/></div>
                      <button type="submit" className="btn filled full">Отправить</button>
                    </form>
                  )}
                </div>
              )}
              <p style={{fontSize:'12px', color:'var(--ink-3)', marginTop:16, lineHeight:1.5}}>Бесплатная упаковка и страховка. Доставка по СПб — следующий день. По России — 3–7 дней.</p>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="other-works">
            <div className="other-works-head">
              <div className="eyebrow" style={{marginBottom:16}}>Из мастерской художника</div>
              <h2 className="display h-lg">Другие работы<br/>{artist.name}<span style={{color:'var(--accent)'}}>.</span></h2>
            </div>
            <div className="scroll-row">
              {related.map(w => (
                <CatalogCard key={w.id} artwork={w} onClick={a => navigate('artwork', { id: a.id })} onAddToCart={addToCart}/>
              ))}
            </div>
          </section>
        )}
      </div>

      {showAR && (
        <div className="modal-backdrop" onClick={() => setShowAR(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAR(false)}><Icon name="close" size={18}/></button>
            <div className="eyebrow" style={{marginBottom:16}}>AR-просмотр</div>
            <h3 className="display">Посмотрите работу<br/>в своём интерьере<span style={{color:'var(--accent)'}}>.</span></h3>
            <p style={{margin:'16px 0 20px', fontSize:14}}>Отсканируйте QR-код телефоном. Откроется AR-сцена — наведите на стену и нажмите кнопку AR.</p>
            <img
              src={`/api/ar/${artwork.id}/qr`}
              alt="QR для AR"
              style={{display:'block', margin:'0 auto', width:220, height:220, imageRendering:'crisp-edges'}}
            />
          </div>
        </div>
      )}
    </main>
  )
}
