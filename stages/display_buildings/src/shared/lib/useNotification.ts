import { toast } from "sonner";

export const useNotification = () => {
  const notify = (message: string, error?: unknown) => {
    if (typeof error === "undefined") {
      return toast.success(message);
    }

    console.error(error);
    return toast.error(message);
  };

  const warn = (message: string) => {
    return toast.warning(message);
  };

  return { notify, warn };
};
