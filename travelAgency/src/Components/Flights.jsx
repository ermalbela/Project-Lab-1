import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import planeIcon from '../assets/images/plane-icon.png';
import axios from 'axios';
import { getFlights } from '../Endpoint';
import Swal from 'sweetalert2';
import Loader from '../Layout/Loader';
import FlightContext from '../_helper/FlightContext';
import checkCircle from '../assets/images/check-circle.png';
import minusCircle from '../assets/images/minus-circle.png';

const Flights = () => {

  const [isLoading, setIsLoading] = useState(true);
  const {data, setData} = useContext(FlightContext);
  const [show, setShow] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  // ===============================FETCH THE WHOLE FLIGHTS HERE===============================//
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(getFlights);
  //       console.log(response);
  //       setData(response.data);
  //       setIsLoading(false);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   fetchData();
  // }, []);

  useEffect(() => {
    if(data !== '' || data !== undefined){
      setIsLoading(false);
    }
  }, [data, setData]);

  const handleClick = flight => {
    console.log(flight);
    setShow(true);
    setSelectedFlight(flight);
  }


  return isLoading ? (
    <Loader />
  ) : (
    <Container>
      <Row>
        <Col md={12}>
          <h2 className='customized-text'>Flights</h2>

          {/* ===============================MAPPING OVER THE DATA HERE=============================== */}
          {data.map((flight, idx) => {
            const date = new Date(flight.reservation);
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            

          // --------------How a flight item should look like----------
            return (
              <div className="timeline-container" key={idx}>
                <div className="event">
                  <div className="event-date customized-text">{formattedDate}</div>
                  <div className="timeline-content d-flex justify-content-between">
                    <Row className="d-flex align-items-center justify-content-between fullWidth">
                      <Col className='d-flex'>
                        <img src={planeIcon} className='plane-icon'/>
                        <div className='d-flex align-items-center flex-column'>
                          <h5>AirSafe</h5>
                          <h6 className='text-muted'>Flight ID: {flight.flightId}</h6>
                        </div>
                      </Col>
                      <Col xs={6} className='d-flex align-items-center justify-content-center'>
                        <div className='d-flex align-items-center flex-column justify-content-center' style={{width: '45%'}}>
                          <h5 className="text-center fullWidth">{flight.originCountry} &nbsp;</h5>
                          <h6 className="text-center">{flight.departure.slice(0, 5)} &nbsp;</h6>
                        </div>
                        <svg viewBox="0 0 33 12" role="img" className="svg-icon svg-fill icon__arrow--big--toright" style={{width: "10%", height: "20px", marginBottom: '4px'}}><path pid="0" d="m32.403 5.709.005-.008-2.84-4.944a.568.568 0 0 0-.77-.195.548.548 0 0 0-.198.757l2.34 4.11H1.063a.557.557 0 0 0-.562.553c0 .306.252.553.562.553h29.879l-2.343 4.138a.549.549 0 0 0 .199.757.567.567 0 0 0 .77-.196l2.841-4.971a.544.544 0 0 0-.006-.554z" fillRule="evenodd"></path></svg>
                        <div className='d-flex align-items-center flex-column' style={{width: '45%'}}>
                          <h5 className="text-center fullWidth">&nbsp; {flight.destinationCountry}</h5>
                          <h6 className="text-center">&nbsp; {flight.arrival.slice(0, 5)}</h6>
                        </div>
                      </Col>
                      {/* ===============================TICKET FUNCTIONALITY BUTTON=============================== */}
                      <Col className="d-flex justify-content-end align-items-center">
                        <h5 style={{marginBottom: '0px'}}>{flight.ticketPrice.toFixed(2)}$ &nbsp;</h5>
                        <Button onClick={() => handleClick(flight)}>View Prices</Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            )
          })}
          {selectedFlight && <Modal size="xl" show={show} onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-lg" scrollable>
            <Modal.Header className='custom-modal-header'>
              <Modal.Title><span className="vip-category-text">3 FARE OPTIONS</span> Avaliable For Your Trip</Modal.Title>
            </Modal.Header>
            <Modal.Body className='row'>
              <Col>
                <Card style={{height: '100%'}}>
                  <Card.Header>
                    <p className='custom-price'>{selectedFlight.ticketPrice}$</p> Standard Category 
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className='flight-category-title'>
                      Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center flight-category-text first-text'>
                      <img src={checkCircle} className="category-icons"/>7kgs Cabin Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center flight-category-text'>
                      <img src={checkCircle} className="category-icons"/>15kgs Check-in Baggage
                    </Card.Text>

                    <Card.Text className='flight-category-title'>
                      Flexibility
                    </Card.Text>
                    <Card.Text className='flight-category-text'>
                      <img src={minusCircle} className="category-icons"/>Cancellation fee starts at 50$ (up to 3 hours before departure)
                    </Card.Text>

                    <Card.Text className='flight-category-title'>
                      Seats, Meals & More
                    </Card.Text>
                    <Card.Text className='flight-category-text first-text'>
                      <img src={minusCircle} className="category-icons"/>Chargeable Seats
                    </Card.Text>
                    <Card.Text className='flight-category-text'>
                      <img src={minusCircle} className="category-icons"/>Chargeable Meals
                    </Card.Text>
                    <div className="d-flex fullWidth justify-content-end align-items-end" style={{height: '36.5%'}}>
                      <Button variant="primary">Purchase</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card style={{height: '100%'}}>
                  <Card.Header>
                    <p className='custom-price'>{(selectedFlight.ticketPrice * 2 / 1.5).toFixed(2)}$</p> Standard+ Category 
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className='flight-category-title'>
                      Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center flight-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/>7kgs Cabin Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center flight-category-text'>
                      <img src={checkCircle} style={{width: '17px'}}/>20kgs Check-in Baggage
                    </Card.Text>

                    <Card.Text className='flight-category-title'>
                      Flexibility
                    </Card.Text>
                    <Card.Text className='flight-category-text'>
                      <img src={minusCircle} style={{width: '17px'}}/>Cancellation fee starts at 50$ (up to 3 hours before departure)
                    </Card.Text>

                    <Card.Text className='flight-category-title'>
                      Seats, Meals & More
                    </Card.Text>
                    <Card.Text className='flight-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Free</span> Seats
                    </Card.Text>
                    <Card.Text className='flight-category-text'>
                      <img src={minusCircle} style={{width: '17px'}}/>Chargeable Meals
                    </Card.Text>
                    <div className="d-flex fullWidth justify-content-end align-items-end" style={{height: '36.5%'}}>
                      <Button variant="primary">Purchase</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Header className='vip-header'>
                    <p className='custom-price'>{selectedFlight.ticketPrice * 2}$</p> VIP Category
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className='flight-category-title'>
                      Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center flight-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/>7kgs Cabin Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center flight-category-text'>
                      <img src={checkCircle} style={{width: '17px'}}/>25kgs Check-in Baggage
                    </Card.Text>

                    <Card.Text className='flight-category-title'>
                      Flexibility
                    </Card.Text>
                    <Card.Text className='flight-category-text'>
                      <img src={minusCircle} style={{width: '17px'}}/>Lower Cancellation fee 20$ (up to 3 hours before departure)
                    </Card.Text>

                    <Card.Text className='flight-category-title'>
                      Seats, Meals & More
                    </Card.Text>
                    <Card.Text className='flight-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Free</span> Seats
                    </Card.Text>
                    <Card.Text className='flight-category-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Complimentary</span> Meals
                    </Card.Text>

                    <Card.Text className='flight-category-title'>
                      Exclusive Benefits
                    </Card.Text>
                    <Card.Text className='flight-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Free</span> Express Check-in
                    </Card.Text>
                    <Card.Text className='flight-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Free</span> Priority Boarding
                    </Card.Text>
                    <Card.Text className='flight-category-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Free</span> Delayed & lost Baggage Protection Service
                    </Card.Text>
                    <div className="d-flex fullWidth justify-content-end align-items-end">
                      <Button variant="primary">Purchase</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Modal.Body>
            <Modal.Footer className='custom-modal-footer'></Modal.Footer>
          </Modal>
          }
        </Col>
      </Row>
    </Container>
  )
}

export default Flights;