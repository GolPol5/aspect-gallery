// ============ EXHIBITIONS PAGE ============
const ExhibitionsPage = () => {
  const { navigate } = useApp();
  const [filter, setFilter] = useState('all');
  const filters = [
    { id:'all',     label:'Все типы' },
    { id:'current', label:'Текущие' },
    { id:'soon',    label:'Предстоящие' },
    { id:'past',    label:'Прошедшие' },
  ];
  const filtered = EXHIBITIONS.filter(e => filter === 'all' ? true : e.status === filter);

  return (
    <main data-screen-label="02 Выставки">
      <div className="page-hero">
        <div className="breadcrumbs"><a onClick={() => navigate('home')} style={{cursor:'pointer'}}>Главная</a>  /  <span>Выставки</span></div>
        <h1>Выставки<span style={{color:'var(--accent)'}}>.</span></h1>
        <div className="page-hero-meta">
          <span style={{fontSize:'14px', color:'var(--ink-3)', maxWidth:'600px'}}>Текущие и предстоящие выставочные проекты в двух залах галереи. Куратор сезона — Елена Дворецкая.</span>
          <span className="count">{filtered.length.toString().padStart(2,'0')} / {EXHIBITIONS.length.toString().padStart(2,'0')}</span>
        </div>
      </div>

      <div className="filter-bar">
        {filters.map(f => (
          <button key={f.id} className={'chip ' + (filter === f.id ? 'active' : '')} onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
      </div>

      <div className="exh-page-grid">
        {filtered.map(exh => (
          <div className={'exh-page-card ' + (exh.status === 'soon' ? 'soon' : '')} key={exh.id} onClick={() => navigate('exhibitions')}>
            <div className="img-wrap" style={{backgroundImage:`url(${SEED(exh.seed)})`}}>
              {exh.status === 'soon' && <span className="exh-badge">Скоро</span>}
              {exh.status === 'current' && <span className="exh-badge dark">Сейчас</span>}
              {exh.status === 'past'    && <span className="exh-badge" style={{background:'#777'}}>Архив</span>}
            </div>
            <div className="body">
              <div className="dates">{exh.dates}</div>
              <div className="title">{exh.title}</div>
              <div className="artists">{exh.artists}</div>
              <div className="teaser">{exh.teaser}</div>
              <span className="text-link">Подробнее <Icon name="arrow" size={14}/></span>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter pull */}
      <section className="section tight alt" style={{textAlign:'center'}}>
        <div className="eyebrow" style={{marginBottom: 24, justifyContent:'center'}}>Календарь выставок</div>
        <h3 className="display" style={{fontSize: 'clamp(40px, 6vw, 80px)', marginBottom: 32}}>Получать программу<br/>сезона раз в месяц<span style={{color:'var(--accent)'}}>.</span></h3>
        <form style={{maxWidth: 480, margin:'0 auto', display:'flex', gap: 8}} onSubmit={e=>e.preventDefault()}>
          <input className="input" type="email" placeholder="ваш@email.ru" style={{flex:1}}/>
          <button className="btn filled">Подписаться</button>
        </form>
      </section>
    </main>
  );
};
window.ExhibitionsPage = ExhibitionsPage;
