// DocumentForm.tsx
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { newDoc, updateDoc, getDoc } from "../services/docsService";
import { FormData, Errors } from "../interface";
import Header from "../components/header/header";

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
              const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
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

const checkboxGroups = [
    {
      title: "Documentos adjuntos",
      name: "documentosAdjuntos",
      options: ["Copia del documento de identificación", "Fotografía", "Título de secundaria", "Verificación plataforma del MEP", "Certificación de estudios cursados en otras instituciones (aplica para convalidación de materias)", "Certificación de TCU (otra universidad)", "Documento de validación de títulos y apostillas en caso de estudios en el exterior", "Copia del título universitario requerido (aplica para matrícula en licenciatura o maestría)"]
    },
    {
      title: "Convalidaciones",
      name: "convalidaciones",
      options: ["Pre estudio de convalidación", "Resolución de convalidación de estudios"]
    },
    {
      title: "Boletas de matrícula",
      name: "boletasMatricula",
      options: ["Presentada"]
    },
    {
      title: "Trabajo comunal universitario TCU",
      name: "tcu",
      options: ["Carta de aprobación – solicitud", "Oficio de aprobación de la universidad", "Oficio de aprobación de la institución u organización", "Bitácora", "Informe final del estudiante", "Oficio de cierre de la universidad"]
    },
    {
      title: "Historial académico",
      name: "historialAcademico",
      options: ["Historial académico de egreso"]
    },
    {
      title: "Documentación adicional",
      name: "documentacionAdicional",
      options: ["Copia de títulos obtenidos", "Otros"]
    },
    {
      title: "Actas de calificación",
      name: "actasCalificacion",
      options: ["Acta de calificación de tesis o tesina", "Actas de calificación de pruebas de grado 1", "Actas de calificación de pruebas de grado 2", "Actas de calificación de pruebas de grado 3", "Actas de calificación de pruebas de grado 4"]
    },
];

const selectFields = [
    {
      label: "Tipo de identificación",
      name: "idType",
      options: ["Cédula", "Pasaporte"]
    },
    {
      label: "Género",
      name: "gender",
      options: ["Masculino", "Femenino", "Otro"]
    },
    {
      label: "Grado",
      name: "grade",
      options: ["Bachillerato", "Licenciatura", "Maestría"]
    },
    {
      label: "Condición del estudiante",
      name: "studentCondition",
      options: ["Regular", "Condicional"]
    },
    {
      label: "Estado del estudiante",
      name: "studentState",
      options: ["Activo", "Inactivo", "Graduado"]
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
    link: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const fetchExpediente = async (id_number: string) => {
    if (!id_number) return;
    setLoading(true);
    try {
      const res = await getDoc(id_number);
      const data = res[0];
      setFormData({
        ...formData,
        ...data,
      });
    } catch (error) {
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
    if (!formData.studentRegistration) newErrors.studentRegistration = "Debe indicar la última fecha de matrícula.";
    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        //await updateDoc(formData);
      } else {
        await newDoc(formData);
      }
      navigate("/home");
    } catch (error) {
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
      <div className="pt-8">
        <h1 className="text-white font-bold mb-4">
          {id_number ? "Editar expediente" : "Añadir expediente"}
        </h1>
        <form className="space-y-4 bg-white p-6 rounded-lg" onSubmit={handleSubmit}>
          {[
            { label: "Nombre del estudiante", name: "studentName" },
            { label: "Número de identificación", name: "idNumber" },
            { label: "Tipo de identificación", name: "idType" },
            { label: "Género", name: "gender" },
            { label: "Grado", name: "grade" },
            { label: "Carrera", name: "career" },
            { label: "Modalidad de graduación", name: "modalidadGraduacion" },
            { label: "Condición del estudiante", name: "studentCondition" },
            { label: "Estado del estudiante", name: "studentState" },
            { label: "Última matrícula", name: "studentRegistration" },
            { label: "Calificaciones", name: "qualifications" },
            { label: "Enlace", name: "link" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                id={name}
                name={name}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2"
                value={(formData as any)[name]}
                onChange={handleChange}
              />
              {(errors as any)[name] && (
                <p className="text-red-500 text-sm">{(errors as any)[name]}</p>
              )}
            </div>
          ))}

          {checkboxGroups.map((group) => (
            <div key={group.name}>
              <p className="font-semibold text-gray-800 mt-4 mb-2">{group.title}</p>
              {group.options.map((option) => {
                const id = `${group.name}-${option}`;
                return (
                  <div key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={id}
                      name={group.name}
                      value={option}
                      checked={(formData as any)[group.name].includes(option)}
                      onChange={() => {
                        const current = (formData as any)[group.name];
                        const updated = current.includes(option)
                          ? current.filter((v: string) => v !== option)
                          : [...current, option];
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
