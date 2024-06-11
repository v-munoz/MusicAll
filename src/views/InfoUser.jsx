import React, { useEffect, useState } from 'react';
import { Alert, Table, Container, Card, Button, Modal } from 'react-bootstrap';
import { GetUserProfile } from '../controllers/UserController';
import { useAuth } from "../services/AuthService";
import { Calendar2, Gift, PeopleFill, PersonFill } from 'react-bootstrap-icons';
import { EditGroup } from '../controllers/MusicalGroupController';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../config/firebase';


export default function UserProfile() {
    const {
        userProfile,
        userGroups,
        error
    } = GetUserProfile(); // Cargar el usuario de la búsqueda y mensaje de error de la función 'GetUserProfile' del controlador

    // Llamar al Hook EditGroup del MusicalGroupController para modificar los datos del grupo
    const {
        inviteUserToGroup, // función para añadir un nuevo miembro al grupo
    } = EditGroup();

    const { currentUser } = useAuth(); // Cargar los datos del usuario actual

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [groupsUserIsAdmin, setGroupsUserIsAdmin] = useState([]);


    useEffect(() => {
        const fetchGroupsUserIsAdmin = async () => {
            try {
                const querySnapshot = await firestore
                    .collection("rel_group_user")
                    .where("userId", "==", currentUser.uid)
                    .where("role", "==", "admin")
                    .get();

                const groups = [];
                querySnapshot.forEach(doc => {
                    const groupId = doc.data().groupId;
                    // Obtener el nombre del grupo desde la colección "groups" usando el ID del grupo
                    firestore.collection("groups").doc(groupId).get()
                        .then(groupDoc => {
                            if (groupDoc.exists) {
                                const groupName = groupDoc.data().name;
                                groups.push({ id: groupId, name: groupName });
                            }
                        })
                        .catch(error => {
                            console.error("Error al obtener los datos del grupo:", error);
                        });
                });

                setGroupsUserIsAdmin(groups);
            } catch (error) {
                console.error("Error al obtener los grupos del usuario: " + error);
            }
        };

        fetchGroupsUserIsAdmin();
    }, [currentUser]);

    return (
        <>

            {/**Mensajes de error */}
            {error && <Alert variant="danger">{error}</Alert>}
            {/**Si hay usuario, muestra sus datos */}
            {userProfile && (
                <Container className='pt-3'>
                    <Card>
                        {/**Encabezado con datos básicos del usuario.
                         * Si el perfil es del propio usuario de la app cambia el color de fondo
                         */}
                        <Card.Header className={`${userProfile.uid === currentUser.uid ? 'bg-info-subtle p-3' : 'p-3'}`}>
                            <div className='row gap-2'>
                                {/**Imagen del perfil */}
                                <div className='col-auto'>
                                    <PersonFill
                                        className="btn btn-secondary"
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
                                </div>

                                {/**Columna con datos del usuario */}
                                <div className='col'>
                                    <h2 className='fw-bold'>{userProfile.name} {userProfile.surname}</h2>
                                    <h5 className=''>{userProfile.email}</h5>
                                </div>

                                {/**Columna con botón de 'Invitar al grupo' o 'Editar tu perfil' (si es tu propia cuenta) */}
                                <div className='col-auto ms-auto'>
                                    {userProfile.uid === currentUser.uid ? (
                                        <Button variant='dark' onClick={() => navigate('/mi-perfil')}>
                                            Editar tu perfil
                                        </Button>
                                    ) : (
                                        <Button variant='dark' onClick={() => setShowModal(true)}>
                                            Invitar a tu grupo
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/**Info de fechas */}
                            <div className='d-flex flex-wrap column-gap-4 mt-3'>
                                {/**Fecha de creación de la cuenta */}
                                <span className="text-muted">
                                    <Calendar2 className='mb-1 me-2' />
                                    {/**Como ya se formatea la fecha antes de guardarla, solo se muestra la primera parte del array (dd/mm/aa , hh:mm:ss) */}
                                    Se unió en: {userProfile.creationDate.split(',')[0] || 'sin datos'}
                                </span>

                                {/**Fecha de nacimiento */}
                                <span className="text-muted">
                                    <Gift className='mb-1 me-2' />
                                    Fecha de nacimiento: {userProfile.birthDate || 'sin datos'}
                                </span>
                            </div>
                        </Card.Header>

                        {/**Cuerpo con detalles de la cuenta */}
                        <Card.Body>
                            {/**Grupos */}
                            <div className='mb-3'>
                                <h4>Grupos</h4>
                                {userGroups.length > 0 ? (
                                    <div className='d-flex flex-wrap gap-3'>
                                        {/**Mapear todos los grupos
                                         * TODO! Transformar en botones para poder navegar a los grupos
                                         */}
                                        {userGroups.map((group, index) => (
                                            <Button
                                                variant='light' 
                                                key={index} 
                                                className='flex-fill text-start rounded-pill border'
                                                onClick={() => navigate(`/grupo?nombre=${group.name}`)}
                                            >
                                                <PeopleFill className='mb-1 me-2' /> {group.name}
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <Alert variant='warning' className='text-center'>Aún no perteneces a ningún grupo.</Alert>
                                )}
                            </div>



                            {/**Instrumentos del músico <TODO! Poner más bonito> */}
                            <div className=''>
                                <h4>Instrumentos</h4>
                                {/**Mapea los instrumentos del array y los muestra en una tabla */}
                                <Table bordered hover size="sm" className="mb-3">
                                    <tbody>
                                        {userProfile.instruments.map((instrument, index) => (
                                            <tr key={index}>
                                                <td className="col-1 text-center">{index + 1}</td>
                                                <td className="ps-2">{instrument}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            )}

            {/**Da menos problemas si se crea el modal en el mismo componente que en uno distinto
             * <!TODO: Refactorizar a un componente distinto>
             */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar un grupo:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex flex-row flex-wrap gap-3 justify-content-center '>
                        {groupsUserIsAdmin.length > 0 ? (
                            groupsUserIsAdmin.map(group => (
                                <Button variant='outline-dark' className='flex-fill '
                                    key={group.id}
                                    onClick={() => {
                                        inviteUserToGroup(userProfile.uid, group.id);
                                        setShowModal(false);
                                    }}
                                >
                                    {group.name}
                                </Button>
                            ))
                        ) : (
                            <Alert variant="warning" className='text-center'>Actualmente no administras ningún grupo</Alert>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
