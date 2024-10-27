import React, { useContext } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Col } from 'react-bootstrap';
import rightArrowIcon from '../assets/images/right-arrow.png';
import deleteIcon from '../assets/images/delete.png'
import Swal from 'sweetalert2';
import { deleteOffer, getOffers } from '../Endpoint';
import AuthContext from '../_helper/AuthContext';
import axios from 'axios';
import OfferContext from '../_helper/OfferContext';

const OfferCard = ({props}) => {

  const {role} = useContext(AuthContext);  
  const {setOfferData} = useContext(OfferContext);

  const getOfferData = async () => {
    const response = await axios.get(getOffers, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
    setOfferData(response.data);
  }

  const handleDeleteOffer = id => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(deleteOffer + id , {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        })
        .then(() => {
          getOfferData();
          Swal.fire({
            title: "Deleted!",
            text: "Offer has been deleted.",
            icon: "success"
          });
        })
      }
    });
  }

  return (
    <>
      <Card className='offer-card w-100' style={{cursor: 'pointer'}}>
        <CardImg variant="top" src={props.imageSource || ''} style={{borderRadius: '0', height: '148px'}} />
        <CardBody>
          <CardTitle className='text-center d-flex justify-content-center align-items-center'>
            <Col>
              {props.originCountry}
            </Col> 
            <Col sm={2}>
              <img src={rightArrowIcon} style={{margin: '0 0.4rem'}}/>
            </Col> 
            <Col>
              {props.destinationCountry}
            </Col>
          </CardTitle>
          <CardText as="h5" className="text-center">{props.reservation.slice(0,10)}</CardText>
          <Card.Footer className="d-flex justify-content-between bg-white">  
            <CardText as="h5" className='text-start mt-2'>{props.price} $ </CardText>
            {role == 'Superadmin' ? <Button className="action-buttons" onClick={() => handleDeleteOffer(props.offerId)}><img src={deleteIcon} alt="delete icon" /></Button> : ''}
          </Card.Footer>
        </CardBody>
      </Card>
    </>
  )
}

export default OfferCard;