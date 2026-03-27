import { CreateModelOffer } from "@.types/model-offer-types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBackendService } from "@services/backendService";

const backendService = createBackendService();
const { baseQuery } = backendService;

const reducerPath = "modelOffers/api";

export const modelOffersApi = createApi({
  reducerPath,
  baseQuery,
  tagTypes: ["model-offer"],
  endpoints: (builder) => ({
    postModel: builder.mutation<boolean, CreateModelOffer>({
      query: ({ modelId, address, description }) => ({
        url: "/model-offers/upload",
        method: "POST",
        body: { modelId, address, description },
      }),
      invalidatesTags: ["model-offer"],
    }),
  }),
});

export const { usePostModelMutation } = modelOffersApi;
