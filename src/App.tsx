import { useEffect, useState } from "react";
import { getToken, logout } from "./services/authService";
import Login from "./pages/login";
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  return (
    <div className="bg-[#002E60] min-w-screen">
      {isAuthenticated ? (
        <div>
          <h1>Bienvenido</h1>
          <button onClick={() => { logout(); window.location.reload(); }}>Cerrar sesión</button>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App
