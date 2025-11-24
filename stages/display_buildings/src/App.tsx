import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { setupStore } from "./store";
import { ViewUI } from "./components/ui/ViewUI";
import { selectUIMode, setUIMode } from "./store/uiSlice";

const store = setupStore();

const AppContent: React.FC = () => {
  const currentMode = useSelector(selectUIMode);
  const dispatch = useDispatch();

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
