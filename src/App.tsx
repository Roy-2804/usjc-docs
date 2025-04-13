import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import { getToken, logout } from "./services/authService";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Users from "./pages/UserList";
import AddDocument from "./pages/AddDocument";
import EditDocument from "./pages/EditDocument";
import DocInfo from "./pages/DocInfo";
import Profile from "./pages/Profile";
import UserForm from "./pages/UserForm";
import Header from "./components/header/header";
import NoPage from "./pages/NoPage";
import DocumentForm from "./pages/DocumentForm";
import './App.css'
import { JwtPayload } from "./interface";
import { jwtDecode } from "jwt-decode";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const sessionUser = getToken();

    if (sessionUser) {
      try {
        const decoded: JwtPayload = jwtDecode(sessionUser);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token expiró
          console.log("Token expirado");
          logout();
          setIsAuthenticated(false);
        } else {
          // Token válido
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Token inválido:", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    
  }, []);

  return (
    <div className="page min-h-screen">
      <Header />
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/add" element={<AddDocument />} />
        <Route path="/users" element={<Users />} />
        <Route path="/doc/node/:id_number" element={<DocInfo />} />
        <Route path="/doc/node/:id_number/edit" element={<EditDocument />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/manage-user" element={<UserForm />} />
        <Route path="/test" element={<DocumentForm />} />
        <Route path="/test/:id_number" element={<DocumentForm />} />
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </div>
  );
}

export default App
