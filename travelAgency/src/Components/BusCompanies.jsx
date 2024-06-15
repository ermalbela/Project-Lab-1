import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal, FormGroup, FormLabel, FormControl, CardBody} from 'react-bootstrap'; //importet qe behen nga Reacti
import Loader from '../Layout/Loader';
import BusContext from '../_helper/BusContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { addBusCompany, addBuses, editBusCopmany, getBusCopmanies, deleteBusCompany, editBus, deleteBus } from '../Endpoint';
import deleteIcon from '../assets/images/delete.png';
import editIcon from '../assets/images/edit.png';

const BusCompany = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { busData, setBusData } = useContext(BusContext);
  const [selectedBus, setSelectedBus] = useState(null);
  const [openBusModal, setOpenBusModal] = useState(false);
  const [busNumber,setBusNumber] = useState(""); //UseState per vendosjen e emrit te busit
  const [deckerNumber,setDeckerNumber] = useState(1);
  const [currentBus,setCurrentBus] = useState(null); //UseState
  const [openBusCompany, setOpenBusCompany] = useState(false);
  const [busCompany, setBusCompany] = useState('');
  const [openEditCompany, setOpenEditCompany] = useState(false);
  const [currentCompany, setCurrentCompany] = useState([]);
  const [openEditBus, setOpenEditBus] = useState(false);
  const [deckerError, setDeckerError] = useState('');

  //metod per shtimin e autobusve
  const handleBus = (id) => {
    console.log(id);
    axios.post(addBuses, {BusNumber:busNumber,DeckersNr:deckerNumber,BusCompanyId:id,}, { 
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
    .then(res => {
      console.log(res.data);
      Swal.fire('Trip Added Successfully', '', 'success');
      
      setCurrentBus('');
      setOpenBusModal(false);
      fetchBusData();
    })
    .catch(err => console.log(err));
    
  }

  const [visibleBuses, setVisibleBuses] = useState({});

  const toggleBuses = (idx) => {
    setVisibleBuses((prevState) => ({
      ...prevState,
      [idx]: !prevState[idx],
    }));
  };


  const fetchBusData = async () => {
    try {
      const response = await axios.get(getBusCopmanies); 
      console.log(response.data);
      setBusData(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false); 
    }
  };
  
  useEffect(() => {
    fetchBusData();
  }, [setBusData]);

  const handleBusClick = (bus) => {
    setSelectedBus(bus);
  };
  const addBus = (bus) => {
    setOpenBusModal(true);
    setCurrentBus(bus);

  }

  const handleEditBus = (id, bus) => {
    console.log(bus);

    if(bus.deckersNr > 2){
      setDeckerError('Deckers should be 2 or less');
    }else{ 
      setDeckerError('');
      axios.put(editBus + id, {BusNumber: bus.busNumber, BusId: bus.busId, DeckersNr: bus.deckersNr})
      .then(res => {
        console.log(res)
        setOpenEditBus(false);
        fetchBusData();
      })
      .catch(err => {
        Swal.fire(err?.response?.data?.message || 'An error occured. Please try again.', '', 'error');
      })
    }
  }

  const handleDeleteBus = id => {
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
        axios.delete(deleteBus + id, {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        })
        .then(() => {
          fetchBusData();
          Swal.fire({
            title: "Deleted!",
            text: "Bus has been deleted.",
            icon: "success"
          });
        })
      }
    });
    
  }

  // const handlePurchase = (tripId) => {
  //   const Name = JSON.parse(localStorage.getItem('name'));
  //   const Id = JSON.parse(localStorage.getItem('userId'));
  //   axios.post('/api/purchase', { tripId, Name, Id }) // Replace with your actual endpoint
  //     .then(res => {
  //       Swal.fire(res.data.message, '', 'success');
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       if (!err.response) {
  //         Swal.fire('Error, No Server Response!', '', 'error');
  //       } else if (err.response?.status === 401) {
  //         Swal.fire('Unauthorized!!!', '', 'error');
  //       } else if (err.response.data) {
  //         Swal.fire(err.response.data, '', 'error');
  //       } else {
  //         Swal.fire('Something went wrong', '', 'error');
  //       }
  //     });
  // };



  //Company Methods
  const handleAddCompany = () => {
    axios.post(addBusCompany, {Name: busCompany})
      .then(res => {
        console.log(res.data);
        Swal.fire('Company Added Successfully', '', 'success');
        
        setBusCompany('');
        setOpenBusCompany(false);
        fetchBusData();
      })
      .catch(err => console.log(err));
  }

  const handleEditCompany = comp => {
    console.log(comp);

    axios.put(editBusCopmany + comp.busCompanyId, {Name: comp.busCompany, BusCompanyId: comp.busCompanyId}, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
    .then(res => {
      console.log(res.data)
      setOpenEditCompany(false);
      setBusCompany('');
      fetchBusData();
      Swal.fire(res.data?.message || 'Edited Successfully.', '', 'success');
    })
    .catch(err => {
      console.log(err);
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
        axios.delete(deleteBusCompany + id, {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        })
        .then(() => {
          fetchBusData();
          Swal.fire({
            title: "Deleted!",
            text: "Bus Company has been deleted.",
            icon: "success"
          })
        })
        .catch(err => {
          Swal.fire(err?.response?.data || 'An error occured while trying to delete Bus Company.');
        })
      }
    });
    
  }

  return (
    <div>
        {isLoading ? (
          <Loader />
        ) : (
          <Row>
            <Col md={12}>
              <div className="d-flex justify-content-between title">
                <h2 className='customized-text'>Bus Companies</h2>
                <Button onClick={() => setOpenBusCompany(true)}>Add Company</Button> 
              </div>
              <Row>
                {busData && busData.map((bus, idx) => (
                  <Col md={4} key={idx}>
                    <Card className='mb-4'>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                        <Card.Title>{bus.busCompany}</Card.Title> 
                          <Button className='action-buttons' onClick={() => {
                            setOpenEditCompany(true);
                            setCurrentCompany(bus);
                          }}><img src={editIcon} alt="edit icon" /></Button>
                          <Button className='action-buttons' onClick={() => handleDeleteCompany(bus.busCompanyId)}><img src={deleteIcon} alt="delete icon" /></Button>
                          <Button onClick={() => toggleBuses(idx)}>
                            {visibleBuses[idx] ? 'Hide Buses' : 'Show Buses'}<span>⏷</span>
                          </Button>
                        </div>
                          <div>
                            <div className={`busesContainer ? ${visibleBuses[idx] ? 'visible' : ''}`}>
                              {visibleBuses[idx] && bus.buses.map((item, busIdx) => (
                                <Card key={busIdx}>
                                  <CardBody className="d-flex justify-content-between">
                                    <Card.Text>
                                      Bus Number : {item.busNumber}
                                      <br />
                                      Number of deckers : {item.deckersNr}
                                    </Card.Text>
                                    <Card.Text>
                                      <Button className='action-buttons' onClick={() => {
                                        setOpenEditBus(true);
                                        setCurrentBus(item);
                                      }}><img src={editIcon} alt="edit icon" /></Button>
                                      <Button className='action-buttons' onClick={() => handleDeleteBus(bus.busCompanyId)}><img src={deleteIcon} alt="delete icon" /></Button>
                                    </Card.Text>
                                  </CardBody>
                                </Card>
                              ))}
                          </div>
                          </div>
                        <Button variant="primary" onClick={() => handleBusClick(bus)}>View Trips</Button>
                        <Button variant="primary" style={{marginLeft:"5px" }} onClick={()=> addBus(bus)}>Add Bus</Button>
                        
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {selectedBus && (
                <div>
                  <h3>Trips for {selectedBus.busCompany}</h3>
                  <Row>
                    {selectedBus.trips && selectedBus.trips.map((trip, idx) => (
                      <Col md={4} key={idx}>
                        <Card className='mb-4'>
                          <Card.Body>
                            <Card.Title>Trip ID: {trip.tripId}</Card.Title>
                            <Card.Text>
                              <strong>Departure:</strong> {trip.departure} <br />
                              <strong>Arrival:</strong> {trip.arrival} <br />
                              <strong>Price:</strong> ${trip.price.toFixed(2)}
                            </Card.Text>
                            <Button variant="primary" onClick={() => handlePurchase(trip.tripId)}>Purchase</Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Col>
          </Row>
        )}
      
      {/* Add Bus modal */}

    {currentBus &&  <Modal size="md" show={openBusModal} onHide={() => setOpenBusModal(false)} aria-labelledby="example-modal-sizes-title-sm">
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          Add Bus
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup className='formGroup'>
          <FormLabel>Bus Number</FormLabel>
          <div className="input-group login-form-inputs">
              <FormControl className="form-control" type="text" name="busNumber" placeholder="e.g. B432" value={busNumber} onChange={e => setBusNumber(e.target.value)} />
          </div>
        </FormGroup>
        <FormGroup className='formGroup'>
          <FormLabel>Number of Deckers</FormLabel>
          <div className="input-group login-form-inputs">
              <FormControl className="form-control" type="text" name="deckerNumber" placeholder="e.g. 1 or 2" value={deckerNumber} onChange={e => setDeckerNumber(e.target.value)} />
          </div>
        </FormGroup>
        <FormGroup className='formGroup d-flex justify-content-end'>
          <Button className="admin-buttons" onClick={() => handleBus(currentBus.busCompanyId)}>Add Bus</Button>
        </FormGroup>
      </Modal.Body>
    </Modal> }

    {currentCompany &&  <Modal size="md" show={openEditCompany} onHide={() => setOpenEditCompany(false)} aria-labelledby="example-modal-sizes-title-sm">
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          Edit Company
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup className='formGroup'>
          <FormLabel>Company Name</FormLabel>
          <div className="input-group login-form-inputs">
              <FormControl className="form-control" type="text" name="companyName" placeholder="e.g. B432" value={currentCompany.busCompany} onChange={e => setCurrentCompany(prev => ({...prev, busCompany: e.target.value}))} />
          </div>
        </FormGroup>
        <FormGroup className='formGroup d-flex justify-content-end'>
          <Button className="admin-buttons" onClick={() => handleEditCompany(currentCompany)}>Edit Company</Button>
        </FormGroup>
      </Modal.Body>
    </Modal> }


    <Modal size="md" show={openBusCompany} onHide={() => setOpenBusCompany(false)} aria-labelledby="example-modal-sizes-title-sm">
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          Add Bus Company
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup className='formGroup'>
          <FormLabel>Company Name</FormLabel>
          <div className="input-group login-form-inputs">
              <FormControl className="form-control" type="text" name="busCompany" placeholder="e.g. Zhitia Travel" value={busCompany} onChange={e => setBusCompany(e.target.value)} />
          </div>
        </FormGroup>
        <FormGroup className='formGroup d-flex justify-content-end'>
          <Button className="admin-buttons" onClick={() => handleAddCompany()}>Add Company</Button>
        </FormGroup>
      </Modal.Body>
    </Modal>

    {currentBus &&  <Modal size="md" show={openEditBus} onHide={() => setOpenEditBus(false)} aria-labelledby="example-modal-sizes-title-sm">
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          Edit Bus
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup className='formGroup'>
          <FormLabel>Bus Number</FormLabel>
          <div className="input-group login-form-inputs">
              <FormControl className="form-control" type="text" name="busNum" placeholder="e.g. B432" value={currentBus.busNumber} onChange={e => setCurrentBus(prev => ({...prev, busNumber: e.target.value}))} />
          </div>
        </FormGroup>
        <FormGroup className='formGroup'>
          <FormLabel>Number of Deckers</FormLabel>
          <div className="input-group login-form-inputs">
              <FormControl className="form-control" type="text" name="deckerNumber" placeholder="e.g. 1 or 2" value={currentBus.deckersNr} onChange={e => setCurrentBus(prev => ({...prev, deckersNr: e.target.value}))} />
          </div>
          <p className="invalidFeedback">{deckerError}</p>
        </FormGroup>
        <FormGroup className='formGroup d-flex justify-content-end'>
          <Button className="admin-buttons" onClick={() => handleEditBus(currentBus.busId, currentBus)}>Edit Bus</Button>
        </FormGroup>
      </Modal.Body>
    </Modal> }

    </div>
  );
};

export default BusCompany;