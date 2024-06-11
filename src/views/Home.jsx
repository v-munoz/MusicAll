import React from "react";
import { Alert, Card, Container, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CalendarEvent, Clock, GeoAlt } from "react-bootstrap-icons";
import { GetUserProfile } from "../controllers/UserController";
import useAccountController from "../controllers/AccountController";
import { useAuth } from "../services/AuthService";
import { GetUserEvents } from "../controllers/EventController";

export default function Home() {
  const { account } = useAccountController();
  const { currentUser } = useAuth();
  const { userProfile, userGroups } = GetUserProfile();
  const { events } = GetUserEvents();

  // <!TODO: Mejorar la presentación y visualización de datos de '/inicio'>
  return (
    <Container className="pt-3">
      {account && userProfile ? (
        // Muestra unos encabezados como si fueran notificaciones de la App
        <div className="d-grid gap-4">
          {/**Saludo al usuario */}
          <div className="d-flex align-items-center gap-2 bg-body-tertiary border rounded-pill p-2">
            <Image src={process.env.PUBLIC_URL + '/logo512.png'} style={{ maxWidth: '40px' }} className="border rounded-circle" />
            <h4 className="m-0">¡Hola, {userProfile.name}!</h4>
          </div>

          <hr className="my-2" />

          {/**"Notificaciones" informando si has creado o te has unido a algún grupo 
           * <!TODO: Completar, por ahora no son mensajes relevantes, solo indica si has creado o te has unido a un grupo>
          */}
          <h5 className="my-0">Notificaciones:</h5>
          {/**Si tienes eventos... */}
          {userGroups.length > 0 ? (
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {userGroups.map(group => (
                // Logo de la App con un mensaje sobre tus grupos
                <div key={group.id} className="flex-fill bg-body-tertiary border rounded-pill p-2">
                  <div className="d-flex align-items-center gap-2">
                    <Image src={process.env.PUBLIC_URL + '/logo512.png'} style={{ maxWidth: '40px' }} className="border rounded-circle" />
                    <span>{group.admin === currentUser.uid ? 'Has creado el' : 'Te has unido al'} grupo <strong className="text-nowrap">{group.name}</strong>.</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Alerta de que aún no tienes ningún grupo
            <Alert variant="warning" className="mt-3">
              ¡Para aprovechar al máximo MusicAll, crea tu propio grupo o únete a uno existente! Así podrás disfrutar de todas las funciones y beneficios que ofrecemos.
            </Alert>
          )}

          <hr className="my-2" />

          {/**Información de tus eventos
           * <!TODO: Filtrar por eventos recién creados o próximos. Ahora muestra todos>
           */}
          <h5 className="my-0">Próximos eventos:</h5>
          {events.length > 0 ? (
            // Si tienes eventos...
            <div className="d-flex flex-wrap flex-row justify-content-between">
              {events.map((event, index) => (
                <div key={event.id} className="col-12 col-md-6 px-2 pb-3">
                  {/* Card con la info del evento */}
                  <Card className="d-grid gap-2">
                    {/* Encabezado con tipo de evento y nombre */}
                    <Card.Header className="d-flex flex-wrap flex-fill gap-2">
                      <OverlayTrigger
                        trigger={["hover", "focus"]}
                        placement="top"
                        overlay={<Tooltip id="tooltip" className='text-capitalize'>{event.type}</Tooltip>}
                      >
                        <span className={`col-auto p-1 rounded-2 bg-${event.type === 'concierto' ? 'warning' : event.type === 'ensayo' ? 'success' : 'body-secondary'}`}></span>
                      </OverlayTrigger>
                      {/**Nombre del evento */}
                      <Card.Title className="fw-semibold mb-0">{event.title}</Card.Title>

                      {/* Mostrar el nombre del grupo asociado al evento */}
                      <span className='badge bg-white border rounded-pill text-reset ms-auto align-self-center'>
                        {userGroups.find(group => group.id === event.groupId)?.name}
                      </span>
                    </Card.Header>

                    {/**Cuerpo de la Card con los datos del evento */}
                    <Card.Body className='d-flex flex-wrap column-gap-3'>
                      {event.date && <span><CalendarEvent className='mb-1 me-1' /> {event.date}</span>}
                      {event.time && <span><Clock className='mb-1 me-1' /> {event.time}</span>}
                      {event.location && <span><GeoAlt className='mb-1 me-1' /> {event.location}</span>}
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            // Mensaje si no hay eventos creados por el usuario o en ninguno de sus grupos
            <Alert variant="warning" className="mt-3">
              ¡No hay eventos próximos! Asegúrate de estar al tanto de las novedades de tus grupos para no perderte ninguno.
            </Alert>
          )}
        </div>
      ) : (
        // Mensaje si no hay ningún usuario registrado
        <Alert variant="danger" className="mt-3">
          Error: No hay ningún usuario registrado
        </Alert>
      )}
    </Container>
  );
}
