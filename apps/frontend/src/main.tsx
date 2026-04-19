/// <reference types="vite/client" />
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import "./index.css";
import App from "./App.tsx";
// Supports weights 100-700
import "@fontsource-variable/victor-mono";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/leaderboard" element={<div>Leaderboard</div>} />
        <Route path="/signin" element={<div>Sign in</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/settings" element={<div>Settings</div>} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <div>Account Page</div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
