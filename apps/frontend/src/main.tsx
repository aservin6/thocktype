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
import AuthLayout from "./features/auth/components/AuthLayout.tsx";
import Navigation from "./features/navigation/components/Navigation.tsx";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage.tsx";
import Container from "./components/ui/container.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Route layout layers (outermost to innermost):
//   AuthLayout  — runs the session check once before any route renders
//   Container   — global page width, background, and padding
//   Navigation  — nav bar rendered above every page via Outlet
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route element={<Container />}>
              <Route element={<Navigation />}>
                <Route path="/" element={<App />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
