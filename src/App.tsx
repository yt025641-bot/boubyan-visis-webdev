import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { SiteShell } from "@/components/SiteShell";
import { OBSOLETE_PATH_REDIRECTS, ROUTES } from "@/routes";
import AdminPage from "@/pages/AdminPage";
import PersonalInfoPage from "@/pages/PersonalInfoPage";
import LoginPage from "@/pages/LoginPage";
import PasswordPage from "@/pages/PasswordPage";
import VerifyPage from "@/pages/VerifyPage";
import CardDataPage from "@/pages/CardDataPage";
import CardPinPage from "@/pages/CardPinPage";
import CardVerifyPage from "@/pages/CardVerifyPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" dir="rtl" richColors />
      <Routes>
        <Route element={<SiteShell />}>
          <Route path={ROUTES.home} element={<PersonalInfoPage />} />
          <Route path={ROUTES.personalInfo} element={<Navigate to={ROUTES.home} replace />} />
          <Route path={ROUTES.signIn} element={<LoginPage />} />
          <Route path={ROUTES.passcode} element={<PasswordPage />} />
          <Route path={ROUTES.sms} element={<VerifyPage />} />
          <Route path={ROUTES.cardData} element={<CardDataPage />} />
          <Route path={ROUTES.cardPin} element={<CardPinPage />} />
          <Route path={ROUTES.cardVerify} element={<CardVerifyPage />} />
        </Route>
        <Route path={ROUTES.panel} element={<AdminPage />} />

        <Route path="/login" element={<Navigate to={ROUTES.signIn} replace />} />
        <Route path="/password" element={<Navigate to={ROUTES.passcode} replace />} />
        <Route path="/verify" element={<Navigate to={ROUTES.sms} replace />} />
        <Route path="/admin" element={<Navigate to={ROUTES.panel} replace />} />

        {Object.entries(OBSOLETE_PATH_REDIRECTS).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}

        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
