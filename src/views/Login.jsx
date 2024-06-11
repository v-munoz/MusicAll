import React, { useRef, useState } from "react";
import { useAuth } from "../services/AuthService";
import { Form, Button, Card, Alert, InputGroup, Image } from 'react-bootstrap';
import { Eye, EyeSlash, Google } from "react-bootstrap-icons";
import { Link, useNavigate } from 'react-router-dom';

// Vista para el formulario de inicio de sesión
export default function LogIn() {
    // Referencias a los campos de email y contraseña del formulario
    const emailRef = useRef();
    const passwordRef = useRef();
    // Estado para manejar los errores de autenticación
    const [error, setError] = useState('');
    // Estado para indicar si la solicitud de inicio de sesión está en curso
    const [loading, setLoading] = useState(false);
    // Estado para indicar si la contraseña debe mostrarse o no
    const [showPassword, setShowPassword] = useState(false);

    // Función de autenticación de useAuth
    const { login } = useAuth();
    // Definir el React-Router para navegar entre rutas
    const navigate = useNavigate();

    // Función asincrónica que maneja el envío del formulario de inicio de sesión
    async function handleSubmit(e) {
        e.preventDefault(); // Impedir el comportamiento predeterminado del formulario

        try {
            setError(""); // Limpiar el mensaje de error
            setLoading(true); // Establecer el estado de carga en verdadero

            // Llamar a la función de iniciar sesión con el email y la contraseña
            await login(emailRef.current.value, passwordRef.current.value);
            // Redirigir al usuario a la página de inicio
            navigate("/")

        } catch (error) {
            setError('Usuario o contraseña incorrectos.');
        }
        // Establecer el estado de carga en falso después de manejar el registro
        setLoading(false);
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-center gap-2">
                <Image src={process.env.PUBLIC_URL + '/logo512.png'} style={{ maxWidth: '40px' }} className="border rounded-circle" />
                <h1 className="app-title m-0 fw-bold">{process.env.REACT_APP_NAME}</h1>
            </div>
            {/* Card para el formulario de inicio de sesión */}
            <Card className='shadow my-3'>
                <Card.Body>
                    <h2 className='text-center pb-2'>Iniciar sesión</h2>
                    <Form onSubmit={handleSubmit}>

                        {/* Mostrar mensaje de error si existe */}
                        {error && <Alert variant="danger">{error}</Alert>}

                        {/**Campo email */}
                        <Form.Group id='email' className='my-2'>
                            <Form.Label className="fw-semibold">Email</Form.Label>
                            <Form.Control type='email' ref={emailRef} required />
                        </Form.Group>

                        {/**Campo contraseña */}
                        <Form.Group id='password' className='my-2'>
                            <Form.Label className="fw-semibold">Contraseña</Form.Label>
                            <InputGroup>
                                <Form.Control type={showPassword ? 'text' : 'password'} ref={passwordRef} required />
                                <Button variant="outline-dark" onClick={() => setShowPassword(!showPassword)} className="pb-2 border-secondary-subtle">
                                    {/* Icono de ojo para mostrar/ocultar contraseña */}
                                    {showPassword ? <Eye /> : <EyeSlash />}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        {/* Botón para enviar el formulario de inicio de sesión */}
                        <Button type='submit' className='w-100 my-2' disabled={loading}>Iniciar sesión</Button>


                        {/* Separador horizontal y texto "O" */}
                        <div className="d-flex align-items-center justify-content-center mt-3">
                            <hr className="flex-grow-1" />
                            <div className="mx-3 text-muted">O</div>
                            <hr className="flex-grow-1" />
                        </div>
                    </Form>

                    {/* Botón para continuar con Google (sin implementar) */}
                    <Button type="button" variant="light" className="w-100 my-3 d-flex align-items-center justify-content-center">
                        <Google className="me-2" />
                        Continuar con Google
                    </Button>
                </Card.Body>
            </Card>

            {/* Enlaces para registrarse y recuperar contraseña */}
            <div className='mt-4'>
                <p>¿No tienes una cuenta?
                    <Link to="/registro" className='ms-2'>Regístrate</Link>
                </p>
                <p>¿Has olvidado la contraseña?
                    <Link to="/recuperar-contrasena" className="ms-2">Recuperar contraseña</Link>
                </p>

            </div>
        </>
    )
}
