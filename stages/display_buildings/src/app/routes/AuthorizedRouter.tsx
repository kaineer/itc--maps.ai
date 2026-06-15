import { AllowRoute } from "@kit/utils/AllowRoute";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { IntroUI } from "@pages/intro/IntroUI";
import { TrackListUI } from "@pages/tracks/list/TrackListUI";
import { TrackPointListUI } from "@pages/tracks/points-list/TrackPointListUI";
import { ViewUI } from "@pages/view/ViewUI";
import { AlignmentUI } from "@pages/alignment/AlignmentUI";
import { CreateModelOfferUI } from "@components/ui/uploader/CreateModelOfferUI";
import { UserListUI } from "@pages/user/list/UserListUI";
import { UserCreateUI } from "@pages/user/create/UserCreateUI";

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
