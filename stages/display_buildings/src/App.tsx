import { Provider, useDispatch, useSelector } from "react-redux";
import { setupStore } from "./store";
import { IntroUI } from "./components/ui/intro/IntroUI";
import { ViewUI } from "./components/ui/view/ViewUI";
import { AlignmentUI } from "./components/ui/alignment/AlignmentUI";
import { uiSlice } from "@slices/uiSlice";
import { Match } from "./components/shared/Match";
import { LoginUI } from "./components/ui/login/LoginUI";
import { AuthInitialization } from "./components/shared/AuthInitialization";
import { useAuthentication } from "@hooks/useAuthentication";
import { useEffect } from "react";

const store = setupStore();

const AppContent = () => {
  const { getUIMode } = uiSlice.selectors;
  const currentMode = useSelector(getUIMode);
  const { isAuthenticated } = useAuthentication();

  const { selectLoginMode, selectViewMode } = uiSlice.actions;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated && currentMode !== "intro") {
      dispatch(selectLoginMode());
    } else if (isAuthenticated && currentMode === "login") {
      dispatch(selectViewMode());
    }
  }, [isAuthenticated, currentMode]);

  return (
    <Match
      value={currentMode}
      intro={() => <IntroUI />}
      login={() => <LoginUI />}
      view={() => <ViewUI />}
      alignment={() => <AlignmentUI />}
    />
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AuthInitialization />
      <AppContent />
    </Provider>
  );
};

export default App;
