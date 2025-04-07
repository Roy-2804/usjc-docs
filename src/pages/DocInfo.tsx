import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { FormData } from "../interface";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const DocInfo = () => {
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const { id_number } = useParams();
  const [expediente, setExpediente] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/docs/${id_number}`);
        setExpediente(res.data[0][0]);
      } catch (err) {
        console.error("Error al obtener expediente:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpedientes();
  }, [id_number]);

  if (loading) return <p className="text-white font-bold mb-4">Cargando...</p>;

  const generatePDF = async () => {
    if (pdfRef.current) {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const canvas = await html2canvas(pdfRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 10, 190, 0);
      const fileName = `Expediente de ${expediente?.studentName}.pdf`;
      doc.save(fileName);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="pt-8 relative">
        <div className="flex items-center justify-between mb-8 relative">
          <h1 className="text-white font-bold">Información del expediente</h1>
          <button onClick={generatePDF} className="block w-40 h-[40px] bg-primary text-white rounded-lg text-center !p-0">Descargar PDF</button>
          <a className="edit-form bg-[#002E60] rounded-[50%] h-[40px] w-[40px] absolute right-[-20px] bottom-[-50px]" href={`/doc/${expediente?.id}/edit`}><span className='sr-only'>Edit</span></a>
        </div>
        {expediente ? (
        <div ref={pdfRef} className="p-4 bg-white shadow-lg w-full rounded-lg">
          <h2 className="font-bold mb-4">{expediente.studentName}</h2>
        </div>
      ) : (
        <p className="text-white font-bold mb-4">Expediente no existe.</p>
      )}
      </div>
    </main>
  );
};
  
export default DocInfo;