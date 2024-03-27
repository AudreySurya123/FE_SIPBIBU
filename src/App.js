import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Resetpassword from "./pages/Resetpassword";
import Forgotpassword from "./pages/Forgotpassword";
import MainLayout from "./components/MainLayout";
import DataIbu from "./pages/DataIbu";
import DataPsikolog from "./pages/DataPsikolog"
import DataAdmin from "./pages/DataAdmin"
import RubriksMom from "./pages/RubriksMom"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="data-ibu" element={<DataIbu />} />
          <Route path="data-psikolog" element={<DataPsikolog />} />
          <Route path="data-admin" element={<DataAdmin />} />
          <Route path="artikel" element={<RubriksMom />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
