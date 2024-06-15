import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { createFlightCompany, createPlanes, deleteCompany, deletePlane, editCompanies, editPlanes, getFlightCompanies, getPlanes } from '../Endpoint';
import { Button, Card, Col, Row, Modal, FormGroup, FormLabel, FormControl, CardHeader, CardBody} from 'react-bootstrap';
import AuthContext from '../_helper/AuthContext';
import Loader from '../Layout/Loader';
import Swal from 'sweetalert2';
import deleteIcon from '../assets/images/delete.png';
import editIcon from '../assets/images/edit.png';

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
  const [editCompany, setEditCompany] = useState(false);
  const [currentCompany, setCurrentCompany] = useState([]);

  const getData = async () => {
    const response = await axios.get(getFlightCompanies, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    });

    console.log(response.data);
    setIsLoading(false)
    setCompanyData(response.data);
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
    .catch(err => {
      Swal.fire(err?.response?.data || 'An error occured. Please try again.', '', 'error');
    })
    
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
          Swal.fire({
            title: "Deleted!",
            text: "Plane has been deleted.",
            icon: "success"
          });
        })
        
      }
    });
    
  }

  const handleEdit = (id, plane) => {
    axios.put(editPlanes + id, {PlaneNumber: plane.planeNumber, PlaneId: plane.planeId}, {
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
    .catch(err => {
      Swal.fire(err?.response?.data?.message || 'An error occured. Please try again.', '', 'error');
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
    })
    .catch(err => {
      Swal.fire(err?.response?.data || 'An error occured. Please try again.', '', 'error');
    })
  }

  const handleEditCompany = comp => {
    console.log(comp);

    axios.put(editCompanies + comp.flightCompanyId, {CompanyName: comp.flightCompany, FlightCompanyId: comp.flightCompanyId}, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
    .then(res => {
      console.log(res.data)
      setEditCompany(false);
      setCompany('');
      getData();
    })
    .catch(err => {
      Swal.fire(err?.response?.data?.message || 'An error occured. Please try again.', '', 'error');
    })
  }

  const handleDeleteCompany = id => {
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
        axios.delete(deleteCompany + id, {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        })
        .then(() => {
          getData();
          Swal.fire({
            title: "Deleted!",
            text: "Flight Company has been deleted.",
            icon: "success"
          })
        })
        .catch(err => {
          Swal.fire(err?.response?.data || 'An error occured while trying to delete Flight Company.');
        })
      }
    });
    
  }
  

  useEffect(() => {
    getData();
  }, []);

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
                  <CardBody style={{paddingBottom: '10px'}}>
                    <div className="d-flex justify-content-between align-items-center">
                      <Card.Title className='text-start mb-3'>{company.flightCompany}</Card.Title>
                      <Card.Title>
                        <div className="d-flex justify-content-end add-plane">
                          <Button className="superadmin-buttons" onClick={() => {
                            setCurrentPlane(company)
                            setCreatePlane(true)
                          }}>Add Plane</Button>
                        </div>
                      </Card.Title>
                    </div>
                    <Card.Title style={{marginRight: '2%', display: 'flex', justifyContent: 'end'}}>
                      <Button className='action-buttons' onClick={() => {
                        setEditCompany(true);
                        setCurrentCompany(company);
                      }}><img src={editIcon} alt="edit icon" /></Button>
                      <Button className='action-buttons' onClick={() => handleDeleteCompany(company.flightCompanyId)}><img src={deleteIcon} alt="delete icon" /></Button>
                    </Card.Title>
                    {company.planes.map(plane => (
                      <div className="text-muted d-flex justify-content-between align-items-center plane" key={plane.planeId}>
                        <h5 className='d-flex align-items-center p-0 m-0 flex-grow-1'>Plane Number: {plane.planeNumber}</h5>
                        <Button className="action-buttons" onClick={() => {
                          setEditPlane(true);
                          setCurrentPlane(plane);
                        }}><img src={editIcon} alt="edit icon" /></Button>
                        <Button className="action-buttons" onClick={() => handleDelete(plane.planeId)}><img src={deleteIcon} alt="delete icon" /></Button>
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
        
        {/* COMPANY MODAL */}
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
            <FormGroup className='formGroup d-flex justify-content-between mt-3'>
              <Button variant='secondary' onClick={() => setCreatePlane(false)}>Close</Button>
              <Button className="admin-buttons" onClick={() => addCompany()}>Add Company</Button>
            </FormGroup>
          </Modal.Body>
        </Modal>

        {currentCompany && 
          <Modal size="md" show={editCompany} onHide={() => setEditCompany(false)} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header>
              <Modal.Title id="example-modal-sizes-title-lg">
                Edit Company
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup className='formGroup'>
                <FormLabel>Company Name</FormLabel>
                <div className="input-group login-form-inputs">
                    <FormControl className="form-control" type="text" name="companyName" placeholder="e.g. AirLine" value={currentCompany.flightCompany} onChange={e => setCurrentCompany(prev => ({...prev, flightCompany: e.target.value}))} />
                </div>
              </FormGroup>
              <FormGroup className='formGroup d-flex justify-content-between mt-3'>
                <Button variant='secondary' onClick={() => setEditCompany(false)}>Close</Button>
                <Button className="admin-buttons" onClick={() => handleEditCompany(currentCompany)}>Edit Company</Button>
              </FormGroup>
            </Modal.Body>
          </Modal>
        }
        
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
              <FormGroup className='formGroup d-flex justify-content-between mt-3'>
                <Button variant='secondary' onClick={() => setCreatePlane(false)}>Close</Button>
                <Button className="admin-buttons" onClick={() => addPlane(currentPlane.flightCompanyId)}>Create Plane</Button>
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
                    <FormControl className="form-control" type="text" name="name" placeholder="e.g. Plane1" value={currentPlane.planeNumber} onChange={e => setCurrentPlane(prev => ({...prev, planeNumber: e.target.value}))} />
                </div>
              </FormGroup>
              <FormGroup className='formGroup d-flex justify-content-between mt-3'>
                <Button variant='secondary' onClick={() => setCreatePlane(false)}>Close</Button>
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
