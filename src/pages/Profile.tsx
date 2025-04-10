import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../interface";

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        const res = await axios.get("http://localhost:3001/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) return <p className="text-white font-bold mb-4">Cargando perfil...</p>;

  return (
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="pt-8">
        <h1 className="text-white font-bold mb-4">Mi perfil</h1>
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Correo:</strong> {user.email}</p>
        <p><strong>Registrado el:</strong> {new Date(user.created_at).toLocaleDateString()}</p>

      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Cerrar sesión
      </button>
      </div>
    </main>
  );
};
  
export default Profile;