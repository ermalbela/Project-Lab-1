import React, { useState } from 'react';
import {Row, Col, DropdownButton, DropdownItem, Button, Modal, Form, FormGroup, FormControl, FormLabel} from 'react-bootstrap';
import { countries } from '../Menu';
import MySelect from './MySelect';
import {components} from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import travel from '../assets/images/travel.webp';
import axios from 'axios';
import OfferCard from '../CommonElements/OfferCard';
import { patterns } from '../Validation';
import { createFlights } from '../Endpoint';

const Dashboard = () => {

  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [passengerCounts, setPassengerCounts] = useState({adult: 0, child: 0, infant: 0});
  const [errors, setErrors] = useState({});
  const [createFlight, setCreateFlight] = useState(false);
  const [flight, setFlight] = useState({
    originCountry: '',
    destinationCountry: '',
    departure: '',
    arrival: '',
    tickets: '',
    ticketPrice: '',
    date: ''
  })

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFlight({...flight, [name]: value})
  }

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [dropdownVal, setDropdownVal] = useState('Traveling with');

  const initialValues = [ // How the data should look like for Offers
    {
      originCountry : {
        value: 'Albania', 
        label: 'Albania'
      },
      destinationCountry: {
        value: 'Italy', 
        label: 'Italy'
      },
      text: '49.99$',
      img: travel
    },
    {
      originCountry : {
        value: 'Albania', 
        label: 'Albania'
      },
      destinationCountry: {
        value: 'Italy', 
        label: 'Italy'
      },
      text: '49.99$',
      img: travel
    },
    {
      originCountry : {
        value: 'Albania', 
        label: 'Albania'
      },
      destinationCountry: {
        value: 'Italy', 
        label: 'Italy'
      },
      text: '49.99$',
      img: travel
    },
    {
      originCountry : {
        value: 'Albania', 
        label: 'Albania'
      },
      destinationCountry: {
        value: 'Italy', 
        label: 'Italy'
      },
      text: '49.99$',
      img: travel
    }
  ]

  const Option = props => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  const customStyles = { // Customizing react-select styles 
    valueContainer: (provided) => ({
      ...provided,
      whiteSpace: "nowrap",
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
      backgroundColor: '#F4F6EF',
      cursor: 'text'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      overflow: 'hidden'
    }),
    option: (styles, {isFocused, isSelected}) => {
      return{
        ...styles,
        backgroundColor: isSelected ? '#13294B' : isFocused ? '#cee6e2' : '#F4F6EF',
        color: !isSelected ? '#000' : isSelected || isFocused ? '#F4F6EF' : '',
        borderRadius: '5px'
      }
    },
    dropdownIndicator: (provided) => ({
      ...provided,
      backgroundColor: '#F4F6EF'
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      margin: 0
    }),
    clearIndicator: (provided) => ({
      ...provided,
      backgroundColor: '#F4F6EF'
    }),
    control: (provided) => ({
      ...provided,
      borderColor: 'hsl(0, 0%, 80%);',
      boxShadow: 'none',
      ':hover': {
        borderColor: 'hsl(0, 0%, 80%);',
        boxShadow: 'none'
      }
    }),
  }


  const toggleDropdown = () => {
    setShowDropdown(prevState => !prevState);
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const validate = (vals) => {
    const errors = {};
    if(!patterns.name.test(vals.originCountry)){
      errors.originCountry = 'Enter a valid Origin Country!';
    }
    if(!patterns.name.test(vals.destinationCountry)){
      errors.destinationCountry = 'Enter a valid Destination Country!';
    }
    if(vals.tickets < 50){
      errors.tickets = 'Ticket number should be bigger than 50!';
    }
    if(vals.ticketPrice < 40){
      errors.ticketPrice = 'Ticket price should be bigger than 40!';
    }
    if(vals.date == '' || vals.date == undefined){
      errors.date = 'Please choose a date';
    }
    return errors;
  }

  
  const depDate = new Date(flight.departure);
  const timeDeparture = depDate.toLocaleTimeString([], {hour12: false});
  const arrDate = new Date(flight.arrival);
  const timeArrival = arrDate.toLocaleTimeString([], { hour12: false });

  const handleClick = () => {
    setErrors(validate(flight));
      try{
        axios.post(createFlights, {OriginCountry: flight.originCountry, DestinationCountry: flight.destinationCountry, Reservation: flight.date, TicketsLeft: flight.tickets, Departure: timeDeparture, Arrival: timeArrival, TicketPrice: flight.ticketPrice})
        .then(res => console.log(res));
      } catch(err) {
        console.log(err);
      }

  }

  const countriesWithLabels = countries.map(country => { //Updating the data so we can use React-Select properly
    return { value: country, label: country };
  });

  console.log(timeDeparture);

  return (
    <>
    <Row className='justify-content-between'>
      <Col>
        <DropdownButton id="dropdown-basic-button" className="mb-4 top-button" title={dropdownVal}>
          {['Bus', 'Airplane'].map((item, idx) => <DropdownItem key={idx} onClick={() => setDropdownVal(item)}>{item}</DropdownItem>)}
        </DropdownButton>
    </Col>
    <Col className='d-flex justify-content-between'>
      <Button onClick={() => setCreateFlight(true)} className='top-button admin-buttons' style={{height: '39px'}}>Create Flight</Button>
      <Button style={{height: '39px'}} className='top-button'>Search</Button>
    </Col>
    </Row>
    <Row className="justify-content-center">
      <Col>
        <MySelect
          options={countriesWithLabels || []}
          styles={customStyles}
          closeMenuOnSelect={true}
          hideSelectedOptions={false}
          components={{ Option }}
          onChange={(selected) => {
            setFromCountry(selected);
            console.log(selected);
          }}
          value={fromCountry}
          className="react-select-container"
          classNamePrefix="react-select"
          maxMenuHeight={"200px"}
          placeholder="From..."
          isClearable
        />
      </Col>
      <Col>
        <MySelect
          options={countriesWithLabels || []}
          styles={customStyles}
          closeMenuOnSelect={true}
          hideSelectedOptions={false}
          components={{ Option }}
          onChange={(selected) => {
            setToCountry(selected);
          }}
          value={toCountry}
          className="react-select-container"
          classNamePrefix="react-select"
          maxMenuHeight={"200px"}
          placeholder="To..."
          isClearable
        />
      </Col>
      <Col>
        <DatePicker
          className="form-control digits"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable={true} 
          placeholderText='Select Date...'
        />
      </Col>
      <Col sm={1} className='d-flex justify-content-end'>
        <DropdownButton title="Passengers" show={showDropdown} onClick={toggleDropdown}>
          {Object.keys(passengerCounts).map(type => (
            <DropdownItem key={type} onClick={e => handleMenuClick(e)}>
              <Button size="sm" variant="outline-success" className="rounded-circle" onClick={e => handleItemClick(type, 'increment', e)}>+</Button>
              {type.charAt(0).toUpperCase() + type.slice(1) + ":" + passengerCounts[type]}
              <Button size="sm" variant="outline-danger" className="rounded-circle" disabled={passengerCounts[type] <= 0} onClick={e => handleItemClick(type, 'decrement', e)}>-</Button>
            </DropdownItem>
          ))}
        </DropdownButton>
      </Col>
    </Row>

    <Modal
      size="lg"
      show={createFlight}
      onHide={() => setCreateFlight(false)}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          Create Flight
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="d-flex justify-content-center flex-column">
          <Col className='d-flex justify-content-between'>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Origin Country</FormLabel>
              <div className="input-group login-form-inputs">
                <FormControl className="form-control" type="text" name='originCountry' placeholder="e.g. Kosovo" value={flight.originCountry} onChange={handleChange} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.originCountry}</p>
            </FormGroup>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Destination Country</FormLabel>
              <div className="input-group login-form-inputs">
                  <FormControl className="form-control" type="text" name="destinationCountry" placeholder="e.g. Albania" value={flight.destinationCountry} onChange={handleChange} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.destinationCountry}</p>
            </FormGroup>
          </Col>
          <Col className='d-flex justify-content-between'>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Departure</FormLabel>
              <div className="input-group login-form-inputs">
                <DatePicker
                  className='form-control modal-datepicker'
                  selected={flight.departure}
                  onChange={(date) => setFlight({...flight, departure: date})}
                  showTimeSelect
                  showTimeSelectOnly
                  timeFormat="p"
                  timeIntervals={30}
                  dateFormat="p"
                />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.departure}</p>
            </FormGroup>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Arrival</FormLabel>
              <div className="input-group login-form-inputs">
                <DatePicker
                  className='form-control modal-datepicker'
                  selected={flight.arrival}
                  onChange={(date) => setFlight({...flight, arrival: date})}
                  showTimeSelect
                  showTimeSelectOnly
                  timeFormat="p"
                  timeIntervals={15}
                  dateFormat="p"
                />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.arrival}</p>
            </FormGroup>
          </Col>
          <Col className='d-flex justify-content-between'>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Ticket Amount</FormLabel>
              <div className="input-group login-form-inputs">
                  <FormControl className="form-control" type="number" name="tickets" placeholder="e.g. 50" value={flight.tickets} onChange={handleChange} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.tickets}</p>
            </FormGroup>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Departure Date</FormLabel>
              <div className="input-group login-form-inputs">
                <DatePicker className='form-control modal-datepicker' selected={flight.date} onChange={(newDate) => setFlight({...flight, date : newDate})} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.date}</p>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup className='formGroup'>
              <FormLabel>Ticket Price</FormLabel>
              <div className="input-group login-form-inputs">
                  <FormControl className="form-control" type="number" name="ticketPrice" placeholder="e.g. 49.99" value={flight.ticketPrice} onChange={handleChange} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.ticketPrice}</p>
            </FormGroup>
          </Col>
          <FormGroup className='formGroup d-flex justify-content-end'>
            <Button className="login-btn admin-buttons" onClick={handleClick}>Create Flight</Button>
          </FormGroup>
        </Form>
      </Modal.Body>
    </Modal>
      <div className='offers' style={{margin: '6rem 0 1rem 0'}}>
        <h2>
          Cheap Flight Offers
        </h2>
        <Row className="g-4">
          {initialValues.map((itemProps, idx) => ( //Mapping over offers then returning Cards from OfferCard Component
            <Col key={idx} onClick={() => {
              setFromCountry(itemProps.originCountry);
              setToCountry(itemProps.destinationCountry);
              setDateRange(['04/26/2024', '05/02/2024']);
            }}>
              <OfferCard props={itemProps}/>
            </Col>
            ))}
        </Row>
      </div>
    </>
  )
}

export default Dashboard;