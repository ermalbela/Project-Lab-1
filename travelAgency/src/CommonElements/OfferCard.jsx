import React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText } from 'react-bootstrap';
import rightArrowIcon from '../assets/images/right-arrow.png';

const OfferCard = ({props}) => {
  return (
    <>
      <Card className='offer-card w-100' style={{cursor: 'pointer'}}>
        <CardImg variant="top" src={props.imageSource || ''} style={{borderRadius: '0', height: '148px'}} />
        <CardBody>
          <CardTitle className='text-center d-flex justify-content-center align-items-center'>{props.originCountry} <img src={rightArrowIcon} /> {props.destinationCountry}</CardTitle>
          <CardText as="h5" className="text-center">{props.reservation.slice(0,10)}</CardText>
          <Card.Footer className="text-center bg-white">  
            <CardText as="h5" className='text-start mt-2'>{props.price} $ <span style={{fontSize: '13px'}}>(per person)</span></CardText>
          </Card.Footer>
        </CardBody>
      </Card>
    </>
  )
}

export default OfferCard;