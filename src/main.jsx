import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { IconContext } from 'react-icons'
import { LoanProvider } from './provider/loanContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IconContext.Provider value={{ color: "", className: "global-class-name" }}>
      <LoanProvider>
        <App />
      </LoanProvider>
    </IconContext.Provider>
    <ToastContainer />
  </StrictMode>,
)
