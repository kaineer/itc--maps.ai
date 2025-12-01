import React from "react";
import { Provider, useSelector } from "react-redux";
import { setupStore } from "./store";
// TODO: Change back after TopCameraController is made ready
import { ViewUI } from "./components/ui/ViewUI.alignment-test";
import { uiSlice } from "./store/uiSlice";

const store = setupStore();

const AppContent: React.FC = () => {
  const { getUIMode } = uiSlice.selectors;
  const currentMode = useSelector(getUIMode);

  return (
    <>
      {currentMode === "view" && <ViewUI />}
      {/* TODO: Add ModelSetupUI and AlignmentUI components when modes are implemented */}
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
