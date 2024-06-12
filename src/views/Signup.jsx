import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, FormCheck, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfRef = useRef();

    const navigate = useNavigate();

    const [showPasswordWarning, setShowPasswordWarning] = useState(false);
    const [showPasswordConfWarning, setShowPasswordConfWarning] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        // Validación y control de errores
        // Comprobar si las contraseñas coinciden
        if (passwordRef.current.value !== passwordConfRef.current.value) {
            return setError('Las contraseñas no coinciden.');
        }

        // Comprobar si la contraseña se ajusta a los controles de Firebase Authentification
        if (passwordRef.current.value.length < 6) {
            return setError('La contraseña debe tener al menos 6 caracteres.');
        }

        // Comprobar si se ha seleccionado el checkbox de términos y condiciones
        if (!acceptedTerms) {
            return setError('Debes aceptar los términos y condiciones.');
        }

        try {
            setError(""); //Limpiar registro de errores

            // Redirigir al usuario a la vista de datos de usuario
            navigate("nuevo-usuario", {
                state: {
                    email: emailRef.current.value,
                    password: passwordRef.current.value
                }
            });

        } catch (error) {
            setError('Error al crear la cuenta.');
            return; // Salir de la función handleSubmit cuando ocurre un error
        }
    }

    // Mostrar una alerta mientras se escribe la contraseña si es menor a 6 caracteres - requisito de Firebase
    const handlePasswordAlert = () => {
        if (passwordRef.current.value.length < 6) {
            setShowPasswordWarning(true);
        } else {
            setShowPasswordWarning(false);
        }
    };

    // Mostrar una alerta mientras se escribe la confirmación de contraseña si no coincide con la contraseña
    const handlePasswordConfirmationAlert = () => {
        if (passwordConfRef.current.value && passwordConfRef.current.value !== passwordRef.current.value) {
            setShowPasswordConfWarning(true);
        } else {
            setShowPasswordConfWarning(false);
        }
    };

    return (
        <div className="reduced-width">
            <div className="d-flex align-items-center justify-content-center gap-2">
                <Image src={process.env.PUBLIC_URL + '/logo512.png'} style={{ maxWidth: '40px' }} className="border rounded-circle" />
                <h1 className="app-title m-0 fw-bold">{process.env.REACT_APP_NAME}</h1>
            </div>
            <Card className='shadow my-3'>
                <Card.Body>
                    <h2 className='text-center my-2'>Crear cuenta</h2>


                    {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {/**Campo email */}
                        <Form.Group id='email' className='my-2'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' ref={emailRef} required />
                        </Form.Group>

                        {/**Campo contraseña */}
                        <Form.Group id='password' className='my-2'>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type='password' ref={passwordRef} required onChange={handlePasswordAlert} />
                            {/**Aviso contraseña no válida (solo comprueba la longitud es <6) */}
                            {showPasswordWarning && (
                                <Form.Text className="text-danger">
                                    La contraseña debe tener al menos 6 caracteres.
                                </Form.Text>
                            )}
                        </Form.Group>

                        {/**Campo confirmación contraseña */}
                        <Form.Group id='password-confirmation' className='my-2'>
                            <Form.Label>Vuelve a escribir tu contraseña</Form.Label>
                            <Form.Control type='password' ref={passwordConfRef} required onChange={handlePasswordConfirmationAlert} />
                            {showPasswordConfWarning && (
                                <Form.Text className="text-danger">
                                    Las contraseñas no coinciden.
                                </Form.Text>
                            )}
                        </Form.Group>

                        {/**Checkbox de términos y condiciones */}
                        <Form.Group id='terms' className='my-3'>
                            <FormCheck>
                                <FormCheck.Input type="checkbox" onChange={e => setAcceptedTerms(e.target.checked)} required />
                                <FormCheck.Label className='small'>
                                    Acepto los <Link to={"/"}>términos y condiciones</Link> de <strong>MusicAll</strong>
                                </FormCheck.Label>
                            </FormCheck>
                        </Form.Group>

                        <Button type='submit' className='w-100 my-2'>Continuar</Button>

                    </Form>
                </Card.Body>
            </Card>

            {/* Enlace para iniciar sesión con cuenta */}
            <div className='mt-4'>
                <p>¿Ya tienes una cuenta?
                    <Link to="/login" className='fw-semibold ms-2'>Iniciar sesión</Link>
                </p>
            </div>
        </div>
    )
}
