import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

const DocInfo = () => {
  const { id_number } = useParams();
  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/docs/${id_number}`);
        setExpediente(res.data);
      } catch (err) {
        console.error("Error al obtener expediente:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpedientes();
  }, [id_number]);

  if (loading) return <p className="text-white font-bold mb-4">Cargando...</p>;

  return (
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="pt-8">
        <h1 className="text-white font-bold mb-4">Información del expediente</h1>
        {expediente ? (
        <div>
          
        </div>
      ) : (
        <p className="text-white font-bold mb-4">No se encontró información para este expediente.</p>
      )}
      </div>
    </main>
  );
};
  
export default DocInfo;