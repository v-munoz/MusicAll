// Importar React y los hooks necesarios desde "react"
import React, { useContext, useState, useEffect } from "react";
// Importar la instancia de autenticación de Firebase desde configuración
import { auth, firestore } from "../config/firebase";

// Crear un contexto de autenticación
const AuthContext = React.createContext();

// Función para acceder al contexto de autenticación
export function useAuth() {
    return useContext(AuthContext);
}

// Componente funcional AuthProvider para proporcionar el contexto de autenticación a la aplicación
export function AuthProvider({ children }) {
    // Estado para almacenar el usuario actualmente autenticado
    const [currentUser, setCurrentUser] = useState();

    // Estado para indicar si la autenticación está en curso
    const [loading, setLoading] = useState(true);

    // Función para registrarse utilizando el servicio de autenticación de Firebase
    async function signup(email, password, userData) {
        try {
            // Crea el usuario en Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Añade los datos adicionales del usuario a Firestore
            await firestore.collection('users').doc(user.uid).set({
                uid: user.uid,
                email: email,
                name: userData.name,
                surname: userData.surname,
                birthDate: userData.birthDate,
                instruments: userData.instruments,
                creationDate: userData.creationDate
            });

            return user; // Devuelve el usuario creado
        } catch(error) {
            console.log(error)
        }
    }


    // Función para iniciar sesión utilizando el servicio de autenticación de Firebase
    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    // Función para cerrar sesión utilizando el servicio de autenticación de Firebase
    function logout() {
        return auth.signOut();
    }

    // Función para restablecer la contraseña utilizando el servicio de autenticación de Firebase 
    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    // Función para actualizar el correo electrónico del usuario actual <!sin implementar>
    function updateEmail(email) {
        return currentUser.updateEmail(email);
    }

    // Función para actualizar la contraseña del usuario actual <!sin implementar>
    function updatePassword(password) {
        return currentUser.updatePassword(password);
    }

    // Función para eliminar la cuenta de usuario actual
    function deleteAccount() {
        return currentUser.delete();
    }

    // Efecto para suscribirse a los cambios de autenticación del usuario
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Devolver una función de limpieza para cancelar la suscripción cuando el componente se desmonte
        return unsubscribe;
    }, []);

    // Funciones que se van a retornar al restod e la app
    const value = {
        currentUser,
        setCurrentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        deleteAccount
    };

    // Renderizar el componente AuthProvider y proporcionar el valor del contexto a sus componentes secundarios
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
