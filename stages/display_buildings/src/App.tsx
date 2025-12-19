import { Provider, useSelector } from "react-redux";
import { setupStore } from "./store";
import { IntroUI } from "./components/ui/intro/IntroUI";
import { ViewUI } from "./components/ui/view/ViewUI";
import { AlignmentUI } from "./components/ui/alignment/AlignmentUI";
import { uiSlice } from "./store/slices/uiSlice";
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
