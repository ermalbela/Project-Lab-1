import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { cancelBusTrip, cancelFlight, singleUser } from '../Endpoint'
import {Card, CardBody, CardHeader, Row, Col, Button} from 'react-bootstrap';
import deleteIcon from '../assets/images/delete.png';
import Loader from '../Layout/Loader';
import Swal from 'sweetalert2';

const MyStatus = () => {
  const [userData, setUserData] = useState(null); // State to hold user data
  const [flightTicketData, setFlightTicketData] = useState(null);
  const [busTripsTicketData, setBusTripsTicketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(singleUser + JSON.parse(localStorage.getItem('userId')), {
        headers: {
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      });
      
      console.log(response.data);
      setUserData(response.data);
      setFlightTicketData(response.data?.flightTicket);
      setBusTripsTicketData(response.data?.busTicket);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false); // Set loading state to false when done
    }
  }

  useEffect(() => {
    getData();
  }, []);


  const handleFlightCancel = () => {
    Swal.fire({
      title: "Are you sure you wanna cancel this flight?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(cancelFlight + JSON.parse(localStorage.getItem('userId')), {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        })
        .then(() => {
          getData();
          Swal.fire({
            title: "Deleted!",
            text: "Flight has been canceled.",
            icon: "success"
          });
        })
        
      }
    });
  }

  const handleBusTripCancel = () => {
    Swal.fire({
      title: "Are you sure you wanna cancel this bus trip?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(cancelBusTrip + JSON.parse(localStorage.getItem('userId')), {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        })
        .then(() => {
          getData();
          Swal.fire({
            title: "Deleted!",
            text: "Bus trip has been canceled.",
            icon: "success"
          });
        })
        
      }
    });
  }

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="title">
        <h2>Bookings</h2>
      </div>
      <Card>
        <CardHeader>
         <h3>Bookings & Check-ins</h3>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <Card className='h-100'>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title className='text-start mb-3'>Your Flight Ticket</Card.Title>
                    {flightTicketData && <Card.Title>
                      <div className="d-flex justify-content-end">
                        <Button className="action-buttons" onClick={() => handleFlightCancel()}><img src={deleteIcon} alt="edit icon" /></Button>
                      </div>
                    </Card.Title>}
                  </div>

                  {flightTicketData !== null && userData !== null ?
                    <ul className="list-unstyled mt-3">
                      <li><strong>Name:</strong> {userData.userName}</li>
                      <li><strong>Origin Country:</strong> {flightTicketData.flight.originCountry}</li>
                      <li><strong>Destination Country:</strong> {flightTicketData.flight.destinationCountry}</li>
                      <li><strong>Adults:</strong> {flightTicketData.adults}</li>
                      <li><strong>Category:</strong> {flightTicketData.category}</li>
                      <li><strong>Children:</strong> {flightTicketData.children}</li>
                      <li><strong>Infant:</strong> {flightTicketData.infant}</li>
                      <li><strong>Reservation:</strong> {new Date(flightTicketData.reservation).toLocaleString()}</li>
                      <li><strong>Price:</strong> {flightTicketData.flight.ticketPrice}$</li>
                      {/* Add more details as needed */}
                    </ul>
                    :
                    <div className='d-flex justify-content-center align-items-center h-100'>
                      <h5>User {userData.userName} hasn't purchased a flight ticket yet!</h5>
                    </div>
                  }
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='h-100'>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title className='text-start mb-3'>Your Bus Trip Ticket</Card.Title>
                    {busTripsTicketData && <Card.Title>
                      <div className="d-flex justify-content-end">
                        <Button className="action-buttons" onClick={() => handleBusTripCancel()}><img src={deleteIcon} alt="edit icon" /></Button>
                      </div>
                    </Card.Title>}
                  </div>

                  {busTripsTicketData !== null && userData !== null ?
                    <ul className="list-unstyled mt-3">
                      <li><strong>Name:</strong> {userData.userName}</li>
                      <li><strong>Origin Country:</strong> {busTripsTicketData.busTrips.origin}</li>
                      <li><strong>Destination Country:</strong> {busTripsTicketData.busTrips.destination}</li>
                      <li><strong>Adults:</strong> {busTripsTicketData.numberOfAdults}</li>
                      <li><strong>Children:</strong> {busTripsTicketData.numberOfChildren}</li>
                      <li><strong>Infant:</strong> {busTripsTicketData.numberOfInfants}</li>
                      <li><strong>Reservation:</strong> {new Date(busTripsTicketData.reservationDate).toLocaleString()}</li>
                      <li><strong>Price:</strong> {busTripsTicketData.busTrips.ticketPrice}$</li>
                      {/* Add more details as needed */}
                    </ul>
                    :
                    <div className='d-flex justify-content-center align-items-center h-100'>
                      <h5>User {userData.userName} hasn't purchased a bus trip ticket yet!</h5>
                    </div>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}

export default MyStatus
