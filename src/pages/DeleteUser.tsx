import { deleteUser } from "../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/header/header";
import { toast } from "react-toastify";

const DeleteUser = () => {
  const { id_number } = useParams();
  const navigate = useNavigate();

  const handleReturn = ()  => {
    navigate("/users");
  }

  const handleDelete = async () => {
    if (id_number) {
      try {
        await deleteUser(id_number);
        toast.success("Usuario eliminado correctamente");
        navigate("/users");
      } catch (error) {
        toast.error("Error al eliminar usuario");
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  return (
    <>
    <Header />
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="pt-8">
        <h1 className="text-white font-bold mb-4">Eliminar usuario</h1>
        <p className="text-white font-bold mb-6">¿Está seguro que desea eliminar el usuario?</p>
        <div className="flex gap-10">
          <button className="!bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-[150px]" type="button" onClick={handleDelete}>Eliminar</button>
          <button className="!bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-[150px]" type="button" onClick={handleReturn}>Cancelar</button>
        </div>
      </div>
    </main>
    </>
  );
};
  
export default DeleteUser;