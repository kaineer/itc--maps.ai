import { userApi } from "@entities/users/model/users.api";
import { tracksApi } from "@entities/tracks/model/tracks.api";
import { modelOffersApi } from "@entities/model-offers/model/model-offers.api";
import { buildingsAndModelsApi } from "./buildingsAndModelsApi";

export const apiReducers = {
  [userApi.reducerPath]: userApi.reducer,
  [tracksApi.reducerPath]: tracksApi.reducer,
  [modelOffersApi.reducerPath]: modelOffersApi.reducer,

  [buildingsAndModelsApi.reducerPath]: buildingsAndModelsApi.reducer,
};
