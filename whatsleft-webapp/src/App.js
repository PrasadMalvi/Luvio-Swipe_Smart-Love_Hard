import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import "./App.css";
import IndexPage from "./Screens/IndexPage";
import SignIn from "./Screens/SignIn";
import MainPage from "./Screens/MainPage";

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/homePage/*" element={<MainPage />} />
      </Routes>
    </Provider>
  );
}

export default App;
