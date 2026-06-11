import { AllowRoute } from "@kit/utils/AllowRoute";
import { TrackPointListUI } from "@components/track-point/list/TrackPointListUI";
import { TrackListUI } from "@components/track/list/TrackListUI";
import { AlignmentUI } from "@components/ui/alignment/AlignmentUI";
import { IntroUI } from "@components/ui/intro/IntroUI";
import { CreateModelOfferUI } from "@components/ui/uploader/CreateModelOfferUI";
import { UserCreateUI } from "@components/ui/user/create/UserCreateUI";
import { UserListUI } from "@components/ui/user/list/UserListUI";
import { ViewUI } from "@components/ui/view/ViewUI";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

const defaultRoute = "/view";

export const AuthorizedRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<IntroUI />} />
      <Route path="view" element={<ViewUI />} />
      <Route path="align" element={<AlignmentUI />} />
      <Route
        path="offers/create"
        element={
          <AllowRoute role="Uploader,Creator,Admin" redirect={defaultRoute}>
            <CreateModelOfferUI />
          </AllowRoute>
        }
      />
      <Route
        path="users"
        element={
          <AllowRoute role="Admin" redirect={defaultRoute}>
            <UserListUI />
          </AllowRoute>
        }
      />
      <Route
        path="users/create"
        element={
          <AllowRoute role="Admin" redirect={defaultRoute}>
            <UserCreateUI />
          </AllowRoute>
        }
      />
      <Route
        path="tracks"
        element={
          <AllowRoute role="Admin" redirect={defaultRoute}>
            <TrackListUI />
          </AllowRoute>
        }
      />
      <Route
        path="tracks/:trackId"
        element={
          <AllowRoute role="Admin" redirect={defaultRoute}>
            <TrackPointListUI />
          </AllowRoute>
        }
      />
      <Route path="*" element={<Navigate to={defaultRoute} />} />
    </Routes>
  </BrowserRouter>
);
