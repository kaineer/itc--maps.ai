import { Provider, useSelector } from "react-redux";
import { setupStore } from "./store";
import { IntroUI } from "./components/ui/intro/IntroUI";
import { ViewUI } from "./components/ui/view/ViewUI";
import { AlignmentUI } from "./components/ui/alignment/AlignmentUI";
import { uiSlice } from "@slices/uiSlice";
import { Match } from "./components/shared/Match";
import { LoginUI } from "./components/ui/login/LoginUI";

const store = setupStore();

const AppContent = () => {
  const { getUIMode } = uiSlice.selectors;
  const currentMode = useSelector(getUIMode);

  return (
    <>
      <Match
        value={currentMode}
        intro={() => <IntroUI />}
        login={() => <LoginUI />}
        view={() => <ViewUI />}
        alignment={() => <AlignmentUI />}
      />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
