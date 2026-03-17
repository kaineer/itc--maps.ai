import { userApi } from "./UsersApi";
import { tracksApi } from "./TracksApi";
import { buildingsApi } from "./BuildingsApi";

export const apiMiddlewares = [
  userApi.middleware,
  tracksApi.middleware,
  buildingsApi.middleware,
];

export const apiReducers = {
  [userApi.reducerPath]: userApi.reducer,
  [tracksApi.reducerPath]: tracksApi.reducer,
  [buildingsApi.reducerPath]: buildingsApi.reducer,
};
