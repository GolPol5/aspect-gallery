// ============ HOME PAGE ============
const HomePage = () => {
  const { navigate, addToCart } = useApp();
  const currentExhs = EXHIBITIONS.filter(e => e.status === 'current' || e.status === 'soon').slice(0, 3);
  const catalogPreview = ARTWORKS.slice(0, 8);

  return (
    <main data-screen-label="01 Главная">
      {/* HERO */}
      <section className="hero">
        <div className="hero-img" style={{backgroundImage:`url(${SEED('hero-main-2')})`}}/>
        <div className="hero-overlay"/>
        <div className="hero-meta-top">
          <span>Санкт-Петербург</span>
          <span>с 2016</span>
          <span>52 художника</span>
        </div>
        <div className="hero-content">
          <h1 className="hero-display">
            Галерея<br/>современного<br/>искусства<br/>
            <span style={{color: '#fff'}}>Аспект</span>
            <span style={{color: '#B5622A'}}>.</span>
          </h1>
          <p className="hero-tagline">Живопись, скульптура и графика российских художников. Закрытые показы, кураторские туры и работа с коллекционерами в самом сердце Петербурга.</p>
          <div className="hero-actions">
            <button className="btn-pill" onClick={() => navigate('exhibitions')}><Icon name="arrowne" size={14}/> Купить билет</button>
            <button className="btn-pill ghost" onClick={() => navigate('catalog')}>Смотреть каталог <Icon name="arrow" size={14}/></button>
          </div>
        </div>
        <div className="hero-corner">Текущая выставка — «Свет, прерывистый» / 10.05 — 15.07.2026</div>
      </section>

      {/* ABOUT STRIP */}
      <section className="about-strip">
        <div className="about-strip-left">
          <div className="eyebrow" style={{marginBottom: 24}}>О нас  ·  Since 2016</div>
          <h2 className="display h-lg" style={{marginBottom: 48}}>Не музей,<br/>не магазин.<br/>Галерея<span style={{color:'var(--accent)'}}>.</span></h2>
          <p>«Аспект» был основан в 2016 году группой искусствоведов и коллекционеров как площадка для серьёзного разговора о современной российской живописи. За десять лет мы провели более 80 выставок, представили работы 52 художников и сформировали собственное собрание.</p>
          <p>Сегодня галерея занимает два этажа в историческом здании на Большой Морской, в пяти минутах от Исаакиевской площади. Мы открыты семь дней в неделю и работаем с частными коллекционерами, корпоративными собраниями и музеями.</p>
          <p>Команда — пятнадцать человек: кураторы, реставраторы, дизайнеры экспозиции, специалисты по логистике произведений искусства.</p>
          <div style={{marginTop: 40}}>
            <button className="btn" onClick={() => navigate('about')}>Подробнее о галерее <Icon name="arrow" size={14}/></button>
          </div>
        </div>
        <div className="about-strip-right" style={{backgroundImage:`url(${SEED('interior-1')})`}}/>
      </section>

      {/* EXHIBITIONS */}
      <section className="section">
        <SectionHead eyebrow="2026 / выставочный сезон" title="Выставки" action="Все выставки" onAction={() => navigate('exhibitions')} accent/>
        <div className="exh-grid">
          {currentExhs.map((exh, i) => (
            <div className="exh-card" key={exh.id} onClick={() => navigate('exhibitions')}>
              <div className="exh-card-img" style={{backgroundImage:`url(${SEED(exh.seed)})`}}>
                {exh.status === 'soon' && <span className="exh-badge">Скоро</span>}
                {exh.status === 'current' && i === 0 && <span className="exh-badge dark">Сейчас</span>}
              </div>
              <div className="exh-card-body">
                <div className="exh-card-dates">{exh.dates}</div>
                <div className="exh-card-title">{exh.title}</div>
                <div className="exh-card-meta">{exh.artists}  ·  Галерея Аспект</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG MASONRY */}
      <section className="section tight" style={{paddingTop: 0}}>
        <SectionHead eyebrow="Собрание галереи" title="Каталог" action="Перейти в каталог" onAction={() => navigate('catalog')}/>
        <div className="masonry">
          {catalogPreview.map((w, i) => {
            const artist = getArtist(w.artistId);
            const heights = [1.0, 1.35, 0.95, 1.2, 1.15, 0.85, 1.3, 1.05];
            return (
              <div className="masonry-item" key={w.id} onClick={() => navigate('artwork', { id: w.id })}>
                <img src={`https://picsum.photos/seed/aspect-${w.seed}/800/${Math.round(800 * heights[i])}`} alt={w.title}/>
                <div className="masonry-overlay">
                  <div className="masonry-overlay-title">{artist.name} — {w.title}</div>
                  <div className="masonry-overlay-price">{fmtRub(w.price)}</div>
                  <button className="btn-pill" onClick={(e)=>{ e.stopPropagation(); addToCart(w); }}>В корзину</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACTS STRIP */}
      <section className="contacts-strip">
        <div>
          <h4>Телефон</h4>
          <p>+7 (812) 000-00-00</p>
          <p style={{color:'#888', fontSize:'13px', marginTop: 12}}>Звонки  ·  Пн–Вс  ·  11:00 – 21:00</p>
        </div>
        <div>
          <h4>Адрес</h4>
          <p>ул. Большая Морская, 35</p>
          <p>Санкт-Петербург, 190000</p>
          <p style={{color:'#888', fontSize:'13px', marginTop: 12}}>2 минуты от ст. м. Адмиралтейская</p>
        </div>
        <div>
          <h4>Социальные сети</h4>
          <div style={{display:'flex', gap: 12, marginTop: 4}}>
            <a href="#" style={{color:'white', borderBottom:'1px solid #444', paddingBottom: 2}}>Telegram</a>
            <a href="#" style={{color:'white', borderBottom:'1px solid #444', paddingBottom: 2}}>Instagram</a>
            <a href="#" style={{color:'white', borderBottom:'1px solid #444', paddingBottom: 2}}>VK</a>
          </div>
          <p style={{color:'#888', fontSize:'13px', marginTop: 16}}>info@aspect-gallery.ru</p>
        </div>
      </section>
    </main>
  );
};

window.HomePage = HomePage;
