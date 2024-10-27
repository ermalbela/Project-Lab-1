import React, { useContext, useEffect, useState, useMemo } from 'react'
import { Container, Row, Col, Button, Modal, Card, DropdownButton, DropdownItem, CardHeader, CardBody } from 'react-bootstrap';
import planeIcon from '../assets/images/plane-icon.png';
import axios from 'axios';
import { getFlights, getPurchasedFlights, purchaseFlight } from '../Endpoint';
import Swal from 'sweetalert2';
import Loader from '../Layout/Loader';
import FlightContext from '../_helper/FlightContext';
import checkCircle from '../assets/images/check-circle.png';
import minusCircle from '../assets/images/minus-circle.png';
import useQuicksort from '../_helper/useQuicksort';
import CustomPagination from '../CommonElements/Pagination';
import rightArrowLong from '../assets/images/right-arrow-long.png';

const Flights = () => {

  const [isLoading, setIsLoading] = useState(true);
  const {data, setData} = useContext(FlightContext);
  const [show, setShow] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState([]);
  const [passengerCounts, setPassengerCounts] = useState({adult: 1, child: 0, infant: 0});

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

  const getData = async () => {
    const response = await axios.get(getPurchasedFlights, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    });
    console.log(response.data);
  }


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



  const [sortKey, setSortKey] = useState('reservation');
  const sortedFlights = useQuicksort(data, sortKey);
  

  const [currentPage, setCurrentPage] = useState(1);
  const [flightsPerPage, setFlightsPerPage] = useState(12);

  const lastVisitIndex = currentPage * flightsPerPage;
  const firstVisitIndex = lastVisitIndex - flightsPerPage;

  let filteredPaginationFlights = sortedFlights.slice(firstVisitIndex, lastVisitIndex);

  const handlePurchase = (flightId, category, reservation) => {
    const Name = JSON.parse(localStorage.getItem('name'));
    const Id = JSON.parse(localStorage.getItem('userId'));
    const validNum = [flightId];

    axios.post(purchaseFlight, {FlightId: validNum, User: {Name, Id}, Adults: passengerCounts['adult'], Category: category, Children: passengerCounts['child'], Infant: passengerCounts['infant'], Reservation: reservation}, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
      .then(res => {
        Swal.fire(res.data.message, '', 'success');
        setShow(false);
      })
      .catch(err => {
        console.log(err);
        if(!err.response){
          Swal.fire('Error', 'No Server Response!', 'error');
        } else if(err?.response?.status == 401){
          Swal.fire('Unauthorized!!', '', 'error');
          localStorage.removeItem('token');
          localStorage.removeItem('name');
          localStorage.removeItem('userId');
        } else if(err.response.data){
          Swal.fire('Error', err.response.data, 'error');
        } else{
          Swal.fire('Error','Something went wrong', 'error');
        }
      })
    
  }

  
  const handleItemClick = (type, action, e) => {
    e.stopPropagation();
    if(action === 'increment'){
      setPassengerCounts(prevCounts => ({
        ...prevCounts,
        [type]: prevCounts[type] + 1
      }))
    } else{
      setPassengerCounts(prevCounts => ({
        ...prevCounts,
        [type]: prevCounts[type] - 1
      }))
    }
  };

  const handleMenuClick = e => {
    e.stopPropagation();
  }

  const handleSelect = (key) => {
    setSortKey(key);
};

  const toggleDropdown = () => {
    setShowDropdown(prevState => !prevState);
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const totalPrice = () => {
    const adultPrice = selectedFlight.ticketPrice;
    const childPrice = selectedFlight.ticketPrice * 0.75; // 75% of adult price
    const infantPrice = selectedFlight.ticketPrice * 0.5; // 50% of adult price

    const totalAdultPrice = passengerCounts.adult * adultPrice;
    const totalChildPrice = passengerCounts.child * childPrice;
    const totalInfantPrice = passengerCounts.infant * infantPrice;

    return totalAdultPrice + totalChildPrice + totalInfantPrice;
};


  return isLoading ? (
    <Loader />
  ) : (
    <>
    <Container>
        <Row>
          <Col xs={12} className="mb-4">
            <h2>Flights</h2>
          </Col>
          <Col xs={12}>
            <Card>
              <Card.Header>
                <h4>Filtered Flights</h4>
              </Card.Header>
              <Card.Body>
                <Row className="d-flex justify-content-between mb-4">
                  <Col className="d-flex align-items-center mb-3 top-flight-dropdown">
                    <span className='none-responsive-text'>Sort By:</span>
                    <DropdownButton
                      id='dropdown-sort-button'
                      title={sortKey === 'reservation' ? 'Reservation' : sortKey === 'ticketPrice' ? 'Price' : 'Tickets Left'}
                      onSelect={handleSelect}
                      className="ml-2"
                    >
                      <DropdownItem eventKey="reservation">Reservation</DropdownItem>
                      <DropdownItem eventKey="ticketPrice">Price</DropdownItem>
                      <DropdownItem eventKey="ticketsLeft">Tickets Left</DropdownItem>
                    </DropdownButton>
                  </Col>
                  <Col className="d-flex justify-content-end top-flight-dropdown">
                    <DropdownButton title="Passengers" show={showDropdown} onClick={toggleDropdown}>
                      {Object.keys(passengerCounts).map(type => (
                        <DropdownItem key={type}>
                          <Button variant="outline-success" onClick={() => handleItemClick(type, 'increment')}>+</Button>
                          {`${type.charAt(0).toUpperCase() + type.slice(1)}: ${passengerCounts[type]}`}
                          <Button variant="outline-danger" disabled={passengerCounts[type] <= 0} onClick={() => handleItemClick(type, 'decrement')}>-</Button>
                        </DropdownItem>
                      ))}
                    </DropdownButton>
                  </Col>
                </Row>

                <Row>
                  {filteredPaginationFlights.length > 0 ? filteredPaginationFlights.map((flight, idx) => {
                    const date = new Date(flight.reservation);
                    const options = { month: 'long', day: 'numeric'};
                    const formattedDate = date.toLocaleDateString('en-US', options);
                    
      
                  // --------------How a flight item should look like----------
                    return (
                      <Col xl={12} className="timeline-container" key={idx}>
                        <div className="event">
                          <div className="timeline-content d-flex justify-content-between">
                            <Row className="d-flex align-items-center justify-content-between fullWidth">
                              <Col className='d-flex align-items-center flight-top-container'>
                                <img src={planeIcon} className='plane-icon'/>
                                <div className='d-flex align-items-center flex-column'>
                                  <h5>{flight.flightCompany}</h5>
                                  <h6 className='text-muted'>{flight.plane.planeNumber}</h6>
                                </div>
                              </Col>
                              <Col xs={6} className='d-flex align-items-center justify-content-center date-container'>
                                <Row>
                                  <Col xs={4} className='d-flex align-items-center flex-column justify-content-center p-0'>
                                    <h5 className="text-center fullWidth">{flight.originCountry} &nbsp;</h5>
                                    <h6 className="text-center">{flight.departure.slice(0, 5)} &nbsp;</h6>
                                  </Col>
                                  <Col xs={4} className="d-flex flex-column justify-content-center align-items-center p-0">
                                    <div className="text-muted text-center mt-2"><span style={{fontSize: '14px'}}>{formattedDate}</span></div>
                                    <img src={rightArrowLong} style={{width: '40%', minWidth: '40px'}}/>
                                  </Col>
                                  <Col xs={4} className='d-flex align-items-center flex-column justify-content-center p-0'>
                                    <h5 className="text-center fullWidth">&nbsp; {flight.destinationCountry}</h5>
                                    <h6 className="text-center">&nbsp; {flight.arrival.slice(0, 5)}</h6>
                                  </Col>
                                </Row>
                              </Col>
                              {/* ===============================TICKET FUNCTIONALITY BUTTON=============================== */}
                              <Col className="d-flex flight-bot-container">
                                <h5 style={{marginBottom: '0px'}}>{flight.ticketPrice.toFixed(2)}$<span style={{fontSize: '14px'}} className="none-responsive-text">(per adult)</span> &nbsp;</h5>
                                <div className='d-flex flex-column align-items-center justify-content-center'>
                                  <h6 className='text-muted customized-font-size none-responsive-text'>({flight.ticketsLeft} Tickets Left)</h6>
                                  <Button onClick={() => handleClick(flight)} className="prices-btn">View Prices</Button>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    )
                  })
                : <h3 className="justify-content-center align-items-center d-flex">There is no flights in this date...</h3>}
      
                  {/* <Button onClick={() => getData()}>Click me</Button> */}
                </Row>

                {selectedFlight ? <Modal size="xl" show={show} onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-lg" scrollable>
              <Modal.Header className='custom-modal-header justify-content-between align-items-center'>
                <Modal.Title><span className="vip-category-text">3 FARE OPTIONS</span> Avaliable For Your Trip</Modal.Title>
                <h5>Price calculated for: (Adults: {passengerCounts['adult']} Children: {passengerCounts['child']} Infant: {passengerCounts['infant']})</h5>
              </Modal.Header>
              <Modal.Body className='row'>
                <Col className="modal-ticket-col">
                  <Card className='h-100'>
                    <Card.Header className='ticket-header'>
                      <p className='custom-price'>{totalPrice().toFixed(2)}$</p> Standard Category 
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
                      <div className="d-flex fullWidth justify-content-end align-items-end modal-tickets" style={{height: '36.5%'}}>
                        <Button variant="primary" onClick={() => handlePurchase(selectedFlight.flightId, 'Standard', selectedFlight.reservation)}>Purchase</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col className="modal-ticket-col">
                  <Card className='h-100'>
                    <Card.Header className='ticket-header'>
                      <p className='custom-price'>{(totalPrice() * 1.5).toFixed(2)}$</p> Standard+ Category 
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
                      <div className="d-flex fullWidth justify-content-end align-items-end modal-tickets" style={{height: '36.5%'}}>
                        <Button variant="primary" onClick={() => handlePurchase(selectedFlight.flightId, 'Standard+', selectedFlight.reservation)}>Purchase</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col className="modal-ticket-col">
                  <Card className='h-100'>
                    <Card.Header className='vip-header ticket-header'>
                      <p className='custom-price'>{(totalPrice() * 2).toFixed(2)}$</p> VIP Category
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
                      <div className="d-flex fullWidth justify-content-end align-items-end modal-tickets">
                        <Button variant="primary" onClick={() => handlePurchase(selectedFlight.flightId, 'VIP', selectedFlight.reservation)}>Purchase</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Modal.Body>
              <Modal.Footer className='custom-modal-footer'></Modal.Footer>
            </Modal> : ''
            }

                <Row className="justify-content-center">
                  <CustomPagination totalUsers={data.length} usersPerPage={flightsPerPage} setTheCurrentPage={setCurrentPage} currentPage={currentPage} />
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Flights;