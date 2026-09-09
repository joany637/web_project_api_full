import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onRegister({ email, password });
  }

  return (
    <main className="register">
      <form className="register__form" onSubmit={handleSubmit}>
        <h2 className="register__title">Regístrate</h2>
        <input
          id="register-email"
          name="email"
          className="register__input"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          id="register-password"
          name="password"
          className="register__input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <button className="register__button" type="submit">
          Registrarse
        </button>
        <p className="register__signup">
          ¿Ya eres miembro? <Link to="/signin" className="register__link">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;