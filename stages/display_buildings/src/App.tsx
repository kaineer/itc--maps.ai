import classes from "./App.module.css";
import { Provider } from "react-redux";
import { setupStore } from "./store";
import { AuthInitialization } from "@components/shared/AuthInitialization";
import { AppContent } from "@app/routes/AppContent";
import { Toaster } from "sonner";

const App = () => {
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

export default App;
