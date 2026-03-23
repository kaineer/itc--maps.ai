// https://chat.deepseek.com/share/af1acj7xh11quvxjhk

import type {
  CreateModel,
  ModelId,
  UpdateModel,
} from "@.types/buildings-types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBackendService } from "@services/backendService";

const { baseQuery } = createBackendService();

export const modelsApi = createApi({
  reducerPath: "models/api",
  tagTypes: ["model"],
  baseQuery,
  endpoints: (builder) => ({
    // PUT /models/{modelId} - изменить положение модели на карте
    createModelPosition: builder.mutation<UpdateModel, CreateModel>({
      query: ({ id, ...data }) => ({
        url: `/models/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "model", id }],
    }),

    // PATCH /models/{modelId} - изменить положение модели на карте
    updateModelPosition: builder.mutation<UpdateModel, UpdateModel>({
      query: ({ id, ...data }) => ({
        url: `/models/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "model", id }],
    }),
    // DELETE /models/{modelId} - удалить модель
    deleteModel: builder.mutation<void, ModelId>({
      query: (modelId) => ({
        url: `/models/${modelId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, modelId) => [
        { type: "model", id: modelId },
      ],
    }),
  }),
});

export const {
  useCreateModelPositionMutation,
  useUpdateModelPositionMutation,
  useDeleteModelMutation,
} = modelsApi;
