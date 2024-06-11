import React from 'react';
import { Button, Card, Form, FormGroup, FormControl, Dropdown, Alert, InputGroup } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, PersonCircle, PersonGear, Search, XLg } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { CreateGroup } from '../controllers/MusicalGroupController';

// Componente para crear un nuevo grupo en la pantalla '/crear-grupo'
export default function CreateNewGroup() {

    const navigate = useNavigate();

    // Llamar al Hook CreateGroup del MusicalGroupController para manejar el form y crear un nuevo grupo
    const {
        step, // Paso en el que se encuentra el formulario
        handleNextStep, // Función para manejar el avance del formulario
        handlePreviousStep, // Función para manejar el retroceso del formulario
        currentUser, // Usuario actual, por defecto será el admin del grupo
        groupName, // Nombre de la agrupación musical creada
        setGroupName, // Estado para almacenar el nombre del grupo
        members, // Array con los emails de los músicos invitados
        handleAddMember, // Función para añadir nuevos miembros al array 'members'
        handleToggleMember, // Función para manejar los checkboxes del array 'members' y eliminarlos del array
        searchInput, // Texto en la barra de búsqueda
        handleSearchInputChange, // Actualiza los resultados del dropdown cuando se escribe en la barra de búsqueda
        handleSearchInputBlur, // Esconde la barra de búsqueda cuando pierde el foco
        searchResults, // Array con los resultados de la busqueda que se muestran en el dropdown
        selectedEvents, //TODO! Por implementar
        setSelectedEvents, //TODO! Por implementar
        selectedSongs, //TODO! Por implementar
        setSelectedSongs, //TODO! Por implementar
        error, // Mensajes de error
        handleSubmit // Envío del formulario
    } = CreateGroup();

    return (
        <>
            {/**Card con el formulario para introducir los datos del nuevo grupo */}
            <Card>
                {/**Encabezado de la card */}
                <Card.Header className="d-flex align-items-center">
                    {/**Información del paso actual y título */}
                    <Card.Title className='my-1'>
                        <span className='badge bg-dark me-2'>{step}/5</span>
                        <strong>Crear un nuevo grupo</strong>
                    </Card.Title>
                    {/**Botón para cerrar el formulario y volver a la página anterior */}
                    <Button
                        type="button"
                        variant="outline-dark"
                        className="position-absolute end-0 border-0 m-2"
                        onClick={() => navigate(-1)}
                    >
                        <XLg className='mb-1' />
                    </Button>
                </Card.Header>
                {/**Formulario dinámico (en varios pasos) para introducir los datos del grupo */}
                <Card.Body>
                    {/**Paso 1: Información del grupo
                     * TODO!: Expandir con más datos relevantes
                     */}
                    {step === 1 && (
                        <>
                            {/**Cuando se envía esta parte se llama a la función 'handleNextStep' que almacena los datos y avanza el formulario */}
                            <Form onSubmit={handleNextStep}>

                                {/**Campo Nombre del Grupo */}
                                <FormGroup controlId='groupName'>
                                    <Form.Label className='fw-bold'>Nombre del grupo *</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Introduce el nombre del grupo'
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        required
                                    />
                                    <Form.Text>* Este campo es obligatorio</Form.Text>
                                </FormGroup>

                                {/**Mensaje de error si no se ha introducido ningún nombre o este ya está en la DB */}
                                {error && <Alert variant="danger" className="text-center mt-3">{error}</Alert>}

                                {/**TODO!: Expandir con más datos relevantes
                                 * Habría que buscar algún componente de React con nombres de ciudades o provincias de España.
                                 * Esto podría ser util: https://github.com/frontid/ComunidadesProvinciasPoblaciones
                                 */}
                                <hr />
                                <Alert variant='warning' className='mt-3 text-center'>Añadir más campos como estilo musical de la banda o localización</Alert>
                            </Form>
                        </>
                    )}

                    {/**Paso 2: Invitar músicos al grupo */}
                    {step === 2 && (
                        <>
                            <Form onSubmit={handleNextStep}>
                                <Form.Label className='fw-bold'>Invita a músicos a tu grupo</Form.Label>
                                {/**Listado con todos los miembros seleccionados en checkbox para poder deseleccionarlos */}
                                <Form.Group controlId="selectedMembers" className='list-group list-group-flush'>
                                    {/**Alerta para informar que a veces se deseleccionan automáticamente usuarios al seleccionar otros pero no se borran de la lista
                                     * Sucede por la indexación en el array, pero ahora que se crea una copia creo que ya está corregido y se puede eliminar
                                     */}
                                    {members.length > 0 && (
                                        <Alert className='small text-muted text-center mx-3 my-1'>Aunque un elemento aparezca desmarcado, si está en esta lista se agregará al grupo.</Alert>
                                    )}
                                    {/**Mapeo de usuarios añadidos al array 'members' */}
                                    {members.map((member, index) => (
                                        <Form.Check
                                            className='list-group-item mx-3'
                                            key={member} // Usamos el email como key
                                            type="checkbox"
                                            label={member}
                                            defaultChecked={true}
                                            onChange={(e) => handleToggleMember(index, e.target.checked)}
                                        />
                                    ))}
                                </Form.Group>

                                {/**Campo de búsqueda con dropdown donde se muestran los usuarios cuyo email coincide con la búsqueda */}
                                <FormGroup controlId='members' className='pt-2'>
                                    {/**Barra de búsqueda con Blur para que desaparezca el dropdown cuando se clica fuera de este campo */}
                                    <InputGroup>
                                        <InputGroup.Text id="search-addon">
                                            <Search />
                                        </InputGroup.Text>
                                        <FormControl
                                            placeholder="Buscar usuarios..."
                                            aria-label="Buscar usuarios"
                                            aria-describedby="search-addon"
                                            value={searchInput}
                                            onChange={handleSearchInputChange}
                                            onBlur={handleSearchInputBlur}
                                        />
                                    </InputGroup>
                                    {/**Dropdown que muestra un máximo de 3 usuarios cuyos emails coinciden con el texto en la barra de búsqueda */}
                                    <Dropdown show={searchResults.length > 0}> {/**Solo aparece si encuentra algo / hay algo escrito */}
                                        <Dropdown.Menu className='container'> {/**Lo he hecho container para que ocupe todo el ancho y quede mejor */}
                                            {/**Mapeo de resultados */}
                                            {searchResults.map((user) => (
                                                <Dropdown.Item className='d-flex flex-wrap align-items-center gap-2'
                                                    key={user.email}
                                                    onClick={() => handleAddMember(user.email)}
                                                >
                                                    {/**Muestra un icono, el nombre + apellidos y el email del usuario. Aunque muestra el nombre no busca por nombre */}
                                                    <PersonCircle />
                                                    <span className='fw-semibold'>{user.name} {user.surname}</span>
                                                    <span className='badge bg-primary'>{user.email}</span>
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>

                                </FormGroup>
                            </Form>
                        </>
                    )}

                    {/**Paso 3: Añadir eventos
                     * TODO! Vincularlo con el modal de creación de eventos
                     */}
                    {step === 3 && (
                        <>
                            <Form onSubmit={handleNextStep}>
                                <FormGroup controlId='events'>
                                    <Form.Label className='fw-bold'>Planifica un ensayo o concierto inicial</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Escribe el nombre del evento'
                                        value={selectedEvents}
                                        onChange={(e) => setSelectedEvents(e.target.value)}
                                        disabled // TODO! Activarlo cuando se complete esta parte del código
                                    />
                                </FormGroup>
                            </Form>
                        </>
                    )}

                    {/**Paso 4: Añadir canciones al repertorio
                     * TODO! Vincularlo con el modal de creación de canciones
                     */}
                    {step === 4 && (
                        <>
                            <Form onSubmit={handleNextStep}>
                                <FormGroup controlId='songs'>
                                    <Form.Label className='fw-bold'>Crea un repertorio para el grupo</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Escribe el nombre de la canción'
                                        value={selectedSongs}
                                        onChange={(e) => setSelectedSongs(e.target.value)}
                                        disabled // TODO! Activarlo cuando se complete esta parte del código
                                    />
                                </FormGroup>
                            </Form>
                        </>
                    )}

                    {/**Paso 5: Resumen general de toda la información del grupo */}
                    {step === 5 && (
                        <>
                            <h3 className='mb-4'>Resumen de tu agrupación musical</h3>

                            {/**Nombre de la agrupación musical */}
                            <div className='d-flex flex-wrap flex-row gap-3 justify-content-between my-2 border-bottom'>
                                <p><strong>Nombre: </strong>{groupName}</p>
                                <p>...</p>
                                <p><strong>Fecha de creación: </strong>{new Date().toLocaleDateString()}</p>
                            </div>

                            {/**TODO! Completar cuando se añadan más datos del grupo */}

                            {/**Lista de miembros invitados */}
                            <div className='my-2 border-bottom'>
                                <strong>Miembros: </strong>
                                <div className='d-flex flex-wrap justify-content-center  gap-3 my-3'>

                                    {/**Administrador del grupo. Es el usuario registrado.
                                     * TODO! Añadir formas de añadir varios admins o eliminarlos
                                     */}
                                    <div className='col-auto text-center bg-warning-subtle border border-1 rounded-2 p-2'>
                                        <PersonGear className='mb-1' /> {currentUser.email}
                                    </div>

                                    {/**Se puede mejorar creando tarjetas con la foto de perfil (si se implementa), instrumentos, etc. */}
                                    {members.length > 0 ? (
                                        members.map((member, index) => (
                                            <div className='col-auto text-center bg-body-tertiary border border-1 rounded-2 p-2' key={member}>
                                                {member}
                                            </div>
                                        ))
                                    ) : ( // Mensaje cuando no se ha invitado a ningún músico a unirse al grupo
                                        <span className="col-12 text-muted">
                                            No has invitado a músicos a tu agrupación musical.
                                            <br />
                                            Invita nuevos miembros buscando su perfil en la aplicación.
                                        </span>
                                    )}
                                </div>
                                {/**Badge con el número de músicos en la banda (el plan es implementar un modelo de pago a partir de cierto número de músicos) */}
                                <span className='badge text-muted bg-body-secondary float-end translate-middle-y'>
                                    Total: {members.length + 1} {/**Suma al usuario administrador */}
                                </span>
                            </div>

                            {/**Lista de eventos añadidos */}
                            <div className='my-2 border-bottom'>
                                <strong>Eventos:</strong>
                                <div className='d-flex flex-wrap gap-3 my-3'>
                                    {selectedEvents.length > 0 ? (
                                        selectedEvents

                                    ) : ( // Mensaje cuando no se ha añadido ningún evento en su creación
                                        <span className=" text-muted">
                                            Puedes programar nuevos eventos desde la pantalla de <strong>Eventos</strong>.
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/**Repertorio musical añadido */}
                            <div className='mt-2'>
                                <strong>Repertorio:</strong>
                                <div className='d-flex flex-wrap gap-3 my-3'>
                                    {selectedSongs.length > 0 ? (
                                        selectedSongs

                                    ) : ( // Mensaje cuando no se ha añadido ningún repertorio inicial
                                        <span className=" text-muted">
                                            Crea el repertorio musical para tu grupo desde la pantalla <strong>Repertorio</strong>.
                                        </span>
                                    )}
                                </div>
                            </div>

                            {error && <Alert variant="danger" className="text-center mt-3">{error}</Alert>}
                        </>

                    )}
                </Card.Body>

                {/**Footer con los botones 'Anterior', 'Siguiente' y 'Confirmar' que varían según el paso del formulario */}
                <Card.Footer className='d-flex flex-wrap gap-2'>
                    {(step !== 1) && (
                        <Button variant='secondary' onClick={handlePreviousStep}>
                            <ChevronLeft className='mb-1' /> Anterior
                        </Button>
                    )}
                    {step !== 5 && (
                        <Button variant='primary' type='submit' className='ms-auto' onClick={handleNextStep}>
                            Siguiente <ChevronRight className='mb-1' />
                        </Button>
                    )}
                    {step === 5 && (
                        <Button variant='primary' className='flex-fill fw-semibold' onClick={handleSubmit}>
                            Confirmar y crear grupo
                        </Button>
                    )}
                </Card.Footer>
            </Card>
        </>
    );
}
