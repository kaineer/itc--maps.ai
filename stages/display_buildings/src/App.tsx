import { Provider } from "react-redux";
import { setupStore } from "./store";
import { AppContent } from "@components/root/AppContent";
import { AuthInitialization } from "@components/shared/AuthInitialization";

const App = () => {
  return (
    <Provider store={setupStore()}>
      <AuthInitialization>
        <AppContent />
      </AuthInitialization>
    </Provider>
  );
};

export default App;
