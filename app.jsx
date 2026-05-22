// ============ APP ROOT ============

const PAGES = {
  home:        { Component: HomePage,         chrome: true,  showFooter: true,  bg: 'white' },
  exhibitions: { Component: ExhibitionsPage,  chrome: true,  showFooter: true,  bg: 'white' },
  catalog:     { Component: CatalogPage,      chrome: true,  showFooter: true,  bg: 'white' },
  artwork:     { Component: ArtworkPage,      chrome: true,  showFooter: true,  bg: 'white' },
  about:       { Component: AboutPage,        chrome: true,  showFooter: true,  bg: 'white' },
  payment:     { Component: PaymentPage,      chrome: true,  showFooter: true,  bg: 'white' },
  contacts:    { Component: ContactsPage,     chrome: true,  showFooter: true,  bg: 'white' },
  auth:        { Component: AuthPage,         chrome: true,  showFooter: true,  bg: 'white' },
  account:     { Component: AccountPage,      chrome: true,  showFooter: true,  bg: 'white' },
  admin:       { Component: AdminPage,        chrome: false, showFooter: false, bg: 'admin' },
};

// Quick page switcher (dev-only utility, used as Tweaks panel)
const PageSwitcher = ({ page, navigate, hidden, onToggle }) => {
  const items = [
    { id:'home', label:'01 Главная' },
    { id:'exhibitions', label:'02 Выставки' },
    { id:'catalog', label:'03 Каталог' },
    { id:'artwork', label:'04 Произведение' },
    { id:'about', label:'05 О галерее' },
    { id:'payment', label:'06 Оплата' },
    { id:'contacts', label:'07 Контакты' },
    { id:'auth', label:'08 Авторизация' },
    { id:'account', label:'09 Кабинет' },
    { id:'admin', label:'10 Админ' },
  ];

  return (
    <div style={{
      position:'fixed', right: 16, bottom: 16, zIndex: 9999,
      fontFamily: 'JetBrains Mono, monospace',
    }}>
      {!hidden && (
        <div style={{
          background:'white', border:'1px solid var(--ink)',
          padding: '14px 14px 12px',
          width: 240,
          marginBottom: 8,
          boxShadow: '4px 4px 0 rgba(0,0,0,0.06)',
        }}>
          <div style={{
            fontSize: 10, letterSpacing:'0.18em', textTransform:'uppercase',
            color:'var(--ink-3)', marginBottom: 10,
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
            <span>Все страницы · 10</span>
            <span style={{color: 'var(--accent)'}}>●</span>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 0}}>
            {items.map(it => (
              <div key={it.id}
                onClick={() => navigate(it.id, it.id === 'artwork' ? { id: 1 } : {})}
                style={{
                  padding: '6px 0',
                  fontSize: 11,
                  cursor:'pointer',
                  color: page === it.id ? 'var(--accent)' : 'var(--ink)',
                  borderBottom: '1px solid var(--line)',
                  display:'flex', justifyContent:'space-between',
                }}>
                <span>{it.label}</span>
                {page === it.id && <span>●</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={onToggle} style={{
        height: 36, padding: '0 14px',
        background: 'var(--ink)', color:'white',
        fontSize: 11, letterSpacing:'0.14em', textTransform:'uppercase',
        border: 0, fontFamily:'inherit',
        display:'flex', alignItems:'center', gap: 8,
      }}>
        <span style={{background:'var(--accent)', width: 6, height: 6, display:'inline-block'}}></span>
        {hidden ? 'Pages' : 'Hide'}
      </button>
    </div>
  );
};

function App() {
  const [page, setPage] = useState('home');
  const [params, setParams] = useState({});
  const [cart, setCart] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const [switcherHidden, setSwitcherHidden] = useState(false);

  const navigate = (p, params2 = {}) => {
    setPage(p);
    setParams(params2);
    // Reset scroll on every nav
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const addToCart = (a) => {
    setCart(prev => prev.some(w => w.id === a.id) ? prev : [...prev, a]);
  };
  const removeFromCart = (i) => setCart(prev => prev.filter((_, idx) => idx !== i));
  const addQuestion = (q) => setQuestions(prev => [{ ...q, date: new Date().toLocaleDateString('ru-RU'), status:'pending' }, ...prev]);
  const login = (u) => setUser(u);
  const logout = () => setUser(null);

  const { Component, chrome, showFooter, bg } = PAGES[page];

  return (
    <AppContext.Provider value={{ page, params, navigate, cart, addToCart, removeFromCart, questions, addQuestion, user, login, logout }}>
      <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', background: bg === 'admin' ? '#0E0E0E' : 'white'}}>
        {chrome && <Header/>}
        <div style={{flex: 1}}>
          <Component/>
        </div>
        {showFooter && <Footer/>}
      </div>
      <PageSwitcher page={page} navigate={navigate} hidden={switcherHidden} onToggle={() => setSwitcherHidden(h => !h)}/>
    </AppContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
