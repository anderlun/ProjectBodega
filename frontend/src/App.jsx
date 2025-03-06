import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/templates/Login";
import ProtectedLayout from "./components/templates/ProtectedLayout";

function App() {
  // Establece el estado inicial basado en la existencia del token en localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Devuelve `true` si hay un token
  );

  const handleLogout = () => {
    // Elimina el token y actualiza el estado
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <ProtectedLayout setIsAuthenticated={setIsAuthenticated} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
