import { useEffect, useState, FormEvent } from "react";
import { UserProfile } from "../interface";
import Header from "../components/header/header";
import editLogo from "/edit-icon-blue.svg";
import trashLogo from "/trash.svg";
import { getUserRole } from "../services/authService";
import { getUsers } from "../services/userService";

const UserList = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const role = getUserRole();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    role: "",
  });
  const fetchUsers = async (formData = {}) => {
    try {
      const res = await getUsers(formData);
      setUsers(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const activeFilter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);
    fetchUsers(formData);
    setLoading(false);
  }
  
  const resetFilters  = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
    })
  }

  return (
    <>
    <Header />
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    {loading && 
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
      }
      <div className="pt-8">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-white font-bold">Listado de usuarios</h1>
          <a href="/add/user" className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 !text-white">Añadir usuario</a>
        </div>
        <form className="bg-white p-4 shadow-lg rounded-2xl mb-4 flex flex-wrap gap-4 items-center justify-between" onSubmit={activeFilter}>
        <h2 className="w-full text-lg font-semibold">Filtros</h2>
        
        <div className="flex flex-col w-full md:w-[48%]">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre</label>
          <input name="name" id="name" type="text" className="border p-2 rounded-lg shadow-sm bg-white text-black" onChange={handleChange} value={formData.name}/>
        </div>
        
        <div className="flex flex-col w-full md:w-[48%]">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo electrónico</label>
          <input name="email" id="email" type="text" className="border p-2 rounded-lg shadow-sm bg-white text-black" onChange={handleChange} value={formData.email}/>
        </div>
        
        <div className="flex flex-col w-full md:w-[48%]">
          <label htmlFor="role" className="text-sm font-medium text-gray-700">Rol</label>
          <select name="role" id="role" className="border p-2 rounded-lg shadow-sm bg-white text-black" onChange={handleChange} value={formData.role}>
            <option value="">Seleccionar</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
          </select>
        </div>
        <div className="flex gap-4 mt-auto ml-auto">
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-auto" onClick={resetFilters}>
            <span>Limpiar</span>
          </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-auto">Filtrar</button>
        </div>
      </form>
      <div className="overflow-x-auto py-4">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-lg rounded-2xl border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        { user.name }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.created_at 
                        ? ` ${new Date(user.created_at).toLocaleDateString()}`
                        : " no disponible"}</td>
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