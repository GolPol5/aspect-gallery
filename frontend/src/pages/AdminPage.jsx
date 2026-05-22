import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '../context'
import { fmtRub, artworkImg, fmtDateRange } from '../data'
import { api } from '../api'
import { Icon } from '../components'

// ── helpers ──────────────────────────────────────────────────────────────
const TYPE_LABEL  = { painting:'Живопись', graphic:'Графика', sculpture:'Скульптура' }
const STATUS_LABEL = { published:'Опубликован', draft:'Черновик', sold:'Продана' }
const INQ_LABEL   = { pending:'Ожидает', answered:'Отвечено' }

function useData(fetcher, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const load = () => {
    setLoading(true)
    fetcher().then(setData).catch(e => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, deps)
  return { data, loading, error, reload: load }
}

// ── sub-panels ────────────────────────────────────────────────────────────

function ArtworksPanel() {
  const { data: res, loading, reload } = useData(() => api.artworks.list({ limit: 100, status: undefined }))
  const { data: artists }              = useData(() => api.artists.list())
  const [form, setForm]  = useState(null) // null = list, {} = new, {...} = edit
  const [saving, setSaving] = useState(false)
  const [err,    setErr]    = useState('')
  const fileRef   = useRef()
  const glbRef    = useRef()
  const usdzRef   = useRef()
  const [modelSaving, setModelSaving] = useState(false)
  const [modelMsg,    setModelMsg]    = useState('')

  const uploadModels = async () => {
    const glb  = glbRef.current?.files?.[0]
    const usdz = usdzRef.current?.files?.[0]
    if (!glb && !usdz) return
    setModelSaving(true); setModelMsg('')
    try {
      const fd = new FormData()
      if (glb)  fd.append('glb',  glb)
      if (usdz) fd.append('usdz', usdz)
      await api.ar.uploadModels(form.id, fd)
      setModelMsg('Модели загружены.')
      if (glbRef.current)  glbRef.current.value  = ''
      if (usdzRef.current) usdzRef.current.value = ''
    } catch (e) { setModelMsg('Ошибка: ' + e.message) }
    finally { setModelSaving(false) }
  }

  const deleteModels = async () => {
    await api.ar.deleteModels(form.id).catch(() => {})
    setModelMsg('Кэш моделей сброшен — будут сгенерированы заново.')
  }

  const artworks = res?.data ?? []

  const startNew  = () => setForm({ title:'', artistId:'', type:'painting', genre:'abstract', size:'medium', technique:'', dimensions:'', price:'', description:'', status:'draft' })
  const startEdit = (w) => setForm({ ...w, price: String(w.price) })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      const files = fileRef.current?.files
      if (form.id) {
        // Update fields
        await api.artworks.update(form.id, {
          title: form.title, artistId: form.artistId, type: form.type, genre: form.genre,
          size: form.size, technique: form.technique, dimensions: form.dimensions,
          price: parseInt(form.price), description: form.description, status: form.status,
        })
        // Upload new images if selected
        if (files?.length) {
          const fd = new FormData()
          Array.from(files).forEach(f => fd.append('images', f))
          await api.artworks.addImages(form.id, fd)
        }
      } else {
        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v) })
        if (files?.length) Array.from(files).forEach(f => fd.append('images', f))
        await api.artworks.create(fd)
      }
      setForm(null); reload()
    } catch (e) { setErr(e.message) } finally { setSaving(false) }
  }

  const del = async (id) => {
    if (!confirm('Удалить работу?')) return
    await api.artworks.delete(id).catch(() => {})
    reload()
  }

  if (form !== null) {
    return (
      <div className="admin-form">
        <button className="text-link" onClick={() => setForm(null)} style={{marginBottom:16, fontSize:13}}>← Назад к списку</button>
        <h1>{form.id ? 'Редактирование' : 'Новый экспонат'}<span style={{color:'var(--accent)'}}>.</span></h1>
        {err && <p style={{color:'#A8302A', marginBottom:16}}>{err}</p>}
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="field"><label className="field-label">Название</label><input className="input" value={form.title} onChange={e => setForm({...form, title:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Художник</label>
              <select className="select" value={form.artistId} onChange={e => setForm({...form, artistId:e.target.value})} required>
                <option value="">Выберите художника</option>
                {(artists ?? []).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="field"><label className="field-label">Тип</label>
              <select className="select" value={form.type} onChange={e => setForm({...form, type:e.target.value})}>
                <option value="painting">Живопись</option>
                <option value="graphic">Графика</option>
                <option value="sculpture">Скульптура</option>
              </select>
            </div>
            <div className="field"><label className="field-label">Жанр</label>
              <select className="select" value={form.genre} onChange={e => setForm({...form, genre:e.target.value})}>
                <option value="abstract">Абстракция</option>
                <option value="portrait">Портрет</option>
                <option value="landscape">Пейзаж</option>
                <option value="still">Натюрморт</option>
                <option value="conceptual">Концептуальное</option>
              </select>
            </div>
            <div className="field"><label className="field-label">Размер</label>
              <select className="select" value={form.size} onChange={e => setForm({...form, size:e.target.value})}>
                <option value="small">Малый</option>
                <option value="medium">Средний</option>
                <option value="large">Большой</option>
              </select>
            </div>
            <div className="field"><label className="field-label">Год</label><input className="input" type="number" value={form.year || ''} onChange={e => setForm({...form, year:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Техника</label><input className="input" value={form.technique} onChange={e => setForm({...form, technique:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Размеры</label><input className="input" value={form.dimensions} onChange={e => setForm({...form, dimensions:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Цена, ₽</label><input className="input" type="number" value={form.price} onChange={e => setForm({...form, price:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Статус</label>
              <select className="select" value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
                <option value="draft">Черновик</option>
                <option value="published">Опубликован</option>
                <option value="sold">Продана</option>
              </select>
            </div>
          </div>
          <div className="field"><label className="field-label">Описание</label><textarea className="textarea" value={form.description || ''} onChange={e => setForm({...form, description:e.target.value})} style={{height:120}}/></div>
          <div className="field">
            <label className="field-label">Фотографии</label>
            {form.id && (form.images ?? []).length > 0 && (
              <div className="upload-thumbs" style={{marginBottom:12, display:'flex', gap:8, flexWrap:'wrap'}}>
                {form.images.map((src, i) => {
                  const filename = src.split('/').pop()
                  return (
                    <div key={i} style={{position:'relative', width:80, height:80, flexShrink:0}}>
                      <div style={{backgroundImage:`url(${src})`, backgroundSize:'cover', width:'100%', height:'100%'}}/>
                      <button
                        type="button"
                        onClick={async () => {
                          await api.artworks.deleteImage(form.id, filename).catch(() => {})
                          setForm(f => ({...f, images: f.images.filter((_, j) => j !== i)}))
                        }}
                        style={{
                          position:'absolute', top:2, right:2,
                          background:'rgba(0,0,0,0.65)', color:'white',
                          border:'none', borderRadius:'50%',
                          width:20, height:20, fontSize:12, lineHeight:'20px',
                          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0
                        }}
                      >✕</button>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="dropzone">
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{display:'block', marginBottom:8}}/>
              <div style={{fontSize:11}}>JPG, PNG, WebP · до 20 МБ · можно выбрать несколько файлов</div>
            </div>
          </div>
          <div style={{display:'flex', gap:8, marginTop:24, borderTop:'1px solid var(--line)', paddingTop:24}}>
            <button type="submit" className="btn filled" disabled={saving}>{saving ? 'Сохранение…' : 'Сохранить'}</button>
            <button type="button" className="btn" onClick={() => setForm(null)}>Отмена</button>
          </div>
        </form>

        {form.id && (
          <div style={{marginTop:32, paddingTop:32, borderTop:'1px solid var(--line)'}}>
            <div className="field-label" style={{marginBottom:16}}>AR-модели</div>
            {modelMsg && <p style={{fontSize:13, color:'var(--accent)', marginBottom:12}}>{modelMsg}</p>}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12}}>
              <div className="field">
                <label className="field-label">GLB (Android)</label>
                <input ref={glbRef} type="file" accept=".glb" style={{display:'block'}}/>
              </div>
              <div className="field">
                <label className="field-label">USDZ (iPhone)</label>
                <input ref={usdzRef} type="file" accept=".usdz" style={{display:'block'}}/>
              </div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button type="button" className="btn filled" onClick={uploadModels} disabled={modelSaving}>
                {modelSaving ? 'Загрузка…' : 'Загрузить модели'}
              </button>
              <button type="button" className="btn" onClick={deleteModels} style={{color:'var(--ink-3)'}}>
                Сбросить кэш
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Экспонаты<span style={{color:'var(--accent)'}}>.</span></h1>
          <p className="sub">{loading ? '…' : `${artworks.length} записей`}</p>
        </div>
        <button className="btn filled" onClick={startNew}><Icon name="plus" size={14}/> Добавить экспонат</button>
      </div>
      {loading ? <p style={{padding:'40px 32px', color:'var(--ink-3)'}}>Загрузка…</p> : (
        <table className="data-table">
          <thead><tr>
            <th style={{width:80}}>Превью</th>
            <th>Название</th><th>Художник</th><th>Тип</th><th>Цена</th><th>Статус</th>
            <th style={{width:100, textAlign:'right'}}>Действия</th>
          </tr></thead>
          <tbody>
            {artworks.map(w => (
              <tr key={w.id}>
                <td><div className="preview" style={{backgroundImage: artworkImg(w) ? `url(${artworkImg(w)})` : 'none', background: artworkImg(w) ? '' : '#F0EDE8'}}/></td>
                <td><strong>{w.title}</strong> <span style={{color:'var(--ink-3)'}}>· {w.year}</span></td>
                <td>{w.artist?.name}</td>
                <td>{TYPE_LABEL[w.type]}</td>
                <td className="mono">{fmtRub(w.price)}</td>
                <td><span className={'status-badge ' + (w.status === 'published' ? 'answered' : 'pending')}>{STATUS_LABEL[w.status]}</span></td>
                <td>
                  <div className="row-actions" style={{justifyContent:'flex-end'}}>
                    <button onClick={() => startEdit(w)}><Icon name="edit" size={13}/></button>
                    <button onClick={() => del(w.id)}><Icon name="trash" size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

function ExhibitionsPanel() {
  const { data: exhibitions, loading, reload } = useData(() => api.exhibitions.list())
  const [form, setForm]     = useState(null)
  const [saving, setSaving] = useState(false)
  const [err,    setErr]    = useState('')
  const fileRef = useRef()

  const startNew  = () => setForm({ title:'', slug:'', artists:'', dateStart:'', dateEnd:'', teaser:'', status:'' })
  const startEdit = (e) => setForm({ ...e, dateStart: e.dateStart?.slice(0,10), dateEnd: e.dateEnd?.slice(0,10) })

  const save = async (ev) => {
    ev.preventDefault()
    setSaving(true); setErr('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== '' && k !== 'id' && k !== 'status' && k !== 'coverImage' && k !== 'createdAt') fd.append(k, v) })
      const file = fileRef.current?.files?.[0]
      if (file) fd.append('coverImage', file)

      if (form.id) {
        await api.exhibitions.update(form.id, fd)
      } else {
        await api.exhibitions.create(fd)
      }
      setForm(null); reload()
    } catch (e) { setErr(e.message) } finally { setSaving(false) }
  }

  const del = async (id) => {
    if (!confirm('Удалить выставку?')) return
    await api.exhibitions.delete(id).catch(() => {})
    reload()
  }

  if (form !== null) {
    return (
      <div className="admin-form">
        <button className="text-link" onClick={() => setForm(null)} style={{marginBottom:16, fontSize:13}}>← Назад к списку</button>
        <h1>{form.id ? 'Редактирование выставки' : 'Новая выставка'}<span style={{color:'var(--accent)'}}>.</span></h1>
        {err && <p style={{color:'#A8302A', marginBottom:16}}>{err}</p>}
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="field"><label className="field-label">Название</label><input className="input" value={form.title} onChange={e => setForm({...form, title:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Slug (URL)</label><input className="input" value={form.slug} onChange={e => setForm({...form, slug:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Художники</label><input className="input" value={form.artists} onChange={e => setForm({...form, artists:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Дата начала</label><input className="input" type="date" value={form.dateStart} onChange={e => setForm({...form, dateStart:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Дата окончания</label><input className="input" type="date" value={form.dateEnd} onChange={e => setForm({...form, dateEnd:e.target.value})} required/></div>
          </div>
          <div className="field"><label className="field-label">Анонс</label><textarea className="textarea" value={form.teaser} onChange={e => setForm({...form, teaser:e.target.value})} style={{height:100}}/></div>
          <div className="field">
            <label className="field-label">Обложка</label>
            {form.coverImage && <div style={{width:120, height:80, backgroundImage:`url(${form.coverImage})`, backgroundSize:'cover', marginBottom:8}}/>}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"/>
          </div>
          <div style={{display:'flex', gap:8, marginTop:24, borderTop:'1px solid var(--line)', paddingTop:24}}>
            <button type="submit" className="btn filled" disabled={saving}>{saving ? 'Сохранение…' : 'Сохранить'}</button>
            <button type="button" className="btn" onClick={() => setForm(null)}>Отмена</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Выставки<span style={{color:'var(--accent)'}}>.</span></h1>
          <p className="sub">{loading ? '…' : `${(exhibitions ?? []).length} записей`}</p>
        </div>
        <button className="btn filled" onClick={startNew}><Icon name="plus" size={14}/> Новая выставка</button>
      </div>
      {loading ? <p style={{padding:'40px 32px', color:'var(--ink-3)'}}>Загрузка…</p> : (
        <table className="data-table">
          <thead><tr>
            <th style={{width:80}}>Превью</th>
            <th>Название</th><th>Художники</th><th>Даты</th><th>Статус</th>
            <th style={{width:100, textAlign:'right'}}>Действия</th>
          </tr></thead>
          <tbody>
            {(exhibitions ?? []).map(e => (
              <tr key={e.id}>
                <td><div className="preview" style={{backgroundImage: e.coverImage ? `url(${e.coverImage})` : 'none', background: e.coverImage ? '' : '#F0EDE8'}}/></td>
                <td><strong>{e.title}</strong></td>
                <td>{e.artists}</td>
                <td className="mono" style={{fontSize:12}}>{fmtDateRange(e.dateStart, e.dateEnd)}</td>
                <td><span className={'status-badge ' + (e.status === 'current' ? 'answered' : 'pending')}>{e.status === 'current' ? 'Идёт' : e.status === 'soon' ? 'Скоро' : 'Архив'}</span></td>
                <td><div className="row-actions" style={{justifyContent:'flex-end'}}>
                  <button onClick={() => startEdit(e)}><Icon name="edit" size={13}/></button>
                  <button onClick={() => del(e.id)}><Icon name="trash" size={13}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

function InquiriesPanel() {
  const [statusFilter, setStatusFilter] = useState('')
  const { data: inquiries, loading, reload } = useData(() => api.inquiries.list(statusFilter || undefined), [statusFilter])
  const [replyId,  setReplyId]  = useState(null)
  const [replyText, setReplyText] = useState('')
  const [sending,  setSending]  = useState(false)

  const sendReply = async () => {
    if (!replyText) return
    setSending(true)
    try {
      await api.inquiries.reply(replyId, replyText)
      setReplyId(null); setReplyText(''); reload()
    } catch { /* silent */ } finally { setSending(false) }
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Обращения<span style={{color:'var(--accent)'}}>.</span></h1>
          <p className="sub">{loading ? '…' : `${(inquiries ?? []).length} обращений`}</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          {[['','Все'],['pending','Ожидают'],['answered','Отвечены']].map(([v,l]) => (
            <button key={v} className={'btn' + (statusFilter === v ? ' filled' : '')} onClick={() => setStatusFilter(v)}>{l}</button>
          ))}
        </div>
      </div>
      {loading ? <p style={{padding:'40px 32px', color:'var(--ink-3)'}}>Загрузка…</p> : (
        <table className="data-table">
          <thead><tr><th>От</th><th>Работа</th><th>Сообщение</th><th>Дата</th><th>Статус</th><th style={{width:100, textAlign:'right'}}>Действия</th></tr></thead>
          <tbody>
            {(inquiries ?? []).map(m => (
              <tr key={m.id}>
                <td><strong>{m.name}</strong><br/><span style={{fontSize:11, color:'var(--ink-3)'}}>{m.email}</span></td>
                <td>{m.artwork?.title ?? '—'}</td>
                <td style={{color:'var(--ink-3)', maxWidth:240, fontSize:13}}>«{m.text.slice(0, 80)}{m.text.length > 80 ? '…' : ''}»</td>
                <td style={{fontSize:12}}>{new Date(m.createdAt).toLocaleDateString('ru-RU')}</td>
                <td><span className={'status-badge ' + (m.status === 'pending' ? 'pending' : 'answered')}>{INQ_LABEL[m.status]}</span></td>
                <td><div className="row-actions" style={{justifyContent:'flex-end'}}>
                  {m.status === 'pending' && (
                    <button onClick={() => { setReplyId(m.id); setReplyText('') }}>
                      <Icon name="msg" size={13}/>
                    </button>
                  )}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {replyId && (
        <div className="modal-backdrop" onClick={() => setReplyId(null)}>
          <div className="modal" style={{background:'#1A1A1A', color:'white'}} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setReplyId(null)} style={{color:'white'}}><Icon name="close" size={18}/></button>
            <h3 className="display" style={{marginBottom:20}}>Ответить на обращение</h3>
            <textarea className="textarea" value={replyText} onChange={e => setReplyText(e.target.value)} style={{height:120, background:'#2A2A2A', border:'1px solid #3A3A3A', color:'white'}}/>
            <div style={{display:'flex', gap:8, marginTop:16}}>
              <button className="btn filled" onClick={sendReply} disabled={sending}>{sending ? 'Отправка…' : 'Отправить ответ'}</button>
              <button className="btn" style={{borderColor:'#444', color:'#888'}} onClick={() => setReplyId(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function SettingsPanel() {
  const { data, loading, reload } = useData(() => api.settings.get())
  const [form,   setForm]   = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [err,    setErr]    = useState('')

  useEffect(() => {
    if (data) setForm({ galleryName:'', email:'', phone:'', address:'', metaDescription:'', workingHours:'', ...data })
  }, [data])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      await api.settings.update(form)
      setSaved(true); setTimeout(() => setSaved(false), 2000); reload()
    } catch (e) { setErr(e.message) } finally { setSaving(false) }
  }

  if (loading || !form) return <p style={{padding:'40px 32px', color:'var(--ink-3)'}}>Загрузка…</p>

  return (
    <>
      <div className="admin-header">
        <div><h1>Настройки<span style={{color:'var(--accent)'}}>.</span></h1><p className="sub">Общие настройки галереи</p></div>
      </div>
      <div className="admin-form">
        {saved  && <p style={{padding:'14px 20px', background:'#ECF1ED', color:'#3A7A4D', marginBottom:20, fontSize:14}}>Сохранено.</p>}
        {err    && <p style={{padding:'14px 20px', background:'#FDE8E8', color:'#A8302A', marginBottom:20, fontSize:14}}>{err}</p>}
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="field"><label className="field-label">Название галереи</label><input className="input" value={form.galleryName} onChange={e => setForm({...form, galleryName:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Контактный email</label><input className="input" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Телефон</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Адрес</label><input className="input" value={form.address} onChange={e => setForm({...form, address:e.target.value})} required/></div>
            <div className="field"><label className="field-label">Часы работы</label><input className="input" value={form.workingHours} onChange={e => setForm({...form, workingHours:e.target.value})}/></div>
          </div>
          <div className="field"><label className="field-label">Описание для поисковых систем</label><textarea className="textarea" value={form.metaDescription} onChange={e => setForm({...form, metaDescription:e.target.value})}/></div>
          <button type="submit" className="btn filled" disabled={saving}>{saving ? 'Сохранение…' : 'Сохранить изменения'}</button>
        </form>
      </div>
    </>
  )
}

// ── main panel ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { navigate } = useApp()
  const [section, setSection] = useState('artworks')

  const sections = [
    { id:'artworks',    label:'Экспонаты',    icon:'package', Panel: ArtworksPanel    },
    { id:'exhibitions', label:'Выставки',     icon:'image',   Panel: ExhibitionsPanel },
    { id:'inquiries',   label:'Обращения',    icon:'msg',     Panel: InquiriesPanel   },
    { id:'settings',    label:'Настройки',    icon:'gear',    Panel: SettingsPanel    },
  ]

  const current = sections.find(s => s.id === section)

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="name">АСПЕКТ <span style={{color:'var(--accent)'}}>·</span> admin</div>
          <div className="tag">Панель управления</div>
        </div>
        <nav className="admin-nav">
          {sections.map(s => (
            <div key={s.id} className={'admin-nav-item ' + (section === s.id ? 'active' : '')} onClick={() => setSection(s.id)}>
              <span className="ico"><Icon name={s.icon} size={15}/></span>
              <span>{s.label}</span>
            </div>
          ))}
          <div className="admin-nav-item" style={{marginTop:'auto', borderTop:'1px solid #2A2A2A', paddingTop:16, color:'#888'}} onClick={() => navigate('home')}>← На сайт</div>
        </nav>
      </aside>
      <section className="admin-content">
        {current && <current.Panel/>}
      </section>
    </main>
  )
}
