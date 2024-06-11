import React, { useState } from 'react';
import { Container, Button, Alert, Card, Modal, Form, Dropdown, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css';
import { CalendarEvent, Clock, GeoAlt, PencilSquare, People, PlusLg, XLg } from 'react-bootstrap-icons';
import { CreateEvent, DeleteEvent, GetUserEvents } from '../controllers/EventController';
import ModalConfirmation from '../components/ModalConfirmation';

export default function Events() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    eventTitle,
    setEventTitle,
    selectedGroup,
    setSelectedGroup,
    eventType,
    setEventType,
    eventDate,
    setEventDate,
    eventTime,
    setEventTime,
    eventLocation,
    setEventLocation,
    handleCreateEvent,
  } = CreateEvent();

  const {
    userGroups,
    events,
  } = GetUserEvents();

  const today = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Container className="py-4">
      {/**Encabezado de la vista con el título y un botón para crear eventos */}
      <div className='d-flex flex-wrap-reverse justify-content-center justify-content-sm-between gap-2 mb-3'>
        <h2>Eventos</h2>

        {/**Botón 'Crear un nuevo Evento' */}
        <Button variant='primary' className='ms-auto' onClick={() => setShowModal(true)}>
          <PlusLg className='mb-1' /> Crear Evento
        </Button>
      </div>

      {/**Si el usuario (o sus grupos) tienen algún evento */}
      {events.length > 0 ? (
        <>
          {/**Separador con la fecha actual */}
          <div className='d-flex flex-wrap gap-3 small text-muted align-items-center font-monospace'>
            <hr className='flex-grow-1' />Hoy es {today}<hr className='flex-grow-1' />
          </div>

          {/**Mapeo de todos los eventos del usuario y sus grupos */}
          {events.map((event, index) => (
            <div key={index}>
              {/**Próximos eventos */}
              {event.date > today && (
                <Card className='my-2'>
                  {/**Encabezado del evento */}
                  <Card.Header className='d-flex flex-wrap align-items-center gap-2'>
                    <Card.Title className='mb-0'>
                      {/**Tipo de evento (concierto = amarillo, ensayo = verde) */}
                      <OverlayTrigger
                        trigger={["hover", "focus"]}
                        placement="top"
                        overlay={<Tooltip id="tooltip" className='text-capitalize'>{event.type}</Tooltip>}
                      >
                        <span className={`px-1 me-2 rounded-2 bg-${event.type === 'concierto' ? 'warning'
                          : event.type === 'ensayo' ? 'success'
                            : 'body-secondary'}`}>
                        </span>
                      </OverlayTrigger>
                      {/**Nombre del evento */}
                      <span className='fw-semibold'>{event.title}</span>
                    </Card.Title>

                    {/**Badge con el grupo del evento */}
                    <span className='badge bg-white border rounded-pill text-reset mt-1 ms-2'>{userGroups.find(group => group.id === event.groupId)?.name}</span>

                    {/**Botón editar evento <!TODO: Sin implementar> */}
                    <ButtonGroup className='gap-2 ms-auto'>
                      <Button
                        variant='success'
                        className='btn-sm rounded-2'
                        onClick={() => console.log("Sin implementar!")}
                      >
                        <PencilSquare className='mb-1' />
                      </Button>

                      {/**Botón para borrar el evento. Llama al modal confirmación
                       * <!TODO: No se porque no funciona. Arreglar!>
                       */}
                      <Button
                        variant='danger'
                        className='btn-sm rounded-2'
                        onClick={() => setShowConfirmation(ModalConfirmation)}
                      >
                        <XLg className='mb-1' />
                      </Button>
                    </ButtonGroup>
                  </Card.Header>

                  {/**Cuerpo de la Card con el resto de datos */}
                  <Card.Body>
                    <div className='d-flex flex-row flex-wrap align-items-center column-gap-4 row-gap-2'>
                      {/**Comprueba si existen los datos antes de mostrarlos */}
                      {event.date &&
                        // Fecha del evento
                        <span><CalendarEvent className='mb-1 me-1' /> {event.date}</span>
                      }
                      {event.time &&
                        // Hora del evento
                        <span><Clock className='mb-1 me-1' /> {event.time}</span>
                      }
                      {event.location &&
                        // Ubicación del evento
                        <span><GeoAlt className='mb-1 me-1' /> {event.location}</span>
                      }
                    </div>
                  </Card.Body>
                </Card>
              )}


              {/**Eventos pasados 
               * <!TODO: Mejorarlo para que no haya que repetir el código>
              */}
              {event.date < today && (
                <>
                  {/**Separador para los eventos antiguos */}
                  <div className='d-flex flex-wrap gap-3 small text-muted align-items-center font-monospace'>
                    <hr className='flex-fill' /> Eventos pasados <hr className='flex-fill' />
                  </div>

                  {/**Se le añade a las Card la clase bg-body-secondary para dar una representación visual */}
                  <Card key={index} className='my-2 bg-body-secondary'>
                    {/**Encabezado del evento */}
                    <Card.Header className='d-flex align-items-center justify-content-between gap-2'>
                      <Card.Title className='mb-0'>
                        {/**Tipo de evento (concierto = amarillo, ensayo = verde) */}
                        <OverlayTrigger
                          trigger={["hover", "focus"]}
                          placement="top"
                          overlay={<Tooltip id="tooltip" className='text-capitalize'>{event.type}</Tooltip>}
                        >
                          <span className={`px-1 me-2 rounded-2 bg-${event.type === 'concierto' ? 'warning'
                            : event.type === 'ensayo' ? 'success'
                              : 'body-secondary'}`}>
                          </span>
                        </OverlayTrigger>
                        {/**Nombre del evento */}
                        {event.title}

                        {/**Badge con el grupo del evento. <!TODO: No se que he tocado pero no se ve y antes si> */}
                        <span className='badge bg-white rounded-pill border px-2 ms-2 text-wrap text-reset'>
                          {userGroups.find(group => group.id === event.groupId)?.name}
                        </span>
                      </Card.Title>

                      {/**Botón editar evento <!TODO: Sin implementar> */}
                      <ButtonGroup className='gap-2'>
                        <Button
                          variant='success'
                          className='btn-sm rounded-2'
                          onClick={() => console.log("Sin implementar!")}
                        >
                          <PencilSquare className='mb-1' />
                        </Button>

                        {/**Botón para borrar el evento. Llama al modal confirmación
                       * <!TODO: No se porque no funciona. Arreglar!>
                       */}
                        <Button
                          variant='danger'
                          className='btn-sm rounded-2'
                          onClick={() => setShowConfirmation(ModalConfirmation)}
                        >
                          <XLg className='mb-1' />
                        </Button>
                      </ButtonGroup>
                    </Card.Header>

                    {/**Cuerpo de la Card con el resto de datos */}
                    <Card.Body>
                      <div className='d-flex flex-row flex-wrap align-items-center column-gap-4 row-gap-2'>
                        {/**Comprueba si existen los datos antes de mostrarlos */}
                        {event.date &&
                          // Fecha del evento
                          <span><CalendarEvent className='mb-1 me-1' /> {event.date}</span>
                        }
                        {event.time &&
                          // Hora del evento
                          <span><Clock className='mb-1 me-1' /> {event.time}</span>
                        }
                        {event.location &&
                          // Ubicación del evento
                          <span><GeoAlt className='mb-1 me-1' /> {event.location}</span>
                        }
                      </div>
                    </Card.Body>
                  </Card>
                </>
              )}
              
              {/**Llamada al modal de confirmación (para eliminar el evento) */}
              <ModalConfirmation
                showModal={showConfirmation}
                closeModal={() => setShowConfirmation(false)}
                action={() => { DeleteEvent(event.id); setShowConfirmation(false) }}
                actionTxt={<>
                  eliminar el evento
                  <span className='text-nowrap text-decoration-underline mx-1'>{event.title}</span>
                </>}
              />

            </div>
          ))}
        </>
      ) : (
        // Si no hay eventos muestra una alerta
        <>
          <hr />
          <Alert key="no-events" variant="warning" className="text-center mt-3">
            Aún no tienes ningún evento en el calendario.
          </Alert>
        </>
      )}


      {/**Modal para crear un nuevo evento.
       * Daba varios errores que no conseguía solucionar como componente independiente, por lo que lo incorporé en la vista
       * <!TODO: Separarlo de la vista para que pueda ser reutilizado, ej. al crear un nuevo grupo y añadir eventos iniciales>
       */}
      <Modal show={showModal} onHide={() => setShowModal(false)} scrollable>

        {/**Formulario de 'crear nuevo evento' */}
        <Form>
          <Modal.Header className='d-flex pb-1' closeButton>
            {/**El título del evento se añade en el encabezado.
             * No consigo que sea 'required', se envía el formulario sin errores aunque no haya nada escrito
             */}
            <Form.Group controlId="eventTitle" className='flex-fill me-3'>
              <Form.Control
                type="text"
                value={eventTitle}
                placeholder='Título'
                onChange={(e) => setEventTitle(e.target.value)}
                autoFocus
                className='border-0 fs-5 fw-semibold'
                required
              />
            </Form.Group>
          </Modal.Header>

          {/**Cuerpo del modal con detalles del evento
           * Al poner el campo de title en el header no funcionaba el 'scrollable' correctamente. El estilo inline lo corrige
           */}
          <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

            {/**Campo de grupo asociado al evento */}
            <Form.Group controlId="selectGroup" className='d-flex flex-wrap align-items-center column-gap-3 mb-3'>
              <Form.Label><People /></Form.Label>

              {/**Dropdown con los grupos del usuario*/}
              <Dropdown onSelect={(e) => setSelectedGroup(e)} className='flex-fill me-sm-3'>
                <Dropdown.Toggle id="dropdown-basic" variant="outline-dark" className='w-100 rounded-pill me-sm-3 border-secondary'>
                  {selectedGroup ? userGroups.find(group => group.id === selectedGroup)?.name : 'Seleccionar grupo...'}
                </Dropdown.Toggle>

                <Dropdown.Menu className='w-100'>
                  {userGroups.map(group => (
                    <Dropdown.Item key={group.id} eventKey={group.id} className='text-center'>{group.name}</Dropdown.Item>
                  ))}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => setSelectedGroup("")} className="text-center small py-0 font-monospace">
                    Reset
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            {/**Campo de tipo de evento */}
            <Form.Group controlId="eventType" className='mb-3'>
              <ButtonGroup className='d-flex justify-content-around gap-3'>
                {/**Button de 'Ensayos' */}
                <Button
                  variant={eventType === 'ensayo' ? 'success' : 'outline-secondary'}
                  className="rounded-pill fw-semibold"
                  onClick={() => setEventType('ensayo')}
                >
                  Ensayo
                </Button>

                {/**Button de 'Conciertos' */}
                <Button
                  variant={eventType === 'concierto' ? 'warning' : 'outline-secondary'}
                  className="rounded-pill fw-semibold"
                  onClick={() => setEventType('concierto')}
                >
                  Concierto
                </Button>
              </ButtonGroup>
            </Form.Group>

            {/**Campo para la fecha, usando el componente react/calendar */}
            <Form.Group controlId="eventDate" className='mb-3'>
              <Calendar
                onChange={setEventDate}
                value={eventDate.toDateString()}
                minDate={new Date()} // No se pueden crear nuevos eventos anteriores a la fecha actual
                className='mx-auto'
              />
            </Form.Group>

            {/**Campo para la hora */}
            <Form.Group controlId="eventTime" className='d-flex flex-wrap column-gap-3 mb-3'>
              <Form.Label><Clock /></Form.Label>
              {/**Componente TimeRangePicker (es bastante feo, pero funciona) */}
              <TimeRangePicker
                onChange={setEventTime}
                value={eventTime}
                className='flex-fill text-center me-sm-3'
                format='HH:mm'
                maxTime="23:59"
                locale='ES-es'
                disableClock
              />
            </Form.Group>

            {/**Campo para la ubicación del evento */}
            <Form.Group controlId="eventLocation" className='d-flex align-items-center column-gap-3 mb-3'>
              <Form.Label><GeoAlt /></Form.Label>
              <Form.Control
                type="text"
                value={eventLocation}
                placeholder='Ubicación'
                onChange={(e) => setEventLocation(e.target.value)}
                className='me-sm-3'
              />
            </Form.Group>
          </Modal.Body>
        </Form>

        {/**Footer con botones de 'cancelar' y 'enviar form' */}
        <Modal.Footer className='d-flex flex-wrap justify-content-around'>
          {/**Botón cancelar */}
          <Button
            variant="outline-secondary"
            className='flex-fill border-0'
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </Button>

          {/**Botón enviar */}
          <Button
            type='submit'
            variant="primary"
            className='flex-fill'
            onClick={() => { handleCreateEvent(); setShowModal(false); }}
          >
            Crear Evento
          </Button>
        </Modal.Footer>
      </Modal>
    </Container >
  );
}
