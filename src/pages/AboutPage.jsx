import { useApp } from '../context'
import { SEED, localInterior, localTeam } from '../data'
import { Icon, SectionHead, BgImage } from '../components'

export default function AboutPage() {
  const { navigate } = useApp()

  const timeline = [
    { year:'2016', title:'Основание', text:'Группа из четырёх искусствоведов и коллекционеров открывает галерею в небольшом помещении в Адмиралтейском районе. Первая выставка — «Девять имён», совместный проект выпускников Академии Штиглица.' },
    { year:'2018', title:'Переезд на Большую Морскую', text:'Галерея занимает два этажа исторического здания напротив бывшего здания Министерства иностранных дел. Площадь экспозиции вырастает в пять раз.' },
    { year:'2021', title:'Собственное собрание', text:'Запуск программы приобретения работ российских художников второй половины XX и XXI века. На сегодня в коллекции — 312 произведений.' },
    { year:'2024', title:'Кураторская программа', text:'Запущена ежегодная резиденция для молодых кураторов. Шесть проектов за два года — все показаны в основном зале.' },
    { year:'2026', title:'Сегодня', text:'15 сотрудников, 80+ проведённых выставок, 52 представленных художника. Работа с частными и корпоративными собраниями.' },
  ]

  const team = [
    { role:'Директор',             name:'Елена Дворецкая',    bio:'Искусствовед, основатель галереи. Окончила СПбГУ, стажировалась в Tate Modern.',                    seed:'team-1' },
    { role:'Куратор',              name:'Михаил Зорин',       bio:'Куратор современной живописи. Десять лет в Эрмитаже. С галереей с 2018 года.',                      seed:'team-2' },
    { role:'Куратор скульптуры',   name:'Александра Петрова', bio:'Специалист по русской и европейской скульптуре XX века. Член ICOM.',                                 seed:'team-3' },
    { role:'Главный реставратор',  name:'Виктор Лебедев',     bio:'Реставратор высшей категории, 30 лет работы с живописью и графикой.',                               seed:'team-4' },
  ]

  const values = [
    { num:'01', title:'Долгие отношения', text:'Мы работаем с художниками на горизонте десятилетий, а не одного сезона. Каждый автор, представленный в галерее, показывался у нас как минимум дважды.' },
    { num:'02', title:'Прозрачность',     text:'Открытая ценовая политика и понятные комиссии. Документы на каждую работу — паспорт, провенанс, экспертиза при необходимости.' },
    { num:'03', title:'Сопровождение',    text:'Подбор работ под пространство, доставка, монтаж, страхование, реставрация и репродукция — собственными силами и проверенными подрядчиками.' },
    { num:'04', title:'Просвещение',      text:'Бесплатные кураторские туры по средам и субботам. Лекторий «Аспект» — раз в две недели, открытый вход для держателей абонемента.' },
  ]

  const spaces = [
    { src:'/imagesMain/prostanstvo6.jpg',  ar:'4/5' },
    { src:'/imagesMain/prostranstvo1.jpg', ar:'1/1' },
    { src:'/imagesMain/prostranstvo2.jpg', ar:'4/3' },
    { src:'/imagesMain/prostranstvo3.jpg', ar:'3/4' },
    { src:'/imagesMain/prostranstvo4.jpg', ar:'4/5' },
    { src:'/imagesMain/prostranstvo5.jpg', ar:'1/1' },
    { src:'/imagesMain/prostranstvo7.jpg', ar:'4/3' },
    { src:'/imagesMain/prostranstvo8.jpg', ar:'3/4' },
  ]

  return (
    <main>
      <BgImage className="about-hero" local="/imagesMain/main_gallery.jpg" fallback={SEED('interior-hero')}>
        <div className="about-hero-overlay"/>
        <div className="about-hero-content">
          <div className="eyebrow" style={{color:'rgba(255,255,255,0.55)', marginBottom:20}}>Галерея Аспект · Санкт-Петербург · с 2016</div>
          <h1 className="display" style={{color:'white', marginBottom:24, fontSize:'clamp(48px, 9vw, 160px)', letterSpacing:'-0.035em', lineHeight:0.88, whiteSpace:'nowrap'}}>О галерее<span style={{color:'var(--accent)'}}>.</span></h1>
          <p style={{fontSize:17, lineHeight:1.6, color:'rgba(255,255,255,0.75)', maxWidth:520}}>Петербургская галерея современного искусства. Живопись, скульптура и графика российских художников.</p>
        </div>
      </BgImage>


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
        <div className="eyebrow" style={{textAlign:'center', marginBottom:32}}>Миссия</div>
        <div className="pull-quote">
          <em>Делать серьёзный разговор об искусстве доступным —<br/>не упрощая, но и не запирая его<br/>в академическую риторику.</em>
          <span className="cite">— Кураторский манифест, 2018</span>
        </div>
      </section>

      <section className="section alt">
        <SectionHead eyebrow="Кто мы" title="Команда"/>
        <div className="team-grid">
          {team.map(p => (
            <div className="team-card" key={p.name}>
              <BgImage className="photo" local={localTeam(p.seed)} fallback={`https://picsum.photos/seed/aspect-${p.seed}/600/600`}/>
              <div className="role">{p.role}</div>
              <div className="name">{p.name}</div>
              <div className="bio">{p.bio}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:'0'}}>
        <div className="section-head" style={{marginBottom:0, padding:'120px 32px 56px'}}>
          <div>
            <div className="eyebrow" style={{marginBottom:16}}>Принципы работы</div>
            <h2 className="display h-xl">Ценности<span style={{color:'var(--accent)'}}>.</span></h2>
          </div>
        </div>
        <div className="values-grid">
          {values.map(v => (
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
          {spaces.map((p, i) => (
            <BgImage key={i} local={p.src} fallback={p.src} style={{'--ar':p.ar}}/>
          ))}
        </div>
      </section>

      <section className="contacts-strip">
        <div style={{gridColumn:'1 / -1', textAlign:'center'}}>
          <h2 className="display h-lg" style={{color:'white', marginBottom:24}}>Прийти в галерею<span style={{color:'var(--accent)'}}>.</span></h2>
          <p style={{maxWidth:540, margin:'0 auto', color:'#CCC'}}>Большая Морская, 35 · Пн – Вс · 11:00 — 21:00. Вход свободный. Кураторские туры по записи.</p>
          <div style={{display:'flex', justifyContent:'center', gap:12, marginTop:32}}>
            <button className="btn-pill accent" onClick={() => navigate('contacts')}>Контакты</button>
            <button className="btn-pill" style={{borderColor:'white', color:'white'}} onClick={() => navigate('exhibitions')}>Программа выставок</button>
          </div>
        </div>
      </section>
    </main>
  )
}
