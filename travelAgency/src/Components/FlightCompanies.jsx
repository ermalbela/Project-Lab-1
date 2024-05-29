import axios from 'axios';
import React, { useContext, useState } from 'react'
import { createFlightCompany, createPlanes, deletePlane, editPlane, getFlightCompanies } from '../Endpoint';
import { Button, Card, Col, Row, Modal, FormGroup, FormLabel, FormControl} from 'react-bootstrap';
import AuthContext from '../_helper/AuthContext';

const FlightCompanies = () => {

  const [data, setData] = useState([]);
  const [Plane, setPlane] = useState('');
  const {role} = useContext(AuthContext);
  const [createCompany, setCreateCompany] = useState(false);
  const [company, setCompany] = useState('');
  const [createPlane, setCreatePlane] = useState(false);
  const [currentPlane, setCurrentPlane] = useState([]);

  const handleClick = async () => {
    console.log(123);

    const response = await axios.get(getFlightCompanies);

    setData(response.data);
  }

  const handleDelete = id => {
    axios.delete(deletePlane + id)
    .then(res => console.log(res.data))
  }

  const handleEdit = (id) => {
    axios.put(editPlane + id, {PlaneNumber: Plane, PlaneId: Plane.PlaneId})
    .then(res => res.data)

  }

  const addCompany = () => {
    axios.post(createFlightCompany, {CompanyName: company})
    .then(res => console.log(res));
  }

  const addPlane = (id) => {
    axios.post(createPlanes, {PlaneNumber: Plane, FlightCompanyId: id}, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
    setPlane('');
  }

  return (
    <>
      <Row>
        <Col className='d-flex justify-content-between'>
          <h2>Flight Companies and Their Planes</h2>
          {role == 'Superadmin' && <Button onClick={() => setCreateCompany(true)} className="top-button superadmin-buttons" style={{height: '39px'}}>Add Company</Button>}
        </Col>
      </Row>
      <div className="offers">
        <Row className="g-4">
          {data.map((company) => (
            <Col key={company.flightCompanyId} md={6} lg={4}>
              <Card className="h-100 review-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className='text-start mb-3'>{company.flightCompany}</Card.Title>
                  <Card.Title>
                    <Button className="superadmin-buttons" onClick={() => {
                      setCurrentPlane(company)
                      setCreatePlane(true)
                    }}>Add Plane</Button>
                  </Card.Title>
                  </div>
                  {company.planes.map(plane => (
                    <Card.Footer className="text-muted d-flex justify-content-around" key={plane.planeId}>
                      <h5 className='d-flex align-items-center p-0 m-0'>Plane Number: {plane.planeNumber}</h5>
                      <Button variant='danger' onClick={() => handleDelete(plane.planeId)}>Delete</Button>
                      <Button variant='warning' onClick={() => handleEdit(plane.planeId, plane)}>Edit</Button>
                    </Card.Footer>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <br />
      <Button onClick={() => handleClick()}>Fetch Planes</Button>


      <Modal size="sm" show={createCompany} onHide={() => setCreateCompany(false)} aria-labelledby="example-modal-sizes-title-sm">
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          Add Company
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup className='formGroup modal-inputs'>
          <FormLabel>Company Name</FormLabel>
          <div className="input-group login-form-inputs">
              <FormControl className="form-control" type="text" name="companyName" placeholder="e.g. AirLine" value={company} onChange={e => setCompany(e.target.value)} />
          </div>
        </FormGroup>
        <FormGroup className='formGroup d-flex justify-content-between'>
          <Button className='' variant='danger' onClick={() => addRandom(createFlights)}>ADD RANDOM</Button>
          <Button className="admin-buttons" onClick={() => addCompany()}>Add Company</Button>
        </FormGroup>
      </Modal.Body>
    </Modal>

    {/* PLANE MODAL */}
    {currentPlane &&
      <Modal size="sm" show={createPlane} onHide={() => setCreatePlane(false)} aria-labelledby="example-modal-sizes-title-sm">
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            Add Plane
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup className='formGroup modal-inputs'>
            <FormLabel>Plane Number</FormLabel>
            <div className="input-group login-form-inputs">
                <FormControl className="form-control" type="text" name="name" placeholder="e.g. Plane1" value={Plane} onChange={e => setPlane(e.target.value)} />
            </div>
          </FormGroup>
          <FormGroup className='formGroup d-flex justify-content-between'>
            <Button className='' variant='danger' onClick={() => addRandom(createFlights)}>ADD RANDOM</Button>
            <Button className="admin-buttons" onClick={() => addPlane(currentPlane.flightCompanyId)}>Create Flight</Button>
          </FormGroup>
        </Modal.Body>
      </Modal>
    }
    </>
  )
}

export default FlightCompanies
