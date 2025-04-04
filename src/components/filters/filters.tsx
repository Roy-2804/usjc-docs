function Filters() {
	return (
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
	);
}

export default Filters