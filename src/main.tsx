import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './components/language-provider'
import { ChildSessionProvider } from './hooks/useChildSession'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ChildSessionProvider>
          <App />
        </ChildSessionProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

