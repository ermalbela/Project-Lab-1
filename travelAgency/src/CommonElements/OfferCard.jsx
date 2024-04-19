import React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText } from 'react-bootstrap';
import travel from '../assets/images/travel.webp'

const OfferCard = ({props}) => {
  return (
    <>
      <Card className='offer-card'>
        <CardImg variant="top" src={props.img || ''} />
        <CardBody>
          <CardTitle>{props.originCountry.value +  ' -> ' + props.destinationCountry.value}</CardTitle>
          <CardText as="h3">{props.text}</CardText>
        </CardBody>
      </Card>
    </>
  )
}

export default OfferCard;