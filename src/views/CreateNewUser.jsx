import React, { useState } from "react";
import { Form, Button, Card, Alert, Modal } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import Calendar from 'react-calendar'; // Importar paquete react-calendar para el widget del calendario (https://www.npmjs.com/package/react-calendar)
import 'react-calendar/dist/Calendar.css';
import ModalInstruments from "../components/ModalInstruments";
import { CreateUser } from "../controllers/UserController";

export default function CreateNewUser() {
    // Utiliza el hook useUserController para obtener referencias, estados y funciones relacionadas con el controlador de usuario
    const {
        nameRef,
        surnameRef,
        selectedDate,
        selectedInstruments,
        maxDate,
        handleSubmit,
        navigate,
        error,
        setSelectedDate,
        handleInstrumentSelection,
    } = CreateUser();

    const [showModalCalendar, setShowModalCalendar] = useState(false);
    const [showModalInstruments, setShowModalInstruments] = useState(false);

    return (
        <>
            {/**Card que contiene el formulario de registro */}
            <Card className="shadow">
                <Card.Header>
                    {/**Botón para volver atrás */}
                    <Button
                        type="button"
                        variant="outline-dark"
                        className="border-0 pb-2"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft />
                    </Button>
                </Card.Header>

                <Card.Body>
                    {/**Muestra un mensaje de error si hay algún error durante el registro */}
                    {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                    {/**Formulario de registro */}
                    <Form onSubmit={handleSubmit}>
                        {/**Campo de nombre */}
                        <Form.Group id="name" className="my-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" ref={nameRef} required />
                        </Form.Group>

                        {/**Campo de apellidos */}
                        <Form.Group id="surname" className="my-3">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control type="text" ref={surnameRef} required />
                        </Form.Group>

                        {/**Campo de fecha de nacimiento */}
                        <Form.Group id="birthday" className="d-grid my-3">
                            <Form.Label>Fecha de nacimiento</Form.Label>

                            {/**Campo que abre el modal de selección de fecha */}
                            <Form.Control 
                                className="text-start border bg-body-tertiary "
                                onClick={() => setShowModalCalendar(true)}
                                // Si hay una fecha seleccionada, muestra la fecha en formato específico, de lo contrario, muestra un mensaje predeterminado
                                value={ selectedDate ? selectedDate.toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                }) : ""}
                                placeholder="Seleccionar fecha de nacimiento"
                                readOnly
                                required
                            />

                            {/**Modal de selección de fecha */}
                            <Modal show={showModalCalendar} onHide={() => setShowModalCalendar(false)} centered>
                                <Modal.Header closeButton></Modal.Header>

                                <Modal.Body>
                                    {/**Componente Calendar para seleccionar la fecha */}
                                    <Calendar className="container"
                                        onChange={(date) => setSelectedDate(date)}
                                        value={selectedDate}
                                        maxDate={maxDate}
                                        minDate={new Date(1901, 0, 1)}
                                        locale="es"
                                    />
                                    <Button className="w-100 mt-3" onClick={() => setShowModalCalendar(false)}>
                                        Confirmar
                                    </Button>
                                </Modal.Body>
                            </Modal>
                        </Form.Group>

                        {/**Campo de selección de instrumentos desde el modal ModalInstruments */}
                        <Form.Group id="instruments" className="d-grid my-3">
                            <Form.Label>Instrumentos</Form.Label>
                            <Form.Control 
                                className="text-start border bg-body-tertiary "
                                onClick={() => setShowModalInstruments(true)}
                                // El texto del botón varía dinámicamente para mostrar los instrumentos seleccionados
                                value={selectedInstruments ? selectedInstruments.join(', ') : []}
                                placeholder="No se han seleccionado instrumentos"
                                readOnly
                            />

                            {/**Modal de selección de instrumentos */}
                            <ModalInstruments
                                showModal={showModalInstruments}
                                handleCloseModal={() => setShowModalInstruments(false)}
                                handleInstrumentSelection={handleInstrumentSelection}
                                selectedInstruments={selectedInstruments}
                            />

                        </Form.Group>



                        {/**Botón de enviar el formulario */}
                        <div className="d-flex gap-3 mt-4">
                            <Button type="submit" className="w-100">
                                Crear cuenta
                            </Button>
                        </div>

                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}
