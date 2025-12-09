// thunks/modelThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Box3 } from "three";
import { ModelData } from "../../utils/modelTransform";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import { getBackend } from "../../utils/backend";

// Async thunk для загрузки модели с сервера
export const fetchModelById = createAsyncThunk(
  "modelUpload/fetchModelById",
  async (modelId: string, { rejectWithValue }) => {
    try {
      // Получаем модель с сервера
      const response = await getBackend("/model/" + modelId);

      if (!response.ok) {
        throw new Error(`Ошибка загрузки модели: ${response.statusText}`);
      }

      // Получаем Blob с моделью
      const modelBlob = await response.blob();

      // Создаем Object URL для загрузки в Three.js
      const modelUrl = URL.createObjectURL(modelBlob);

      // Здесь вам нужно использовать свой загрузчик моделей (например, useFBX)
      // Так как useFBX - это React hook, вам нужно будет либо:
      // 1. Использовать FBXLoader напрямую
      // 2. Или создать отдельный компонент для загрузки

      // Пример с использованием FBXLoader напрямую:
      const loader = new FBXLoader();

      return new Promise<ModelData>((resolve, reject) => {
        loader.load(
          modelUrl,
          (modelObject) => {
            // Очищаем Object URL
            URL.revokeObjectURL(modelUrl);

            // Рассчитываем bounding box
            const boundingBox = new Box3().setFromObject(modelObject);

            // Подсчитываем количество вертексов
            let vertexCount = 0;
            modelObject.traverse((child) => {
              if (child.isMesh) {
                vertexCount += child.geometry.attributes.position.count;
              }
            });

            const modelData: ModelData = {
              id: modelId,
              modelObject,
              metadata: {
                fileFormat: "fbx",
                vertexCount,
                boundingBox,
              },
            };

            resolve(modelData);
          },
          (progress) => {
            // Можно добавить обработку прогресса загрузки
            console.log(
              `Загружено: ${(progress.loaded / progress.total) * 100}%`,
            );
          },
          (error) => {
            const err = error as Error;
            URL.revokeObjectURL(modelUrl);
            reject(new Error(`Ошибка загрузки FBX: ${err.message}`));
          },
        );
      });
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);
