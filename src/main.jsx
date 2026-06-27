import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import amplifyConfig from './amplifyconfiguration'
import './index.css'
import App from './App.jsx'

// Comment out if using real amplify_outputs.json:
// import outputs from '../amplify_outputs.json'
// Amplify.configure(outputs)

// Using manual config until backend is deployed:
Amplify.configure(amplifyConfig)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
