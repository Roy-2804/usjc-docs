import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import { getToken, logout } from "./services/authService";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Users from "./pages/UserList";
import DocInfo from "./pages/DocInfo";
import Profile from "./pages/Profile";
import UserForm from "./pages/UserForm";
import NoPage from "./pages/NoPage";
import DocumentForm from "./pages/DocumentForm";
import DeleteDoc from "./pages/DeleteDoc";
import DeleteUser from "./pages/DeleteUser";
import './App.css'
import { JwtPayload } from "./interface";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import RequireAdmin from "./components/requireAdmin/requireAdmin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

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
          navigate("/");
        } else {
          // Token válido
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Token inválido:", error);
        setIsAuthenticated(false);
        navigate("/");
      }
    } else {
      setIsAuthenticated(false);
      navigate("/");
    }    
  }, []);

  return (
    <div className="page min-h-screen">
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/add" element={<DocumentForm />} />
        <Route
          path="/users"
          element={
            <RequireAdmin>
              <Users />
            </RequireAdmin>
          }
        />
        <Route path="/doc/node/:id_number" element={<DocInfo />} />
        <Route path="/doc/node/:id_number/edit" element={<DocumentForm />} />
        <Route
          path="/doc/node/:id_number/delete"
          element={
            <RequireAdmin>
              <DeleteDoc />
            </RequireAdmin>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/add/user"
          element={
            <RequireAdmin>
              <UserForm />
            </RequireAdmin>
          }
        />
        <Route path="/user/:id_number/edit" element={<UserForm />} />
        <Route
          path="/user/:id_number/delete"
          element={
            <RequireAdmin>
              <DeleteUser />
            </RequireAdmin>
          }
        />
        <Route path="/" element={<Login onLogin={() => setIsAuthenticated(true)} isAuthenticated={isAuthenticated} />} />
        <Route path="/user/:id_number" element={<DocInfo />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App
