import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, FormGroup, FormLabel, FormControl} from 'react-bootstrap'; //importet qe behen nga Reacti
import Header from '../Layout/Header';
import Loader from '../Layout/Loader';
import BusContext from '../_helper/BusContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { addBuses, getBusCopmanies, getBuses } from '../Endpoint';


const BusCompany = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { busData, setBusData } = useContext(BusContext);
  const [selectedBus, setSelectedBus] = useState(null);
  const [openBusModal, setOpenBusModal] = useState(false);
  const [busNumber,setBusNumber] = useState(""); //UseState per vendosjen e emrit te busit
  const [deckerNumber,setDeckerNumber] = useState(1);
  const [currentBus,setCurrentBus] = useState(null); //UseState

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


  useEffect(() => {
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

    fetchBusData();
  }, [setBusData]);

  const handleBusClick = (bus) => {
    setSelectedBus(bus);
  };
  const addBus = (bus) => {
    setOpenBusModal(true);
    setCurrentBus(bus);

  }

  const handlePurchase = (tripId) => {
    const Name = JSON.parse(localStorage.getItem('name'));
    const Id = JSON.parse(localStorage.getItem('userId'));
    axios.post('/api/purchase', { tripId, Name, Id }) // Replace with your actual endpoint
      .then(res => {
        Swal.fire(res.data.message, '', 'success');
      })
      .catch(err => {
        console.log(err);
        if (!err.response) {
          Swal.fire('Error, No Server Response!', '', 'error');
        } else if (err.response?.status === 401) {
          Swal.fire('Unauthorized!!!', '', 'error');
        } else if (err.response.data) {
          Swal.fire(err.response.data, '', 'error');
        } else {
          Swal.fire('Something went wrong', '', 'error');
        }
      });
  };

  return (
    <div>
        {isLoading ? (
          <Loader />
        ) : (
          <Row>
            <Col md={12}>
              <h2 className='customized-text'>Bus Companies</h2>
              <Row>
                {busData && busData.map((bus, idx) => (
                  <Col md={4} key={idx}>
                    <Card className='mb-4'>
                      <Card.Body>
                        
                        
                        <div className="d-flex justify-content-between">
                        <Card.Title>{bus.busCompany}</Card.Title> 
                        <Button onClick={() => toggleBuses(idx)}  >
                            {visibleBuses[idx] ? 'Hide Buses' : 'Show Buses'}<span>⏷</span>
                          </Button>
                        </div>
                          <div>
                         
                            <div className={`busesContainer ? ${visibleBuses[idx] ? 'visible' : ''}`}>
                              {visibleBuses[idx] && bus.buses.map((item, busIdx) => (
                                <Card.Text key={busIdx}>
                                  Bus Number : {item.busNumber}
                                  <br />
                                  Number of deckers : {item.deckersNr}
                                </Card.Text>
                              ))}
                          </div>
                          </div>
                          {/* <strong>Origin:</strong> {bus.originCountry} <br />
                          <strong>Destination:</strong> {bus.destinationCountry} <br />
                          <strong>Price:</strong> ${bus.ticketPrice.toFixed(2)} */}
                        
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


    </div>
  );
};

export default BusCompany;
