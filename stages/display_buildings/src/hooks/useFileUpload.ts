//
import { useState, useCallback } from "react";
import { uploadToBackend } from "@utils/backend";

export interface UseFileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB по умолчанию
    allowedTypes = ["image/jpeg", "image/png", "application/pdf"],
    onSuccess,
    onError,
  } = options;

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!allowedTypes.includes(file.type)) {
        return `Недопустимый тип файла. Разрешены: ${allowedTypes.join(", ")}`;
      }

      if (file.size > maxSize) {
        return `Файл слишком большой. Максимальный размер: ${Math.round(maxSize / 1024 / 1024)}MB`;
      }

      return null;
    },
    [allowedTypes, maxSize],
  );

  const uploadFile = useCallback(
    async (
      file: File,
      endpoint: string,
      additionalData?: Record<string, string>,
    ): Promise<any> => {
      const validationError = validateFile(file);
      if (validationError) {
        const error = new Error(validationError);
        setUploadState((prev) => ({ ...prev, error: validationError }));
        onError?.(error);
        throw error;
      }

      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
      });

      try {
        const formData = new FormData();
        formData.append("file", file);

        if (additionalData) {
          Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, value);
          });
        }

        // Для демонстрации прогресса можно использовать XMLHttpRequest
        // или добавить обработчик прогресса для fetch с помощью ReadableStream
        const response = await uploadToBackend(endpoint, formData);

        if (!response.ok) {
          throw new Error(`HTTP ошибка: ${response.status}`);
        }

        const result = await response.json();

        setUploadState({
          isUploading: false,
          progress: 100,
          error: null,
        });

        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err as Error;
        setUploadState({
          isUploading: false,
          progress: 0,
          error: error.message,
        });

        onError?.(error);
        throw error;
      }
    },
    [validateFile, onSuccess, onError],
  );

  const reset = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
    });
  }, []);

  return {
    ...uploadState,
    uploadFile,
    validateFile,
    reset,
  };
};
