import { ViewUI } from "@pages/view/ViewUI";
import { IntroUI } from "@pages/intro/IntroUI";
import { LoginUI } from "@pages/user/login/LoginUI";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

export const UnauthorizedRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<IntroUI />} />
      <Route path="/login" element={<LoginUI />} />
      <Route path="/view" element={<ViewUI />} />
      <Route path="*" element={<Navigate to="/view" />} />
    </Routes>
  </BrowserRouter>
);
