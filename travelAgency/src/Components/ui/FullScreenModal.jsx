import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const FullScreenModal = ({ show, handleClose, title, children, handleSave }) => {
    return (
        <Modal style={{background: 'transparent'}} show={show} onHide={handleClose} size="xl" dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FullScreenModal;
