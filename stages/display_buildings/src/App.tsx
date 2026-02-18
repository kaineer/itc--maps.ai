import { Provider } from "react-redux";
import { setupStore } from "./store";
import { AppContent } from "@components/root/AppContent";
import { AuthInitialization } from "@components/shared/AuthInitialization";
import { Toaster } from "sonner";

const App = () => {
  return (
    <Provider store={setupStore()}>
      <AuthInitialization>
        <Toaster position="bottom-right" richColors />
        <AppContent />
      </AuthInitialization>
    </Provider>
  );
};

export default App;
