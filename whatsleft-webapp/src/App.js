import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./Screens/IndexPage";
import SignIn from "./Screens/SignIn";
import Dashboard from "./Screens/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/homePage" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
