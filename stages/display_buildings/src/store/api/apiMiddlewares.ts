import { tracksApi } from "@entities/tracks/model/tracks.api";
import { userApi } from "@entities/users/model/users.api";
import { modelOffersApi } from "@entities/model-offers/model/model-offers.api";
import { buildingsAndModelsApi } from "./buildingsAndModelsApi";

export const apiMiddlewares = [
  userApi.middleware,
  tracksApi.middleware,
  modelOffersApi.middleware,
  buildingsAndModelsApi.middleware,
];
