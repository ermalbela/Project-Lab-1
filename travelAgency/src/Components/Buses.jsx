import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Button, Modal, Card, DropdownButton, DropdownItem } from 'react-bootstrap';
import busIcon from '../assets/images/busIcon.png';
import axios from 'axios';
import { purchaseBus } from '../Endpoint';
import Swal from 'sweetalert2';
import Loader from '../Layout/Loader';
import BusContext from '../_helper/BusContext';
import checkCircle from '../assets/images/check-circle.png';
import minusCircle from '../assets/images/minus-circle.png';
import useQuicksort from '../_helper/useQuicksort';


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
    console.log(bus);
    setShow(true);
    setselectedBus(bus);
  }

  const [sortKey, setSortKey] = useState('reservation');

  const sortedbuss = useQuicksort(busData, sortKey);
  

  const handlePurchase = (busId, category, reservation) => {
    const Name = JSON.parse(localStorage.getItem('name'));
    const Id = JSON.parse(localStorage.getItem('userId'));
    const validNum = [busId];
    const passengerCountsArr = Object.values(passengerCounts);
    console.log(passengerCountsArr);
    

    axios.post(purchaseBus, {busId: validNum, User: {Name, Id}, Adults: passengerCounts['adult'], Category: category, Children: passengerCounts['child'], Infant: passengerCounts['infant'], Reservation: reservation}, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
      .then(res => {
        Swal.fire(res.data.message, '', 'success');
        console.log(res)
      })
      .catch(err => {
        console.log(err);
        if(!err.response){
          Swal.fire('Error, No Server Response!', '', 'error');
        } else if (err.response?.status === 401) {
          Swal.fire('Unauthorized!!!', '', 'error');
        } else if(err.response.data){
          Swal.fire(err.response.data, '','error');
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
                    <DropdownItem eventKey="ticketsLeft">Tickets Left</DropdownItem>
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
          {sortedbuss.map((bus, idx) => {
            const date = new Date(bus.reservation);
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
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
                          <h5 className="text-center fullWidth">{bus.originCountry} &nbsp;</h5>
                          <h6 className="text-center">{bus.departure.slice(0, 5)} &nbsp;</h6>
                        </div>
                        <svg viewBox="0 0 33 12" role="img" className="svg-icon svg-fill icon__arrow--big--toright" style={{width: "10%", height: "20px", marginBottom: '4px'}}><path pid="0" d="m32.403 5.709.005-.008-2.84-4.944a.568.568 0 0 0-.77-.195.548.548 0 0 0-.198.757l2.34 4.11H1.063a.557.557 0 0 0-.562.553c0 .306.252.553.562.553h29.879l-2.343 4.138a.549.549 0 0 0 .199.757.567.567 0 0 0 .77-.196l2.841-4.971a.544.544 0 0 0-.006-.554z" fillRule="evenodd"></path></svg>
                        <div className='d-flex align-items-center flex-column' style={{width: '45%'}}>
                          <h5 className="text-center fullWidth">&nbsp; {bus.destinationCountry}</h5>
                          <h6 className="text-center">&nbsp; {bus.arrival.slice(0, 5)}</h6>
                        </div>
                      </Col>
                      {/* ===============================TICKET FUNCTIONALITY BUTTON=============================== */}
                      <Col className="d-flex justify-content-end align-items-center">
                        <h5 style={{marginBottom: '0px'}}>{bus.ticketPrice.toFixed(2)}$<span style={{fontSize: '14px'}}>(per adult)</span> &nbsp;</h5>
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                          <h6 className='text-muted'>({bus.ticketsLeft} Tickets Left)</h6>
                          <Button onClick={() => handleClick(bus)}>View Prices</Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            )
          })}
          {selectedBus && <Modal size="xl" show={show} onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-lg" scrollable>
            <Modal.Header className='custom-modal-header justify-content-between align-items-center'>
              <Modal.Title><span className="vip-category-text">3 FARE OPTIONS</span> Avaliable For Your Trip</Modal.Title>
              <h5>Price calculated for: (adults: {passengerCounts['adult']} children: {passengerCounts['child']} infant: {passengerCounts['infant']})</h5>
            </Modal.Header>
            <Modal.Body className='row'>
              <Col>
                <Card style={{height: '100%'}}>
                  <Card.Header>
                    <p className='custom-price'>{totalPrice().toFixed(2)}$</p> Standard Category 
                  </Card.Header>
                  <Card.Body>
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
                      <img src={minusCircle} className="category-icons"/>Cancellation fee starts at 50$ (up to 3 hours before departure)
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
                    <div className="d-flex fullWidth justify-content-end align-items-end" style={{height: '36.5%'}}>
                      <Button variant="primary" onClick={() => handlePurchase(selectedBus.busId, 'Standard', selectedBus.reservation)}>Purchase</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card style={{height: '100%'}}>
                  <Card.Header>
                    <p className='custom-price'>{(totalPrice() * 1.5).toFixed(2)}$</p> Standard+ Category 
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className='bus-category-title'>
                      Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center bus-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/>7kgs Cabin Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center bus-category-text'>
                      <img src={checkCircle} style={{width: '17px'}}/>20kgs Check-in Baggage
                    </Card.Text>

                    <Card.Text className='bus-category-title'>
                      Flexibility
                    </Card.Text>
                    <Card.Text className='bus-category-text'>
                      <img src={minusCircle} style={{width: '17px'}}/>Cancellation fee starts at 50$ (up to 3 hours before departure)
                    </Card.Text>

                    <Card.Text className='bus-category-title'>
                      Seats, Meals & More
                    </Card.Text>
                    <Card.Text className='bus-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Free</span> Seats
                    </Card.Text>
                    <Card.Text className='bus-category-text'>
                      <img src={minusCircle} style={{width: '17px'}}/>Chargeable Meals
                    </Card.Text>
                    <div className="d-flex fullWidth justify-content-end align-items-end" style={{height: '36.5%'}}>
                      <Button variant="primary" onClick={() => handlePurchase(selectedBus.busId, 'Standard+', selectedBus.reservation)}>Purchase</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Header className='vip-header'>
                    <p className='custom-price'>{(totalPrice() * 2).toFixed(2)}$</p> VIP Category
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className='bus-category-title'>
                      Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center bus-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/>7kgs Cabin Baggage
                    </Card.Text>
                    <Card.Text className='d-flex align-items-center bus-category-text'>
                      <img src={checkCircle} style={{width: '17px'}}/>25kgs Check-in Baggage
                    </Card.Text>

                    <Card.Text className='bus-category-title'>
                      Flexibility
                    </Card.Text>
                    <Card.Text className='bus-category-text'>
                      <img src={minusCircle} style={{width: '17px'}}/>Lower Cancellation fee 20$ (up to 3 hours before departure)
                    </Card.Text>

                    <Card.Text className='bus-category-title'>
                      Seats, Meals & More
                    </Card.Text>
                    <Card.Text className='bus-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Free</span> Seats
                    </Card.Text>
                    <Card.Text className='bus-category-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Complimentary</span> Meals
                    </Card.Text>

                    <Card.Text className='bus-category-title'>
                      Exclusive Benefits
                    </Card.Text>
                    <Card.Text className='bus-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Free</span> Express Check-in
                    </Card.Text>
                    <Card.Text className='bus-category-text first-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Free</span> Priority Boarding
                    </Card.Text>
                    <Card.Text className='bus-category-text'>
                      <img src={checkCircle} style={{width: '17px'}}/><span className='vip-category-text'>Free</span> Delayed & lost Baggage Protection Service
                    </Card.Text>
                    <div className="d-flex fullWidth justify-content-end align-items-end">
                      <Button variant="primary" onClick={() => handlePurchase(selectedBus.busId, 'VIP', selectedBus.reservation)}>Purchase</Button>
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

export default Bus;