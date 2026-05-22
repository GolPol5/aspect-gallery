// ============ CATALOG PAGE ============
const CatalogPage = () => {
  const { navigate, addToCart } = useApp();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sizes, setSizes] = useState(new Set());
  const [genres, setGenres] = useState(new Set());
  const [artistId, setArtistId] = useState('');
  const [color, setColor] = useState('');

  const toggleSet = (setter, val) => setter(prev => {
    const next = new Set(prev);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  });

  const filtered = useMemo(() => {
    return ARTWORKS.filter(w => {
      const artist = getArtist(w.artistId);
      if (search && !(w.title.toLowerCase().includes(search.toLowerCase()) || artist.name.toLowerCase().includes(search.toLowerCase()))) return false;
      if (type !== 'all' && w.type !== type) return false;
      if (priceMin && w.price < +priceMin) return false;
      if (priceMax && w.price > +priceMax) return false;
      if (sizes.size && !sizes.has(w.size)) return false;
      if (genres.size && !genres.has(w.genre)) return false;
      if (artistId && w.artistId !== artistId) return false;
      return true;
    });
  }, [search, type, priceMin, priceMax, sizes, genres, artistId, color]);

  return (
    <main data-screen-label="03 Каталог">
      <div className="page-hero">
        <div className="breadcrumbs"><a onClick={() => navigate('home')} style={{cursor:'pointer'}}>Главная</a>  /  <span>Каталог</span></div>
        <h1>Каталог<span style={{color:'var(--accent)'}}>.</span></h1>
        <div className="page-hero-meta">
          <span style={{fontSize:'14px', color:'var(--ink-3)', maxWidth:'600px'}}>Живопись, графика и скульптура. Все работы в наличии. Доставка по России и за рубеж.</span>
          <span className="count">{filtered.length.toString().padStart(3,'0')} / {ARTWORKS.length.toString().padStart(3,'0')} работ</span>
        </div>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <div className="filter-group">
            <input className="search-input" placeholder="Поиск по названию..." value={search} onChange={e => setSearch(e.target.value)}/>
          </div>

          <div className="filter-group">
            <h5>Тип</h5>
            <label className="radio"><input type="radio" name="type" checked={type==='all'} onChange={() => setType('all')}/><span className="radio-mark"></span>Все</label>
            <label className="radio"><input type="radio" name="type" checked={type==='painting'} onChange={() => setType('painting')}/><span className="radio-mark"></span>Живопись</label>
            <label className="radio"><input type="radio" name="type" checked={type==='graphic'} onChange={() => setType('graphic')}/><span className="radio-mark"></span>Графика</label>
            <label className="radio"><input type="radio" name="type" checked={type==='sculpture'} onChange={() => setType('sculpture')}/><span className="radio-mark"></span>Скульптура</label>
          </div>

          <div className="filter-group">
            <h5>Цена, ₽</h5>
            <div className="price-row">
              <input placeholder="от" type="number" value={priceMin} onChange={e=>setPriceMin(e.target.value)}/>
              <input placeholder="до" type="number" value={priceMax} onChange={e=>setPriceMax(e.target.value)}/>
            </div>
          </div>

          <div className="filter-group">
            <h5>Размер</h5>
            <label className="check"><input type="checkbox" checked={sizes.has('small')} onChange={() => toggleSet(setSizes, 'small')}/><span className="check-mark"></span>Малый (до 50 см)</label>
            <label className="check"><input type="checkbox" checked={sizes.has('medium')} onChange={() => toggleSet(setSizes, 'medium')}/><span className="check-mark"></span>Средний (50–120 см)</label>
            <label className="check"><input type="checkbox" checked={sizes.has('large')} onChange={() => toggleSet(setSizes, 'large')}/><span className="check-mark"></span>Большой (120+ см)</label>
          </div>

          <div className="filter-group">
            <h5>Жанр</h5>
            <label className="check"><input type="checkbox" checked={genres.has('abstract')}    onChange={() => toggleSet(setGenres,'abstract')}/><span className="check-mark"></span>Абстракция</label>
            <label className="check"><input type="checkbox" checked={genres.has('portrait')}    onChange={() => toggleSet(setGenres,'portrait')}/><span className="check-mark"></span>Портрет</label>
            <label className="check"><input type="checkbox" checked={genres.has('landscape')}   onChange={() => toggleSet(setGenres,'landscape')}/><span className="check-mark"></span>Пейзаж</label>
            <label className="check"><input type="checkbox" checked={genres.has('still')}       onChange={() => toggleSet(setGenres,'still')}/><span className="check-mark"></span>Натюрморт</label>
            <label className="check"><input type="checkbox" checked={genres.has('conceptual')}  onChange={() => toggleSet(setGenres,'conceptual')}/><span className="check-mark"></span>Концептуальное</label>
          </div>

          <div className="filter-group">
            <h5>Художник</h5>
            <select className="select" value={artistId} onChange={e => setArtistId(e.target.value)}>
              <option value="">Все художники</option>
              {ARTISTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="filter-group" style={{borderBottom: 0}}>
            <h5>Цвет</h5>
            <div className="swatches">
              {COLORS_SWATCH.map(s => (
                <div key={s.id}
                  className={'swatch ' + (color === s.id ? 'active' : '')}
                  style={{background: s.hex}}
                  onClick={() => setColor(color === s.id ? '' : s.id)}/>
              ))}
            </div>
          </div>

          <div style={{marginTop: 24}}>
            <button className="text-link" onClick={() => { setSearch(''); setType('all'); setPriceMin(''); setPriceMax(''); setSizes(new Set()); setGenres(new Set()); setArtistId(''); setColor(''); }}>
              Сбросить фильтры
            </button>
          </div>
        </aside>

        <div>
          <div className="catalog-grid">
            {filtered.map(w => (
              <CatalogCard key={w.id} artwork={w} onClick={(a) => navigate('artwork', { id: a.id })} onAddToCart={addToCart}/>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{padding: '120px 32px', textAlign:'center', color:'var(--ink-3)'}}>
              <p style={{fontSize:'14px'}}>По заданным фильтрам ничего не найдено.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
window.CatalogPage = CatalogPage;
