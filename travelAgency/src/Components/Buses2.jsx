import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Loader from '../Layout/Loader';
import BusContext from '../_helper/BusContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const Bus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { busData, setBusData } = useContext(BusContext);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await axios.get('/api/buses'); // Replace with your actual endpoint
        setBusData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false); // Ensure loader hides if there's an error
      }
    };

    fetchBusData();
  }, [setBusData]);

  const handleBusClick = (bus) => {
    setSelectedBus(bus);
  };

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
      <Header />
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <Row>
            <Col md={12}>
              <h2 className='customized-text'>Buses</h2>
              <Row>
                {busData && busData.map((bus, idx) => (
                  <Col md={4} key={idx}>
                    <Card className='mb-4'>
                      <Card.Body>
                        <Card.Title>{bus.name}</Card.Title>
                        <Card.Text>
                          <strong>Origin:</strong> {bus.originCountry} <br />
                          <strong>Destination:</strong> {bus.destinationCountry} <br />
                          <strong>Price:</strong> ${bus.ticketPrice.toFixed(2)}
                        </Card.Text>
                        <Button variant="primary" onClick={() => handleBusClick(bus)}>View Trips</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {selectedBus && (
                <div>
                  <h3>Trips for {selectedBus.name}</h3>
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
      </Container>
      <Footer />
    </div>
  );
};

export default Bus;
