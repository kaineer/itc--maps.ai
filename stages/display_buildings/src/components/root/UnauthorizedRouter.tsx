import { IntroUI } from "@components/ui/intro/IntroUI";
import { LoginUI } from "@components/ui/login/LoginUI";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

export const UnauthorizedRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<IntroUI />} />
      <Route path="login" element={<LoginUI />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </BrowserRouter>
);
