import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importar las vistas de la app
import Home from "./views/Home";
import Events from "./views/Events";
import Notifications from "./views/Notifications";
import Repertoire from "./views/Repertoire";
import Groups from "./views/Groups";
import Profile from "./views/Profile";
import InfoUser from './views/InfoUser';
import LogIn from "./views/Login";
import ForgotPass from "./views/ForgotPassword"
import SignUp from "./views/Signup";
import CreateNewUser from "./views/CreateNewUser";
import CreateNewGroup from "./views/CreateNewGroup";

// Importar el Container de react-bootstrap
import { Container } from "react-bootstrap";
import { NavbarTop, NavbarBottom } from "./components/Navbar";

// Importar AuthProvider que contiene las funciones relacionadas con el inicio de sesión
import { AuthProvider, useAuth } from "./services/AuthService";
import InfoGroup from "./views/InfoGroup";


function App() {
  // Obtener el nombre de la aplicación desde el manifest.json y ponerlo como título de la web
  useEffect(() => {
    const appName = process.env.REACT_APP_NAME;
    document.title = appName;
  }, []);

  // Componente para las rutas privadas, solo accesibles para usuarios autenticados
  function PrivateRoute({ element }) {
    const { currentUser } = useAuth();
  
    // Si no hay un usuario logueado, redirigir a /login
    if (!currentUser || currentUser === null) {
      return <Navigate to="/login" replace />;
    }
    // Si hay un usuario logueado, ir a la vista de la url introducida e incorporar las barras de navegación superior e inferior
    return (
      <>
        <NavbarTop />
        {element}
        <NavbarBottom />
      </>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        {/**Contenedor principal de la aplicación */}
        <Container style={{ margin: "50px auto 50px auto" }}>
          <Routes>

            {/**Rutas privadas - es necesario estar logeado para acceder a ellas, si no redirige a /login */}
            <Route path="/" element={<PrivateRoute element={<Home />} />} />
            <Route path="/eventos" element={<PrivateRoute element={<Events />} />} />
            <Route path="/notificaciones" element={<PrivateRoute element={<Notifications />} />} />
            <Route path="/repertorio" element={<PrivateRoute element={<Repertoire />} />} />
            <Route path="/mis-grupos" element={<PrivateRoute element={<Groups />} />} />
            <Route path="/grupo" element={<PrivateRoute element={<InfoGroup />} />} />
            <Route path="/crear-grupo" element={<PrivateRoute element={<CreateNewGroup />} />} />
            <Route path="/mi-perfil" element={<PrivateRoute element={<Profile />} />} />
            {/* Ruta para el perfil de otro usuario */}
            <Route path="/perfil" element={<PrivateRoute element={<InfoUser />} />} />



            {/**Rutas de Login y registro */}
            <Route path="/login" element={<LogIn />} />
            <Route path="/recuperar-contrasena" element={<ForgotPass />} />
            <Route path="/registro" element={<SignUp />} />
            <Route path="/registro/nuevo-usuario" element={<CreateNewUser />} />
            
          </Routes>
        </Container>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
