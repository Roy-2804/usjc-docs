import { useState, ChangeEvent, FormEvent } from "react";
import { newDoc } from "../services/docsService";
import { FormData, Errors } from "../interface";


const createCheckboxGroup = (
  title: string,
  name: keyof FormData,
  options: string[],
  formData: FormData,
  setFormData: (data: FormData) => void
) => (
  <div>
    <p className="font-semibold text-gray-800 mt-4 mb-2">{title}</p>
    {options.map((option) => {
      const id = `${name}-${option}`;
      return (
        <div key={option} className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={id}
            name={name}
            value={option}
            checked={formData[name].includes(option)}
            onChange={(e) => {
              const value = e.target.value;
              const current = formData[name];
              const updated = (current as string[]).includes(value)
                ? (current as string[]).filter((v) => v !== value)
                : [...(current as string[]), value];
              setFormData({ ...formData, [name]: updated });
            }}
            className="rounded border-gray-300"
          />
          <label htmlFor={id} className="text-sm text-gray-700">{option}</label>
        </div>
      );
    })}
  </div>
);

function AddDocument() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    studentName: "",
    idNumber: "",
    idType: "",
    gender: "",
    grade: "",
    career: "",
    modalidadGraduacion: "",
    documentosAdjuntos: [],
    convalidaciones: [],
    boletasMatricula: [],
    tcu: [],
    historialAcademico: [],
    documentacionAdicional: [],
    actasCalificacion: [],
    qualifications: [],
    studentCondition: "",
    studentState: "",
    studentRegistration: "",
  });

  const clearForm = () => {
    setFormData({
      id: "",
      studentName: "",
      idNumber: "",
      idType: "",
      gender: "",
      grade: "",
      career: "",
      modalidadGraduacion: "",
      documentosAdjuntos: [],
      convalidaciones: [],
      boletasMatricula: [],
      tcu: [],
      historialAcademico: [],
      documentacionAdicional: [],
      actasCalificacion: [],
      qualifications: [],
      studentCondition: "",
      studentState: "",
      studentRegistration: "",
    });
  };
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.studentName) newErrors.studentName = "El nombre es obligatorio.";
    if (!formData.idNumber) newErrors.idNumber = "El número de identificación es obligatorio.";
    if (!formData.idType) newErrors.idType = "Debe seleccionar un tipo de identificación.";
    if (!formData.gender) newErrors.gender = "Debe seleccionar el sexo del estudiante.";
    if (!formData.grade) newErrors.grade = "Debe seleccionar un grado.";
    if (!formData.career) newErrors.career = "Debe seleccionar una carrera.";
    if (!formData.studentCondition) newErrors.studentCondition = "Debe indicar la condicion del estudiante.";
    if (!formData.studentState) newErrors.studentState = "Debe indicar si el estudiante esta activo o inactivo.";
    if (!formData.studentRegistration) newErrors.studentRegistration = "Debe indicar la ultima fecha de matricula del estudiante.";
    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        await newDoc(formData);
      } catch (error) {
        console.log("Error al registrar expediente", error);
      }

      clearForm();
      setLoading(false);
    }
  };


	return (
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
       {loading && 
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
      }
      <div className="pt-8">
        <h1 className="text-white font-bold mb-4">Añadir expediente</h1>
        <form className="space-y-4 bg-white p-6 rounded-lg" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Nombre del estudiante</label>
          <input placeholder="Ingrese el nombre" id="studentName" name="studentName" type="text" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.studentName} />
          {errors.studentName && <p className="text-red-500 text-sm">{errors.studentName}</p>}
        </div>

        <div>
          <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">Número de identificación</label>
          <input placeholder="Ingrese la identificación" id="idNumber" name="idNumber" type="number" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.idNumber}/>
          {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber}</p>}
        </div>

        <div>
          <label htmlFor="idType" className="block text-sm font-medium text-gray-700">Tipo de identificación</label>
          <select id="idType" name="idType" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.idType}>
            <option value="">Seleccionar</option>
            <option value="Cédula de identidad">Cédula de identidad</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Cédula de residencia">Cédula de residencia</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.idType && <p className="text-red-500 text-sm">{errors.idType}</p>}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Sexo</label>
          <select id="gender" name="gender" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.gender}>
            <option value="">Seleccionar</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
          </select>
          {errors.idType && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>

        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grado</label>
          <select id="grade" name="grade" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.grade}>
            <option value="">Seleccionar</option>
            <option value="Bachillerato">Bachillerato</option>
            <option value="Licenciatura">Licenciatura</option>
            <option value="Maestría">Maestría</option>
          </select>
          {errors.grade && <p className="text-red-500 text-sm">{errors.grade}</p>}
        </div>

        <div>
          <label htmlFor="career" className="block text-sm font-medium text-gray-700">Carrera</label>
          <select id="career" name="career" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.career}>
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
          {errors.career && <p className="text-red-500 text-sm">{errors.career}</p>}
        </div>

        {createCheckboxGroup("Documentos adjuntos", "documentosAdjuntos", [
          "Copia del documento de identificación",
          "Fotografía",
          "Título de secundaria",
          "Verificación plataforma del MEP",
          "Certificación de estudios cursados en otras instituciones (aplica para convalidación de materias)",
          "Certificación de TCU (otra universidad)",
          "Documento de validación de títulos y apostillas en caso de estudios en el exterior",
          "Copia del título universitario requerido (aplica para matrícula en licenciatura o maestría)"
        ], formData, setFormData)}

        {createCheckboxGroup("Convalidaciones", "convalidaciones", [
          "Pre estudio de convalidación",
          "Resolución de convalidación de estudios"
        ], formData, setFormData)}

        {createCheckboxGroup("Boletas de matrícula", "boletasMatricula", ["Presentada"], formData, setFormData)}

        {createCheckboxGroup("Trabajo comunal universitario TCU", "tcu", [
          "Carta de aprobación – solicitud",
          "Oficio de aprobación de la universidad",
          "Oficio de aprobación de la institución u organización",
          "Bitácora",
          "Informe final del estudiante",
          "Oficio de cierre de la universidad"
        ], formData, setFormData)}

        {createCheckboxGroup("Historial académico", "historialAcademico", ["Historial académico de egreso"], formData, setFormData)}

        <div>
          <label htmlFor="modalidadGraduacion" className="block text-sm font-medium text-gray-700">Modalidad de graduación</label>
          <select id="modalidadGraduacion" name="modalidadGraduacion" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.modalidadGraduacion}>
            <option value="">Seleccionar</option>
            <option value="Tesina">Tesina</option>
            <option value="Tesis">Tesis</option>
            <option value="Pruebas de grado">Pruebas de grado</option>
          </select>
        </div>

        {formData.modalidadGraduacion && (
          <>
             {formData.modalidadGraduacion === 'Tesina' || formData.modalidadGraduacion === 'Tesis' ? (
              <>
                {createCheckboxGroup("Actas de calificación", "actasCalificacion", [
                  "Acta de calificación de tesis o tesina",
                ], formData, setFormData)}
              </>
            ) : null}
            {formData.modalidadGraduacion === 'Pruebas de grado' ? (
              <>
                {createCheckboxGroup("Actas de calificación", "actasCalificacion", [
                  "Acta de calificación de tesis o tesina",
                  "Actas de calificación de pruebas de grado 1",
                  "Actas de calificación de pruebas de grado 2",
                  "Actas de calificación de pruebas de grado 3",
                  "Actas de calificación de pruebas de grado 4"
                ], formData, setFormData)}
              </>
            ) : null}
            <div>
              <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">Notas (en caso de que sean más de una, separarlas por comas)</label>
              <input placeholder="Ejemplo: (87, 90...)" id="qualifications" name="qualifications" type="text" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.qualifications} />
            </div>
          </>
        )}

        {createCheckboxGroup("Documentación adicional", "documentacionAdicional", [
          "Copia de títulos obtenidos",
          "Otros"
        ], formData, setFormData)}

        <div>
          <label htmlFor="studentCondition" className="block text-sm font-medium text-gray-700">Condición del estudiante</label>
          <select id="studentCondition" name="studentCondition" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.studentCondition}>
            <option value="">Seleccionar</option>
            <option value="Moroso">Moroso</option>
            <option value="Al día">Al día</option>
          </select>
          {errors.studentCondition && <p className="text-red-500 text-sm">{errors.studentCondition}</p>}
        </div>

        <div>
          <label htmlFor="studentState" className="block text-sm font-medium text-gray-700">¿Estudiante activo o inactivo?</label>
          <select id="studentState" name="studentState" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.studentState}>
            <option value="">Seleccionar</option>
            <option value="Activo">Activo</option>
            <option value="Graduado">Graduado</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          {errors.studentState && <p className="text-red-500 text-sm">{errors.studentState}</p>}
        </div>

        <div>
          <label htmlFor="studentRegistration" className="block text-sm font-medium text-gray-700">Fecha de última matrícula</label>
          <input 
            type="date" 
            id="studentRegistration" 
            name="studentRegistration"
            onChange={handleChange}
            value={formData.studentRegistration}
          />
          {errors.studentRegistration && <p className="text-red-500 text-sm">{errors.studentRegistration}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Guardar Contenido
        </button>
      </form>
      </div>
		</main>
	);
}

export default AddDocument