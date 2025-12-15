import { Provider, useSelector } from "react-redux";
import { setupStore } from "./store";
import { ViewUI } from "./components/ui/ViewUI";
import { AlignmentUI } from "./components/ui/AlignmentUI";
import { IntroUI } from "./components/ui/IntroUI";
import { uiSlice } from "./store/uiSlice";
import { Match } from "./components/shared/Match";

const store = setupStore();

const AppContent = () => {
  const { getUIMode } = uiSlice.selectors;
  const currentMode = useSelector(getUIMode);

  return (
    <>
      <Match
        value={currentMode}
        intro={() => <IntroUI />}
        view={() => <ViewUI />}
        alignment={() => <AlignmentUI />}
        modelSetup={() => null}
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
