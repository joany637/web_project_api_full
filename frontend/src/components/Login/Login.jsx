import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onLogin({ email, password });
  }

  return (
    <main className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title">Inicia sesión</h2>
        <input
          id="login-email"
          name="email"
          className="login__input"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          id="login-password"
          name="password"
          className="login__input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button className="login__button" type="submit">
          Iniciar sesión
        </button>
        <p className="login__signup">
          ¿Aún no tienes una cuenta? <Link to="/signup" className="login__link">Regístrate</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;