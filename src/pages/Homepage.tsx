import { useEffect, useState, FormEvent } from "react";
import { FilterData, FormData } from "../interface";
import { getDocs } from "../services/docsService";
import { getUserRole } from "../services/authService";
import Header from "../components/header/header";
import editLogo from "/edit-icon-blue.svg";
import trashLogo from "/trash.svg";

function Homepage() {
  const [loading, setLoading] = useState(false);
  const [expedientes, setExpedientes] = useState<FormData[]>([]);
  const [formData, setFormData] = useState<FilterData>({
    studentName: "",
    idNumber: "",
    gender: "",
    grade: "",
    career: "",
    studentState: ""
  });
  const role = getUserRole();

  useEffect(() => {
    fetchExpedientes();
  }, []);

  const fetchExpedientes = async (formData = {}) => {
    try {
      const res = await getDocs(formData);
      setExpedientes(res.data);
    } catch (err) {
      console.error("Error al obtener expedientes:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const activeFilter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);
    fetchExpedientes(formData);
    setLoading(false);
  }

  const resetFilters  = () => {
    setFormData({
      studentName: "",
      idNumber: "",
      gender: "",
      grade: "",
      career: "",
      studentState: ""
    })
  }

	return <>
    <Header />
		<main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">	
    {loading && 
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
      }
    <div className="pt-8">
      <h1 className="text-white font-bold mb-4">Listado de expedientes</h1>
      <form className="bg-white p-4 shadow-lg rounded-2xl mb-4 flex flex-wrap gap-4 items-center justify-between" onSubmit={activeFilter}>
        <h2 className="w-full text-lg font-semibold">Filtros</h2>
        
        <div className="flex flex-col w-full md:w-[48%]">
          <label htmlFor="studentName" className="text-sm font-medium text-gray-700">Nombre</label>
          <input id="studentName" name="studentName" type="text" className="border p-2 rounded-lg text-black shadow-sm bg-white text-black" value={formData.studentName} onChange={handleChange}/>
        </div>
        
        <div className="flex flex-col w-full md:w-[48%]">
          <label htmlFor="idNumber" className="text-sm font-medium text-gray-700">Número de identificación</label>
          <input id="idNumber" name="idNumber" type="number" className="border p-2 rounded-lg text-black shadow-sm bg-white text-black" value={formData.idNumber} onChange={handleChange}/>
        </div>

        <div className="flex flex-col w-full md:w-[48%]">
          <label htmlFor="gender" className="text-sm font-medium text-gray-700">Género</label>
          <select id="gender" name="gender" className="border p-2 rounded-lg shadow-sm bg-white text-black" value={formData.gender} onChange={handleChange}>
            <option value="">Seleccionar</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
          </select>
        </div>
        
        <div className="flex flex-col w-full md:w-[48%]">
          <label htmlFor="grade" className="text-sm font-medium text-gray-700">Grado</label>
          <select id="grade" name="grade" className="border p-2 rounded-lg shadow-sm bg-white text-black" value={formData.grade} onChange={handleChange}>
            <option value="">Seleccionar</option>
            <option value="Bachillerato">Bachillerato</option>
            <option value="Licenciatura">Licenciatura</option>
            <option value="Maestría">Maestría</option>
          </select>
        </div>

        <div className="flex flex-col w-full md:w-[48%]">
          <label htmlFor="career" className="text-sm font-medium text-gray-700">Carrera</label>
          <select id="career" name="career" className="border p-2 rounded-lg shadow-sm bg-white text-black" value={formData.career} onChange={handleChange}>
          <option value="">Seleccionar</option>
            <option value="Administración de Empresas">Administración de Empresas</option>
            <option value="Administración de Empresas con Énfasis en Gestión y Servicios de la Información">Administración de Empresas con Énfasis en Gestión y Servicios de la Información</option>
            <option value="Administración de Empresas con Énfasis en Mercadeo y Ventas">Administración de Empresas con Énfasis en Mercadeo y Ventas</option>
            <option value="Administración de Empresas con Énfasis en Recursos Humanos">Administración de Empresas con Énfasis en Recursos Humanos</option>
            <option value="Administración de Empresas con Énfasis en Relaciones Laborales">Administración de Empresas con Énfasis en Relaciones Laborales</option>
            <option value="Administración de Empresas con Énfasis en Transporte y Seguridad Vial">Administración de Empresas con Énfasis en Transporte y Seguridad Vial</option>
            <option value="Contaduría Pública">Contaduría Pública</option>
            <option value="Derecho">Derecho</option>
          </select>
        </div>
        
        <div className="flex flex-col w-full md:w-[48%]">
          <label htmlFor="studentState" className="text-sm font-medium text-gray-700">Estado</label>
          <select id="studentState" name="studentState" className="border p-2 rounded-lg shadow-sm bg-white text-black" value={formData.studentState} onChange={handleChange}>
            <option value="">Seleccionar</option>
            <option value="Activo">Activo</option>
            <option value="Graduado">Graduado</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        
        <div className="flex gap-4 mt-auto ml-auto">
          <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={resetFilters}>
            <span>Limpiar</span>
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <span>Filtrar</span>
          </button>
        </div>
      </form>
      <div className="overflow-x-auto py-4">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-lg rounded-2xl border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">identificación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Género</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrera</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {expedientes.length > 0 ? (
                  expedientes.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <a href={`/doc/node/${doc.id}`} className="text-blue-600 hover:underline">{doc.studentName}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.idNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          if (Array.isArray(doc.grade)) {
                            return doc.grade.join(", ");
                          }
                          try {
                            const parsed = JSON.parse(doc.grade || "[]");
                            return Array.isArray(parsed) ? parsed.join(", ") : doc.grade;
                          } catch {
                            return doc.grade;
                          }
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[50px] overflow-x-scroll no-scrollbar">
                        {(() => {
                          if (Array.isArray(doc.career)) {
                            return doc.career.join(", ");
                          }
                          try {
                            const parsed = JSON.parse(doc.career || "[]");
                            return Array.isArray(parsed) ? parsed.join(", ") : doc.career;
                          } catch {
                            return doc.career;
                          }
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.studentState}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline flex gap-4 justify-center">
                        <a href={`/doc/node/${doc.id}/edit`} className="text-blue-600 hover:underline w-[20px] h-[20px] block">
                          <img src={editLogo} alt="Edit icon" />
                        </a>
                        {role === "admin" &&
                          <a href={`/doc/node/${doc.id}/delete`} className="text-blue-600 hover:underline w-[20px] h-[20px] block">
                            <img src={trashLogo} alt="Edit icon" className="w-5 h-5"/>
                          </a>
                        }
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No hay datos disponibles.</td>
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