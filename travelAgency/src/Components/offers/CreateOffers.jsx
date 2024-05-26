import React, { useState } from 'react';
import { Button, Form, Image } from 'react-bootstrap';

const CreateOffers = () => {
  const [photoSelected, setPhotoSelected] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [input, setInput] = useState({
    title: '',
    destinationName: '',
    overview: '',
    hotel: '',
    hotelOverview: '',
    oldPrice: 0,
    price: 0,
    phone: '',
    email: '',
    address: '',
  });

  const handleInputChange = (name, value) => {
    setInput({ ...input, [name]: value });
  };

  const handleAddPhoto = () => {
    if (currentPhoto) {
      setPhotoSelected([...photoSelected, currentPhoto]);
      setCurrentPhoto('');
    }
  };

  const handleRemovePhoto = index => {
    setPhotoSelected(photoSelected.filter((_, i) => i !== index));
  };

  const handleSubmit = e => {
    e.preventDefault();

    setPhotoSelected([]);
  };

  console.log('inpuit', input);

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='title'>
          <Form.Label>Title</Form.Label>
          <Form.Control
            name='title'
            type='text'
            placeholder='Exotic Bali Getaway'
            onChange={e => handleInputChange('title', e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='destination'>
          <Form.Label>Destination Name</Form.Label>
          <Form.Control
            name='destinationName'
            type='text'
            placeholder='Ex. London'
            onChange={e => handleInputChange('destinationName', e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='overview'>
          <Form.Label>Overview</Form.Label>
          <Form.Control
            name='overview'
            as='textarea'
            rows={3}
            placeholder='Ex. About that places'
            onChange={e => handleInputChange('overview', e.target.value)}
          />
        </Form.Group>
        <h4 style={{ marginTop: '10px' }}>Accommodations Information</h4>
        <Form.Group controlId='hotel'>
          <Form.Label>Hotel</Form.Label>
          <Form.Control
            name='hotel'
            type='text'
            placeholder='Hotel name...'
            onChange={e => handleInputChange('hotel', e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='hotelOverview'>
          <Form.Label>Hotel Overview</Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            placeholder='Ex. Hotel overview'
            onChange={e => handleInputChange('hotelOverview', e.target.value)}
            name='hotelOverview'
          />
        </Form.Group>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
          <Form.Group controlId='photo'>
            <Form.Label>Add photo</Form.Label>
            <Form.Control
              onChange={e => setCurrentPhoto(e.target.value)}
              type='text'
              placeholder='Ex. Link'
            />
          </Form.Group>
          <Button
            variant='primary'
            onClick={handleAddPhoto}
            style={{ marginTop: '10px' }}>
            Add
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
          {photoSelected.map((item, index) => (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Image
                style={{ marginTop: '10px' }}
                src={item}
                width={150}
                height={150}
              />
              <Button
                variant='danger'
                onClick={() => handleRemovePhoto(index)}
                style={{ marginLeft: '10px' }}>
                Remove
              </Button>
            </div>
          ))}
        </div>

        <h4 style={{ marginTop: '10px' }}>Prices</h4>

        <Form.Group controlId='oldPrice'>
          <Form.Label>Old Price</Form.Label>
          <Form.Control
            type='number'
            placeholder='Ex. 3000'
            name='oldPrice'
            onChange={e => handleInputChange('oldPrice', e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='price'>
          <Form.Label>Price</Form.Label>
          <Form.Control
            type='number'
            placeholder='Ex. 3000'
            name='price'
            onChange={e => handleInputChange('price', e.target.value)}
          />
        </Form.Group>

        <h4 style={{ marginTop: '10px' }}>Contact Information</h4>

        <Form.Group controlId='phone'>
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ex. +38344333222'
            name='phone'
            onChange={e => handleInputChange('phone', e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ex. john.do@example.com'
            name='email'
            onChange={e => handleInputChange('email', e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ex. Travel Lane...'
            name='address'
            onChange={e => handleInputChange('address', e.target.value)}
          />
        </Form.Group>
        <Button type='submit' variant='primary'>
          Create
        </Button>
      </Form>
    </div>
  );
};

export default CreateOffers;
