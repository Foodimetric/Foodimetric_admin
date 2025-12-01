import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "./pages/Notification/context/NotificationContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-right" toastOptions={{ duration: 600000 }} />
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </StrictMode>
);
