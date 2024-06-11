import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default function ModalInstruments({ showModal, handleCloseModal, handleInstrumentSelection, selectedInstruments }) {
    /**Modal para mostrar un menú de instrumentos disponibles
    * Las imágenes usadas para cada instrumento son emojis, y se usa su código DEC en UTF-8
    */

    return (
        <Modal show={showModal} onHide={handleCloseModal} size='lg'>

            {/**Encabezado con botón cerrar */}
            <Modal.Header closeButton>
                <Modal.Title>Seleccione sus instrumentos</Modal.Title>
            </Modal.Header>

            {/**Cuerpo del modal */}
            <Modal.Body className='my-2'>
                {/**Grupo de botones checkbox para manejar la selección de los instrumentos. Se pueden seleccionar varios o ninguno */}
                <div className="btn-group d-flex flex-wrap justify-content-center" role="group">
                    
                    {/**Botones de selección de instrumentos. Responsive en 2-3-4 columnas */}
                    {/**Instrumento 1: Voz */}
                    <div className='col-6 col-sm-4 col-lg-3 p-2'>
                        <input
                            type="checkbox"
                            className="btn-check"
                            id="btncheck1"
                            autoComplete="off"
                            checked={selectedInstruments.includes('Voz')}
                            onChange={() => handleInstrumentSelection('Voz')}
                        />
                        <label className="btn btn-outline-primary w-100" htmlFor="btncheck1">
                            <p className='fs-3 mb-0'>&#127908;</p> {/**Código DEC del emoji */}
                            Voz
                        </label>
                    </div>
                    
                    {/**Instrumento 2: Guitarra */}
                    <div className='col-6 col-sm-4 col-lg-3 p-2'>
                        <input
                            type="checkbox"
                            className="btn-check"
                            id="btncheck2"
                            autoComplete="off"
                            checked={selectedInstruments.includes('Guitarra')}
                            onChange={() => handleInstrumentSelection('Guitarra')}
                        />
                        <label className="btn btn-outline-primary w-100" htmlFor="btncheck2">
                            <p className='fs-3 mb-0'>&#127928;</p>
                            Guitarra
                        </label>
                    </div>

                    {/**Instrumento 3: Trompeta */}
                    <div className='col-6 col-sm-4 col-lg-3 p-2'>
                        <input
                            type="checkbox"
                            className="btn-check"
                            id="btncheck3"
                            autoComplete="off"
                            checked={selectedInstruments.includes('Trompeta')}
                            onChange={() => handleInstrumentSelection('Trompeta')}
                        />
                        <label className="btn btn-outline-primary w-100" htmlFor="btncheck3">
                            <p className='fs-3 mb-0'>&#127930;</p>
                            Trompeta
                        </label>
                    </div>

                    {/**Instrumento 4: Teclado */}
                    <div className='col-6 col-sm-4 col-lg-3 p-2'>
                        <input
                            type="checkbox"
                            className="btn-check"
                            id="btncheck4"
                            autoComplete="off"
                            checked={selectedInstruments.includes('Teclado')}
                            onChange={() => handleInstrumentSelection('Teclado')}
                        />
                        <label className="btn btn-outline-primary w-100" htmlFor="btncheck4">
                            <p className='fs-3 mb-0'>&#127929;</p>
                            Teclado
                        </label>
                    </div>

                    {/**Instrumento 5: Batería */}
                    <div className='col-6 col-sm-4 col-lg-3 p-2'>
                        <input
                            type="checkbox"
                            className="btn-check"
                            id="btncheck5"
                            autoComplete="off"
                            checked={selectedInstruments.includes('Batería')}
                            onChange={() => handleInstrumentSelection('Batería')}
                        />
                        <label className="btn btn-outline-primary w-100" htmlFor="btncheck5">
                            <p className='fs-3 mb-0'>&#129345;</p>
                            Batería
                        </label>
                    </div>

                    {/**Instrumento 6: Violín */}
                    <div className='col-6 col-sm-4 col-lg-3 p-2'>
                        <input
                            type="checkbox"
                            className="btn-check"
                            id="btncheck6"
                            autoComplete="off"
                            checked={selectedInstruments.includes('Violín')}
                            onChange={() => handleInstrumentSelection('Violín')}
                        />
                        <label className="btn btn-outline-primary w-100" htmlFor="btncheck6">
                            <p className='fs-3 mb-0'>&#127931;</p>
                            Violín
                        </label>
                    </div>

                    {/**Instrumento 7: Saxo */}
                    <div className='col-6 col-sm-4 col-lg-3 p-2'>
                        <input
                            type="checkbox"
                            className="btn-check"
                            id="btncheck7"
                            autoComplete="off"
                            checked={selectedInstruments.includes('Saxofón')}
                            onChange={() => handleInstrumentSelection('Saxofón')}
                        />
                        <label className="btn btn-outline-primary w-100" htmlFor="btncheck7">
                            <p className='fs-3 mb-0'>&#127927;</p>
                            Saxofón
                        </label>
                    </div>
                </div>
            </Modal.Body>

            {/**Footer con botón para cerrar el modal. Se guardan automáticamente. */}
            <Modal.Footer>
                <Button variant='primary' className='w-100' onClick={handleCloseModal}>
                    Guardar selección
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
