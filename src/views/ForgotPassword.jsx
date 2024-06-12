import React, { useRef, useState } from "react";
import { useAuth } from "../services/AuthService";
import { Form, Button, Card, Alert, Image } from 'react-bootstrap';
import { ArrowLeft, Lock } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';

// Vista para el formulario de inicio de sesión
export default function ResetPassword() {
    // Referencias a los campos de email y contraseña del formulario
    const emailRef = useRef();

    // Estado para manejar los errores de autenticación
    const [error, setError] = useState('');

    // Estado para manejar los errores de autenticación
    const [message, setMessage] = useState('');

    // Estado para indicar si la solicitud de inicio de sesión está en curso
    const [loading, setLoading] = useState(false);

    // Función de autenticación de useAuth
    const { resetPassword } = useAuth();
    // Definir el React-Router para navegar entre rutas
    const navigate = useNavigate();

    // Función asincrónica que maneja el envío del formulario de inicio de sesión
    async function handleSubmit(e) {
        e.preventDefault(); // Impedir el comportamiento predeterminado del formulario

        try {
            setMessage("");
            setError("");
            setLoading(true); // Establecer el estado de carga en verdadero

            // Llamar a la función de iniciar sesión con el email y la contraseña
            await resetPassword(emailRef.current.value);
            setMessage('Comprueba tu bandeja de entrada para restablecer tu contraseña.');

        } catch (error) {
            setError('Error al restablecer la contraseña.');
        }
        // Establecer el estado de carga en falso después de manejar el registro
        setLoading(false);
    }

    return (
        <div className="reduced-width">
            <div className="d-flex align-items-center justify-content-center gap-2">
                <Image src={process.env.PUBLIC_URL + '/logo512.png'} style={{ maxWidth: '40px' }} className="border rounded-circle" />
                <h1 className="app-title m-0 fw-bold">{process.env.REACT_APP_NAME}</h1>
            </div>

            {/* Card para el formulario de recuperar contraseña */}
            <Card className='shadow my-4'>

                <Card.Header className="d-flex justify-content-between align-items-center bg-body border-0 mt-2">
                    {/**Botón para volver atrás */}
                    <Button
                        type="button"
                        variant="outline-dark"
                        className="border-0"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mb-1" />
                    </Button>
                    <h2 className='fs-3 mb-0'>Recuperar contraseña</h2>
                    <Lock className="fs-4" />
                </Card.Header>

                <Card.Body>

                    <Form onSubmit={handleSubmit}>

                        <p className="text-center text-secondary">Introduce tu correo electrónico y te enviaremos un enlace para que vuelvas a entrar en tu cuenta.</p>

                        {/**Campo email */}
                        <Form.Group id='email' className='my-2'>
                            <Form.Label className="fw-semibold">Email:</Form.Label>
                            <Form.Control type='email' ref={emailRef} required />
                        </Form.Group>

                        {/* Botón para enviar el formulario de inicio de sesión */}
                        <Button type='submit' className='w-100 mt-2' disabled={loading}>Enviar enlace de acceso</Button>

                        {/* Mostrar mensaje de confirmación */}
                        {message && <Alert variant="info">{message}</Alert>}
                        {/* Mostrar mensaje de error si existe */}
                        {error && <Alert variant="danger">{error}</Alert>}
                    </Form>

                    {/* Separador horizontal y texto "O" */}
                    <div className="d-flex align-items-center justify-content-center my-3">
                        <hr className="flex-grow-1" />
                        <div className="mx-3 text-black-50">O</div>
                        <hr className="flex-grow-1" />
                    </div>

                    {/* Botón para continuar con Google (sin implementar) */}
                    <a href="/registro" className="btn btn-light w-100">
                        Crear una nueva cuenta
                    </a>
                </Card.Body>
            </Card>
        </div>
    )
}
