import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import planeIcon from '../assets/images/plane-icon.png';
import axios from 'axios';
import { getFlights } from '../Endpoint';
import Swal from 'sweetalert2';

const Flights = () => {

  const [data, setData] = useState([]);

  // ===============================FETCHING THE DATA HERE===============================//
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(getFlights);
        console.log(response);
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);


  return (
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
            return(
              <div className="timeline-container" key={idx}>
                <div className="event">
                  <div className="event-date customized-text">{formattedDate}</div>
                  <div className="timeline-content d-flex justify-content-between">
                    <div className="d-flex align-items-center justify-content-between fullWidth">
                      <div className='d-flex'>
                        <img src={planeIcon} className='plane-icon'/>
                        <div className='d-flex align-items-center flex-column'>
                          <h5>AirSafe</h5>
                          <h6 className='text-muted'>Flight ID: {flight.flightId}</h6>
                        </div>
                      </div>
                      <div className='d-flex align-items-center'>
                        <div className='d-flex align-items-center flex-column'>
                          <h5>{flight.originCountry} &nbsp;</h5>
                          <h5>{flight.departure.slice(0, 5)} &nbsp;</h5>
                        </div>
                        <svg viewBox="0 0 33 12" role="img" className="svg-icon svg-fill icon__arrow--big--toright" style={{width: "40px", height: "20px", marginBottom: '4px'}}><path pid="0" d="m32.403 5.709.005-.008-2.84-4.944a.568.568 0 0 0-.77-.195.548.548 0 0 0-.198.757l2.34 4.11H1.063a.557.557 0 0 0-.562.553c0 .306.252.553.562.553h29.879l-2.343 4.138a.549.549 0 0 0 .199.757.567.567 0 0 0 .77-.196l2.841-4.971a.544.544 0 0 0-.006-.554z" fillRule="evenodd"></path></svg>
                        <div className='d-flex align-items-center flex-column'>
                          <h5>&nbsp; {flight.destinationCountry}</h5>
                          <h5>&nbsp; {flight.arrival.slice(0, 5)}</h5>
                        </div>
                      </div>
                      {/* ===============================TICKET FUNCTIONALITY BUTTON=============================== */}
                      <Button>View Prices</Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* <div className="timeline-container">
              <div className="event">
                <div className="event-date customized-text">March 25, 2024</div>
                <div className="timeline-content">
                  <img src={planeIcon} className='plane-icon'/>
                  <h4>Albania &nbsp;</h4>
                  <svg viewBox="0 0 33 12" role="img" className="svg-icon svg-fill icon__arrow--big--toright" style={{width: "40px", height: "20px", marginBottom: '4px'}}><path pid="0" d="m32.403 5.709.005-.008-2.84-4.944a.568.568 0 0 0-.77-.195.548.548 0 0 0-.198.757l2.34 4.11H1.063a.557.557 0 0 0-.562.553c0 .306.252.553.562.553h29.879l-2.343 4.138a.549.549 0 0 0 .199.757.567.567 0 0 0 .77-.196l2.841-4.971a.544.544 0 0 0-.006-.554z" fillRule="evenodd"></path></svg>
                  <h4>&nbsp; Kosovo</h4>
                </div>
              </div>
          </div> */}
        </Col>
      </Row>
    </Container>
  )
}

export default Flights;