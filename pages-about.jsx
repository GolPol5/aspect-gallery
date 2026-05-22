// ============ ABOUT PAGE ============
const AboutPage = () => {
  const { navigate } = useApp();
  const timeline = [
    { year:'2016', title:'Основание', text:'Группа из четырёх искусствоведов и коллекционеров открывает галерею в небольшом помещении в Адмиралтейском районе. Первая выставка — «Девять имён», совместный проект выпускников Академии Штиглица.' },
    { year:'2018', title:'Переезд на Большую Морскую', text:'Галерея занимает два этажа исторического здания напротив бывшего здания Министерства иностранных дел. Площадь экспозиции вырастает в пять раз.' },
    { year:'2021', title:'Собственное собрание', text:'Запуск программы приобретения работ российских художников второй половины XX и XXI века. На сегодня в коллекции — 312 произведений.' },
    { year:'2024', title:'Кураторская программа', text:'Запущена ежегодная резиденция для молодых кураторов. Шесть проектов за два года — все показаны в основном зале.' },
    { year:'2026', title:'Сегодня', text:'15 сотрудников, 80+ проведённых выставок, 52 представленных художника. Работа с частными и корпоративными собраниями.' },
  ];

  return (
    <main data-screen-label="05 О галерее">
      <div className="about-hero" style={{backgroundImage:`url(${SEED('interior-hero')})`}}/>

      <section className="section">
        <SectionHead eyebrow="Кратко" title="О галерее"/>
        <div style={{maxWidth: 880, margin: '0 auto', padding: '0 32px', columnCount: 2, columnGap: 56}}>
          <p>«Аспект» — петербургская галерея современного искусства, основанная в 2016 году. Мы занимаемся живописью, графикой и скульптурой российских художников преимущественно среднего и старшего поколения, а также сопровождаем коллекционеров: от первой покупки до построения собственного собрания.</p>
          <p>Наш подход — без декоративности и без шума. Мы выбираем художников, чья работа имеет внутреннюю необходимость, а не следует моде. И последовательно показываем их в течение многих лет.</p>
        </div>
      </section>

      <section className="section alt">
        <SectionHead eyebrow="10 лет работы" title="История"/>
        <div className="timeline">
          {timeline.map(row => (
            <div className="timeline-row" key={row.year}>
              <div className="timeline-year">{row.year}</div>
              <div className="timeline-events">
                <h4>{row.title}</h4>
                <p>{row.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="eyebrow" style={{textAlign:'center', marginBottom: 32}}>Миссия</div>
        <div className="pull-quote">
          <em>Делать серьёзный разговор об искусстве доступным —<br/>не упрощая, но и не запирая его<br/>в академическую риторику.</em>
          <span className="cite">— Кураторский манифест, 2018</span>
        </div>
      </section>

      <section className="section alt">
        <SectionHead eyebrow="Кто мы" title="Команда"/>
        <div className="team-grid">
          {[
            { role:'Директор',          name:'Елена Дворецкая',     bio:'Искусствовед, основатель галереи. Окончила СПбГУ, стажировалась в Tate Modern.', seed:'team-1' },
            { role:'Куратор',           name:'Михаил Зорин',        bio:'Куратор современной живописи. Десять лет в Эрмитаже. С галереей с 2018 года.', seed:'team-2' },
            { role:'Куратор скульптуры',name:'Александра Петрова',  bio:'Специалист по русской и европейской скульптуре XX века. Член ICOM.', seed:'team-3' },
            { role:'Главный реставратор', name:'Виктор Лебедев',    bio:'Реставратор высшей категории, 30 лет работы с живописью и графикой.', seed:'team-4' },
          ].map(p => (
            <div className="team-card" key={p.name}>
              <div className="photo" style={{backgroundImage:`url(https://picsum.photos/seed/aspect-${p.seed}/600/600)`}}/>
              <div className="role">{p.role}</div>
              <div className="name">{p.name}</div>
              <div className="bio">{p.bio}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding: '0'}}>
        <div className="section-head" style={{marginBottom: 0, padding: '120px 32px 56px'}}>
          <div>
            <div className="eyebrow" style={{marginBottom: 16}}>Принципы работы</div>
            <h2 className="display h-xl">Ценности<span style={{color:'var(--accent)'}}>.</span></h2>
          </div>
        </div>
        <div className="values-grid">
          {[
            { num:'01', title:'Долгие отношения', text:'Мы работаем с художниками на горизонте десятилетий, а не одного сезона. Каждый автор, представленный в галерее, показывался у нас как минимум дважды.' },
            { num:'02', title:'Прозрачность', text:'Открытая ценовая политика и понятные комиссии. Документы на каждую работу — паспорт, провенанс, экспертиза при необходимости.' },
            { num:'03', title:'Сопровождение', text:'Подбор работ под пространство, доставка, монтаж, страхование, реставрация и репродукция — собственными силами и проверенными подрядчиками.' },
            { num:'04', title:'Просвещение', text:'Бесплатные кураторские туры по средам и субботам. Лекторий «Аспект» — раз в две недели, открытый вход для держателей абонемента.' },
          ].map(v => (
            <div className="value-cell" key={v.num}>
              <div className="value-num">— {v.num}</div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHead eyebrow="Помещение" title="Пространство"/>
        <div className="photo-masonry">
          {[
            { seed:'space-1', ar:'4/5' },
            { seed:'space-2', ar:'1/1' },
            { seed:'space-3', ar:'4/3' },
            { seed:'space-4', ar:'3/4' },
            { seed:'space-5', ar:'4/5' },
            { seed:'space-6', ar:'1/1' },
            { seed:'space-7', ar:'4/3' },
            { seed:'space-8', ar:'3/4' },
          ].map(p => (
            <div key={p.seed} style={{'--ar': p.ar, backgroundImage:`url(https://picsum.photos/seed/aspect-${p.seed}/800/800)`}}/>
          ))}
        </div>
      </section>

      <section className="contacts-strip">
        <div style={{gridColumn:'1 / -1', textAlign:'center'}}>
          <h2 className="display h-lg" style={{color:'white', marginBottom: 24}}>Прийти в галерею<span style={{color:'var(--accent)'}}>.</span></h2>
          <p style={{maxWidth: 540, margin:'0 auto', color:'#CCC'}}>Большая Морская, 35  ·  Пн – Вс  ·  11:00 — 21:00. Вход свободный. Кураторские туры по записи.</p>
          <div style={{display:'flex', justifyContent:'center', gap: 12, marginTop: 32}}>
            <button className="btn-pill accent" onClick={() => navigate('contacts')}>Контакты</button>
            <button className="btn-pill" style={{borderColor:'white', color:'white'}} onClick={() => navigate('exhibitions')}>Программа выставок</button>
          </div>
        </div>
      </section>
    </main>
  );
};
window.AboutPage = AboutPage;
