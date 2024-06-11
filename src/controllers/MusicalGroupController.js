import { useState, useEffect } from 'react';
import { useAuth } from "../services/AuthService";
import { firestore } from '../config/firebase';
import GroupModel from '../models/MusicalGroupModel';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook para gestionar las funciones CRUD para los Grupos Musicales:
 *  -   (Create): CreateGroup()
 *  -   (Retrieve): GetGroupInfo()
 *  -   (Retrieve ALL): Se realiza en la barra de búsqueda en conjunto con el resto de colecciones <!TODO: mejorarlo y separarlo>
 *  -   (Update): EditGroup()
 *  -   (Delete): DeleteGroup()
 */


/**Función CreateGroup para crear un nuevo grupo en la vista 'CreateNewGroup'
 * Maneja la interacción con los campos y el avance del formulario, la búsqueda de usuarios...
 * <TODO! Añadir búsqueda e interacción de canciones y eventos. Además, ajustar que la tecla 'intro' mueva el formulario a no ser que esté en el paso 5>
 */
export function CreateGroup() {

    const { currentUser } = useAuth(); // Cargar los datos del usuario actual
    const [groupName, setGroupName] = useState(''); // Estado para almacenar el nombre del grupo
    const [members, setMembers] = useState([]); // Estado para almacenar los miembros del grupo
    const [selectedEvents, setSelectedEvents] = useState([]); // Estado para almacenar los eventos
    const [selectedSongs, setSelectedSongs] = useState([]); // Estado para almacenar el repertorio del grupo
    const [step, setStep] = useState(1); // Estado para mostrar el progreso del formulario
    const [error, setError] = useState(''); // Estado para mostrar mensajes de error
    const navigate = useNavigate();

    // Estados para la función de búsqueda en el paso 2 (Añadir nuevos miembros al grupo)
    const [searchInput, setSearchInput] = useState(''); // Indica si hay texto en la barra de búsqueda
    const [searchResults, setSearchResults] = useState([]); // Almacena los usuarios encontrados para mostrarlos
    const [usersData, setUsersData] = useState([]); // Almacena la información de los usuarios buscados y seleccionados



    // Función asíncrona para manejar el avance al siguiente paso del formulario al clicar el botón 'Siguiente'
    const handleNextStep = async () => {

        // En el primer paso, verifica si se ha ingresado un nombre para el grupo y muestra un error si ya existe en la DB
        if (step === 1) {
            // Muestra un mensaje de error si no se ha ingresado un nombre
            if (!groupName.trim()) {
                setError('Por favor, introduce un nombre para el grupo.');
                return;
            }

            // Consulta Firestore para verificar si ya existe un grupo con el mismo nombre
            const groupRef = firestore.collection("groups").where("nombre", "==", groupName.trim());
            const groupSnapshot = await groupRef.get();

            // Si ya existe un grupo con el mismo nombre, muestra un mensaje de error
            if (!groupSnapshot.empty) {
                setError(`Ya existe un grupo llamado "${groupName}". Por favor, elige otro nombre.`);
                return;
            }
        }

        // Si no hay errores, avanza al siguiente paso y reinicia cualquier mensaje de error
        setError('');
        setStep(step + 1);
    };

    // Maneja el retroceso al paso anterior del formulario al clicar el botón 'Anterior'
    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    /** 
     * Funciones para manejar la búsqueda, visualización y selección de los usuarios
     */
    useEffect(() => {
        // Define una función asincrónica para obtener los datos de los usuarios de Firestore
        const fetchUsers = async () => {
            try {
                // Realiza una consulta a la colección 'users' en Firestore y espera la respuesta
                const querySnapshot = await firestore.collection('users').get();
                // Mapea los documentos del snapshot a sus datos correspondientes y almacénalos en 'users'
                const users = querySnapshot.docs.map(doc => doc.data());
                // Actualiza el estado 'usersData' con el array de usuarios obtenido de Firestore
                setUsersData(users);
            } catch (error) {
                // Maneja cualquier error que ocurra durante la obtención de datos e imprímelo en la consola
                console.error('Error buscando usuarios: ', error);
            }
        };

        // Llama a la función 'fetchUsers' al montar el componente para obtener los datos de Firestore
        fetchUsers();
    }, []); // Ejecuta este efecto solo una vez, después del montaje del componente

    // Maneja el cambio en el campo de búsqueda de usuarios para invitar al grupo
    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
        // Cuando se escribe algo en el form control, busca y filtra los usuarios por email
        if (e.target.value.trim() !== '') {
            // Filtrado de usuarios disponibles para invitar
            const filteredUsers = usersData.filter((user) =>
                user.email.includes(e.target.value) // Muestra usuarios cuyo email coincide con la búsqueda
                && !members.includes(user.email)    // Excluye usuarios que ya se hayan añadido al array 'members'
                && user.email !== currentUser.email // Excluye al usuario actual (ya que será el admin del grupo)
            );
            // Limita los resultados a mostrar solo los primeros 3 cotando el array
            const limitedResults = filteredUsers.slice(0, 3);
            setSearchResults(limitedResults);
        } else {
            setSearchResults([]); // Si no hay texto en el campo de búsqueda, no se muestra ningún resultado
        }
    };

    // Maneja la incorporación de un nuevo miembro al grupo
    const handleAddMember = (email) => {
        setMembers((prevMembers) => [...prevMembers, email]); // Agrega el nuevo miembro al estado de miembros
        setSearchInput(''); // Limpia el campo de búsqueda después de agregar un miembro
        setSearchResults([]); // Limpia los resultados de la búsqueda después de agregar un miembro
    };

    // Maneja el cambio en el estado de un miembro seleccionado (marcado/desmarcado)
    const handleToggleMember = (index, checked) => {
        setMembers((prevMembers) => {
            if (!checked) {
                // Si el miembro ha sido desmarcado, elimínalo del estado de miembros
                const updatedMembers = [...prevMembers]; // Crea una copia del array para reiniciar el índice y que no se desmarquen usuarios no clicados
                updatedMembers.splice(index, 1);
                return updatedMembers;
            }
            return prevMembers;
        });
    };

    // Maneja la pérdida de foco del campo de búsqueda para ocultar el desplegable con los usuarios encontrados
    const handleSearchInputBlur = () => {
        // Establece un retraso para que cuando se seleccionan usuarios del desplegable puedan marcarse antes de que este desaparezca
        // Si no, al seleccionar un usuario instantáneamente pierde el foco y no se selecciona.
        setTimeout(() => {
            setSearchResults([]);
            setSearchInput(''); // Limpia el campo de búsqueda
        }, 200); // Limpia los resultados de la búsqueda cuando el campo de búsqueda pierde el foco después de 200ms
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el funcionamiento por defecto al enviar el form

        try {
            setError(""); // Reiniciar mensajes de error

            // Crea un objeto GroupModel con los datos introducidos en el form
            const newGroup = new GroupModel(groupName, currentUser.uid);

            // Crea un elemento en la colección 'groups' del la DB
            const groupRef = await firestore.collection('groups').add({
                name: newGroup.name, // Campo de nombre
                admin: newGroup.admin, // Campo del administrador del grupo
                creationDate: newGroup.creationDate, // Campo de fecha de creación
                // <TODO! Añadir más campos>
            });

            // Establece la id del grupo como el hash de referencia del objeto en la DB
            const groupId = groupRef.id;
            // Añade al evento en la DB un campo groupId con su referencia
            await groupRef.update({
                groupId: groupId,
            });

            // Agrega al usuario actual al grupo a través de la colección intermedia 'rel_group_user'
            await firestore.collection('rel_group_user').add({
                userId: currentUser.uid, // ID del usuario que crea el grupo (admin)
                groupId: groupId, // ID del grupo 
                role: 'admin', // Como es el creador tiene rol de 'Admin'
                // <TODO! Sería mejor que admin fuera un campo booleano y role sirviera para almacenar el rol (instrumento) del músico en la banda>
            });

            // Promesa para añadir al resto de miembros al grupo a través de las conexiones con la colección intermedia 'rel_group_user'
            await Promise.all(members.map(async (member) => {
                // Busca todos los usuarios cuyos emails coinciden con el introducido por el admin
                const userQuery = await firestore.collection('users').where('email', '==', member).get();

                // Si se han añadido miembros
                if (!userQuery.empty) {
                    // Buscar la id de cada usuario
                    const userId = userQuery.docs[0].data().uid;

                    // Agrega a cada usuario al grupo a través de la colección intermedia 'rel_group_user'
                    await firestore.collection('rel_group_user').add({
                        userId: userId, // ID del usuario que crea el grupo (admin)
                        groupId: groupId, // ID del grupo 
                        role: '', // <TODO! Completar para poner roles por instrumento que toca en la banda>
                    });
                }
            }));
            // Vuelve a la vista '/mis-grupos' para ver los grupos de los que es miembro
            navigate('/mis-grupos');

        } catch (error) {
            setError(error);
        }
    };

    return {
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
    }
}


/** Función GetGroupInfo para obtener la información de un grupo y sus miembros. Se utiliza en la vista 'Groups y InfoGroup'.
 *  Utiliza varios useEffect para obtener:
 *  - los grupos de usuario,
 *  - los datos del grupo seleccionado,
 *  - los datos de los miembros de ese grupo.
 */
export function GetGroupInfo() {
    const { currentUser } = useAuth(); // Cargar los datos del usuario actual
    const [userGroups, setUserGroups] = useState([]); // Estado con el listado de grupos a los que pertenece el usuario
    const [selectedGroup, setSelectedGroup] = useState(null); // Grupo seleccionado 
    const [groupMembers, setGroupMembers] = useState({}); // Estado con los miembros del grupo
    const location = useLocation(); // Obtiene valores de la URL
    const navigate = useNavigate(); // Permite navegar entre pantallas
    const [error, setError] = useState(''); // Mensaje de error

    // useEffect para cargar los grupos a los que pertenece el usuario actual
    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                setError('');
                if (currentUser) {
                    // Obtener las referencias de los grupos del usuario actual desde la colección 'rel_group_user'
                    const relRef = await firestore.collection("rel_group_user").where("userId", "==", currentUser.uid).get();
                    // Conseguir los IDs de esos grupos
                    const userGroupIds = relRef.docs.map(doc => doc.data().groupId);

                    // Mapear las IDs de los grupos del usuario, para obtener los datos de cada grupo
                    const fetchedUserGroups = await Promise.all(userGroupIds.map(async (groupId) => {
                        const groupRef = await firestore.collection("groups").doc(groupId).get();
                        return { id: groupRef.id, ...groupRef.data() };
                    }));

                    // Establecer los grupos del usuario
                    setUserGroups(fetchedUserGroups);
                }
            } catch (error) {
                setError("Error al cargar los grupos del usuario");
            }
        };

        fetchUserGroups();
    }, [currentUser]);

    //useEffect para obtener los datos de un grupo desde la URL
    useEffect(() => {
        const fetchGroupFromURL = async () => {
            try {
                setError('');
                // Buscar el nombre del grupo en la URL
                const groupName = new URLSearchParams(location.search).get("nombre");
                // Si la url tiene un nombre de un grupo lo busca en la DB
                if (groupName) {
                    const groupQuery = await firestore.collection("groups").where("name", "==", groupName).get();
                    // Si hay algún resultado obtiene los datos del grupo
                    if (!groupQuery.empty) {
                        const groupData = groupQuery.docs[0].data();
                        // Establecerlo como grupo seleccionado
                        setSelectedGroup({ id: groupQuery.docs[0].id, ...groupData });
                    }
                }
            } catch (error) {
                setError("Error al cargar el grupo desde la URL");
            }
        };

        fetchGroupFromURL();
    }, [location.search]);

    // useEffect para obtener los miembros del grupo
    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                setError('');
                // Comrpueba si hay algún grupo seleccionado primero
                if (selectedGroup) {
                    // Busca las relaciones de ese grupo con los usuarios
                    const relRef = await firestore.collection("rel_group_user").where("groupId", "==", selectedGroup.id).get();
                    // Mapea los resultados y obtiene los datos de cada usuario
                    const membersData = await Promise.all(relRef.docs.map(async (doc) => {
                        const userData = await firestore.collection("users").doc(doc.data().userId).get();
                        return { id: doc.data().userId, ...userData.data(), role: doc.data().role };
                    }));

                    // Los establece como miembros del grupo en la vista
                    setGroupMembers(prevState => ({
                        ...prevState,
                        [selectedGroup.id]: membersData
                    }));
                }
            } catch (error) {
                setError("Error al cargar los miembros del grupo");
            }
        };

        fetchGroupMembers();
    }, [selectedGroup]);

    return {
        navigate, // Permite navegar entre pantallas
        location, // Obtiene la url de la dirección actual
        currentUser, // Datos del usuario actual
        userGroups, // Listado de grupos del usuario
        groupMembers, // Listado de usuarios en el grupo seleccionado
        selectedGroup, // Datos del grupo seleccionado
        setSelectedGroup, // Estado para indicar el grupo seleccionado
        error, // Mensaje de error
    }
}



/**Función EditGroup para modificar los datos del grpo. Se utiliza en la vista 'Groups'.
 * <TODO! Por ahora solo permite togglear el 'modo edición' pero no guarda los cambios, ni permite modificarlos. Solo permite modificar el rol en la banda en el dropdown>
 * Además, incorpora la función para salir del grupo 
 * <TODO! Mejorar, ahora hay que recargar la página para ver los cambios>
 */
export function EditGroup() {

    const [roleInBand, setRoleInBand] = useState({}); // Estado para almacenar los roles (instrumentos) de los miembros en la banda
    const [groupMembers, setGroupMembers] = useState({}); // Estado para almacenar los miembros del grupo
    const navigate = useNavigate(); // Navegación
    const [error, setError] = useState(''); // Mensajes de error

    // Función para manejar la selección del rol de un miembro en la banda en el dropdown
    // <TODO! No guarda la selección>
    const handleRoleSelection = (memberId, instrument) => {
        setRoleInBand(prevState => ({
            ...prevState,
            [memberId]: instrument // Actualiza el rol del miembro especificado
        }));
    };

    // Función para invitar a un usuario a tus grupos
    const inviteUserToGroup = async (userId, groupId) => {
        try {
            setError('');
            // Verifica si el usuario ya está en el grupo
            const isUserInGroup = await firestore.collection("rel_group_user").where("groupId", "==", groupId).where("userId", "==", userId).get();
            
            //Verifica que el usuario no esté en ese grupo
            if (isUserInGroup) {
                setError("El usuario ya está en el grupo.");
                console.log("El usuario ya está en el grupo")
                return; // No se envía la invitación si el usuario ya está en el grupo
            } else {
                // Añade una nueva entrada en la colección 'rel_group_user' para invitar al usuario al grupo
                await firestore.collection("rel_group_user").add({
                    userId: userId,
                    groupId: groupId,
                    role: "",
                });
            }
            // Actualiza los datos de los miembros del grupo después de la invitación
            setGroupMembers(prevState => {
                const updatedGroupMembers = { ...prevState };
                const updatedGroup = updatedGroupMembers[groupId] || [];
                const newMember = { id: userId };
                return {
                    ...prevState,
                    [groupId]: [...updatedGroup, newMember]
                };
            });
        } catch (error) {
            setError("Error al invitar al usuario al grupo: " + error);
        }
    };


    // Función para permitir que un miembro abandone el grupo (si no es el Admin)
    const leaveGroup = async (memberId, groupId) => {
        try {
            // Elimina la relación del miembro con el grupo en la colección 'rel_group_user'
            await firestore.collection("rel_group_user")
                .where("userId", "==", memberId)
                .where("groupId", "==", groupId)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        doc.ref.delete(); // Borra el documento de relación
                    });
                });

            // Actualiza los datos de los miembros del grupo después de la salida del miembro
            const updatedGroupMembers = { ...groupMembers };
            if (updatedGroupMembers[groupId]) {
                updatedGroupMembers[groupId] = updatedGroupMembers[groupId].filter(member => member.id !== memberId);
                setGroupMembers(updatedGroupMembers); // Actualiza los miembros del grupo
                navigate("/mis-grupos"); // Navega de vuelta a la lista de grupos
            }

        } catch (error) {
            setError("Error al salir del grupo: " + error);
        }
    };

    return {
        roleInBand, // Roles de los miembros en la banda
        handleRoleSelection, // Función para manejar la selección del rol de un miembro
        inviteUserToGroup, // función para añadir un nuevo miembro al grupo
        leaveGroup, // Función para que un miembro abandone el grupo
        error, // Mensajes de error
    };
}


/**Función DeleteGroup para eliminar el grupo. Se utiliza en la vista 'Groups'.
 * <TODO! Hay que crear un modal de confirmación para que no se elimine directamente y por error >
 * <TODO! Mejorar, ahora hay que recargar la página para ver los cambios>
 */
export function DeleteGroup() {
    const navigate = useNavigate(); // Navegación
    const [error, setError] = useState(''); // Mensajes de error

    // Función para eliminar un grupo
    const deleteGroup = async (groupId) => {
        try {
            // Borrar el grupo de la colección 'groups' en Firestore
            await firestore.collection("groups").doc(groupId).delete();

            // Eliminar las relaciones en 'rel_group_user' asociadas al groupId del grupo seleccionado
            const relGroupUserRef = await firestore.collection("rel_group_user").where("groupId", "==", groupId).get();

            // Agrega las eliminaciones a un lote de operaciones
            const batch = firestore.batch();
            relGroupUserRef.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit(); // Ejecuta todas las operaciones de eliminación en un lote

            navigate("/mis-grupos"); // Navega de vuelta a la lista de grupos después de eliminar el grupo

            console.log("Grupo eliminado exitosamente."); // Mensaje de éxito en la consola

        } catch (error) {
            // En caso de error, establece el mensaje de error y lo imprime en la consola
            setError("Error al eliminar el grupo: " + error.message);
            console.error("Error al eliminar el grupo:", error);
        }
    };

    return {
        deleteGroup, // Función para eliminar un grupo
        error // Mensajes de error
    };
}

