import { Provider, useSelector } from "react-redux";
import { setupStore } from "./store";
// TODO: Change back after TopCameraController is made ready
import { ViewUI } from "./components/ui/ViewUI.alignment-test";
import { AlignmentUI } from "./components/ui/AlignmentUI";
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
