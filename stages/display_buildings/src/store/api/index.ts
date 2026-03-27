import { userApi } from "./UsersApi";
import { tracksApi } from "./TracksApi";
import { buildingsApi } from "./BuildingsApi";
import { modelsApi } from "./ModelsApi";
import { modelOffersApi } from "./ModelOffersApi";

export const apiMiddlewares = [
  userApi.middleware,
  tracksApi.middleware,
  buildingsApi.middleware,
  modelsApi.middleware,
  modelOffersApi.middleware,
];

export const apiReducers = {
  [userApi.reducerPath]: userApi.reducer,
  [tracksApi.reducerPath]: tracksApi.reducer,
  [buildingsApi.reducerPath]: buildingsApi.reducer,
  [modelsApi.reducerPath]: modelsApi.reducer,
  [modelOffersApi.reducerPath]: modelOffersApi.reducer,
};
