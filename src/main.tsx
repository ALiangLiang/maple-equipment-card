import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

document.fonts.load('20px "Noto Sans KR"').then(() => {
  console.log('Font loaded successfully', document.fonts.check('18px "Noto Sans KR"'));
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
});

