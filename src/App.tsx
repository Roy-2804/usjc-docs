import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getToken } from "./services/authService";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Users from "./pages/UserList";
import AddDocument from "./pages/AddDocument";
import DocInfo from "./pages/DocInfo";
import Header from "./components/header/header";
import NoPage from "./pages/NoPage";
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  return (
    <div className="page min-h-screen">
      {isAuthenticated ? (
        <Router>
          <Header></Header>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/add" element={<AddDocument />} />
            <Route path="/users" element={<Users />} />
            <Route path="/doc/:id_number" element={<DocInfo />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </Router>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App
