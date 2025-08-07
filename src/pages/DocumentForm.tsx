// DocumentForm.tsx
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { newDoc, updateDoc, getDoc } from "../services/docsService";
import { FormData, Errors } from "../interface";
import Header from "../components/header/header";
import { toast } from "react-toastify";

const createCheckboxGroup = (
  title: string,
  name: keyof FormData,
  options: string[],
  formData: FormData,
  setFormData: (data: FormData) => void
) => (
  <div>
    <p className="font-semibold text-gray-800 mt-4 mb-2">{title}</p>
    {options.map((option, index) => {
       const id = `${name}-${option}`;
       const isChecked = formData[name].includes(option);
       const qualificationsRaw = typeof formData.qualifications === 'string'
       ? formData.qualifications
       : '';
      const notes = qualificationsRaw.split(',');
      const currentNote = notes[index] || '';

      return (
        <div key={option} className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            id={id}
            name={name}
            value={option}
            checked={isChecked}
            onChange={(e) => {
              const value = e.target.value;
              const current = Array.isArray(formData[name])
                ? formData[name]
                : JSON.parse(formData[name]);

              const updated = current.includes(value)
                ? current.filter((v: string) => v !== value)
                : [...current, value];

              const newNotes = [...notes];

              if (!updated.includes(value)) {
                newNotes[index] = '';
              }

              setFormData({
                ...formData,
                [name]: updated,
                qualifications: newNotes.join(',') as string,
              });
            }}
            className="rounded border-gray-300"
          />
          <label htmlFor={id} className="text-sm text-gray-700">{option}</label>
          {isChecked && (
              <input
                type="text"
                placeholder="Nota"
                value={currentNote.replace(/^"(.*)"$/, '$1')}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const updatedNotes = formData.qualifications?.split(',') ?? [];

                  // Asegurar longitud
                  while (updatedNotes.length < options.length) {
                    updatedNotes.push('');
                  }

                  updatedNotes[index] = newValue;

                  setFormData({
                    ...formData,
                    qualifications: updatedNotes.join(','),
                  });
                }}
                className="ml-6 rounded border border-gray-300 p-1 text-sm w-[300px]"
              />
            )}
        </div>
      );
    })}
  </div>
);

const checkboxGroups = [
    {
      title: "Documentos adjuntos",
      name: "documentosAdjuntos",
      options: ["Copia del documento de identificación", "Fotografía", "Título de secundaria", "Verificación plataforma del MEP", "Certificación de estudios cursados en otras instituciones (aplica para convalidación de materias)", "Certificación de TCU (otra universidad)", "Documento de validación de títulos y apostillas en caso de estudios en el exterior", "Copia del título universitario requerido (aplica para matrícula en licenciatura o maestría)"]
    },
    {
      title: "Convalidaciones",
      name: "convalidaciones",
      options: ["Pre estudio de convalidación", "Resolución de convalidación de estudios", "No registra / no posee"]
    },
    {
      title: "Boletas de matrícula",
      name: "boletasMatricula",
      options: ["Presentada", "No registra"]
    },
    {
      title: "Trabajo comunal universitario TCU",
      name: "tcu",
      options: ["Carta de aprobación – solicitud", "Oficio de aprobación de la universidad", "Oficio de aprobación de la institución u organización", "Bitácora", "Informe final del estudiante", "Oficio de cierre de la universidad", "No registra"]
    },
    {
      title: "Historial académico",
      name: "historialAcademico",
      options: ["Historial académico de egreso", "Sin referencia"]
    },
    {
      title: "Documentación adicional",
      name: "documentacionAdicional",
      options: ["Copia de títulos obtenidos", "Otros", "No posee"]
    }
];

const DocumentForm = () => {
  const { id_number } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    studentName: "",
    idNumber: "",
    idType: "",
    gender: "",
    grade: [""],
    career: [""],
    modalidadGraduacion: "",
    documentosAdjuntos: [],
    convalidaciones: [],
    boletasMatricula: [],
    tcu: [],
    historialAcademico: [],
    documentacionAdicional: [],
    actasCalificacion: [],
    qualifications: "",
    studentCondition: "",
    studentState: "",
    studentRegistration: "",
    link: "",
    subjectCount: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  function parsePossiblyEscapedJSON(value: any): string[] {
    try {
      if (Array.isArray(value)) return value;
  
      let parsed = value;
  
      // Intenta deserializar varias veces hasta obtener un array válido
      while (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
  
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const fetchExpediente = async (id_number: string) => {
    if (!id_number) return;
    setLoading(true);
    try {
      const res = await getDoc(id_number);
      const data = res[0][0];
      const parsedExpediente = {
        ...data,
        career: Array.isArray(data.career)
          ? data.career
          : JSON.parse(data.career || "[]"),
        grade: Array.isArray(data.grade)
          ? data.grade
          : JSON.parse(data.grade || "[]"),
      };
      setFormData({
        ...formData,
        ...parsedExpediente,
      });
      console.log(parsedExpediente)
    } catch (error) {
      toast.error("Error al obtener expediente");
      console.error("Error al obtener expediente:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_number) fetchExpediente(id_number);
  }, [id_number]);

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.studentName) newErrors.studentName = "El nombre es obligatorio.";
    if (!formData.idNumber) newErrors.idNumber = "El número de identificación es obligatorio.";
    if (!formData.idType) newErrors.idType = "Debe seleccionar un tipo de identificación.";
    if (!formData.grade) newErrors.grade = "Debe seleccionar un grado.";
    if (!formData.career) newErrors.career = "Debe seleccionar una carrera.";
    if (!formData.studentCondition) newErrors.studentCondition = "Debe indicar la condición del estudiante.";
    if (!formData.studentState) newErrors.studentState = "Debe indicar si el estudiante está activo o inactivo.";
    if (!formData.subjectCount) newErrors.subjectCount = "Debe indicar la cantidad de carreras.";
    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, id } = e.target;
    const index = e.target.getAttribute("data-index");

    const updatedForm = {
      ...formData,
      [name]: value,
    };

    if ((name === "grade" || name === "career") && index !== null) {
      const i = parseInt(index);
      const updatedArray = [...(formData[name] || [])];
      updatedArray[i] = value;
      updatedForm[name] = updatedArray;
    }
    
    if (id === "modalidadGraduacion" ) {
      updatedForm.qualifications = "";
      updatedForm.actasCalificacion = [];
    }
  
    if (id === "subjectCount" && parseInt(value) > 4 ) {
      updatedForm.subjectCount = "4";
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      if (id_number) {
        await updateDoc(id_number, formData);
        toast.success("El expediente se editó correctamente");
      } else {
        await newDoc(formData);
        toast.success("El expediente se guardó correctamente");
      }
      navigate("/home");
    } catch (error) {
      toast.error("Error al guardar expediente");
      console.error("Error al guardar expediente:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white">Cargando...</p>;

  return (
    <>
    <Header />
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="pt-8 relative">
        <h1 className="text-white font-bold mb-4">
          {id_number ? "Editar expediente" : "Añadir expediente"}
        </h1>
        <a className="see-node bg-[#002E60] rounded-[50%] h-[40px] w-[40px] absolute right-0 top-[80px]" href={`/doc/node/${id_number}`}><span className='sr-only'>See node</span></a>
        <form className="space-y-4 bg-white p-6 rounded-lg" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Nombre del estudiante</label>
            <input placeholder="Ingrese el nombre" id="studentName" name="studentName" type="text" className="text-black mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.studentName} />
            {errors.studentName && <p className="text-red-500 text-sm">{errors.studentName}</p>}
          </div>

          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">Número de identificación</label>
            <input placeholder="Ingrese la identificación" id="idNumber" name="idNumber" type="number" className="text-black mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.idNumber}/>
            {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber}</p>}
          </div>

          <div>
            <label htmlFor="idType" className="block text-sm font-medium text-gray-700">Tipo de identificación</label>
            <select id="idType" name="idType" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white text-black" onChange={handleChange} value={formData.idType}>
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
            <select id="gender" name="gender" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white text-black" onChange={handleChange} value={formData.gender}>
              <option value="">Seleccionar</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>

          <div>
            <label htmlFor="subjectCount" className="block text-sm font-medium text-gray-700">Cantidad de carreras</label>
            <input type="string" id="subjectCount" name="subjectCount" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white text-black" onChange={handleChange} value={formData.subjectCount}></input>
            {errors.subjectCount && <p className="text-red-500 text-sm">{errors.subjectCount}</p>}
          </div>

          {Array.from({ length: parseInt(formData.subjectCount) || 0 }).map((_, idx) => (
            <div className="border border-[#002E60] p-2 rounded-lg" key={idx}>
              <p className="text-[#002E60] font-bold underline text-sm mb-2">Carrera #{idx + 1}</p>
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grado</label>
                <select data-index={idx} id="grade" name="grade" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white text-black" onChange={handleChange} value={formData.grade[idx] ?? ""}>
                  <option value="">Seleccionar</option>
                  <option value="Bachillerato">Bachillerato</option>
                  <option value="Licenciatura">Licenciatura</option>
                  <option value="Maestría">Maestría</option>
                  <option value="Sin registro">Sin registro</option>
                </select>
                {errors.grade && <p className="text-red-500 text-sm">{errors.grade}</p>}
              </div>

              <div>
                <label htmlFor="career" className="block text-sm font-medium text-gray-700">Carrera</label>
                <select data-index={idx} id="career" name="career" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white text-black" onChange={handleChange} value={formData.career[idx] ?? ""}>
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
            </div>
          ))}

          <div>
            <label htmlFor="modalidadGraduacion" className="block text-sm font-medium text-gray-700">Modalidad de graduación</label>
            <select id="modalidadGraduacion" name="modalidadGraduacion" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white text-black" onChange={handleChange} value={formData.modalidadGraduacion}>
              <option value="">Seleccionar</option>
              <option value="Tesina">Tesina</option>
              <option value="Tesis">Tesis</option>
              <option value="Pruebas de grado">Pruebas de grado</option>
              <option value="Sin registro">Sin registro</option>
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
                    "Actas de calificación de pruebas de grado 1",
                    "Actas de calificación de pruebas de grado 2",
                    "Actas de calificación de pruebas de grado 3",
                    "Actas de calificación de pruebas de grado 4"
                  ], formData, setFormData)}
                </>
              ) : null}
              {formData.modalidadGraduacion != 'Sin registro' ? (
                <>
                  <div className="hidden">
                    <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">Notas (en caso de que sean más de una, separarlas por comas)</label>
                    <input placeholder="Ejemplo: (87, 90...)" id="qualifications" name="qualifications" type="text" className="text-black mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.qualifications || ''} />
                  </div>
                </>
              ) : null}
            </>
          )}

          <div>
            <label htmlFor="studentCondition" className="block text-sm font-medium text-gray-700">Condición del estudiante</label>
            <select id="studentCondition" name="studentCondition" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white text-black" onChange={handleChange} value={formData.studentCondition}>
              <option value="">Seleccionar</option>
              <option value="Moroso">Moroso</option>
              <option value="Al día">Al día</option>
              <option value="Becado">Becado</option>
            </select>
            {errors.studentCondition && <p className="text-red-500 text-sm">{errors.studentCondition}</p>}
          </div>

          <div>
            <label htmlFor="studentState" className="block text-sm font-medium text-gray-700">¿Estudiante activo o inactivo?</label>
            <select id="studentState" name="studentState" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white text-black" onChange={handleChange} value={formData.studentState}>
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
              className="text-black mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white"
            />
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link de los archivos</label>
            <input placeholder="Ingrese el link" id="link" name="link" type="text" className="text-black mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white" onChange={handleChange} value={formData.link} />
          </div>

          {checkboxGroups.map((group) => (
            <div key={group.name}>
              <p className="font-semibold text-gray-800 mt-4 mb-2">{group.title}</p>

              {group.options.map((option) => {
                const id = `${group.name}-${option}`;
                const currentValues = parsePossiblyEscapedJSON((formData as any)[group.name]);

                return (
                  <div key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={id}
                      name={group.name}
                      value={option}
                      checked={currentValues.includes(option)}
                      onChange={() => {
                        const updated = currentValues.includes(option)
                          ? currentValues.filter((v: string) => v !== option)
                          : [...currentValues, option];

                        setFormData({ ...formData, [group.name]: updated });
                      }}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={id} className="text-sm text-gray-700">{option}</label>
                  </div>
                );
              })}
            </div>
          ))}

          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Guardar expediente
          </button>
        </form>
      </div>
    </main>
    </>
  );
};

export default DocumentForm;
