import classes from "./App.module.css";
import { Provider } from "react-redux";
import { setupStore } from "@store/index";
import { AuthInitialization } from "@entities/users";
import { AppContent } from "@app/routes/AppContent";
import { Toaster } from "sonner";

export const App = () => {
  return (
    <Provider store={setupStore()}>
      <AuthInitialization>
        <Toaster
          toastOptions={{
            classNames: {
              title: classes.toastTitle,
            },
          }}
          position="bottom-right"
          richColors
          visibleToasts={5}
        />
        <AppContent />
      </AuthInitialization>
    </Provider>
  );
};
