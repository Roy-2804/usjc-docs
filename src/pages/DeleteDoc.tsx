import { deleteDoc } from "../services/docsService";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/header/header";

const DeleteDoc = () => {
  const { id_number } = useParams();
  const navigate = useNavigate();

  const handleReturn = ()  => {
    navigate("/home");
  }

  const handleDelete = async () => {
    if (id_number) {
      try {
        await deleteDoc(id_number);
        navigate("/home");
      } catch (error) {
        console.error("Error al eliminar documento:", error);
      }
    }
  };

  return (
    <>
    <Header />
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="pt-8">
        <h1 className="text-white font-bold mb-4">Eliminar expediente</h1>
        <p className="text-white font-bold mb-6">¿Está seguro que desea eliminar el expediente?</p>
        <div className="flex gap-10">
          <button className="!bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-[150px]" type="button" onClick={handleDelete}>Eliminar</button>
          <button className="!bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-[150px]" type="button" onClick={handleReturn}>Cancelar</button>
        </div>
      </div>
    </main>
    </>
  );
};
  
export default DeleteDoc;