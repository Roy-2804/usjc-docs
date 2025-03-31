import { useEffect, useState } from "react";
import { getToken } from "./services/authService";
import Login from "./pages/login";
import Homepage from "./pages/homepage";
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    //setIsAuthenticated(!!getToken());
  }, []);

  return (
    <div className="bg-[#002E60] min-w-screen">
      {isAuthenticated ? (
        <Homepage />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App
