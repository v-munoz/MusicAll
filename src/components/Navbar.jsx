import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Navbar, Nav, Button, Image } from "react-bootstrap";
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
      <Navbar className="navbar-top flex-row flex-wrap justify-content-between px-2 py-1 bg-body-tertiary" fixed="top">
        
        {/**Logo y nombre de la APP */}
        <Navbar.Brand className="col d-flex align-items-center gap-2">
          <Image src={process.env.PUBLIC_URL + '/logo512.png'} style={{ maxWidth: '40px' }} className="ms-1 rounded-circle" />
          <h1 className="app-title fs-3 m-0 fw-semibold">{process.env.REACT_APP_NAME}</h1>
        </Navbar.Brand>

        <Nav className="col-auto align-items-center gap-2 gap-md-3 pe-sm-2">
          {/** Barra de búsqueda */}
          <Nav.Link className="text-reset" onClick={() => setShowModalSearch(true)} aria-label="Buscar">
            <Search size={"24px"} />
          </Nav.Link>

          {/** Botón para ir a la página de notificaciones */}
          <Nav.Link href="/notificaciones" className="position-relative text-reset" aria-label="Notificaciones">
            <BellFill size={"24px"} />
          </Nav.Link>

          {/** Icono usuario */}
          <Nav.Link>
            <Button
              type="button"
              variant="primary"
              onClick={() => setShowModalAccount(true)}
              aria-label="Cuenta"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0",
                borderRadius: "50%",
                height: "35px",
                width: "35px",
              }}
            >
              <PersonFill size={"25px"} />
            </Button>
          </Nav.Link>
        </Nav>
      </Navbar>

      <ModalAccount showModal={showModalAccount} handleCloseModal={() => setShowModalAccount(false)} />
      <SearchBar showModal={showModalSearch} handleCloseModal={() => setShowModalSearch(false)} />
    </>
  );
};

// Componente para la barra de navegación inferior
function NavbarBottom() {
  const location = useLocation();

  return (
    <Navbar className="bg-body-tertiary mx-auto" fixed="bottom">
      <Nav className="container-fluid justify-content-around ">
        {/* Botón para ir a la página de inicio */}
        <Nav.Link href="/"
          className={location.pathname === '/'
            ? 'badge bg-primary-subtle rounded-pill py-2 px-4 active'
            : 'badge text-muted py-2 px-4'
          }
        >
          <HouseFill size={"24px"} />
        </Nav.Link>

        {/* Botón para ir a la página de repertorio */}
        <Nav.Link href="/repertorio"
          className={location.pathname === '/repertorio'
            ? 'badge bg-primary-subtle rounded-pill py-2 px-4 active'
            : 'badge text-muted py-2 px-4'
          }
        >
          <MusicNoteList size={"24px"} />
        </Nav.Link>

        {/* Botón para ir a la página de eventos */}
        <Nav.Link href="/eventos"
          className={location.pathname === '/eventos'
            ? 'badge bg-primary-subtle rounded-pill py-2 px-4 active'
            : 'badge text-muted py-2 px-4'
          }
        >
          <CalendarWeekFill size={"24px"} />
        </Nav.Link>

        {/* Botón para ir a la página de grupos */}
        <Nav.Link href="/mis-grupos"
          className={location.pathname === '/mis-grupos'
            ? 'badge bg-primary-subtle rounded-pill py-2 px-4 active'
            : 'badge text-muted py-2 px-4'
          }
        >
          <PeopleFill size={"24px"} />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}

export { NavbarTop, NavbarBottom }; // Exporta los componentes NavbarTop y NavbarBottom
