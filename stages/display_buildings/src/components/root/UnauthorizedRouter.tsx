// import { CreateModelOffer } from "@components/ui/anonymous/CreateModelOffer";
import { IntroUI } from "@components/ui/intro/IntroUI";
import { LoginUI } from "@components/ui/login/LoginUI";
import { ViewUI } from "@components/ui/view/ViewUI";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

export const UnauthorizedRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<IntroUI />} />
      <Route path="login" element={<LoginUI />} />
      <Route path="view" element={<ViewUI />} />
      <Route path="*" element={<Navigate to="/view" />} />
    </Routes>
  </BrowserRouter>
);
