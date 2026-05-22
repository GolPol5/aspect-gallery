import React, { useState, useEffect } from 'react'
import { AppContext, useApp } from './context'
import { COLORS_SWATCH, fmtRub, SEED, SEEDSQ, artworkImg, localArtwork, localExhibition, localHero, localInterior, localTeam } from './data'
import { api } from './api'

export { AppContext, useApp, COLORS_SWATCH, fmtRub, SEED, SEEDSQ, artworkImg, localArtwork, localExhibition, localHero, localInterior, localTeam }

// Smart image with local-first, fallback on error
export const GalleryImage = ({ local, fallback, alt = '', className, style, onClick }) => (
  <img
    src={local}
    alt={alt}
    className={className}
    style={style}
    onClick={onClick}
    onError={e => { if (e.target.src !== fallback) e.target.src = fallback }}
  />
)

export const BgImage = ({ local, fallback, className, style, children, onClick }) => {
  const [src, setSrc] = useState(local)
  useEffect(() => {
    const img = new Image()
    img.src = local
    img.onerror = () => setSrc(fallback)
    img.onload  = () => setSrc(local)
    setSrc(local)
  }, [local, fallback])
  return (
    <div className={className} style={{ ...style, backgroundImage: `url(${src})` }} onClick={onClick}>
      {children}
    </div>
  )
}

// ============ ICON SET ============
export const Icon = ({ name, size = 16, stroke = 1.5 }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'cart':      return <svg {...props}><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M3 4h2l2.5 11h11l2-7H6"/></svg>
    case 'user':      return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>
    case 'arrow':     return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    case 'arrowne':   return <svg {...props}><path d="M7 17 17 7M8 7h9v9"/></svg>
    case 'close':     return <svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>
    case 'plus':      return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>
    case 'minus':     return <svg {...props}><path d="M5 12h14"/></svg>
    case 'edit':      return <svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
    case 'trash':     return <svg {...props}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></svg>
    case 'frame':     return <svg {...props}><rect x="3" y="4" width="18" height="14" rx="0"/><path d="M3 8h18M8 4v14"/></svg>
    case 'ar':        return <svg {...props}><path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><circle cx="12" cy="12" r="3"/></svg>
    case 'instagram': return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></svg>
    case 'telegram':  return <svg {...props}><path d="M22 3 2 11l6 3 2 6 4-4 6 5Z"/></svg>
    case 'vk':        return <svg {...props}><path d="M3 7h2c.5 6 4 9 5 9V7h2v4c2 0 4-2 4-4h2c0 3-2 5-3 6 1 1 4 3 4 6h-2c-1-2-3-4-5-4v4h-1c-4 0-7-3-8-11Z"/></svg>
    case 'search':    return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
    case 'pin':       return <svg {...props}><path d="M12 22s8-7 8-13a8 8 0 0 0-16 0c0 6 8 13 8 13Z"/><circle cx="12" cy="9" r="3"/></svg>
    case 'package':   return <svg {...props}><path d="m3 7 9-4 9 4-9 4Z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/></svg>
    case 'image':     return <svg {...props}><rect x="3" y="3" width="18" height="18"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>
    case 'doc':       return <svg {...props}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h6"/></svg>
    case 'users':     return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    case 'msg':       return <svg {...props}><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5l-5 2 1-4a8 8 0 1 1 13-6.5Z"/></svg>
    case 'gear':      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>
    case 'menu':      return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    default: return null
  }
}

const NAV_ITEMS = [
  { key: 'exhibitions', label: 'Выставки' },
  { key: 'catalog',     label: 'Каталог' },
  { key: 'about',       label: 'О галерее' },
  { key: 'payment',     label: 'Оплата и доставка' },
  { key: 'contacts',    label: 'Контакты' },
]

// ============ HEADER ============
export const Header = () => {
  const { page, navigate, cart, user } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [badgePop, setBadgePop] = useState(false)
  const prevCount = React.useRef(cart.length)

  React.useEffect(() => {
    if (cart.length > prevCount.current) {
      setBadgePop(true)
      setTimeout(() => setBadgePop(false), 400)
    }
    prevCount.current = cart.length
  }, [cart.length])

  const go = (key) => { navigate(key); setMenuOpen(false) }

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="brand" onClick={() => go('home')}>
            АСПЕКТ<span className="brand-dot"></span>
          </div>
          <nav className="nav">
            {NAV_ITEMS.map(item => (
              <span key={item.key}
                className={'nav-link ' + (page === item.key ? 'active' : '')}
                onClick={() => go(item.key)}>
                {item.label}
              </span>
            ))}
          </nav>
          <div className="header-actions">
            <button className="btn-pill" onClick={() => go('exhibitions')}>
              <Icon name="arrowne" size={14}/> Купить билет
            </button>
            <button className="icon-btn" aria-label="Корзина" onClick={() => go('account', { tab: 'cart' })}>
              <Icon name="cart" size={16}/>
              {cart.length > 0 && <span className={'badge' + (badgePop ? ' pop' : '')}>{cart.length}</span>}
            </button>
            <button className="icon-btn" aria-label="Аккаунт"
              onClick={() => go(user ? 'account' : 'auth')}
              onDoubleClick={() => go('admin')}>
              <Icon name="user" size={16}/>
            </button>
            <button className="icon-btn burger-btn" aria-label="Меню" onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <Icon name="close" size={20}/> : <Icon name="menu" size={20}/>}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <nav onClick={e => e.stopPropagation()}>
            <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
              <Icon name="close" size={22}/>
            </button>
            {NAV_ITEMS.map(item => (
              <span key={item.key}
                className={'mobile-nav-link ' + (page === item.key ? 'active' : '')}
                onClick={() => go(item.key)}>
                {item.label}
              </span>
            ))}
            <div className="mobile-menu-actions">
              <button className="btn-pill" onClick={() => go('exhibitions')}>
                <Icon name="arrowne" size={14}/> Купить билет
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

// ============ FOOTER ============
export const Footer = () => {
  const { navigate } = useApp()
  const [email, setEmail] = useState('')
  const [done, setDone]   = useState(false)

  const subscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    try {
      await api.newsletter.subscribe({ email, source: 'footer' })
      setDone(true)
      setEmail('')
    } catch { /* silent */ }
  }

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="display" style={{fontSize:'28px', letterSpacing:'0.02em'}}>АСПЕКТ<span style={{color:'#B5622A'}}>.</span></div>
          <p style={{maxWidth:'280px'}}>Галерея современного искусства в Санкт-Петербурге. Живопись, скульптура, графика. С 2016 года.</p>
        </div>
        <div>
          <h4>Навигация</h4>
          <ul>
            {NAV_ITEMS.map(i => (
              <li key={i.key}><a onClick={() => navigate(i.key)} style={{cursor:'pointer'}}>{i.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Контакты</h4>
          <ul>
            <li>Санкт-Петербург,</li>
            <li>ул. Большая Морская, 35</li>
            <li>+7 (812) 000-00-00</li>
            <li>info@aspect-gallery.ru</li>
            <li style={{marginTop:8, color:'#888'}}>Пн–Вс · 11:00 – 21:00</li>
          </ul>
        </div>
        <div>
          <h4>Подписка</h4>
          <div className="social-row">
            <a href="#" aria-label="Telegram"><Icon name="telegram" size={14}/></a>
            <a href="#" aria-label="VK"><Icon name="vk" size={14}/></a>
          </div>
          <p style={{fontSize:'13px', maxWidth:'280px'}}>Новости о выставках и приватных показах — раз в две недели.</p>
          {done ? (
            <p style={{fontSize:'13px', color:'#B5622A', marginTop:8}}>Вы подписаны!</p>
          ) : (
            <form className="newsletter" onSubmit={subscribe}>
              <input type="email" placeholder="ваш@email.ru" value={email} onChange={e => setEmail(e.target.value)}/>
              <button type="submit">↗</button>
            </form>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Галерея Аспект. Все права защищены.</span>
        <span><a href="#">Cookie policy</a> · <a href="#">Политика конфиденциальности</a></span>
      </div>
    </footer>
  )
}

// ============ SECTION HEAD ============
export const SectionHead = ({ eyebrow, title, action, onAction, accent }) => (
  <div className="section-head">
    <div>
      {eyebrow && <div className="eyebrow" style={{marginBottom:16}}>{eyebrow}</div>}
      <h2 className="display h-xl">{title}{accent && <span style={{color:'var(--accent)'}}>.</span>}</h2>
    </div>
    {action && <span className="text-link" onClick={onAction}>{action} <Icon name="arrow" size={14}/></span>}
  </div>
)

// ============ CATALOG CARD ============
export const CatalogCard = ({ artwork, onClick, onAddToCart }) => {
  const { cart } = useApp()
  const [justAdded, setJustAdded] = useState(false)
  const artistName = artwork.artist?.name ?? ''
  const imgSrc     = artworkImg(artwork)
  const inCart     = cart.some(w => w.id === artwork.id)

  const handleAdd = (e) => {
    e.stopPropagation()
    if (inCart || justAdded) return
    onAddToCart && onAddToCart(artwork)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 900)
  }

  const btnClass = justAdded ? 'btn-pill just-added' : inCart ? 'btn-pill in-cart' : 'btn-pill filled'

  return (
    <div className={'cat-card' + (inCart ? ' in-cart' : '')} onClick={() => onClick && onClick(artwork)}>
      {imgSrc ? (
        <div className="cat-card-img" style={{backgroundImage:`url(${imgSrc})`}}/>
      ) : (
        <div className="cat-card-img" style={{background:'#F0EDE8'}}/>
      )}
      <div className="cat-overlay">
        <button className={btnClass} onClick={handleAdd}>
          {justAdded
            ? <><Icon name="plus" size={12}/> <span>Добавлено</span></>
            : inCart
              ? <><Icon name="plus" size={12}/> В корзине</>
              : 'В корзину'
          }
        </button>
        <button className="btn-pill" onClick={e => { e.stopPropagation(); onClick && onClick(artwork) }}>
          Подробнее <Icon name="arrow" size={12}/>
        </button>
      </div>
      <div className="cat-card-body">
        <div className="cat-card-artist">{artistName}</div>
        <div className="cat-card-title"><em>{artwork.title}</em>, {artwork.year}</div>
        <div className="cat-card-price">{fmtRub(artwork.price)}</div>
        {inCart && (
          <div className="cat-in-cart-dot">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="#2E7D52"><circle cx="4" cy="4" r="4"/></svg>
            В корзине
          </div>
        )}
      </div>
    </div>
  )
}
