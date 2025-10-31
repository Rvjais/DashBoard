// client/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { ThemeProvider } from "./lib/theme.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminTasks from "./pages/AdminTasks.jsx";
// ThemeProvider moved to ./lib/theme.js to avoid circular imports

export default function App(){
  const authed = !!localStorage.getItem("token");
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={authed? <Dashboard/> : <Navigate to="/login" />} />
        <Route path="/admin/tasks" element={<AdminTasks />} />
      </Routes>
    </ThemeProvider>
  );
}
