import { useEffect, useState } from "react";
import axios from "axios";
import { UserProfile } from "../interface";
import Header from "../components/header/header";
import editLogo from "/edit-icon-blue.svg";
import trashLogo from "/trash.svg";
import { getUserRole } from "../services/authService";

const UserList = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const role = getUserRole();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
    <Header />
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="pt-8">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-white font-bold">Listado de usuarios</h1>
          <a href="/add/user" className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 !text-white">Añadir usuario</a>
        </div>
        <form className="bg-white p-4 shadow-lg rounded-2xl mb-4 flex flex-wrap gap-4 items-center">
        <h2 className="w-full text-lg font-semibold">Filtros</h2>
        
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" className="border p-2 rounded-lg" />
        </div>
        
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700">Número de identificación</label>
          <input type="number" className="border p-2 rounded-lg" />
        </div>
        
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700">Grado</label>
          <select className="border p-2 rounded-lg">
            <option value="">Seleccionar</option>
            <option value="Bachillerato">Bachillerato</option>
            <option value="Licenciatura">Licenciatura</option>
            <option value="Maestría">Maestría</option>
          </select>
        </div>
        
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700">Carrera</label>
          <select className="border p-2 rounded-lg">
            <option value="">Seleccionar</option>
            <option value="Ingeniería">Ingeniería</option>
            <option value="Medicina">Medicina</option>
            <option value="Derecho">Derecho</option>
            <option value="Administración">Administración</option>
          </select>
        </div>
        
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700">Estado</label>
          <select className="border p-2 rounded-lg">
            <option value="">Seleccionar</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-auto">Filtrar</button>
      </form>
      <div className="overflow-x-auto py-4">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-lg rounded-2xl border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <a href={`/user/${user.id}`} className="text-blue-600 hover:underline">{ user.name }</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.created_at}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline flex gap-4 justify-center">
                        <a href={`/user/${user.id}/edit`} className="text-blue-600 hover:underline w-[20px] h-[20px] block">
                            <img src={editLogo} alt="Edit icon" />
                          </a>
                          {role === "admin" &&
                            <a href={`/user/${user.id}/delete`} className="text-blue-600 hover:underline w-[20px] h-[20px] block">
                              <img src={trashLogo} alt="Edit icon" className="w-5 h-5"/>
                            </a>
                          }
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No hay datos disponibles. Intente filtrar nuevamente.</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      </div>
		</main>
    </>
  );
};

export default UserList;