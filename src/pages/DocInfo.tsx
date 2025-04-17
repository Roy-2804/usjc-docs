import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormData } from "../interface";
import { getDoc } from "../services/docsService";
import Header from "../components/header/header";
import StudentPDF from "../components/studentPDF/StudentPDF";
import { PDFViewer } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';

const DocInfo = () => {
  const { id_number } = useParams();
  const [expediente, setExpediente] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(true);

  const fetchExpedientes = async (id_number: string) => {
    try {
      const res: FormData[][] = await getDoc(id_number);
      setExpediente(res[0][0]);
      console.log(res)
    } catch (err) {
      console.error("Error al obtener expediente:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_number) fetchExpedientes(id_number);
  }, [id_number]);

  if (loading) return <p className="text-white font-bold mb-4">Cargando...</p>;

  setTimeout(() => {
    setDownloading(false);
    }, 1500);
  return (
    <>
    <Header />
    <main className={`mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ${downloading ? "overflow-hidden h-screen" : ""}`}>
      {downloading && 
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
      }
      <div className="pt-8 relative pb-0">
        <div className="flex items-center justify-between mb-8 relative">
          <h1 className="text-white font-bold">Información del expediente</h1>
          { expediente &&
          <div>
            <PDFDownloadLink
              document={<StudentPDF student={expediente} />}
              fileName={`Expediente_${expediente.studentName}.pdf`}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                textDecoration: 'none',
                margin: 'auto',
                color: '#fff',
                backgroundColor: '#000',
                borderRadius: 6,
                width: 200,
                height: 50,
              }}
            >
              {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
            </PDFDownloadLink>
            <a className="edit-form bg-[#002E60] rounded-[50%] h-[40px] w-[40px] absolute right-0 bottom-[-50px]" href={`/doc/node/${expediente?.id}/edit`}><span className='sr-only'>Edit</span></a>
          </div>
          }
          
        </div>
      </div>
      { expediente && 
      <>
        <PDFViewer showToolbar={false} width="100%" height="600">
          <StudentPDF student={expediente} />
        </PDFViewer>
      </>
      }
    </main>
    </>
  );
};
  
export default DocInfo;