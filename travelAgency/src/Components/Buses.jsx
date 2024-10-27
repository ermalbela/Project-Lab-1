import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Button, Modal, Card, DropdownButton, DropdownItem } from 'react-bootstrap';
import busIcon from '../assets/images/busIcon.png';
import axios from 'axios';
import { getPurchasedFlights, purchaseBus } from '../Endpoint';
import Swal from 'sweetalert2';
import Loader from '../Layout/Loader';
import BusContext from '../_helper/BusContext';
import checkCircle from '../assets/images/check-circle.png';
import minusCircle from '../assets/images/minus-circle.png';
import useQuicksort from '../_helper/useQuicksort';
import CustomPagination from '../CommonElements/Pagination';
import rightArrowLong from '../assets/images/right-arrow-long.png'

const Bus = () => {

  const [isLoading, setIsLoading] = useState(true);
  const {busData, setBusData} = useContext(BusContext);
  const [show, setShow] = useState(false);
  const [selectedBus, setselectedBus] = useState(null);
  const [passengerCounts, setPassengerCounts] = useState({adult: 1, child: 0, infant: 0});

  // ===============================FETCH THE WHOLE busS HERE===============================//
  // useEffect(() => {
  //   const fetchbusData = async () => {
  //     try {
  //       const response = await axios.get(getbuss);
  //       console.log(response);
  //       setbusData(response.busData);
  //       setIsLoading(false);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   fetchbusData();
  // }, []);

  useEffect(() => {
    if(busData !== '' || busData !== undefined){
      setIsLoading(false);
    }
  }, [busData, setBusData]);

  const handleClick = bus => {
    setShow(true);
    setselectedBus(bus);
  }

  const [sortKey, setSortKey] = useState('reservation');
  const sortedBuses = useQuicksort(busData, sortKey);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [busTripsPerPage, setBusTripsPerPage] = useState(12);

  const lastVisitIndex = currentPage * busTripsPerPage;
  const firstVisitIndex = lastVisitIndex - busTripsPerPage;

  let filteredPaginationBusTrips = sortedBuses.slice(firstVisitIndex, lastVisitIndex);

  console.log(filteredPaginationBusTrips);


  const handlePurchase = (busId, reservation) => {
    const Name = JSON.parse(localStorage.getItem('name'));
    const Id = JSON.parse(localStorage.getItem('userId'));
    const validNum = [busId];
    const passengerCountsArr = Object.values(passengerCounts);
    
    console.log(validNum);

    axios.post(purchaseBus, {BusTripsId: validNum, User: {Name, Id}, Adults: passengerCounts['adult'], Children: passengerCounts['child'], Infant: passengerCounts['infant'], Reservation: reservation}, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
      .then(res => {
        Swal.fire(res.data.message, '', 'success');
        setShow(false);
      })
      .catch(err => {
        if(err?.response?.status == 401){
          Swal.fire('Unauthorized!!', '', 'error');
          localStorage.removeItem('token');
          localStorage.removeItem('name');
          localStorage.removeItem('userId');
        }
        Swal.fire('Error', err.response?.data?.message, 'error');
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
    const adultPrice = selectedBus.ticketPrice;
    const childPrice = selectedBus.ticketPrice * 0.75; // 75% of adult price
    const infantPrice = selectedBus.ticketPrice * 0.5; // 50% of adult price

    const totalAdultPrice = passengerCounts.adult * adultPrice;
    const totalChildPrice = passengerCounts.child * childPrice;
    const totalInfantPrice = passengerCounts.infant * infantPrice;

    return totalAdultPrice + totalChildPrice + totalInfantPrice;
};


  return isLoading ? (
    <Loader />
  ) : (
    <Container>
  <Row>
    <Col xs={12} className="mb-4">
      <h2>Buses</h2>
    </Col>
    <Col xs={12}>
      <Card>
        <Card.Header>
          <h4>Filtered Buses</h4>
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
                <DropdownItem eventKey="ticketsAvailable">Tickets Left</DropdownItem>
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
            {filteredPaginationBusTrips.length > 0 ? filteredPaginationBusTrips.map((bus, idx) => {
              const date = new Date(bus.reservation);
              const options = { month: 'long', day: 'numeric' };
              const formattedDate = date.toLocaleDateString('en-US', options);

              // --------------How a bus item should look like----------
              return (
                <Col xl={12} className="timeline-container" key={idx}>
                  <div className="event">
                    <div className="timeline-content d-flex justify-content-between">
                      <Row className="d-flex align-items-center justify-content-between fullWidth">
                        <Col className='d-flex align-items-center flight-top-container'>
                          <img src={busIcon} className='plane-icon' />
                          <div className='d-flex align-items-center flex-column'>
                            <h5>{bus.name}</h5>
                            <h6 className='text-muted'>Bus ID: {bus.busId}</h6>
                          </div>
                        </Col>
                        <Col xs={6} className='d-flex align-items-center justify-content-center date-container'>
                          <Row>
                            <Col xs={4} className='d-flex align-items-center flex-column justify-content-center p-0'>
                              <h5 className="text-center fullWidth">{bus.origin} &nbsp;</h5>
                              <h6 className="text-center">{bus.departureTime.slice(0, 5)} &nbsp;</h6>
                            </Col>
                            <Col xs={4} className="d-flex flex-column justify-content-center align-items-center p-0">
                              <div className="text-muted text-center mt-2"><span style={{ fontSize: '14px' }}>{formattedDate}</span></div>
                              <img src={rightArrowLong} style={{ width: '40%', minWidth: '40px' }} />
                            </Col>
                            <Col xs={4} className='d-flex align-items-center flex-column justify-content-center p-0'>
                              <h5 className="text-center fullWidth">&nbsp; {bus.destination}</h5>
                              <h6 className="text-center">&nbsp; {bus.arrivalTime.slice(0, 5)}</h6>
                            </Col>
                          </Row>
                        </Col>
                        {/* ===============================TICKET FUNCTIONALITY BUTTON=============================== */}
                        <Col className="d-flex flight-bot-container">
                          <h5 style={{ marginBottom: '0px' }}>{bus.ticketPrice.toFixed(2)}$<span style={{ fontSize: '14px' }} className="none-responsive-text">(per adult)</span> &nbsp;</h5>
                          <div className='d-flex flex-column align-items-center justify-content-center'>
                            <h6 className='text-muted customized-font-size none-responsive-text'>({bus.ticketsAvailable} Tickets Left)</h6>
                            <Button onClick={() => handleClick(bus)} className="prices-btn">View Prices</Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              )
            })
              : <h3 className="justify-content-center align-items-center d-flex">There are no bus trips on this date...</h3>}

            {selectedBus && <Modal size="md" show={show} onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-lg" scrollable>
              <Modal.Header className='custom-modal-header justify-content-between align-items-center'>
                <Modal.Title><span className="vip-category-text">1 FARE OPTION</span> Available For Your Trip</Modal.Title>
                <h5>Price calculated for: (Adults: {passengerCounts['adult']} Children: {passengerCounts['child']} Infants: {passengerCounts['infant']})</h5>
              </Modal.Header>
              <Modal.Body className='row'>
                <Col>
                  <Card className='h-100'>
                    <Card.Header className="d-flex justify-content-center">
                      <p className='custom-price'>{totalPrice().toFixed(2)}$</p> Standard Category
                    </Card.Header>
                    <Card.Body>
                      <Card.Text className='bus-category-title'>
                        Baggage
                      </Card.Text>
                      <Card.Text className='d-flex align-items-center bus-category-text first-text'>
                        <img src={checkCircle} className="category-icons" />7kgs Cabin Baggage
                      </Card.Text>
                      <Card.Text className='d-flex align-items-center bus-category-text'>
                        <img src={checkCircle} className="category-icons" />15kgs Check-in Baggage
                      </Card.Text>

                      <Card.Text className='bus-category-title'>
                        Flexibility
                      </Card.Text>
                      <Card.Text className='bus-category-text'>
                        <img src={minusCircle} className="category-icons" />Cancellation fee starts at 50$
                      </Card.Text>

                      <Card.Text className='bus-category-title'>
                        Seats, Meals & More
                      </Card.Text>
                      <Card.Text className='bus-category-text first-text'>
                        <img src={minusCircle} className="category-icons" />Chargeable Seats
                      </Card.Text>
                      <Card.Text className='bus-category-text'>
                        <img src={minusCircle} className="category-icons" />Chargeable Meals
                      </Card.Text>
                      <div className="d-flex fullWidth justify-content-end align-items-end">
                        <Button variant="primary" onClick={() => handlePurchase(selectedBus.busTripsId, selectedBus.reservation)}>Purchase</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Modal.Body>
              <Modal.Footer className='custom-modal-footer'></Modal.Footer>
            </Modal>}
          </Row>

          <Row>
            <CustomPagination totalUsers={busData.length} usersPerPage={busTripsPerPage} setTheCurrentPage={setCurrentPage} currentPage={currentPage} />
          </Row>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>

  )
}

export default Bus;