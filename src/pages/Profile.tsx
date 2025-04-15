import { useEffect, useState } from "react";
import { UserProfile } from "../interface";
import Header from "../components/header/header";
import { getUserInfo } from "../services/authService";
import userPicture from '/user.svg';

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  

  useEffect(() => {
    const data = getUserInfo() as UserProfile;
    setUser(data);
  }, []);

  if (!user) return <p className="text-white font-bold mb-4">Cargando perfil...</p>;

  return (
    <>
    <Header />
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="pt-8">
        <h1 className="text-white font-bold mb-4">Mi perfil</h1>
        <div className="flex items-center justify-center mt-20 w-full">
          <div className="bg-white rounded-xl shadow-md p-8 w-full text-center">
            <div className="flex items-center justify-center w-26 h-26 mx-auto rounded-full shadow-lg">
              <img
                className="object-cover"
                src={userPicture}
                alt={`${name}'s profile`}
              />
            </div>
            <h2 className="text-4xl font-bold mt-4 text-gray-800">{user.name}</h2>
            <p className="text-gray-600 mt-2">Correo electrónico: {user.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              Fecha de creación:
              {user.created_at
                ? ` ${new Date(user.created_at).toLocaleDateString()}`
                : " no disponible"}
            </p>
          </div>
        </div>
      </div>
    </main>
    </>
  );
};
  
export default Profile;