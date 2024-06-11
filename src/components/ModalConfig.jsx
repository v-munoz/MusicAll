import React, { useState } from "react";
import { ListGroup, Modal, ModalTitle, Button } from "react-bootstrap";
import { PersonFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import useAccountController from "../controllers/AccountController";
import ModalConfirmation from "./ModalConfirmation";

// Componente ModalAccount para mostrar información de la cuenta y acciones disponibles
function ModalAccount({ showModal, handleCloseModal }) {
  // Obtiene datos de la cuenta y la función de logout del AccountController
  const { account, handleLogout, handleDeleteAccount } = useAccountController();

  const [showConfirmation, setShowConfirmation] = useState(false);

  // Función para navegación entre vistas
  const navigate = useNavigate();


  return (
    <>
      {/**Modal con ajustes de cuentas y configuración*/}
      <Modal show={showModal} onHide={handleCloseModal}>

        {/**Cabecera con botón cerrar */}
        <Modal.Header className="pb-0 border-0" closeButton>
          <ModalTitle className="fw-bold">{document.title}</ModalTitle>
        </Modal.Header>

        {/**Cuerpo del modal */}
        <Modal.Body>
          {/**"Tarjeta" con datos básicos del usuario */}
          <div className="d-flex bg-white p-2 rounded-pill border">

            {/**Foto de perfil 
           * TODO: añadir opción para cambiarla*/}
            <PersonFill
              className="btn btn-primary"
              style={{
                height: "75px",
                width: "75px",
                padding: "10px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "",
              }}
            />

            {/**Datos: Nombre + Apellido, email */}
            <div className="d-grid my-auto">
              {/**Verifica si hay datos de cuenta disponible */}
              {account ? (
                <>
                  <strong className="ms-3 text-capitalize">
                    {account.name} {account.surname}
                  </strong>
                  <small className="rounded-pill text-center bg-body-tertiary ms-3 px-2">
                    {account.email}
                  </small>
                </>
              ) : (
                <> {/* Si no hay datos de cuenta */}
                  <strong className="ms-3 text-capitalize">Nombre de usuario</strong>
                  <small className="rounded-pill text-center bg-body-tertiary ms-3 px-2">
                    correo electrónico
                  </small>
                </>
              )}
            </div>
          </div>

          {/**Lista de acciones disponibles para el usuario */}
          <ListGroup className="rounded-4 my-3">

            {/**Botón para ver el perfil del usuario */}
            <button
              type="button"
              onClick={() => {
                navigate("/mi-perfil"); // Navega a la vista del perfil del usuario
                handleCloseModal(); // Cierra el modal después de hacer clic en el botón, si no sigue activo en la siguiente pantalla
              }}
              className="list-group-item text-start"
              disabled={!account} // Lo deshabilita si no hay datos de cuenta
            >
              Mi perfil
            </button>

            <div className="d-flex mt-2"></div>

            {/** Botón para iniciar sesión */}
            <button
              type="button"
              onClick={() => navigate("/login")} // Navega a la vista de inicio de sesión
              className="list-group-item text-start"
              disabled={account ? true : false} // Lo deshabilita si ya hay una cuenta iniciada
            >
              Iniciar sesión
            </button>

            {/** Botón para registrarse */}
            <button
              type="button"
              onClick={() => navigate("/registro")} // Navega a la vista de registro
              className="list-group-item text-start"
              disabled={account ? true : false} // Lo deshabilita si ya hay una cuenta iniciada
            >
              Registrarse
            </button>

            {/** Botón para cerrar sesión */}
            <button
              type="button"
              onClick={handleLogout} // Llama a la función para cerrar sesión
              className="list-group-item text-start"
              disabled={!account} // Lo deshabilita si no hay una cuenta iniciada
            >
              Cerrar sesión
            </button>



            {/**Añadir botones para eliminar cuenta, ver informacion de grupos o lo que sea oportuno */}
          </ListGroup>

          {/**Separador horizontal */}
          <hr className="flex-grow-1 mx-5 mt-4" />

          {/**Botón para eliminar la cuenta de usuario */}
          <Button
            /**TODO: Cambiar el 'window.confirm'. Funciona bien pero se puede integrar mejor */
            onClick={() => {
              handleCloseModal();
              setShowConfirmation(ModalConfirmation)
            }}
            variant="white"
            className="text-danger btn-sm w-100 border-0"
            disabled={!account} // Lo deshabilita si no hay una cuenta iniciada
          >
            Eliminar cuenta
          </Button>

        </Modal.Body>
      </Modal>
      <ModalConfirmation
        showModal={showConfirmation}
        closeModal={() => { setShowConfirmation(false) }}
        action={() => handleDeleteAccount}
        actionTxt={"eliminar tu cuenta"}
      />
    </>
  );
}

export default ModalAccount; // Exporta el componente ModalAccount
