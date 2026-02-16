import { Provider } from "react-redux";
import { setupStore } from "./store";
import { AuthInitialization } from "./components/shared/AuthInitialization";
import { AppContent } from "@components/root/AppContent";
import { ViewInitialization } from "@components/shared/ViewInitialization";

const App = () => {
  return (
    <Provider store={setupStore()}>
      <ViewInitialization />
      <AuthInitialization>
        <AppContent />
      </AuthInitialization>
    </Provider>
  );
};

export default App;
