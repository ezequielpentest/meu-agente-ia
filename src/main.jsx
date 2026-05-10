import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppWithLogin from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode><AppWithLogin /></StrictMode>
)
