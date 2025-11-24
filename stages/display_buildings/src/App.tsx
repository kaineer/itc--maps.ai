import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { setupStore } from "./store";
import { selectUIMode, setUIMode } from "./store/uiSlice";
import { ViewUI } from "./components/ui/ViewUI";
import { AlignmentUI } from "./components/ui/AlignmentUI";

const store = setupStore();

const AppContent: React.FC = () => {
  const currentMode = useSelector(selectUIMode);
  const dispatch = useDispatch();

  const handleModeChange = () => {
    const newMode = currentMode === "view" ? "alignment" : "view";
    dispatch(setUIMode(newMode));
  };

  return (
    <>
      {currentMode === "view" ? (
        <ViewUI onModeChange={handleModeChange} />
      ) : (
        <AlignmentUI
          buildings={[]} // TODO: Load buildings for alignment mode
          onModeChange={handleModeChange}
        />
      )}
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
