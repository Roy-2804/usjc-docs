// DocumentForm.tsx
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserProfile, UserErrors } from "../interface";


const UserForm = () => {
  const { id_number } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    name: "",
    email: "",
    pass: "",
    created_at: "",
    role: "",
  });
  const [errors, setErrors] = useState<UserErrors>({});

  const fetchExpediente = async (id_number: string) => {
    if (!id_number) return;
    setLoading(true);
    try {
      //const res = await getUser(id_number);
      //const data = res[0];
      // setFormData({
      //   ...formData,
      //   ...data,
      // });
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_number) fetchExpediente(id_number);
  }, [id_number]);

  const validate = (): UserErrors => {
    const newErrors: UserErrors = {};
    if (!formData.email) newErrors.email = "El correo electronico es obligatorio.";
    if (!formData.pass) newErrors.pass = "La contraseña es obligatoria.";
    if (!formData.role) newErrors.role = "Debe seleccionar un rol para el usuario.";
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
        //await newDoc(formData);
      }
      navigate("/users");
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white">Cargando...</p>;

  return (
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="pt-8">
        <h1 className="text-white font-bold mb-4">
          {id_number ? "Editar usuario" : "Añadir usuario"}
        </h1>
        <form className="space-y-4 bg-white p-6 rounded-lg" onSubmit={handleSubmit}>
          <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electronico</label>
              <input
                type="text"
                id="email"
                name="email"
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="pass" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="text"
                id="pass"
                name="pass"
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2"
                value={formData.pass}
                onChange={handleChange}
              />
              {errors.pass && (
                <p className="text-red-500 text-sm">{errors.pass}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <select name="role" id="role" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-2" value={formData.pass}
                onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div>

          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Guardar expediente
          </button>
        </form>
      </div>
    </main>
  );
};

export default UserForm;
