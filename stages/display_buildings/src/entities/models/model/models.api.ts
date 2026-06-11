// https://chat.deepseek.com/share/af1acj7xh11quvxjhk
// https://chat.deepseek.com/a/chat/s/e23837cc-f44e-4909-9420-d5fe5f73be1d
//
import type {
  CreateModel,
  ModelId,
  UpdateModel,
} from "@.types/buildings-types";
import { buildingsAndModelsApi } from "@store/api/buildingsAndModelsApi";

export const modelsApi = buildingsAndModelsApi.injectEndpoints({
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
      invalidatesTags: (_result, _error, { id }) => [
        { type: "model", id },
        "buildingsList",
      ],
    }),
    // DELETE /models/{modelId} - удалить модель
    deleteModel: builder.mutation<void, ModelId>({
      query: (modelId) => ({
        url: `/models/${modelId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, modelId) => [
        { type: "model", id: modelId },
        "buildingsList",
      ],
    }),
  }),
});

export const {
  useCreateModelPositionMutation,
  useUpdateModelPositionMutation,
  useDeleteModelMutation,
} = modelsApi;
