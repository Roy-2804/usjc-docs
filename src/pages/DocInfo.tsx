import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormData } from "../interface";
import html2canvas from "html2canvas-pro";
import { jsPDF } from 'jspdf';
import logo from '/logo.png';
import { getDoc } from "../services/docsService";
import Header from "../components/header/header";

const DocInfo = () => {
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const { id_number } = useParams();
  const [expediente, setExpediente] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

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

  const generatePDF = async () => {
    setDownloading(true);
    if (pdfRef.current) {
      const originalCanvas = await html2canvas(pdfRef.current, { scale: 2 });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (originalCanvas.height * pdfWidth) / originalCanvas.width;

      const pageHeightPx = (originalCanvas.width * pdfHeight) / pdfWidth; // altura de página en px

      let renderedHeight = 0;
      let pageIndex = 0;

      while (renderedHeight < originalCanvas.height) {
        const canvasFragment = document.createElement("canvas");
        const context = canvasFragment.getContext("2d");

        // Tamaño del fragmento
        canvasFragment.width = originalCanvas.width;
        canvasFragment.height = Math.min(pageHeightPx, originalCanvas.height - renderedHeight);

        // Copiar fragmento del canvas original
        context?.drawImage(
          originalCanvas,
          0,
          renderedHeight,
          originalCanvas.width,
          canvasFragment.height,
          0,
          0,
          originalCanvas.width,
          canvasFragment.height
        );

        const imgData = canvasFragment.toDataURL("image/png");

        const paddingTop = pageIndex === 0 ? 0 : 35; // 35mm de padding desde la segunda página

        if (pageIndex > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, paddingTop, imgWidth, (canvasFragment.height * pdfWidth) / originalCanvas.width);

        renderedHeight += canvasFragment.height;
        pageIndex++;
      }

      const fileName = `Expediente de ${expediente?.studentName}.pdf`;
      pdf.save(fileName);
    }
    setDownloading(false);
  };

  return (
    <>
    <Header />
    <main className={`mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ${downloading ? "overflow-hidden h-screen" : ""}`}>
      {downloading && 
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
      }
      <div className="pt-8 relative pb-20">
        <div className="flex items-center justify-between mb-8 relative">
          <h1 className="text-white font-bold">Información del expediente</h1>
          { expediente &&
          <div>
            <button onClick={generatePDF} className="block w-40 h-[40px] bg-primary text-white rounded-lg text-center !p-0">Descargar PDF</button>
            <a className="edit-form bg-[#002E60] rounded-[50%] h-[40px] w-[40px] absolute right-[-20px] bottom-[-50px]" href={`/doc/node/${expediente?.id}/edit`}><span className='sr-only'>Edit</span></a>
          </div>
          }
          
        </div>
        {expediente ? (
        <div ref={pdfRef} className="py-8 px-12 bg-white shadow-lg w-full rounded-lg">
          <div className='flex items-center gap-[20px] mb-8'>
            <img
              src={logo}
              alt="USJC Logo"
              className="h-[180px] w-[40%] object-contain" />
              <div className='w-[4px] bg-[#002E60] h-[100px]'></div>
              <h2 className="text-3xl font-bold w-[40%]">EXPEDIENTE ACADÉMICO ESTUDIANTIL</h2>
          </div>
          <h3 className='text-3xl font-bold uppercase text-center mb-8'>Datos generales</h3>
          <div className='flex gap-2 text-xl items-center flex-wrap font-medium mb-10'>
            <p className='bg-gray-200 p-2 w-[25%]'>Nombre del estudiante:</p>
            <p className='bg-gray-200 p-2 w-[35%]'>{expediente.studentName}</p>
            <p className='bg-gray-200 p-2 w-[20%]'>Sexo:</p>
            <p className='bg-gray-200 p-2 w-[calc(20%-24px)]'>{expediente.gender}</p>
            <p className='bg-gray-200 p-2 w-[25%]'>Identificación:</p>
            <p className='bg-gray-200 p-2 w-[35%]'>{expediente.idNumber}</p>
            <p className='bg-gray-200 p-2 w-[15%]'>Tipo doc:</p>
            <p className='bg-gray-200 p-2 w-[calc(25%-24px)]'>{expediente.idType}</p>
            <p className='bg-[#002E60] p-2 w-[100%] text-center text-white'>Condición del estudiante</p>
            <p className='bg-gray-200 p-2 w-[25%]'>Económica:</p>
            <p className='bg-gray-200 p-2 w-[35%]'>{expediente.studentCondition}</p>
            <p className='bg-gray-200 p-2 w-[20%]'>Estatus:</p>
            <p className='bg-gray-200 p-2 w-[calc(20%-24px)]'>{expediente.studentState}</p>
            <p className='bg-gray-200 p-2 w-[25%]'>Grado:</p>
            <p className='bg-gray-200 p-2 w-[35%]'>{expediente.grade}</p>
            <p className='bg-gray-200 p-2 w-[20%]'>Última Matrícula:</p>
            <p className='bg-gray-200 p-2 w-[calc(20%-24px)]'>{expediente.studentRegistration}</p>
            <p className='bg-gray-200 p-2 w-[25%]'>Carrera que cursa:</p>
            <p className='bg-gray-200 p-2 w-[calc(75%-8px)]'>{expediente.career}</p>
          </div>
          <h3 className='text-3xl font-bold uppercase text-center mb-12'>DOCUMENTACIÓN</h3>
          <div className='text-xl max-w-[80%]'>
            <div className='flex justify-between mb-4'>
              <p>Copia del documento de identificación</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.documentosAdjuntos.includes("Copia del documento de identificación")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Fotografía</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.documentosAdjuntos.includes("Fotografía")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Título de secundaria</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.documentosAdjuntos.includes("Título de secundaria")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Verificación plataforma del MEP</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.documentosAdjuntos.includes("Verificación plataforma del MEP")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Certificación de estudios cursados en otras instituciones <br /> (aplica para convalidación de materias)</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.documentosAdjuntos.includes("Certificación de estudios cursados en otras instituciones")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Certificación de TCU (otra universidad)</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.documentosAdjuntos.includes("Certificación de TCU (otra universidad)")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Validación de títulos y apostillas en caso de estudios en el exterior  <br />
              (aplica para estudiantes que cursaron estudios en el exterior)
              </p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.documentosAdjuntos.includes("Documento de validación de títulos y apostillas en caso de estudios en el exterior")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Copia del título universitario requerido <br />(aplica para matrícula en licenciatura o maestría)</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.documentosAdjuntos.includes("Copia del título universitario requerido")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
          </div>
          <h3 className='text-3xl font-bold uppercase text-center my-12'>CONVALIDACIONES</h3>
          <div className='text-xl max-w-[80%]'>
            <div className='flex justify-between mb-4'>
              <p>Pre estudio de convalidación</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.convalidaciones.includes("Pre estudio de convalidación")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Resolución de convalidación de estudios</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.convalidaciones.includes("Resolución de convalidación de estudios")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
          </div>
          <h3 className='text-3xl font-bold uppercase text-center my-12'>TRABAJO COMUNAL <br />UNIVERSITARIO TCU</h3>
          <div className='text-xl max-w-[80%]'>
            <div className='flex justify-between mb-4'>
              <p>Carta de aprobación – solicitud</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.tcu.includes("Carta de aprobación – solicitud")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Oficio de aprobación de la universidad</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.tcu.includes("Oficio de aprobación de la universidad")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Oficio de aprobación de la institución u organización</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.tcu.includes("Oficio de aprobación de la institución u organización")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Bitácora</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.tcu.includes("Bitácora")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Informe final del estudiante</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.tcu.includes("Informe final del estudiante")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
            <div className='flex justify-between mb-4'>
              <p>Oficio de cierre de la universidad</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.tcu.includes("Oficio de cierre de la universidad")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
          </div>
          <h3 className='text-3xl font-bold uppercase text-center my-12'>HISTORIAL ACADÉMICO</h3>
          <div className='text-xl max-w-[80%]'>
            <div className='flex justify-between mb-4'>
              <p>Historial académico de egreso</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.historialAcademico.includes("Historial académico de egreso")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
          </div>
          <h3 className='text-3xl font-bold uppercase text-center my-12'>MODALIDAD DE GRADUACIÓN</h3>
          <div className='text-xl max-w-[80%]'>
          {expediente.modalidadGraduacion ? (
                <>
                  <div className='flex justify-between mb-4'>
                    <p>{expediente.modalidadGraduacion}</p>
                    <div className='bg-green-500 h-[20px] w-[20px]'></div>
                  </div>

                  {(typeof expediente.actasCalificacion === "string"
                    ? JSON.parse(expediente.actasCalificacion)
                    : expediente.actasCalificacion
                  ).map((acta: string, idx: number) => (
                    <div className='flex justify-between mb-4' key={idx}>
                      <p>{acta}</p>
                      <div className="bg-green-500 h-[20px] w-[20px]"></div>
                    </div>
                  ))}

                  {typeof expediente.qualifications === "string" &&
                    <div className='flex gap-4 mb-4'>
                      <p>Notas: </p>
                      {(expediente.qualifications as string).split(",").map((q, idx) => (
                        <span key={idx}>{q.trim().replace(/"/g, "")}, </span>
                      ))}
                    </div>
                  }

                </>
              ) : (
                <p className='flex justify-between mb-4'>Modalidad de graduación no presentada</p>
              )}
            <div className='flex justify-between mb-4'>
              <p>Copia de títulos obtenidos</p>
              <div className={`bg-gray-400 h-[20px] w-[20px] ${
                expediente.documentacionAdicional.includes("Copia de títulos obtenidos")
                  ? 'bg-green-500'
                  : ''
              }`}></div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white font-bold mb-4">Expediente no existe.</p>
      )}
      </div>
    </main>
    </>
  );
};
  
export default DocInfo;