import { useState } from 'react'
import { AppContext } from './context'
import { Header, Footer, Icon } from './components'
import HomePage         from './pages/HomePage'
import ExhibitionsPage  from './pages/ExhibitionsPage'
import CatalogPage      from './pages/CatalogPage'
import ArtworkPage      from './pages/ArtworkPage'
import ExhibitionPage   from './pages/ExhibitionPage'
import AboutPage        from './pages/AboutPage'
import { PaymentPage, ContactsPage } from './pages/InfoPages'
import { AuthPage, AccountPage }     from './pages/AuthPage'
import AdminPage        from './pages/AdminPage'

const PAGES = {
  home:        { Component: HomePage,        chrome: true,  showFooter: true  },
  exhibitions: { Component: ExhibitionsPage, chrome: true,  showFooter: true  },
  exhibition:  { Component: ExhibitionPage,  chrome: true,  showFooter: true  },
  catalog:     { Component: CatalogPage,     chrome: true,  showFooter: true  },
  artwork:     { Component: ArtworkPage,     chrome: true,  showFooter: true  },
  about:       { Component: AboutPage,       chrome: true,  showFooter: true  },
  payment:     { Component: PaymentPage,     chrome: true,  showFooter: true  },
  contacts:    { Component: ContactsPage,    chrome: true,  showFooter: true  },
  auth:        { Component: AuthPage,        chrome: true,  showFooter: true  },
  account:     { Component: AccountPage,     chrome: true,  showFooter: true  },
  admin:       { Component: AdminPage,       chrome: false, showFooter: false },
}


export default function App() {
  const [page, setPage]   = useState('home')
  const [params, setParams] = useState({})
  const [cart, setCart]   = useState([])
  const [questions, setQuestions] = useState([])
  const [user, setUser]   = useState(null)
  const navigate = (p, params2 = {}) => {
    setPage(p)
    setParams(params2)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const addToCart      = a  => setCart(prev => prev.some(w => w.id === a.id) ? prev : [...prev, a])
  const removeFromCart = i  => setCart(prev => prev.filter((_, idx) => idx !== i))
  // q should include { artworkId, artworkTitle, artwork, name, email, text }
  const addQuestion    = q  => setQuestions(prev => [{ ...q, date: new Date().toLocaleDateString('ru-RU'), status:'pending' }, ...prev])
  const login          = u  => setUser(u)
  const logout         = () => setUser(null)

  const { Component, chrome, showFooter } = PAGES[page]

  return (
    <AppContext.Provider value={{ page, params, navigate, cart, addToCart, removeFromCart, questions, addQuestion, user, login, logout }}>
      <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', background: page === 'admin' ? '#0E0E0E' : 'white'}}>
        {chrome && <Header/>}
        <div style={{flex:1}}>
          <Component/>
        </div>
        {showFooter && <Footer/>}
      </div>
    </AppContext.Provider>
  )
}
