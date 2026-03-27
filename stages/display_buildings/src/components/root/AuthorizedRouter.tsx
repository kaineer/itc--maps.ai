import { AllowRoute } from "@components/shared/AllowRoute";
import { TrackPointListUI } from "@components/track-point/list/TrackPointListUI";
import { TrackListUI } from "@components/track/list/TrackListUI";
import { AlignmentUI } from "@components/ui/alignment/AlignmentUI";
import { IntroUI } from "@components/ui/intro/IntroUI";
import { CreateModelOfferUI } from "@components/ui/uploader/CreateModelOfferUI";
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
        path="offers/create"
        element={
          <AllowRoute role="Uploader,Creator,Admin" redirect="/view">
            <CreateModelOfferUI />
          </AllowRoute>
        }
      />
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
      <Route
        path="tracks"
        element={
          <AllowRoute role="Admin" redirect="login">
            <TrackListUI />
          </AllowRoute>
        }
      />
      <Route
        path="tracks/:trackId"
        element={
          <AllowRoute role="Admin" redirect="login">
            <TrackPointListUI />
          </AllowRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
