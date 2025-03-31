import { logout } from "../services/authService";
import Header from "../components/header/header";

function Homepage() {
	return <>
		<Header />
		<div>
			<h1>Bienvenido</h1>
			<button onClick={() => { logout(); window.location.reload(); }}>Cerrar sesión</button>
		</div>
	</>;
}
  
export default Homepage