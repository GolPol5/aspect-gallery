import { useState } from 'react'
import { useApp } from '../context'
import { Icon } from '../components'
import { api } from '../api'

// ============ PAYMENT PAGE ============
export function PaymentPage() {
  const { navigate } = useApp()
  const sections = [
    { id:'pay',    n:'01', title:'Способы оплаты' },
    { id:'rus',    n:'02', title:'Доставка по России' },
    { id:'world',  n:'03', title:'Международная доставка' },
    { id:'pack',   n:'04', title:'Упаковка и страховка' },
    { id:'return', n:'05', title:'Возврат и обмен' },
  ]

  return (
    <main>
      <div className="page-hero">
        <div className="breadcrumbs"><a onClick={() => navigate('home')} style={{cursor:'pointer'}}>Главная</a> / <span>Оплата и доставка</span></div>
        <h1>Оплата<br/>и доставка<span style={{color:'var(--accent)'}}>.</span></h1>
      </div>

      <article className="article">
        <div className="toc">
          <h4>Содержание</h4>
          <ul>
            {sections.map(s => (
              <li key={s.id}><a href={`#${s.id}`}><span className="mono" style={{color:'var(--accent)', marginRight:12}}>{s.n}</span>{s.title}</a></li>
            ))}
          </ul>
        </div>

        <section id="pay">
          <h2><span className="num">— 01</span>Способы оплаты</h2>
          <p>Галерея «Аспект» работает с физическими и юридическими лицами. Мы принимаем оплату следующими способами:</p>
          <ul>
            <li><strong>Банковские карты</strong> — Visa, Mastercard, МИР, UnionPay. Оплата на сайте через эквайринг Сбербанка.</li>
            <li><strong>Безналичный перевод по счёту</strong> — для физических лиц и организаций. Счёт выставляем в течение одного рабочего дня.</li>
            <li><strong>Наличный расчёт в галерее</strong> — при покупке на месте, до 600 000 ₽ согласно законодательству.</li>
            <li><strong>Рассрочка</strong> — от 3 до 12 месяцев, без процентов. Работает на работы стоимостью от 200 000 ₽. Оформление в галерее.</li>
            <li><strong>Криптовалюты</strong> — по запросу, через посредника. Стоимость пересчитывается на момент платежа.</li>
          </ul>
          <p>Право собственности на произведение переходит к покупателю в момент полной оплаты и подписания акта приёма-передачи.</p>
        </section>

        <section id="rus">
          <h2><span className="num">— 02</span>Доставка по России</h2>
          <p>Все работы упаковываются индивидуально в реставрационной мастерской галереи. Доставка осуществляется проверенными перевозчиками, специализирующимися на произведениях искусства.</p>
          <table>
            <thead><tr><th>Регион</th><th>Срок</th><th>Стоимость</th></tr></thead>
            <tbody>
              <tr><td>Санкт-Петербург и область</td><td>1–2 дня</td><td>от 3 000 ₽</td></tr>
              <tr><td>Москва и Московская область</td><td>2–3 дня</td><td>от 6 500 ₽</td></tr>
              <tr><td>Города-миллионники</td><td>3–5 дней</td><td>от 9 000 ₽</td></tr>
              <tr><td>Другие города России</td><td>5–10 дней</td><td>по расчёту</td></tr>
              <tr><td>Авиадоставка</td><td>1–3 дня</td><td>по расчёту</td></tr>
            </tbody>
          </table>
          <p>При покупке работ на сумму свыше 500 000 ₽ доставка по России бесплатна.</p>
        </section>

        <section id="world">
          <h2><span className="num">— 03</span>Международная доставка</h2>
          <p>Галерея оформляет необходимые документы для вывоза произведений искусства, включая экспертизу Министерства культуры в случаях, когда она требуется по закону.</p>
          <p>Сроки оформления документов — от 14 до 45 дней в зависимости от категории работы. Стоимость экспертизы и оформления — от 12 000 ₽.</p>
          <p>Доставка осуществляется логистическими операторами, специализирующимися на art-логистике: Crown Fine Art, Hasenkamp, Möbel Transport, Atelier 4.</p>
        </section>

        <section id="pack">
          <h2><span className="num">— 04</span>Упаковка и страховка</h2>
          <p>Каждая работа упаковывается в музейном стандарте: бескислотная бумага, защитный картон, угловые протекторы, термоусадочная плёнка, деревянный ящик при необходимости.</p>
          <p>Страховка на полную оценочную стоимость произведения включена в стоимость доставки. Страховой партнёр — «Ингосстрах», программа «Произведения искусства».</p>
        </section>

        <section id="return">
          <h2><span className="num">— 05</span>Возврат и обмен</h2>
          <p>Согласно законодательству РФ, произведения искусства не подлежат возврату или обмену как товар надлежащего качества. Однако галерея готова рассмотреть возврат или обмен в индивидуальном порядке — в течение 14 дней с момента получения работы.</p>
          <p>В случае выявленных при получении дефектов или повреждений, возникших при транспортировке, страховая компания компенсирует ущерб в полном объёме.</p>
        </section>

        <div style={{borderTop:'1px solid var(--line)', padding:'40px 0', marginTop:64, fontSize:13, color:'var(--ink-3)'}}>
          <p>Последнее обновление: 1 марта 2026</p>
        </div>
      </article>
    </main>
  )
}

// ============ CONTACTS PAGE ============
export function ContactsPage() {
  const { navigate } = useApp()
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [subject, setSubject] = useState('')
  const [msg, setMsg]         = useState('')
  const [sent,    setSent]    = useState(false)
  const [sending, setSending] = useState(false)
  const [error,   setError]   = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!name || !email || !msg) return
    setSending(true)
    setError('')
    try {
      await api.contact.send({ name, email, subject: subject || undefined, message: msg })
      setSent(true)
      setName(''); setEmail(''); setSubject(''); setMsg('')
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      setError(err.message || 'Не удалось отправить сообщение')
    } finally {
      setSending(false)
    }
  }

  return (
    <main>
      <div className="page-hero">
        <div className="breadcrumbs"><a onClick={() => navigate('home')} style={{cursor:'pointer'}}>Главная</a> / <span>Контакты</span></div>
        <h1>Контакты<span style={{color:'var(--accent)'}}>.</span></h1>
      </div>

      <div className="map-placeholder" style={{backgroundImage:'url(/imagesMain/map.jpg)', backgroundSize:'cover', backgroundPosition:'center'}}>
        <div className="map-pin">
          <Icon name="pin" size={40} stroke={1.4}/>
          <div className="label">Большая Морская, 35 · Санкт-Петербург</div>
        </div>
      </div>

      <div className="contacts-page">
        <div className="contacts-col">
          <div className="eyebrow" style={{marginBottom:24}}>Юридические реквизиты</div>
          <h2 className="display h-md" style={{marginBottom:48}}>Где нас найти<br/>и как написать<span style={{color:'var(--accent)'}}>.</span></h2>
          <div className="requisites">
            <div className="req-row"><span className="req-label">Наименование</span><span className="req-val">ИП Аспект-Галерея</span></div>
            <div className="req-row"><span className="req-label">ИНН</span><span className="req-val mono">7813000000</span></div>
            <div className="req-row"><span className="req-label">ОГРНИП</span><span className="req-val mono">123456789012345</span></div>
            <div className="req-row"><span className="req-label">Адрес</span><span className="req-val">190000, Санкт-Петербург,<br/>ул. Большая Морская, дом 35</span></div>
            <div className="req-row"><span className="req-label">Телефон</span><span className="req-val">+7 (812) 000-00-00</span></div>
            <div className="req-row"><span className="req-label">Email</span><span className="req-val">info@aspect-gallery.ru</span></div>
            <div className="req-row"><span className="req-label">Часы работы</span><span className="req-val">Пн – Вс · 11:00 – 21:00</span></div>
          </div>
          <div style={{marginTop:56, display:'flex', gap:8}}>
            <a href="#" className="btn-pill" style={{textDecoration:'none'}}><Icon name="telegram" size={14}/> Telegram</a>
            <a href="#" className="btn-pill" style={{textDecoration:'none'}}><Icon name="vk" size={14}/> VK</a>
          </div>
        </div>

        <div className="contacts-col">
          <div className="eyebrow" style={{marginBottom:24}}>Форма обратной связи</div>
          <h2 className="display h-md" style={{marginBottom:32}}>Напишите нам<span style={{color:'var(--accent)'}}>.</span></h2>
          {sent  && <p style={{padding:'16px 20px', background:'#FEF1E6', color:'var(--accent)', marginBottom:24, fontSize:14}}>Сообщение отправлено. Мы ответим в течение рабочего дня.</p>}
          {error && <p style={{padding:'16px 20px', background:'#FDE8E8', color:'#A8302A',       marginBottom:24, fontSize:14}}>{error}</p>}
          <form onSubmit={submit}>
            <div className="field"><label className="field-label">Имя</label><input className="input" value={name} onChange={e => setName(e.target.value)} required/></div>
            <div className="field"><label className="field-label">Email</label><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required/></div>
            <div className="field"><label className="field-label">Тема</label>
              <select className="select" value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="">Выберите тему</option>
                <option>Покупка работы</option>
                <option>Кураторский тур</option>
                <option>Сотрудничество с художниками</option>
                <option>Пресса</option>
                <option>Другое</option>
              </select>
            </div>
            <div className="field"><label className="field-label">Сообщение</label><textarea className="textarea" value={msg} onChange={e => setMsg(e.target.value)} required style={{height:160}}/></div>
            <button type="submit" className="btn filled large" disabled={sending}>{sending ? 'Отправка…' : 'Отправить'} <Icon name="arrow" size={14}/></button>
            <p style={{fontSize:12, color:'var(--ink-3)', marginTop:16}}>Отправляя форму, вы соглашаетесь с обработкой персональных данных.</p>
          </form>
        </div>
      </div>
    </main>
  )
}
