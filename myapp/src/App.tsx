import { Provider } from "react-redux";
import "./App.css";

import store from "./redux/store";
import Balance from "./views/Balance";

import Content from "./views/Content";
import Order from "./views/Order";

function App() {
  return (
    <Provider store={store}>
      <Content />
      <Balance />
      <Order />
    </Provider>
  );
}

export default App;
