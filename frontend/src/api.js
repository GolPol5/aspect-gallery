const BASE = '/api'

async function req(path, opts = {}) {
  const isFormData = opts.body instanceof FormData
  const res = await fetch(BASE + path, {
    ...opts,
    headers: isFormData ? opts.headers : { 'Content-Type': 'application/json', ...opts.headers },
  })
  if (res.status === 204) return null
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)
  return json
}

const qs = (params) => {
  const p = Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v !== '' && v != null))
  return Object.keys(p).length ? '?' + new URLSearchParams(p) : ''
}

export const api = {
  artworks: {
    list:        (p)          => req(`/artworks${qs(p)}`),
    get:         (id)         => req(`/artworks/${id}`),
    create:      (form)       => req('/artworks',               { method: 'POST',   body: form }),
    update:      (id, data)   => req(`/artworks/${id}`,         { method: 'PUT',    body: JSON.stringify(data) }),
    delete:      (id)         => req(`/artworks/${id}`,         { method: 'DELETE' }),
    addImages:   (id, form)   => req(`/artworks/${id}/images`,  { method: 'POST',   body: form }),
    deleteImage: (id, name)   => req(`/artworks/${id}/images/${name}`, { method: 'DELETE' }),
  },
  artists: {
    list:   ()           => req('/artists'),
    get:    (id)         => req(`/artists/${id}`),
    create: (data)       => req('/artists',     { method: 'POST',   body: JSON.stringify(data) }),
    update: (id, data)   => req(`/artists/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id)         => req(`/artists/${id}`, { method: 'DELETE' }),
  },
  exhibitions: {
    list:   (filter)     => req(`/exhibitions${qs({ filter: filter !== 'all' ? filter : null })}`),
    get:    (idOrSlug)   => req(`/exhibitions/${idOrSlug}`),
    create: (form)       => req('/exhibitions',     { method: 'POST',   body: form }),
    update: (id, form)   => req(`/exhibitions/${id}`, { method: 'PUT',  body: form }),
    delete: (id)         => req(`/exhibitions/${id}`, { method: 'DELETE' }),
  },
  inquiries: {
    list:        (status) => req(`/inquiries${qs({ status })}`),
    create:      (data)   => req('/inquiries',           { method: 'POST',  body: JSON.stringify(data) }),
    reply:       (id, r)  => req(`/inquiries/${id}/reply`, { method: 'PUT', body: JSON.stringify({ reply: r }) }),
    patchStatus: (id, s)  => req(`/inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: s }) }),
  },
  contact: {
    send:     (data) => req('/contact',           { method: 'POST',  body: JSON.stringify(data) }),
    list:     (read) => req(`/contact${qs({ isRead: read })}`),
    markRead: (id)   => req(`/contact/${id}/read`, { method: 'PATCH' }),
  },
  newsletter: {
    subscribe: (data) => req('/newsletter/subscribe', { method: 'POST', body: JSON.stringify(data) }),
  },
  settings: {
    get:    ()     => req('/settings'),
    update: (data) => req('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
  ar: {
    uploadModels: (id, form) => req(`/ar/${id}/models`, { method: 'POST', body: form }),
    deleteModels: (id)       => req(`/ar/${id}/models`, { method: 'DELETE' }),
  },
}
