/// <reference types="vite/client" />
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./features/auth/components/ProtectedRoute.tsx";
import SignInPage from "./features/auth/pages/SignInPage.tsx";
import RegisterPage from "./features/auth/pages/RegisterPage.tsx";
import LeaderboardPage from "./features/leaderboard/pages/LeaderboardPage.tsx";
import AccountPage from "./features/account/pages/AccountPage.tsx";
import SettingsPage from "./features/settings/pages/SettingsPage.tsx";
import "./index.css";
import App from "./App.tsx";
// Supports weights 100-700
import "@fontsource-variable/victor-mono";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
