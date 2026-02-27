import { useState, useEffect  } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProducts from "./pages/AdminProducts";

import { isLoggedIn, logout } from "./utils/auth";

import './App.css'

function App() {

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    navigate("/");
  };
  
  return (
    <div>
      <nav>
        {!loggedIn && (
          <>
            <Link to="/">Login</Link> |{" "}
            <Link to="/register">Register</Link>
          </>
        )}

        {loggedIn && (
          <>
            <Link to="/dashboard">Dashboard</Link> |{" "}
            <Link to="/admin/products">Manage Products</Link> |{" "}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );

}

export default App
