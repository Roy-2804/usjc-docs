import { toast } from "react-toastify";

const NoPage = () => {
  toast.info("La página que accedes no existe");

    return (
      <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="pt-8">
          <h1 className="text-white font-bold mb-4">Pagina no encontrada</h1>
          <a className="text-white font-bold" href="/">Volver al inicio</a>
        </div>
      </main>
    );
  };
  
  export default NoPage;