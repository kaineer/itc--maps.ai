import { tracksApi } from "@entities/tracks";
import { userApi } from "@entities/users";
import { modelOffersApi } from "@entities/model-offers";
import { buildingsAndModelsApi } from "./buildingsAndModelsApi";

export const apiMiddlewares = [
  userApi.middleware,
  tracksApi.middleware,
  modelOffersApi.middleware,
  buildingsAndModelsApi.middleware,
];
