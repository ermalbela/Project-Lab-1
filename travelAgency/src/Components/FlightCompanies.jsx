import axios from 'axios';
import React, { useState } from 'react'
import { deletePlane, editPlane, getFlightCompanies } from '../Endpoint';
import { Button, Card, Col, Row } from 'react-bootstrap';

const FlightCompanies = () => {

  const [data, setData] = useState([]);
  const [Plane, setPlane] = useState({PlaneNumber: 'A3AC7', PlaneId: 1});

  const handleClick = async () => {
    console.log(123);

    const response = await axios.get(getFlightCompanies);

    setData(response.data);
  }

  const handleDelete = id => {
    axios.delete(deletePlane + id)
    .then(res => console.log(res.data))
  }

  const handleEdit = (id) => {
    axios.put(editPlane + id, {PlaneNumber: Plane.PlaneNumber, PlaneId: Plane.PlaneId})
    .then(res => res.data)

  }

  return (
    <>
      <Row>
        <Col className='justify-content-between'>
          <h2>Flight Companies and Their Planes</h2>
        </Col>
      </Row>
      <div className="offers">
        <Row className="g-4">
          {data.map((company) => (
            <Col key={company.flightCompanyId} md={6} lg={4}>
              <Card className="h-100 review-card">
                <Card.Body>
                  <Card.Title className='text-start mb-3'>{company.flightCompany}</Card.Title>
                  {company.planes.map(plane => (
                    <Card.Footer className="text-muted d-flex justify-content-around" key={plane.planeId}>
                      <h5 className='d-flex align-items-center p-0 m-0'>Plane Number: {plane.planeNumber}</h5>
                      <Button variant='danger' onClick={() => handleDelete(plane.planeId)}>Delete</Button>
                      <Button variant='warning' onClick={() => handleEdit(plane.planeId, plane)}>Edit</Button>
                    </Card.Footer>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <br />
      <Button onClick={() => handleClick()}>Fetch Planes</Button>
    </>
  )
}

export default FlightCompanies
