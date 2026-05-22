// ============ ADMIN PANEL ============

const AdminPage = () => {
  const { navigate } = useApp();
  const [section, setSection] = useState('artworks');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const sections = [
    { id:'artworks',   label:'Экспонаты',   icon:'package' },
    { id:'exhibitions',label:'Выставки',    icon:'image' },
    { id:'pages',      label:'Страницы',    icon:'doc' },
    { id:'users',      label:'Пользователи',icon:'users' },
    { id:'inquiries',  label:'Обращения',   icon:'msg' },
    { id:'settings',   label:'Настройки',   icon:'gear' },
  ];

  const startEdit = (a) => { setEditing(a); setShowForm(true); };
  const startNew  = () => { setEditing(null); setShowForm(true); };

  return (
    <main data-screen-label="10 Админ-панель" className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="name">АСПЕКТ <span style={{color:'var(--accent)'}}>·</span> admin</div>
          <div className="tag">Панель управления</div>
        </div>
        <nav className="admin-nav">
          {sections.map(s => (
            <div key={s.id} className={'admin-nav-item ' + (section === s.id ? 'active' : '')} onClick={() => { setSection(s.id); setShowForm(false); }}>
              <span className="ico"><Icon name={s.icon} size={15}/></span>
              <span>{s.label}</span>
            </div>
          ))}
          <div className="admin-nav-item" style={{marginTop: 'auto', borderTop:'1px solid #2A2A2A', paddingTop: 16, color:'#888'}} onClick={() => navigate('home')}>← На сайт</div>
        </nav>
      </aside>

      <section className="admin-content">
        {!showForm ? (
          <>
            <div className="admin-header">
              <div>
                <h1>{sections.find(s => s.id === section).label}<span style={{color:'var(--accent)'}}>.</span></h1>
                <p className="sub">
                  {section === 'artworks' && `${ARTWORKS.length} экспонатов · ${ARTWORKS.filter(a => a.type==='painting').length} живописи · ${ARTWORKS.filter(a => a.type==='sculpture').length} скульптур`}
                  {section === 'exhibitions' && `${EXHIBITIONS.length} выставок · ${EXHIBITIONS.filter(e => e.status==='current').length} текущих`}
                  {section === 'pages' && 'Управление статическими страницами сайта'}
                  {section === 'users' && '847 зарегистрированных пользователей'}
                  {section === 'inquiries' && '12 необработанных обращений'}
                  {section === 'settings' && 'Общие настройки галереи'}
                </p>
              </div>
              {section === 'artworks' && <button className="btn filled" onClick={startNew}><Icon name="plus" size={14}/> Добавить экспонат</button>}
              {section === 'exhibitions' && <button className="btn filled" onClick={startNew}><Icon name="plus" size={14}/> Новая выставка</button>}
            </div>

            {section === 'artworks' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{width: 80}}>Превью</th>
                    <th>Название</th>
                    <th>Художник</th>
                    <th>Тип</th>
                    <th>Цена</th>
                    <th>Статус</th>
                    <th style={{width: 100, textAlign:'right'}}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {ARTWORKS.map(w => {
                    const a = getArtist(w.artistId);
                    return (
                      <tr key={w.id}>
                        <td><div className="preview" style={{backgroundImage:`url(${SEEDSQ(w.seed)})`}}/></td>
                        <td><strong>{w.title}</strong> <span style={{color:'var(--ink-3)'}}>· {w.year}</span></td>
                        <td>{a.name}</td>
                        <td>{w.type === 'painting' ? 'Живопись' : w.type === 'sculpture' ? 'Скульптура' : 'Графика'}</td>
                        <td className="mono">{fmtRub(w.price)}</td>
                        <td><span className="status-badge answered">Опубликован</span></td>
                        <td>
                          <div className="row-actions" style={{justifyContent:'flex-end'}}>
                            <button onClick={() => startEdit(w)}><Icon name="edit" size={13}/></button>
                            <button><Icon name="trash" size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {section === 'exhibitions' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{width: 80}}>Превью</th>
                    <th>Название</th>
                    <th>Художники</th>
                    <th>Даты</th>
                    <th>Статус</th>
                    <th style={{width: 100, textAlign:'right'}}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {EXHIBITIONS.map(e => (
                    <tr key={e.id}>
                      <td><div className="preview" style={{backgroundImage:`url(${SEED(e.seed)})`}}/></td>
                      <td><strong>{e.title}</strong></td>
                      <td>{e.artists}</td>
                      <td className="mono" style={{fontSize: 12}}>{e.dates}</td>
                      <td>
                        <span className={'status-badge ' + (e.status === 'current' ? 'answered' : 'pending')}>
                          {e.status === 'current' ? 'Идёт' : e.status === 'soon' ? 'Скоро' : 'Архив'}
                        </span>
                      </td>
                      <td><div className="row-actions" style={{justifyContent:'flex-end'}}>
                        <button><Icon name="edit" size={13}/></button>
                        <button><Icon name="trash" size={13}/></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {section === 'pages' && (
              <table className="data-table">
                <thead><tr><th>Страница</th><th>URL</th><th>Последнее изменение</th><th style={{width: 100, textAlign:'right'}}>Действия</th></tr></thead>
                <tbody>
                  {[
                    { name:'Главная', url:'/', date:'12.05.2026' },
                    { name:'О галерее', url:'/about', date:'08.04.2026' },
                    { name:'Оплата и доставка', url:'/payment', date:'01.03.2026' },
                    { name:'Контакты', url:'/contacts', date:'15.02.2026' },
                    { name:'Политика конфиденциальности', url:'/privacy', date:'01.01.2026' },
                  ].map(p => (
                    <tr key={p.url}>
                      <td><strong>{p.name}</strong></td>
                      <td className="mono" style={{color:'var(--ink-3)', fontSize: 12}}>{p.url}</td>
                      <td>{p.date}</td>
                      <td><div className="row-actions" style={{justifyContent:'flex-end'}}><button><Icon name="edit" size={13}/></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {section === 'users' && (
              <table className="data-table">
                <thead><tr><th>Имя</th><th>Email</th><th>Регистрация</th><th>Заказов</th><th style={{width: 100, textAlign:'right'}}>Действия</th></tr></thead>
                <tbody>
                  {[
                    { name:'Анна Иванова', email:'anna.ivanova@example.com', reg:'14.04.2026', orders: 2 },
                    { name:'Михаил Петров', email:'m.petrov@example.com', reg:'02.03.2026', orders: 1 },
                    { name:'Екатерина Смирнова', email:'k.smirnova@example.com', reg:'18.02.2026', orders: 4 },
                    { name:'Дмитрий Кузнецов', email:'d.kuznetsov@example.com', reg:'09.01.2026', orders: 0 },
                    { name:'Ольга Васильева', email:'o.vasilieva@example.com', reg:'22.11.2025', orders: 3 },
                  ].map(u => (
                    <tr key={u.email}>
                      <td><strong>{u.name}</strong></td>
                      <td style={{color:'var(--ink-3)'}}>{u.email}</td>
                      <td>{u.reg}</td>
                      <td className="mono">{u.orders}</td>
                      <td><div className="row-actions" style={{justifyContent:'flex-end'}}><button><Icon name="edit" size={13}/></button><button><Icon name="trash" size={13}/></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {section === 'inquiries' && (
              <table className="data-table">
                <thead><tr><th>От</th><th>Работа</th><th>Сообщение</th><th>Дата</th><th>Статус</th><th style={{width: 100, textAlign:'right'}}>Действия</th></tr></thead>
                <tbody>
                  {[
                    { from:'Анна Иванова', art: ARTWORKS[3], msg:'Возможна ли доставка в Лондон?', date:'12.05', status:'pending' },
                    { from:'Михаил Петров', art: ARTWORKS[0], msg:'Можно посмотреть работу вживую?', date:'08.05', status:'answered' },
                    { from:'Екатерина Смирнова', art: ARTWORKS[10], msg:'Есть ли скидка при покупке двух работ?', date:'04.05', status:'answered' },
                    { from:'Дмитрий Кузнецов', art: ARTWORKS[5], msg:'Какая упаковка предусмотрена для отправки?', date:'02.05', status:'pending' },
                  ].map((m, i) => (
                    <tr key={i}>
                      <td><strong>{m.from}</strong></td>
                      <td>{m.art.title}</td>
                      <td style={{color:'var(--ink-3)', maxWidth: 280}}>«{m.msg}»</td>
                      <td>{m.date}</td>
                      <td><span className={'status-badge ' + (m.status === 'pending' ? 'pending' : 'answered')}>{m.status === 'pending' ? 'Ожидает' : 'Отвечено'}</span></td>
                      <td><div className="row-actions" style={{justifyContent:'flex-end'}}><button><Icon name="edit" size={13}/></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {section === 'settings' && (
              <div className="admin-form">
                <div className="form-grid">
                  <div className="field"><label className="field-label">Название галереи</label><input className="input" defaultValue="Галерея «Аспект»"/></div>
                  <div className="field"><label className="field-label">Контактный email</label><input className="input" defaultValue="info@aspect-gallery.ru"/></div>
                  <div className="field"><label className="field-label">Телефон</label><input className="input" defaultValue="+7 (812) 000-00-00"/></div>
                  <div className="field"><label className="field-label">Адрес</label><input className="input" defaultValue="ул. Большая Морская, 35"/></div>
                </div>
                <div className="field"><label className="field-label">Описание для поисковых систем</label><textarea className="textarea" defaultValue="Галерея современного искусства в Санкт-Петербурге. Живопись, скульптура, графика российских художников."/></div>
                <button className="btn filled">Сохранить изменения</button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="admin-header">
              <div>
                <button className="text-link" onClick={() => setShowForm(false)} style={{marginBottom: 16, fontSize:13}}>← Назад к списку</button>
                <h1>{editing ? 'Редактирование' : 'Новый экспонат'}<span style={{color:'var(--accent)'}}>.</span></h1>
                <p className="sub">{editing ? `${editing.title}, ${editing.year}` : 'Заполните карточку произведения'}</p>
              </div>
            </div>

            <div className="admin-form">
              <div className="form-grid">
                <div className="field"><label className="field-label">Название</label><input className="input" defaultValue={editing?.title || ''}/></div>
                <div className="field"><label className="field-label">Художник</label>
                  <select className="select" defaultValue={editing?.artistId || ''}>
                    <option value="">Выберите художника</option>
                    {ARTISTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div className="field"><label className="field-label">Тип</label>
                  <select className="select" defaultValue={editing?.type || 'painting'}>
                    <option value="painting">Живопись</option>
                    <option value="graphic">Графика</option>
                    <option value="sculpture">Скульптура</option>
                  </select>
                </div>
                <div className="field"><label className="field-label">Жанр</label>
                  <select className="select" defaultValue={editing?.genre || ''}>
                    <option value="">Выберите жанр</option>
                    <option value="abstract">Абстракция</option>
                    <option value="portrait">Портрет</option>
                    <option value="landscape">Пейзаж</option>
                    <option value="still">Натюрморт</option>
                    <option value="conceptual">Концептуальное</option>
                  </select>
                </div>
                <div className="field"><label className="field-label">Год</label><input className="input" type="number" defaultValue={editing?.year || 2026}/></div>
                <div className="field"><label className="field-label">Техника</label><input className="input" defaultValue={editing?.technique || ''}/></div>
                <div className="field"><label className="field-label">Размеры</label><input className="input" defaultValue={editing?.dimensions || ''}/></div>
                <div className="field"><label className="field-label">Цена, ₽</label><input className="input" type="number" defaultValue={editing?.price || ''}/></div>
              </div>
              <div className="field"><label className="field-label">Описание</label>
                <textarea className="textarea" defaultValue={editing?.desc || ''} style={{height: 140}}/>
              </div>
              <div className="field">
                <label className="field-label">Фотографии</label>
                <div className="dropzone">
                  <strong>Перетащите файлы сюда</strong>
                  или <a href="#" style={{color:'var(--accent)', borderBottom:'1px solid var(--accent)'}}>выберите с компьютера</a>
                  <div style={{fontSize: 11, marginTop: 8}}>JPG, PNG, до 20 МБ. Рекомендуем 2400×3000 пикселей.</div>
                  {editing && (
                    <div className="upload-thumbs">
                      {[editing.seed, editing.seed + '-b', editing.seed + '-c'].map(s => (
                        <div key={s} style={{backgroundImage:`url(https://picsum.photos/seed/aspect-${s}/200/200)`}}/>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{display:'flex', gap: 8, marginTop: 24, borderTop:'1px solid var(--line)', paddingTop: 24}}>
                <button className="btn filled" onClick={() => setShowForm(false)}>Сохранить</button>
                <button className="btn" onClick={() => setShowForm(false)}>Отмена</button>
                {editing && <button className="btn" style={{marginLeft:'auto', borderColor:'#A8302A', color:'#A8302A'}}><Icon name="trash" size={14}/> Удалить</button>}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};
window.AdminPage = AdminPage;
