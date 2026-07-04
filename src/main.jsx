import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { IconContext } from 'react-icons'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IconContext.Provider value={{ color: "green", className: "global-class-name" }}>
      <App />
    </IconContext.Provider>
    <ToastContainer />
  </StrictMode>,
)
