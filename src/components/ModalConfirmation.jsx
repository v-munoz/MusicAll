import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function ModalConfirmation({ showModal, closeModal, action, actionTxt }) {
    
    return (
        <Modal show={showModal} onHide={closeModal} centered >
            <Modal.Header closeButton />

            <Modal.Body className='text-center'>
                <p>¿Estás seguro de que quieres <span className='fw-semibold'>{actionTxt}</span>?</p>
            </Modal.Body>

            <Modal.Footer className='d-flex flex-wrap justify-content-around'>
                
                <Button 
                    variant='outline-secondary' 
                    className='flex-fill fw-semibold'
                    onClick={closeModal}
                >
                    Cancelar
                </Button>

                <Button 
                    variant='danger' 
                    className='flex-fill fw-semibold'
                    onClick={action}
                >
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
