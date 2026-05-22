// ============ ARTWORK DETAIL PAGE ============
const ArtworkPage = () => {
  const { navigate, params, addToCart, addQuestion } = useApp();
  const id = params.id || 1;
  const artwork = getArtwork(id) || ARTWORKS[0];
  const artist = getArtist(artwork.artistId);
  const [activeThumb, setActiveThumb] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const [qName, setQName] = useState('');
  const [qEmail, setQEmail] = useState('');
  const [qText, setQText] = useState('');
  const [questionSent, setQuestionSent] = useState(false);

  // Generate thumbnail seeds (variations)
  const thumbs = [artwork.seed, artwork.seed + '-b', artwork.seed + '-c', artwork.seed + '-d'];
  const primaryImg = activeThumb === 0 ? SEED(artwork.seed) : `https://picsum.photos/seed/aspect-${thumbs[activeThumb]}/1200/1500`;

  const otherWorks = ARTWORKS.filter(w => w.artistId === artwork.artistId && w.id !== artwork.id).slice(0, 6);
  const moreOfType = ARTWORKS.filter(w => w.id !== artwork.id).slice(0, 4);
  const recommendations = otherWorks.length > 0 ? otherWorks : moreOfType;

  const typeLabel = { painting:'Живопись', sculpture:'Скульптура', graphic:'Графика' }[artwork.type];

  const submitQuestion = (e) => {
    e.preventDefault();
    if (!qName || !qEmail || !qText) return;
    addQuestion({ artworkId: artwork.id, name: qName, email: qEmail, text: qText });
    setQuestionSent(true);
    setTimeout(() => { setShowQuestion(false); setQuestionSent(false); setQName(''); setQEmail(''); setQText(''); }, 1800);
  };

  return (
    <main data-screen-label="04 Карточка произведения">
      <div className="artwork-page">
        <div className="breadcrumbs">
          <a onClick={() => navigate('catalog')} style={{cursor:'pointer'}}>Каталог</a>  /  <a onClick={() => navigate('catalog')} style={{cursor:'pointer'}}>{typeLabel}</a>  /  <span>{artwork.title}</span>
        </div>

        <div className="artwork-grid">
          {/* LEFT: images */}
          <div className="artwork-images">
            <div className="artwork-primary" style={{backgroundImage:`url(${primaryImg})`}}/>
            <div className="artwork-thumbs">
              {thumbs.map((seed, i) => (
                <div key={i} className={'artwork-thumb ' + (activeThumb === i ? 'active' : '')}
                  style={{backgroundImage:`url(https://picsum.photos/seed/aspect-${seed}/400/400)`}}
                  onClick={() => setActiveThumb(i)}/>
              ))}
            </div>
            <div className="artwork-actions">
              <button className="btn" onClick={() => setShowAR(true)}><Icon name="frame" size={16}/> В интерьере</button>
              <button className="btn" onClick={() => setShowAR(true)}><Icon name="ar" size={16}/> AR-просмотр</button>
              <button className="btn" style={{borderColor:'var(--line)', color:'var(--ink-3)'}}>♡ В избранное</button>
            </div>
          </div>

          {/* RIGHT: info */}
          <aside className="artwork-info">
            <div className="artwork-artist"><a href="#" style={{borderBottom:'1px solid var(--accent)', paddingBottom: 2}}>{artist.name.toUpperCase()}</a></div>
            <h1 className="artwork-title">{artwork.title}</h1>
            <div className="artwork-meta">
              <span>Год  <strong>{artwork.year}</strong></span>
              <span>Техника  <strong>{artwork.technique}</strong></span>
              <span>Размер  <strong>{artwork.dimensions}</strong></span>
            </div>
            <div className="artwork-desc">
              <p>{artwork.desc}</p>
              <p>Работа поставляется с авторским сертификатом подлинности. Возможна организация просмотра в галерее или выезд куратора с произведением.</p>
              <p style={{fontSize:'13px', color:'var(--ink-3)', borderLeft:'1px solid var(--line)', paddingLeft: 14}}>Об авторе: {artist.bio}</p>
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
                      <div className="field">
                        <label className="field-label">Имя</label>
                        <input className="input" value={qName} onChange={e => setQName(e.target.value)} required/>
                      </div>
                      <div className="field">
                        <label className="field-label">Email</label>
                        <input className="input" type="email" value={qEmail} onChange={e => setQEmail(e.target.value)} required/>
                      </div>
                      <div className="field">
                        <label className="field-label">Вопрос</label>
                        <textarea className="textarea" value={qText} onChange={e => setQText(e.target.value)} required/>
                      </div>
                      <button type="submit" className="btn filled full">Отправить</button>
                    </form>
                  )}
                </div>
              )}
              <p style={{fontSize:'12px', color:'var(--ink-3)', marginTop: 16, lineHeight:1.5}}>Бесплатная упаковка и страховка. Доставка по СПб — следующий день. По России — 3–7 дней.</p>
            </div>
          </aside>
        </div>

        {/* OTHER WORKS */}
        <section className="other-works">
          <div className="other-works-head">
            <div className="eyebrow" style={{marginBottom: 16}}>Из мастерской художника</div>
            <h2 className="display h-lg">Другие работы<br/>{artist.name}<span style={{color:'var(--accent)'}}>.</span></h2>
          </div>
          <div className="scroll-row">
            {recommendations.map(w => (
              <CatalogCard key={w.id} artwork={w} onClick={(a) => navigate('artwork', { id: a.id })} onAddToCart={addToCart}/>
            ))}
          </div>
        </section>
      </div>

      {showAR && (
        <div className="modal-backdrop" onClick={() => setShowAR(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAR(false)}><Icon name="close" size={18}/></button>
            <div className="eyebrow" style={{marginBottom: 16}}>AR-просмотр</div>
            <h3 className="display">Посмотрите работу<br/>в своём интерьере<span style={{color:'var(--accent)'}}>.</span></h3>
            <p style={{margin: '20px 0', fontSize: 14}}>Отсканируйте код с помощью камеры телефона. AR-сцена откроется в браузере — потребуется доступ к камере.</p>
            <div className="qr-box"></div>
            <p style={{textAlign:'center', fontSize: 12, color:'var(--ink-3)'}}>Поддерживается на iOS 13+ и Android 9+</p>
          </div>
        </div>
      )}
    </main>
  );
};
window.ArtworkPage = ArtworkPage;
