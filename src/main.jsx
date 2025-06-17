import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/Auth'
import { ProductCartProvider } from './context/ProductCartContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductCartProvider>
        <App />
      </ProductCartProvider>
    </AuthProvider>
  </StrictMode>,
)
