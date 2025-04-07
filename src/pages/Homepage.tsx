import { useEffect, useState } from "react";
import axios from "axios";
import { FormData } from "../interface";

function Homepage() {
  const [expedientes, setExpedientes] = useState<FormData[]>([]);
  
  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/docs");
        setExpedientes(res.data);
      } catch (err) {
        console.error("Error al obtener expedientes:", err);
      }
    };

    fetchExpedientes();
  }, []);

	return <>
		<main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">	
    <div className="pt-8">
      <h1 className="text-white font-bold mb-4">Listado de expedientes</h1>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {expedientes.length > 0 ? (
                  expedientes.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <a href={`/doc/${doc.id}`} className="text-blue-600 hover:underline">{doc.studentName}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.idNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.grade}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.studentState}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                        <a href={`/doc/${doc.id}/edit`} className="text-blue-600 hover:underline">Editar</a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No hay datos disponibles.</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
		</main>
	</>;
}
  
export default Homepage