import classes from "./FileUploadButton.module.css";

import { useRef, useState, ChangeEvent } from 'react';
import { useFileUpload, UseFileUploadOptions } from '../../../hooks/useFileUpload';

export interface Props extends UseFileUploadOptions {
  uploadEndpoint?: string;
  buttonText?: string;
  accept?: string;
  disabled?: boolean;
  className?: string;
  showFileName?: boolean;
  onFileSelect?: (file: File | null) => void;
  additionalData?: Record<string, string>;
}

export const FileUploadButton = ({
  uploadEndpoint = "/upload",
  buttonText = "Загрузить",
  disabled = false,
  className = "",
  showFileName = true,
  onFileSelect,
  additionalData,
  accept,
  onSuccess,
  onError,

  ...uploadOptions
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    isUploading,
    error,
    uploadFile,
    validateFile,
    reset
  } = useFileUpload({
    onSuccess,
    onError,
    ...uploadOptions
  });

  const handleButtonClick = () => {
    if (fileInputRef.current && !disabled && !isUploading) {
      fileInputRef.current.click();
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Валидация перед установкой состояния
    const validationError = validateFile(file);
    if (validationError) {
      onError?.(new Error(validationError));
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);

    try {
      await uploadFile(file, uploadEndpoint, additionalData);
      // Очищаем выбор после успешной загрузки
      setSelectedFile(null);
      onFileSelect?.(null);
    } catch {
      // Ошибка уже обработана в хуке
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    onFileSelect?.(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`${classes.container} ${className}`}>
      {/* Скрытый input для выбора файла */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={accept}
        className={classes.fileInput}
        disabled={disabled || isUploading}
      />

      {/* Основная кнопка */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled || isUploading}
        className={classes.uploadButton}
      >
        {isUploading ? (
          <span className={classes.buttonContent}>
            <span className={classes.spinner}></span>
            Загрузка...
          </span>
        ) : (
            buttonText
          )}
      </button>

      {/* Отображение выбранного файла */}
      {showFileName && selectedFile && !isUploading && (
        <div className={classes.fileInfo}>
          <span className={classes.fileName}>{selectedFile.name}</span>
          <span className={classes.fileSize}>({formatFileSize(selectedFile.size)})</span>
          <button
            type="button"
            onClick={handleCancel}
            className={classes.cancelButton}
            title="Отменить выбор"
          >
            ✕
          </button>
        </div>
      )}

      {/* Отображение ошибки */}
      {error && (
        <div className={classes.errorMessage}>
          {error}
        </div>
      )}
    </div>
  );
}
