import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/Auth'
import { ProductCartProvider } from './context/ProductCartContext'
import App from './App.jsx'
import './index.css'

import { Provider } from 'react-redux';
import { store } from './state/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>      
      <ProductCartProvider>         {/* TODO: i'll remove this late */}
        <Provider store={store}>
          <App />
        </Provider>
      </ProductCartProvider>
    </AuthProvider>
  </StrictMode>,
)
