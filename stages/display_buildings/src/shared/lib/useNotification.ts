import { type ExternalToast, toast } from "sonner";

export const useNotification = () => {
  const notify = (message: string, error?: unknown) => {
    if (typeof error === "undefined") {
      return toast.success(message);
    }

    console.error(error);
    return toast.error(message);
  };

  const error = (message: string, data: ExternalToast) => {
    return toast.error(message, data);
  }

  const warn = (message: string, data: ExternalToast) => {
    return toast.warning(message, data);
  };

  const info = (message: string, data: ExternalToast) => {
    return toast.info(message, data);
  }

  const success = (message: string, data: ExternalToast) => {
    return toast.success(message, data);
  }

  return { notify, warn, info, error, success };
};
