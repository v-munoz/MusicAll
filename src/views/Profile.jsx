import React, { useState } from 'react';
import { Button, Alert, Table, Form } from "react-bootstrap";
import ModalInstruments from "../components/ModalInstruments";
import { EditUserData } from "../controllers/UserController";
import { PlusLg } from 'react-bootstrap-icons';


// Componente para la visualización y edición del perfil de usuario
export default function User() {
    const [showModalInstruments, setShowModalInstruments] = useState(false); // Estado para controlar la visibilidad del modal de instrumentos

    // Llamar a la función EditUserData del controlador UserController
    const {
        user, // Datos del usuario actual
        editedUser, // Datos editados del usuario
        error, // Mensaje de error
        message, // Mensajes informativos
        editing, // Modo de edición
        handleEdit, // Función para manejar el modo edición
        handleCancel, // Función para cancelar el envío del formulario
        handleChange, // Función para manejar los cambios en el formulario
        handleInstrumentChange, // Función para manejar el cambio de instrumentos
        handleSaveChanges, // Función para manejar el guardado de datos y envío del formulario
    } = EditUserData();

    return (
        <>
            {/**Mostrar información del perfil si existe una cuenta */}
            {user && (
                <>
                    <h2 className='text-center'>Información de perfil</h2>

                    {/**Presentado en un Form para poder editarlo */}
                    <Form>

                        {/**Campo de email */}
                        <Form.Group className="my-3">
                            <Form.Label className='fw-semibold'>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={editing ? editedUser.email : user.email}
                                onChange={handleChange}
                                disabled // TODO: Gestionar cambio de email usando AuthService
                            />
                            {/**Mostrar fecha de creación de la cuenta */}
                            <Form.FloatingLabel className='text-center text-secondary small'>Creado en: {user.creationDate || "sin datos"}</Form.FloatingLabel>
                        </Form.Group>

                        {/**Campo de nombre */}
                        <Form.Group className="my-3">
                            <Form.Label className='fw-semibold'>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editing ? editedUser.name : user.name}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>

                        {/**Campo de apellidos */}
                        <Form.Group className="my-3">
                            <Form.Label className='fw-semibold'>Apellidos</Form.Label>
                            <Form.Control
                                type="text"
                                name="surname"
                                value={editing ? editedUser.surname : user.surname}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>

                        {/**Campo de fecha de nacimiento */}
                        <Form.Group className="my-3">
                            <Form.Label className='fw-semibold'>Fecha de nacimiento</Form.Label>
                            <Form.Control
                                type="text"
                                name="birthDate"
                                value={user.birthDate}
                                disabled
                            />
                        </Form.Group>
                    </Form>

                    {/**Tabla de instrumentos seleccionados */}
                    <Table hover size='sm' className='my-3'>
                        <thead>
                            <tr>
                                <th colSpan={2} className='border-0'>Instrumentos</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Muestra los instrumentos guardados en la cuenta */}
                            {!editing && user.instruments.map((instrument, index) => (
                                <tr key={index}>
                                    <td className='col-1 border-end'>{index + 1}</td>
                                    <td className='fw-semibold ps-3'>{instrument}</td>
                                </tr>
                            ))}
                            {/* Muestra solo los instrumentos de editedUser en modo edición */}
                            {editing && editedUser.instruments.map((instrument, index) => (
                                <tr key={index}>
                                    <td className='col-1 border-end'>{index + 1}</td>
                                    <td className='fw-semibold ps-3'>{instrument}</td>
                                    {/* Muestra una tercera columna con un botón eliminar */}
                                    <td className="d-flex">
                                        <Button variant='close' className='ms-auto' onClick={() => handleInstrumentChange(instrument)} />
                                    </td>
                                </tr>
                            ))}
                            {/* Añadir una fila con un botón para añadir más instrumentos (ModalInstruments) en modo edición */}
                            {editing && (
                                <tr>
                                    <td colSpan={3}>
                                        <Button
                                            variant='transparent'
                                            className='btn-sm w-100 d-flex justify-content-center align-items-center text-muted'
                                            onClick={() => setShowModalInstruments(true)}
                                        >
                                            <PlusLg /> Añadir instrumentos
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/**Instanciar el componente con el modal para añadir más instrumentos */}
                    <ModalInstruments
                        showModal={showModalInstruments}
                        handleCloseModal={() => setShowModalInstruments(false)}
                        handleInstrumentSelection={handleInstrumentChange}
                        selectedInstruments={editedUser.instruments}
                    />

                    {/**Mostrar mensajes de error o éxito */}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="info">{message}</Alert>}

                    {/**Botón para editar perfil */}
                    <div className='d-flex gap-3 my-4'>
                        {/**Si está en modo edición, mostrar el botón de editar */}
                        {!editing ? (
                            <Button variant="danger" className='w-100 fw-semibold' onClick={handleEdit}>Editar perfil</Button>
                        ) : (
                            <> {/**Botones para cancelar y guardar cambios en el modo de edición */}
                                <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
                                <Button variant="success" className='w-100' onClick={handleSaveChanges}>Guardar cambios</Button>
                            </>
                        )}
                    </div>
                </>
            )}

            {/**Mensaje si no hay usuario logeado */}
            {!user && <p>No hay usuario logeado</p>}
        </>
    );
}
