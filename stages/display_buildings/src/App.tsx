import React from "react";
import { Provider, useSelector } from "react-redux";
import { setupStore } from "./store";
import { ViewUI } from "./components/ui/ViewUI";
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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
