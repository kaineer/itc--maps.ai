import { FileUploadButton } from "@components/shared/ui/FileUploadButton";
import classes from "./CreateModelOfferUI.module.css";
import { type SubmitEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { usePostModelMutation } from "@entities/model-offers/model/model-offers.api";

export const CreateModelOfferUI = () => {
  const addressRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [modelId, setModelId] = useState<string | null>(null);

  const [postModel] = usePostModelMutation();

  const resetInputs = () => {
    addressRef.current?.value && (addressRef.current.value = "");
    descriptionRef.current?.value && (descriptionRef.current.value = "");
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const address = addressRef.current?.value;
    const description = descriptionRef.current?.value;

    if (address && description && modelId) {
      postModel({ address, description, modelId }).then(() => {
        toast.success("Модель для адреса " + address + " успешно добавлена!");
        resetInputs();
      });
    }
  };

  const handleUploadSuccess = ({ modelId }: { modelId: string }) => {
    setModelId(modelId);
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h2 className={classes.title}>Добавить модель на карту</h2>

        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.formGroup}>
            <label htmlFor="address" className={classes.label}>
              Адрес
            </label>
            <input
              type="text"
              id="address"
              ref={addressRef}
              className={classes.input}
              placeholder="Введите адрес"
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="description" className={classes.label}>
              Описание
            </label>
            <textarea
              id="description"
              ref={descriptionRef}
              className={classes.textarea}
              placeholder="Введите описание здания"
              rows={4}
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label className={classes.label}>Модель</label>
            <FileUploadButton
              uploadEndpoint="/model-offers/upload"
              buttonText="Загрузить модель"
              allowedTypes={[""]}
              onSuccess={handleUploadSuccess}
            />
            {modelId && <p className={classes.fileInfo}>Файл загружен</p>}
          </div>

          <button
            disabled={!modelId}
            type="submit"
            className={classes.submitButton}
          >
            Предложить разместить модель
          </button>
        </form>
      </div>
    </div>
  );
};
