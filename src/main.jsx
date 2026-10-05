import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/Auth'
import App from './App.jsx'
import './index.css'

import { Provider } from 'react-redux';
import { store } from './state/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </StrictMode>,
)
