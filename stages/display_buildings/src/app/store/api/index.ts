import { userApi } from "@entities/users";
import { tracksApi } from "@entities/tracks";
import { modelOffersApi } from "@entities/model-offers";
import { buildingsAndModelsApi } from "./buildingsAndModelsApi";

export const apiReducers = {
  [userApi.reducerPath]: userApi.reducer,
  [tracksApi.reducerPath]: tracksApi.reducer,
  [modelOffersApi.reducerPath]: modelOffersApi.reducer,

  [buildingsAndModelsApi.reducerPath]: buildingsAndModelsApi.reducer,
};
