import { userApi } from "@entities/users/model/users.api";
import { tracksApi } from "@entities/tracks/model/tracks.api";
import { buildingsApi } from "@entities/buildings/model/buildings.api";
import { modelsApi } from "@entities/models/model/models.api";
import { modelOffersApi } from "@entities/model-offers/model/model-offers.api";

export const apiReducers = {
  [userApi.reducerPath]: userApi.reducer,
  [tracksApi.reducerPath]: tracksApi.reducer,
  [buildingsApi.reducerPath]: buildingsApi.reducer,
  [modelsApi.reducerPath]: modelsApi.reducer,
  [modelOffersApi.reducerPath]: modelOffersApi.reducer,
};
