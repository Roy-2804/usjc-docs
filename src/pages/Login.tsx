import { useEffect, useState } from "react";
import { login } from "../services/authService";
import logo from '/logo.png';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import eye from '/eye.svg';
import eyeOff from '/eye-off.svg';

const Login = ({ onLogin, isAuthenticated }: { onLogin: () => void; isAuthenticated: boolean }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const data = await login(email, password);
      onLogin();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setLoading(false)
      toast.success("Bienvenido");
      navigate("/home");
    } catch (error) {
      toast.warning("Error al iniciar sesión. Asegúrate de añadir las credenciales correctamente");
      console.log("Error al iniciar sesión", error);
      setLoading(false)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {loading && 
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
      }
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <img src={logo} alt="USJC Logo" />
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black shadow-sm bg-white text-black"
              placeholder="ejemplo@usanjuandelacruz.ac.cr"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">Contraseña</label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black shadow-sm bg-white text-black"
              placeholder="********"
              required
            />
            <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 bottom-0 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors !bg-[transparent] !border-0
                hover:!border-0 !p-0 focus:!outline-[0]"
                aria-label={passwordVisible ? "Ocultar contraseña" : "Ver contraseña"}
              >
              {passwordVisible ? (
                <img
                alt="Eye off"
                src={eyeOff}
                className="size-6"
              />
              ) : (
                <img
                    alt="Eye"
                    src={eye}
                    className="size-6"
                  />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full !bg-[#002E60] py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
