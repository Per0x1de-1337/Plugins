import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Onboard from "./pages/Onboard";
import Detach from "./pages/Detach";

export default function App() {
  return (
    <Router>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Cluster Management UI</h1>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/onboard" element={<Onboard />} />
          <Route path="/detach" element={<Detach />} />
        </Routes>
      </div>
    </Router>
  );
}
