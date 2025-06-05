
import { createRoot } from 'react-dom/client'
import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = "pk_test_ZW5kbGVzcy1tYXlmbHktNzguY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
