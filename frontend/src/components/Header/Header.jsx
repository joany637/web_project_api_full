import { Link, useLocation } from 'react-router-dom';
import logo from '../../images/Vector.png';

// 📥 Recibimos el correo como una propiedad más
function Header({ loggedIn, userEmail, onSignOut }) {
  const ubicacion = useLocation();
  const estaEnRegistro = ubicacion.pathname === '/signup';
  const estaEnInicio = ubicacion.pathname === '/signin';

  return (
    <header className="header">
      <img
        src={logo}
        alt="palabra Around"
        className="header-vector"
      />

      {!loggedIn && (
        <nav className="header__navigation">
          {estaEnRegistro && (
            <Link to="/signin" className="header__link">
              Iniciar sesión
            </Link>
          )}
          {estaEnInicio && (
            <Link to="/signup" className="header__link">
              Registrarse
            </Link>
          )}
        </nav>
      )}

      {loggedIn && (
        <nav className="header__navigation">
          {/* ✅ Aquí mostramos el correo ingresado */}
          <span className="header__email">{userEmail}</span>
          <button
            type="button"
            className="header__logout"
            onClick={onSignOut}
          >
            Cerrar sesión
          </button>
        </nav>
      )}

      <hr className="header-line" />
    </header>
  );
}

export default Header;