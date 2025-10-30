// client/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App(){
  const authed = !!localStorage.getItem("token");
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={authed? <Dashboard/> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}
