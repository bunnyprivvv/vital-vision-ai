import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

console.log("VITASCAN_BOOT: MAIN_JSX_INITIALIZED");

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log("VITASCAN_BOOT: ROOT_FOUND_MOUNTING_REACT");
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
} else {
  console.error("VITASCAN_BOOT: FATAL_ROOT_MISSING");
}
