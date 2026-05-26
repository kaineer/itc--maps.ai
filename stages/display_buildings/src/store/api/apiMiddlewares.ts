import { buildingsApi } from "@entities/buildings/model/buildings.api";
import { tracksApi } from "@entities/tracks/model/tracks.api";
import { userApi } from "@entities/users/model/users.api";
import { modelsApi } from "@entities/models/model/models.api";
import { modelOffersApi } from "@entities/model-offers/model/model-offers.api";

export const apiMiddlewares = [
  userApi.middleware,
  tracksApi.middleware,
  buildingsApi.middleware,
  modelsApi.middleware,
  modelOffersApi.middleware,
];
