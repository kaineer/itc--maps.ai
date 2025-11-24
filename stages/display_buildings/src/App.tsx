import React from "react";
import { Provider } from "react-redux";
import { setupStore } from "./store";
import { ViewUI } from "./components/ui/ViewUI";

const store = setupStore();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ViewUI />
    </Provider>
  );
};

export default App;
