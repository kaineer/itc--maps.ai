import { AlignmentUI } from "@components/ui/alignment/AlignmentUI";
import { IntroUI } from "@components/ui/intro/IntroUI";
import { LoginUI } from "@components/ui/login/LoginUI";
import { ViewUI } from "@components/ui/view/ViewUI";
import { BrowserRouter, Route, Routes } from "react-router";

export const AuthorizedRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<IntroUI />} />
      <Route path="login" element={<LoginUI />} />
      <Route path="view" element={<ViewUI />} />
      <Route path="align" element={<AlignmentUI />} />
    </Routes>
  </BrowserRouter>
);
