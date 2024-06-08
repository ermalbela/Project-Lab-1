import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { createFlightCompany, createPlanes, deletePlane, editPlanes, getFlightCompanies, getPlanes } from '../Endpoint';
import { Button, Card, Col, Row, Modal, FormGroup, FormLabel, FormControl, CardHeader, CardBody} from 'react-bootstrap';
import AuthContext from '../_helper/AuthContext';
import Loader from '../Layout/Loader';
import Swal from 'sweetalert2';

const FlightCompanies = () => {

  const [companyData, setCompanyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [Plane, setPlane] = useState('');
  const {role} = useContext(AuthContext);
  const [createCompany, setCreateCompany] = useState(false);
  const [company, setCompany] = useState('');
  const [createPlane, setCreatePlane] = useState(false);
  const [currentPlane, setCurrentPlane] = useState([]);
  const [editPlane, setEditPlane] = useState(false);

  const getData = async () => {
    const response = await axios.get(getFlightCompanies, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    });

    setIsLoading(false)
    setCompanyData(response.data);
  }

  const handleDelete = id => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(deletePlane + id, {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        })
        .then(() => {
          getData();
        })
        Swal.fire({
          title: "Deleted!",
          text: "Plane has been deleted.",
          icon: "success"
        });
      }
    });
    
  }

  const handleEdit = (id, plane) => {
    axios.put(editPlanes + id, {PlaneNumber: Plane, PlaneId: plane.planeId}, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
    .then(res => {
      console.log(res.data)
      setEditPlane(false);
      setPlane('');
      getData();
    })
  }

  const addCompany = () => {
    axios.post(createFlightCompany, {CompanyName: company}, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
    .then(res => {
      console.log(res)
      getData();
      setCreateCompany(false);
      setCompany(false);
    });
  }

  const addPlane = (id) => {
    axios.post(createPlanes, {PlaneNumber: Plane, FlightCompanyId: id}, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
    .then(res => {
      console.log(res.data)
      getData();
      setPlane('');
      setCreatePlane(false);
    })
    .catch(err => console.log(err));
    
  }

  useEffect(() => {
    getData();
  })

  return isLoading ? (
    <Loader />
  ) : (
    <>
    <div className="title">
      <h2>Flight Companies</h2>
    </div>
    <Card>
      <CardHeader className='d-flex justify-content-between'>
        <h4>Flight Companies and Their Planes</h4>
        {role == 'Superadmin' && <Button onClick={() => setCreateCompany(true)} className="top-button superadmin-buttons" style={{height: '39px'}}>Add Company</Button>}
      </CardHeader>
      <CardBody>
        <div className="flight-companies">
          <Row className="g-4">
            {companyData.map((company) => (
              <Col key={company.flightCompanyId} md={6} lg={6} className='mb-2'>
                <Card className="h-100 flight-companies-card">
                  <CardBody>
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
                      <div className="text-muted d-flex justify-content-between align-items-center plane" key={plane.planeId}>
                        <h5 className='d-flex align-items-center p-0 m-0 flex-grow-1'>Plane Number: {plane.planeNumber}</h5>
                        <Button variant='danger' onClick={() => handleDelete(plane.planeId)}>Delete</Button>
                        <Button variant='warning' onClick={() => {
                          setEditPlane(true);
                          setCurrentPlane(plane);
                        }}>Edit</Button>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Button onClick={async () => {
          const response = await axios.get(getPlanes, {
            headers: {
              'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
            }
          })

          console.log(response.data);
          
        }}>Click me</Button>

        <Modal size="md" show={createCompany} onHide={() => setCreateCompany(false)} aria-labelledby="example-modal-sizes-title-sm">
          <Modal.Header>
            <Modal.Title id="example-modal-sizes-title-lg">
              Add Company
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup className='formGroup'>
              <FormLabel>Company Name</FormLabel>
              <div className="input-group login-form-inputs">
                  <FormControl className="form-control" type="text" name="companyName" placeholder="e.g. AirLine" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
            </FormGroup>
            <FormGroup className='formGroup d-flex justify-content-end'>
              <Button className="admin-buttons" onClick={() => addCompany()}>Add Company</Button>
            </FormGroup>
          </Modal.Body>
        </Modal>

        {/* PLANE MODAL */}
        {currentPlane &&
          <Modal size="md" show={createPlane} onHide={() => setCreatePlane(false)} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header>
              <Modal.Title id="example-modal-sizes-title-lg">
                Add Plane
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup className='formGroup'>
                <FormLabel>Plane Number</FormLabel>
                <div className="input-group login-form-inputs">
                    <FormControl className="form-control" type="text" name="name" placeholder="e.g. Plane1" value={Plane} onChange={e => setPlane(e.target.value)} />
                </div>
              </FormGroup>
              <FormGroup className='formGroup d-flex justify-content-end'>
                <Button className="admin-buttons" onClick={() => addPlane(currentPlane.flightCompanyId)}>Create Flight</Button>
              </FormGroup>
            </Modal.Body>
          </Modal>
        }

        {currentPlane &&
          <Modal size="md" show={editPlane} onHide={() => setEditPlane(false)} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header>
              <Modal.Title id="example-modal-sizes-title-lg">
                Edit Plane
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup className='formGroup'>
                <FormLabel>Plane Number</FormLabel>
                <div className="input-group login-form-inputs">
                    <FormControl className="form-control" type="text" name="name" placeholder="e.g. Plane1" value={Plane} onChange={e => setPlane(e.target.value)} />
                </div>
              </FormGroup>
              <FormGroup className='formGroup d-flex justify-content-end'>
                <Button className="admin-buttons" onClick={() => handleEdit(currentPlane.planeId, currentPlane)}>Edit Plane</Button>
              </FormGroup>
            </Modal.Body>
          </Modal>
        }
      </CardBody>
    </Card>
    </>
  )
}

export default FlightCompanies
