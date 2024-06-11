import React from 'react';
import { Alert, Button, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GetGroupInfo, } from '../controllers/MusicalGroupController';
import { ChevronRight, PlusLg } from 'react-bootstrap-icons';

// Componente para mostrar los datos de los grupos, editarlos y elimnarlos en la pantalla '/mis-grupos'
export default function Groups() {

    /**<!TODO: Cada función tiene un 'error' distinto y como son de tipo 'const' no se pueden importar todos así que hay que ver como corregirlo> */

    // Llamar al Hook GetGroupInfo del MusicalGroupController para obtener los datos de los grupos del usuario
    const {
        navigate, // Permite navegar entre pantallas
        userGroups, // Listado de grupos del usuario
        setSelectedGroup, // Estado para indicar el grupo seleccionado
    } = GetGroupInfo();




    return (
        <Container className='pt-3'>
            {/**Encabezado de la vista con el título y un botón para crear grupos */}
            <div className='d-flex flex-wrap-reverse justify-content-center justify-content-sm-between gap-2 mb-2'>
                <h2>Mis grupos</h2>

                {/**Botón 'Crear Nuevo Grupo' */}
                <Button variant='primary' className='ms-auto' onClick={() => navigate("/crear-grupo")}>
                    <PlusLg className='mb-1' /> Nuevo grupo
                </Button>
            </div>

            <hr />

            {/**Si el usuario pertenece a algún grupo, muestra una lista de todos sus grupos */}
            {userGroups.length > 0 ? (
                <div className='d-flex flex-wrap flex-row justify-content-center my-3'>
                    {userGroups.map((group, index) => (
                        <div key={index} className='col-12 col-md p-2'>
                            <Card className='shadow border-0'>
                                <Card.Body>
                                    <Card.Title>{group.name}</Card.Title>
                                    <Card.Subtitle className='text-muted py-2'>Descripción del grupo</Card.Subtitle>
                                    <Link
                                        to={`/grupo?nombre=${group.name}`}
                                        className='btn btn-light border fw-semibold float-end'
                                        onClick={() => setSelectedGroup(group)}
                                    >Ver grupo <ChevronRight className='mb-1'/>
                                    </Link>
                                </Card.Body>
                            </Card>

                        </div>
                    ))}
                </div>


            ) : (
                // Si no hay grupos mmuestra un mensaje de error
                <Alert variant='warning' className='text-center'>Aún no perteneces ni administras ningún grupo.</Alert>
            )
            }
        </Container >
    );
}
