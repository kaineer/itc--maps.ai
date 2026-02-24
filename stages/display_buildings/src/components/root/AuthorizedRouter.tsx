import { AllowRoute } from "@components/shared/AllowRoute";
import { AlignmentUI } from "@components/ui/alignment/AlignmentUI";
import { IntroUI } from "@components/ui/intro/IntroUI";
import { UserCreateUI } from "@components/ui/user/create/UserCreateUI";
import { UserListUI } from "@components/ui/user/list/UserListUI";
import { ViewUI } from "@components/ui/view/ViewUI";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

export const AuthorizedRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<IntroUI />} />
      <Route path="login" element={<Navigate to="/view" />} />
      <Route path="view" element={<ViewUI />} />
      <Route path="align" element={<AlignmentUI />} />
      <Route
        path="users"
        element={
          <AllowRoute role="Admin" redirect="/view">
            <UserListUI />
          </AllowRoute>
        }
      />
      <Route
        path="users/create"
        element={
          <AllowRoute role="Admin" redirect="/view">
            <UserCreateUI />
          </AllowRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
