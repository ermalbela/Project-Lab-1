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
        <Col md={12}>
          <div className="d-flex justify-content-between mb-5">
            <h2 className='customized-text'>Buses</h2>
            <div className="sort-dropdown">
              <span>Sorted By:</span>
                <DropdownButton
                    id='dropdown-basic-button'
                    title={`${sortKey === 'reservation' ? 'Reservation' : sortKey === 'ticketPrice' ? 'Price' : 'Tickets Left'}`}
                    onSelect={handleSelect}
                >
                    <DropdownItem eventKey="reservation">Reservation</DropdownItem>
                    <DropdownItem eventKey="ticketPrice">Price</DropdownItem>
                    <DropdownItem eventKey="ticketsAvailable">Tickets Left</DropdownItem>
                </DropdownButton>
            </div>
            <DropdownButton title="Passengers" show={showDropdown} onClick={toggleDropdown}>
              {Object.keys(passengerCounts).map(type => (
                <DropdownItem key={type} onClick={e => handleMenuClick(e)}>
                  <Button size="sm" variant="outline-success" className="rounded-circle" onClick={e => handleItemClick(type, 'increment', e)}>+</Button>
                  {type.charAt(0).toUpperCase() + type.slice(1) + ":" + passengerCounts[type]}
                  <Button size="sm" variant="outline-danger" className="rounded-circle" disabled={passengerCounts[type] <= 0} onClick={e => handleItemClick(type, 'decrement', e)}>-</Button>
                </DropdownItem>
              ))}
            </DropdownButton>
          </div>
          {/* ===============================MAPPING OVER THE busData HERE=============================== */}
          {filteredPaginationBusTrips.length >= 1 ? filteredPaginationBusTrips.map((bus, idx) => {
            const date = new Date(bus.reservation);
            const options = { month: 'long', day: 'numeric'};
            const formattedDate = date.toLocaleDateString('en-US', options);
            

          // --------------How a bus item should look like----------
            return (
              <div className="timeline-container" key={idx}>
                <div className="event">
                  <div className="event-date customized-text">{formattedDate}</div>
                  <div className="timeline-content d-flex justify-content-between">
                    <Row className="d-flex align-items-center justify-content-between fullWidth">
                      <Col className='d-flex align-items-center'>
                        <img src={busIcon} className='plane-icon'/>
                        <div className='d-flex align-items-center flex-column'>
                          <h5>{bus.name}</h5>
                          <h6 className='text-muted'>Bus ID: {bus.busId}</h6>
                        </div>
                      </Col>
                      <Col xs={4} className='d-flex align-items-center justify-content-center'>
                        <div className='d-flex align-items-center flex-column justify-content-center' style={{width: '45%'}}>
                          <h5 className="text-center fullWidth">{bus.origin} &nbsp;</h5>
                          <h6 className="text-center">{bus.departureTime.slice(0, 5)} &nbsp;</h6>
                        </div>
                        <svg viewBox="0 0 33 12" role="img" className="svg-icon svg-fill icon__arrow--big--toright" style={{width: "10%", height: "20px", marginBottom: '4px'}}><path pid="0" d="m32.403 5.709.005-.008-2.84-4.944a.568.568 0 0 0-.77-.195.548.548 0 0 0-.198.757l2.34 4.11H1.063a.557.557 0 0 0-.562.553c0 .306.252.553.562.553h29.879l-2.343 4.138a.549.549 0 0 0 .199.757.567.567 0 0 0 .77-.196l2.841-4.971a.544.544 0 0 0-.006-.554z" fillRule="evenodd"></path></svg>
                        <div className='d-flex align-items-center flex-column' style={{width: '45%'}}>
                          <h5 className="text-center fullWidth">&nbsp; {bus.destination}</h5>
                          <h6 className="text-center">&nbsp; {bus.arrivalTime.slice(0, 5)}</h6>
                        </div>
                      </Col>
                      {/* ===============================TICKET FUNCTIONALITY BUTTON=============================== */}
                      <Col className="d-flex justify-content-end align-items-center">
                        <h5 style={{marginBottom: '0px'}}>{bus.ticketPrice.toFixed(2)}$<span style={{fontSize: '14px'}}>(per adult)</span> &nbsp;</h5>
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                          <h6 className='text-muted customized-font-size'>({bus.ticketsAvailable} Tickets Left)</h6>
                          <Button onClick={() => handleClick(bus)}>View Prices</Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            )
          })
          : <h3 className="h-100 justify-content-center align-items-end d-flex">There is no bus trips in this date...</h3>}
          {selectedBus && <Modal size="md" show={show} onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-lg" scrollable>
            <Modal.Header className='custom-modal-header justify-content-between align-items-center'>
              <Modal.Title><span className="vip-category-text">1 FARE OPTION</span> Avaliable For Your Trip</Modal.Title>
              <h5>Price calculated for: (Adults: {passengerCounts['adult']} Children: {passengerCounts['child']} Infant: {passengerCounts['infant']})</h5>
            </Modal.Header>
            <Modal.Body className='row'>
              <Col>
                <Card className='h-100'>
                  <Card.Header className=" d-flex justify-content-center">
                    <p className='custom-price'>{totalPrice().toFixed(2)}$</p> Standard Category 
                  </Card.Header>
                  <Card.Body className=' d-flex justify-content-center flex-column align-items-center'>
                    <Card.Text className='bus-category-title'>
                      Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center bus-category-text first-text'>
                      <img src={checkCircle} className="category-icons"/>7kgs Cabin Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center bus-category-text'>
                      <img src={checkCircle} className="category-icons"/>15kgs Check-in Baggage
                    </Card.Text>

                    <Card.Text className='bus-category-title'>
                      Flexibility
                    </Card.Text>
                    <Card.Text className='bus-category-text'>
                      <img src={minusCircle} className="category-icons"/>Cancellation fee starts at 50$
                    </Card.Text>

                    <Card.Text className='bus-category-title'>
                      Seats, Meals & More
                    </Card.Text>
                    <Card.Text className='bus-category-text first-text'>
                      <img src={minusCircle} className="category-icons"/>Chargeable Seats
                    </Card.Text>
                    <Card.Text className='bus-category-text'>
                      <img src={minusCircle} className="category-icons"/>Chargeable Meals
                    </Card.Text>
                    <div className="d-flex fullWidth justify-content-end align-items-end">
                      <Button variant="primary" onClick={() => handlePurchase(selectedBus.busTripsId, selectedBus.reservation)}>Purchase</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Modal.Body>
            <Modal.Footer className='custom-modal-footer'></Modal.Footer>
          </Modal>
          }
        </Col>
        <Col className='d-flex justify-content-end align-content-end'>
          <CustomPagination totalUsers={busData.length} usersPerPage={busTripsPerPage} setTheCurrentPage={setCurrentPage} currentPage={currentPage}/>
        </Col>
      </Row>
    </Container>
  )
}

export default Bus;