const users = [
  { name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member", id: 1 },
  { name: "Courtney Henry", title: "Designer", email: "courtney.henry@example.com", role: "Admin", id: 2 },
  { name: "Tom Cook", title: "Director of Product", email: "tom.cook@example.com", role: "Member", id: 3 },
  { name: "Whitney Francis", title: "Copywriter", email: "whitney.francis@example.com", role: "Admin", id: 4 },
  { name: "Leonard Krasner", title: "Senior Designer", email: "leonard.krasner@example.com", role: "Owner", id: 5 },
  { name: "Floyd Miles", title: "Principal Designer", email: "floyd.miles@example.com", role: "Member", id: 6 },
];

const UserList = () => {
  return (
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="pt-8">
        <h1 className="text-white font-bold mb-4">Listado de usuarios</h1>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">identificación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrera</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <a href={`/user/${user.id}`} className="text-blue-600 hover:underline">{user.name}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">Edit</td>
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
  );
};

export default UserList;