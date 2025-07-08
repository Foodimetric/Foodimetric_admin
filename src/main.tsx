import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from './features/notification/context/NotificationContext.tsx';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </StrictMode>
);
