// ============ AUTH PAGE + ACCOUNT PAGE ============

const AuthPage = () => {
  const { navigate, login } = useApp();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');

  const submitLogin = (e) => {
    e.preventDefault();
    login({ name: email.split('@')[0] || 'Гость', email });
    navigate('account');
  };
  const submitRegister = (e) => {
    e.preventDefault();
    if (password !== confirm) return alert('Пароли не совпадают');
    login({ name, email });
    navigate('account');
  };

  return (
    <main data-screen-label="08 Авторизация" className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <div className={'auth-tab ' + (tab === 'login' ? 'active' : '')} onClick={() => setTab('login')}>Войти</div>
          <div className={'auth-tab ' + (tab === 'register' ? 'active' : '')} onClick={() => setTab('register')}>Зарегистрироваться</div>
        </div>

        {tab === 'login' ? (
          <form onSubmit={submitLogin}>
            <h2 className="display">Войти в кабинет<span style={{color:'var(--accent)'}}>.</span></h2>
            <p style={{fontSize:13, marginBottom: 32, color:'var(--ink-3)'}}>Введите email и пароль, чтобы вернуться к корзине и обращениям.</p>
            <div className="field"><label className="field-label">Email</label><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required/></div>
            <div className="field"><label className="field-label">Пароль</label><input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required/></div>
            <button type="submit" className="btn filled full large">Войти</button>
            <a className="forgot" href="#">Забыли пароль?</a>
          </form>
        ) : (
          <form onSubmit={submitRegister}>
            <h2 className="display">Создать аккаунт<span style={{color:'var(--accent)'}}>.</span></h2>
            <p style={{fontSize:13, marginBottom: 32, color:'var(--ink-3)'}}>Сохраняйте избранные работы, отслеживайте заказы, получайте приглашения на закрытые показы.</p>
            <div className="field"><label className="field-label">Имя</label><input className="input" value={name} onChange={e => setName(e.target.value)} required/></div>
            <div className="field"><label className="field-label">Email</label><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required/></div>
            <div className="field"><label className="field-label">Пароль</label><input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required/></div>
            <div className="field"><label className="field-label">Подтвердите пароль</label><input className="input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required/></div>
            <button type="submit" className="btn filled full large">Создать аккаунт</button>
            <p style={{fontSize: 11, color:'var(--ink-3)', marginTop: 12, textAlign:'center'}}>Регистрируясь, вы соглашаетесь с политикой обработки данных.</p>
          </form>
        )}
      </div>
      <div className="auth-skip" style={{position:'absolute', bottom: 56, left: 0, right: 0}}>
        <a onClick={() => navigate('catalog')} style={{cursor:'pointer'}}>Продолжить без аккаунта</a>
      </div>
    </main>
  );
};

// ===== Account =====

const AccountPage = () => {
  const { navigate, user, cart, removeFromCart, questions, logout, params } = useApp();
  const [tab, setTab] = useState(params.tab || 'profile');
  useEffect(() => { if (params.tab) setTab(params.tab); }, [params.tab]);

  const safeUser = user || { name: 'Анна Иванова', email: 'anna@example.com' };
  const initials = safeUser.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const [profileForm, setProfileForm] = useState({
    name: safeUser.name,
    email: safeUser.email,
    phone: '+7 (912) 345-67-89',
    city: 'Санкт-Петербург',
  });
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id:'profile',   label:'Личные данные' },
    { id:'inquiries', label:'Мои обращения' },
    { id:'cart',      label:'Корзина',   badge: cart.length },
  ];

  const cartTotal = cart.reduce((s, w) => s + w.price, 0);

  // Mock conversation data
  const [expandedThread, setExpandedThread] = useState(null);
  const threads = [
    questions[0] || { artworkId: 4, name: safeUser.name, email: safeUser.email, text:'Возможна ли доставка в Лондон? Какие сроки и стоимость?', date:'12.05.2026', status:'pending' },
    { artworkId: 1, name: safeUser.name, email: safeUser.email, text:'Можно посмотреть работу вживую перед покупкой?', date:'04.05.2026', status:'answered', reply: 'Конечно. Запишитесь на просмотр в галерее по будням с 11 до 19, либо мы можем привезти работу к вам на дом в пределах СПб.' },
  ];

  return (
    <main data-screen-label="09 Личный кабинет" className="account-layout">
      <aside className="account-sidebar">
        <div className="acc-user">
          <div className="avatar">{initials}</div>
          <div>
            <div className="name">{safeUser.name}</div>
            <div className="email">{safeUser.email}</div>
          </div>
        </div>
        <nav className="acc-nav">
          {tabs.map(t => (
            <div key={t.id} className={'acc-nav-item ' + (tab === t.id ? 'active' : '')} onClick={() => setTab(t.id)}>
              <span>{t.label}</span>
              {t.badge ? <span className="badge">{t.badge}</span> : null}
            </div>
          ))}
          <div className="acc-nav-item logout" onClick={() => { logout(); navigate('home'); }}>Выйти →</div>
        </nav>
      </aside>

      <section className="account-content">
        {tab === 'profile' && (
          <div>
            <h2>Личные данные<span style={{color:'var(--accent)'}}>.</span></h2>
            {saved && <p style={{padding:'14px 20px', background:'#ECF1ED', color:'#3A7A4D', marginBottom: 24, fontSize: 14}}>Данные сохранены.</p>}
            <form style={{maxWidth: 640}} onSubmit={e => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
              <div className="field"><label className="field-label">Имя</label><input className="input" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})}/></div>
              <div className="field"><label className="field-label">Email</label><input className="input" type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})}/></div>
              <div className="field"><label className="field-label">Телефон</label><input className="input" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})}/></div>
              <div className="field"><label className="field-label">Город</label><input className="input" value={profileForm.city} onChange={e => setProfileForm({...profileForm, city: e.target.value})}/></div>
              <button type="submit" className="btn filled large">Сохранить</button>
            </form>
          </div>
        )}

        {tab === 'inquiries' && (
          <div>
            <h2>Мои обращения<span style={{color:'var(--accent)'}}>.</span></h2>
            {threads.length === 0 ? <p style={{color:'var(--ink-3)'}}>У вас пока нет обращений.</p> :
              threads.map((th, i) => {
                const w = getArtwork(th.artworkId);
                const isOpen = expandedThread === i;
                return (
                  <div key={i}>
                    <div className="thread" onClick={() => setExpandedThread(isOpen ? null : i)}>
                      <div className="thread-thumb" style={{backgroundImage:`url(${SEEDSQ(w.seed)})`}}/>
                      <div className="thread-body">
                        <div className="thread-title">{w.title} · {getArtist(w.artistId).name}</div>
                        <div className="thread-preview">«{th.text}»</div>
                        <div className="thread-meta">
                          <span>{th.date}</span>
                          <span className={'status-badge ' + (th.status === 'pending' ? 'pending' : 'answered')}>
                            {th.status === 'pending' ? 'Ожидает ответа' : 'Отвечено'}
                          </span>
                        </div>
                      </div>
                      <Icon name="arrow" size={16}/>
                    </div>
                    {isOpen && (
                      <div style={{padding: '0 0 32px 100px', borderBottom: '1px solid var(--line)'}}>
                        <div style={{padding: '20px 24px', background:'var(--bg-alt)', marginBottom: 12}}>
                          <div style={{fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-3)', marginBottom: 6}}>Вы · {th.date}</div>
                          <p style={{fontSize: 14}}>{th.text}</p>
                        </div>
                        {th.reply ? (
                          <div style={{padding: '20px 24px', background:'white', border: '1px solid var(--line)'}}>
                            <div style={{fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--accent)', marginBottom: 6}}>Куратор галереи · {th.date}</div>
                            <p style={{fontSize: 14}}>{th.reply}</p>
                          </div>
                        ) : (
                          <p style={{fontSize: 13, color:'var(--ink-3)', padding: '16px 0'}}>Куратор галереи ответит в течение суток.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {tab === 'cart' && (
          <div>
            <h2>Корзина<span style={{color:'var(--accent)'}}>.</span></h2>
            {cart.length === 0 ? (
              <div style={{padding:'80px 0', textAlign:'center'}}>
                <p style={{fontSize: 15, color:'var(--ink-3)', marginBottom: 24}}>В корзине пусто.</p>
                <button className="btn" onClick={() => navigate('catalog')}>Перейти в каталог</button>
              </div>
            ) : (
              <>
                <div>
                  {cart.map((w, i) => {
                    const a = getArtist(w.artistId);
                    return (
                      <div key={w.id + '-' + i} className="cart-item">
                        <div className="cart-item-img" style={{backgroundImage:`url(${SEEDSQ(w.seed)})`, cursor:'pointer'}} onClick={() => navigate('artwork', { id: w.id })}/>
                        <div className="cart-item-info">
                          <div className="artist">{a.name}</div>
                          <div className="title">«{w.title}», {w.year}</div>
                          <div className="meta">{w.technique}  ·  {w.dimensions}</div>
                        </div>
                        <div className="cart-item-price">{fmtRub(w.price)}</div>
                        <button className="cart-remove" onClick={() => removeFromCart(i)} aria-label="Удалить">
                          <Icon name="close" size={14}/>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="cart-total">
                  <span className="label">Итого  ·  {cart.length} {cart.length === 1 ? 'работа' : cart.length < 5 ? 'работы' : 'работ'}</span>
                  <span className="amount">{fmtRub(cartTotal)}</span>
                  <button className="btn filled large">Оформить заказ <Icon name="arrow" size={14}/></button>
                </div>
                <p style={{fontSize: 12, color:'var(--ink-3)', marginTop: 16, textAlign:'right'}}>Доставка и упаковка рассчитываются на следующем шаге.</p>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

window.AuthPage = AuthPage;
window.AccountPage = AccountPage;
