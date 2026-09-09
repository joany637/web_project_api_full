import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Header from './components/Header/Header.jsx';
import Main from './components/Main/Main.jsx';
import Footer from './components/Footer/Footer.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import InfoTooltip from './components/InfoTooltip/InfoTooltip.jsx';

import {
  register,
  authorize,
  checkToken,
} from './utils/auth.js';

import api from './utils/api.js';

const NotFound = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '5rem',
        fontSize: '1.5rem',
      }}
    >
      <h1>Página no Encontrada</h1>
      <p>La ruta que intentas visitar no existe</p>
    </div>
  );
};

function App() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] =
    useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (!token) {
      setIsCheckingToken(false);
      return;
    }

    checkToken(token)
      .then((data) => {
        console.log('Usuario actual:', data);
        setCurrentUser(data.data);
        setLoggedIn(true);
      })
      .catch((err) => {
        console.log('Token inválido:', err);

        localStorage.removeItem('jwt');
        setCurrentUser(null);
        setLoggedIn(false);

        navigate('/signin');
      })
      .finally(() => {
        setIsCheckingToken(false);
      });
  }, [navigate]);

  function handleRegister({ email, password }) {
    console.log('📤 Enviando registro:', {
      email,
      password,
    });

    register({ email, password })
      .then((res) => {
        console.log('✅ Registro exitoso:', res);

        setIsRegistrationSuccess(true);
        setIsInfoTooltipOpen(true);
      })
      .catch((err) => {
        console.log('❌ Error de registro:', err);

        setIsRegistrationSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  }

  function handleLogin({ email, password }) {
    authorize({ email, password })
      .then((data) => {
        console.log('Respuesta del login:', data);

        const token = data.token;

        localStorage.setItem('jwt', token);

        return checkToken(token);
      })
      .then((userData) => {
        console.log('Usuario autorizado:', userData);

        setCurrentUser(userData.data);
        setLoggedIn(true);

        navigate('/');
      })
      .catch((err) => {
        console.log('❌ Error de login:', err);

        setIsRegistrationSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  }

  function handleUpdateUser({ name, about }) {
    return api
      .updateProfile({ name, about })
      .then((data) => {
        console.log('✅ Usuario actualizado:', data);

        const updatedUser = data.data || data;

        setCurrentUser(updatedUser);

        return updatedUser;
      })
      .catch((err) => {
        console.log(
          '❌ Error al actualizar el perfil:',
          err
        );

        throw err;
      });  }   
      
      const token = localStorage.getItem('jwt');  
      useEffect(() => {
        if (loggedIn) {
          api.getUserInfo()
            .then((data) => {
              console.log('Datos del usuario:', data);

              const userData = data.data || data;

              setCurrentUser(userData);
            })
            .catch((err) => {
              console.log(
                '❌ Error al obtener datos del usuario:',
                err
              );
            });
        }
      }, [loggedIn]);


  
  function handleUpdateAvatar(avatarUrl) {
    return api
      .updateAvatar( avatarUrl )
      .then((data) => {
        console.log('✅ Avatar actualizado:', data);

        const updatedUser = data.data || data;

        setCurrentUser(updatedUser);

        return updatedUser;
      })
      .catch((err) => {
        console.log(
          '❌ Error al actualizar el avatar:',
          err
        );

        throw err;
      });
  }

  function handleSignOut() {
    localStorage.removeItem('jwt');

    setLoggedIn(false);
    setCurrentUser(null);

    navigate('/signin');
  }

  function closeInfoTooltip() {
    console.log('🔒 Cerrando tooltip');

    setIsInfoTooltipOpen(false);

    if (isRegistrationSuccess) {
      navigate('/signin');
    }
  }

  if (isCheckingToken) {
    return null;
  }

  return (
    <>
      <Routes>

        <Route
          path="/"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <div className="page">
                <div className="page__content">

                  <Header
                    loggedIn={loggedIn}
                    userEmail={currentUser?.email}
                    onSignOut={handleSignOut}
                  />

                  <Main
                    currentUser={currentUser}
                    onUpdateUser={handleUpdateUser}
                    onUpdateAvatar={handleUpdateAvatar}
                  />

                  <Footer />

                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/signin"
          element={
            <>
              <Header loggedIn={false} />
              <Login onLogin={handleLogin} />
            </>
          }
        />

        <Route
          path="/signup"
          element={
            <>
              <Header loggedIn={false} />
              <Register onRegister={handleRegister} />
            </>
          }
        />

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      <InfoTooltip
        isOpen={isInfoTooltipOpen}
        onClose={closeInfoTooltip}
        isSuccess={isRegistrationSuccess}
      />
    </>
  );
}

export default App;