import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Navbar, Nav, Button } from "react-bootstrap";
import {
  PersonFill,
  Search,
  HouseFill,
  CalendarWeekFill,
  BellFill,
  MusicNoteList,
  PeopleFill,
} from "react-bootstrap-icons";

import ModalAccount from "./ModalConfig";
import SearchBar from "./SearchBar";


// Componente para la barra de navegación superior
function NavbarTop() {
  // Estado para controlar la visibilidad del modal de usuario
  const [showModalAccount, setShowModalAccount] = useState(false);

  // Estado para controlar la visibilidad del modal de búsqueda
  const [showModalSearch, setShowModalSearch] = useState(false);

  // Estado para almacenar la posición de desplazamiento previa
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  // Efecto para controlar el comportamiento de la barra de navegación al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Oculta la barra de navegación cuando se desplaza hacia abajo y la muestra cuando se desplaza hacia arriba
      if (prevScrollPos > currentScrollPos) {
        document.querySelector(".navbar-top").style.top = "0";
      } else {
        document.querySelector(".navbar-top").style.top = "-75px";
      }

      setPrevScrollPos(currentScrollPos);
    };

    // Agrega el evento de escucha para el scroll
    window.addEventListener("scroll", handleScroll);

    // Remueve el evento de escucha al desmontar el componente
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <>
      <Navbar className="navbar-top container-fluid justify-content-center px-2 bg-white " fixed="top" >

        {/**Barra de búsqueda */}
        <Nav className="w-100 bg-body-secondary rounded-pill ps-3 ms-3" >
          <Nav.Item
            onClick={() => setShowModalSearch(true)}
            className="d-flex align-items-center w-100 gap-3 py-2 text-muted"
          >
            <Search />
            Buscar
          </Nav.Item>
        </Nav>

        {/* Botón para ir a la página de notificaciones */}
        <Nav.Link href="/notificaciones" className="position-relative mx-4">
          <BellFill size={"24px"} />
          {/**Muestra una notificación aunque no haya
           * TODO! corregirlo cuando se implementen las notificaciones
           */}
          <span className="badge d-flex p-1 rounded-circle bg-danger position-absolute top-0 start-100 translate-middle-x"></span>
        </Nav.Link>

        {/**Icono usuario */}
        <Navbar.Brand>
          <Button
            type="button"
            variant="primary"
            onClick={() => setShowModalAccount(true)}
            style={{
              height: "35px",
              width: "35px",
              padding: "0",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PersonFill size={"25px"} />
          </Button>
        </Navbar.Brand>
      </Navbar>

      <ModalAccount showModal={showModalAccount} handleCloseModal={() => setShowModalAccount(false)} />
      <SearchBar showModal={showModalSearch} handleCloseModal={() => setShowModalSearch(false)} />
    </>
  );
}

// Componente para la barra de navegación inferior
function NavbarBottom() {
  const location = useLocation();

  return (
    <Navbar className="bg-body-tertiary mx-auto" fixed="bottom">
      <Nav className="container-fluid justify-content-around ">
        {/* Botón para ir a la página de inicio */}
        <Nav.Link href="/" className={location.pathname === '/' ? 'badge bg-primary-subtle rounded-pill py-2 px-4 active' : 'badge text-muted py-2 px-4'}>
          <HouseFill size={"24px"} />
        </Nav.Link>

        {/* Botón para ir a la página de repertorio */}
        <Nav.Link href="/repertorio" className={location.pathname === '/repertorio' ? 'badge bg-primary-subtle rounded-pill py-2 px-4 active' : 'badge text-muted py-2 px-4'}>
          <MusicNoteList size={"24px"} />
        </Nav.Link>

        {/* Botón para ir a la página de eventos */}
        <Nav.Link href="/eventos" className={location.pathname === '/eventos' ? 'badge bg-primary-subtle rounded-pill py-2 px-4 active' : 'badge text-muted py-2 px-4'}>
          <CalendarWeekFill size={"24px"} />
        </Nav.Link>

        {/* Botón para ir a la página de grupos */}
        <Nav.Link href="/mis-grupos" className={location.pathname === '/mis-grupos' ? 'badge bg-primary-subtle rounded-pill py-2 px-4 active' : 'badge text-muted py-2 px-4'}>
          <PeopleFill size={"24px"} />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}

export { NavbarTop, NavbarBottom }; // Exporta los componentes NavbarTop y NavbarBottom
