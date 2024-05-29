import React, { useContext, useState, useEffect } from 'react';
import {Row, Col, DropdownButton, DropdownItem, Button, Modal, Form, FormGroup, FormControl, FormLabel, Card, Container} from 'react-bootstrap';
import { countries } from '../Menu';
import MySelect from './MySelect';
import {components} from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import travel from '../assets/images/travel.webp';
import axios from 'axios';
import OfferCard from '../CommonElements/OfferCard';
import { patterns } from '../Validation';
import { createFlights, filteredFlights, createBuses, filteredTrips, createPlanes } from '../Endpoint';
import moment from 'moment/moment';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import FlightContext from '../_helper/FlightContext';
import AuthContext from '../_helper/AuthContext';
import BusContext from '../_helper/BusContext';
import Loader from '../Layout/Loader';

const Dashboard = () => {

  const {role, setRole} = useContext(AuthContext);

  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [errors, setErrors] = useState({});
  const [createFlight, setCreateFlight] = useState(false);
  const [createPlane, setCreatePlane] = useState(false);
  const [createBus, setCreateBus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initialData = {
    name: '',
    originCountry: '',
    destinationCountry: '',
    departure: '',
    arrival: '',
    tickets: '',
    ticketPrice: '',
    date: ''
  }

  useEffect(() => {
    if(role !== '' && role !== undefined && role){
      setIsLoading(false);
    } else{
      history('/login');
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('userId');
    }
  }, [role, setRole]);
  
  const [flight, setFlight] = useState(initialData);
  const [bus, setBus] = useState(initialData);
  const [plane, setPlane] = useState('');

  const history = useNavigate();

  const {setData} = useContext(FlightContext);
  const {setBusData} = useContext(BusContext);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFlight({...flight, [name]: value})
  }

  const handleBusChange = (e) => {
    const {name, value} = e.target;
    setBus({...bus, [name]: value});
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

  const validate = (vals) => {
    const errors = {};
    if(!patterns.name.test(vals.name)){
      errors.name = 'Enter a valid Company Name!';
    }
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

  

  // =============================POSTING DATA TO BACKEND============================= // 
  const handleClick = async (url, category) => {
    const depDate = new Date(category.departure);
    const timeDeparture = depDate.toLocaleTimeString([], {hour12: false});
    const arrDate = new Date(category.arrival);
    const timeArrival = arrDate.toLocaleTimeString([], { hour12: false });

    setErrors(validate(category));
    if(category.originCountry !== '' && category.destinationCountry !== '' && category.date !== '' && category.tickets !== '' && category.departure !== '' && category.arrival !== '' && category.ticketPrice !== '' && category.name !== ''){
      try{
        console.log(timeDeparture);
        console.log(timeArrival);
        axios.post(url, {Name: category.name, OriginCountry: category.originCountry, DestinationCountry: category.destinationCountry, Reservation: category.date, TicketsLeft: category.tickets, Departure: timeDeparture, Arrival: timeArrival, TicketPrice: category.ticketPrice}, {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        })
          .then(res => {
            console.log(res)
            Swal.fire('Trip Added Successfully', '', 'success');
            setCreateFlight(false);
            setFlight(initialData);
            setCreateBus(false);
            setBus(initialData);
          })
          // .catch(err => {
          //   if(!err.response){
          //     Swal.fire('Error, No Server Response!', '', 'error');
          //     setErrors({globalError: 'Error, No Server Response!'})
          //   } else if (err.response?.status === 401) {
          //     Swal.fire('Unauthorized!!!', '', 'error');
          //   } else{
          //     Swal.fire('Something Went Wrong!', '', 'error');
          //   }
          // });
      } catch(err) {
        console.log(err);
      }
    }     
  }

  const countriesWithLabels = countries.map(country => { //Updating the data so we can use React-Select properly
    return { value: country, label: country };
  });

  const handleSearch = () => {
    if(fromCountry['value'] !== '' && fromCountry['value'] !== undefined && toCountry['value'] !== '' && toCountry['value'] !== undefined && dateRange[0] !== null && dateRange[1] !== null){
      const finalVals = {
        Reservation: moment(dateRange[0]).format('yyyy-MM-DD'),
        // Returning: moment(dateRange[1]).format('yyyy-MM-DD'),
        OriginCountry: fromCountry['value'],
        DestinationCountry: toCountry['value'],
        // Adults: passengerCounts['adult'],
        // Children: passengerCounts['child'],
        // Infant: passengerCounts['infant']
      }
      axios.post(dropdownVal == 'Bus' ? filteredTrips : filteredFlights, finalVals, {
        headers: {
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      })
        .then(res => {
          console.log(res.data)
          if(dropdownVal == 'Bus'){
            setBusData(res.data?.filtered_bus?.result)
            history('/bus');
          } else{
            setData(res.data?.filtered_flights?.result);
            history('/flights');
          }
        })
        .catch(err => {
          if(!err.response){
            Swal.fire('Error, No Server Response!', '', 'error');
            setErrors({globalError: 'Error, No Server Response!'})
          } else if (err.response?.status === 401) {
            Swal.fire('Unauthorized!!!', '', 'error');
          } else{
            Swal.fire('Fetching filtered flights failed, please try again!', '', 'error');
          }
        })
    }
  }


  //=========================ADD RANDOM FLIGHT============================
  const addRandom = async (url) => {
    console.log(url);
    //Countries you wanna add in Origin Country and Destination Country
    const countries = ['Italy', 'Greece', 'Kosovo', 'Albania'];
    let names;
    let ticketPrice;

    if(url == '/api/bus/create_bus'){
      names = ['FlixBus', 'MegaBus', 'HappyBus', 'GreenBus'];
      ticketPrice = (Math.random() * 200 + 40).toFixed(2)
    } else{
      names = ['DeltaAir', 'AirSafe', 'UnitedAir', 'FlixAir'];
      ticketPrice = (Math.random() * 600 + 60).toFixed(2);
    }

    const originCountry = countries[Math.floor(Math.random() * countries.length)];
    let destinationCountry;
    
    do {
      destinationCountry = countries[Math.floor(Math.random() * countries.length)];
    } while (destinationCountry === originCountry);
    
    // Generate random hour and minute for Departure time
    const departureHour = Math.floor(Math.random() * 4) + 20;
    const departureMinute = Math.floor(Math.random() * 4) * 15;
    
    // Generate random hour for Arrival time, making sure it's 2 hours after Departure time
    const arrivalHour = (departureHour + 2) % 24;
    
    // Generate random minute for Arrival time, making sure it's in intervals of 15
    const arrivalMinute = Math.floor(Math.random() * 4) * 15;

    const departureTime = new Date();
    departureTime.setHours(departureHour);
    departureTime.setMinutes(departureMinute);

    const arrivalTime = new Date();
    arrivalTime.setHours(arrivalHour);
    arrivalTime.setMinutes(arrivalMinute);
    
    // Choose a random name from the names array
    const name = names[Math.floor(Math.random() * names.length)];


    const finalData = {
      PlaneId: 1,
      OriginCountry: originCountry,
      DestinationCountry: destinationCountry,
      Reservation: new Date(),
      TicketsLeft: Math.floor(Math.random() * 60) + 60,
      Departure: departureTime.toLocaleTimeString('en-US', { hour12: false }),
      Arrival: arrivalTime.toLocaleTimeString('en-US', { hour12: false }),
      TicketPrice: ticketPrice
    };
    
    axios.post('api/plane/create_plane', {FlightCompanyId: 1, PlaneNumber: 'Plane1'}, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
      .then(res => {
        console.log(res)
        Swal.fire('Trip Added Successfully', '', 'success');
        setCreateFlight(false);
        setFlight(initialData);
        setCreateBus(false);
        setBus(initialData);
      })
      // .catch(err => {
      //   if(!err.response){
      //     Swal.fire('Error, No Server Response!', '', 'error');
      //     setErrors({globalError: 'Error, No Server Response!'})
      //   } else if (err.response?.status === 401) {
      //     Swal.fire('Unauthorized!!!', '', 'error');
      //     history('/login');
      //   } else{
      //     Swal.fire('Something went wrong!', '', 'error');
      //   }
      // })
  }


  // ========================================REVIEWS============================================
  const [reviews, setReviews] = useState([
    // HOW THE DATA SHOULD LOOK FOR REVIEWS
    { name: 'John Doe', review: 'Great service, very satisfied!', rating: 5, date: '2024-05-01', planeNumber: 'AirSafe' },
    { name: 'Jane Smith', review: 'Had an amazing experience!', rating: 4, date: '2024-05-02', planeNumber: 'AirLines' },
    { name: 'Jane Smith', review: 'Had an amazing experience!', rating: 4, date: '2024-05-02', planeNumber: 'AirSafe' }
  ]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          style={{ color: i < rating ? '#ffc107' : '#e4e5e9', fontSize: '2.5rem' }}
        >
          &#9733;
        </span>
      );
    }
    return stars;
  };

  const addPlane = () => {
    axios.post(createPlanes, {PlaneNumber: plane, FlightCompanyId: 1}, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  }

  return isLoading ? (
    <Loader />
  ) : (
    <>
    <Row className='justify-content-between'>
      <Col>
        <DropdownButton id="dropdown-basic-button" className="mb-4 top-button" title={dropdownVal}>
          {['Bus', 'Airplane'].map((item, idx) => <DropdownItem key={idx} onClick={() => setDropdownVal(item)}>{item}</DropdownItem>)}
        </DropdownButton>
      </Col>
      <Col className='d-flex justify-content-between'>
        {role == 'Superadmin' && <Button onClick={() => setCreatePlane(true)} className="top-button superadmin-buttons" style={{height: '39px'}}>Create Plane</Button>}
        {role === 'Admin' || role === 'Superadmin' ? <>
          <Button onClick={() => setCreateFlight(true)} className='top-button admin-buttons' style={{height: '39px', marginRight: '2%'}}>Create Flight</Button>
          <Button onClick={() => setCreateBus(true)} className='top-button admin-buttons' style={{height: '39px'}}>Create Bus Trip</Button>
        </> : ''}
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
          dateFormat="yyyy/MM/dd"
          className="form-control digits"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          placeholderText='Select Date...'
        />
      </Col>
      <Col sm={2} className='d-flex justify-content-end'>
        <Button style={{height: '39px'}} className='top-button' onClick={handleSearch}>Search</Button>
      </Col>
    </Row>

    <Modal size="lg" show={createFlight} onHide={() => setCreateFlight(false)} aria-labelledby="example-modal-sizes-title-lg">
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
          <Col className='d-flex justify-content-between'>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Ticket Price</FormLabel>
              <div className="input-group login-form-inputs">
                  <FormControl className="form-control" type="number" name="ticketPrice" placeholder="e.g. 49.99" value={flight.ticketPrice} onChange={handleChange} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.ticketPrice}</p>
            </FormGroup>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Company Name</FormLabel>
              <div className="input-group login-form-inputs">
                  <FormControl className="form-control" type="text" name="name" placeholder="e.g. AirSafe" value={flight.name} onChange={handleChange} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.name}</p>
            </FormGroup>
          </Col>
          <FormGroup className='formGroup d-flex justify-content-between'>
            <Button className='' variant='danger' onClick={() => addRandom(createFlights)}>ADD RANDOM</Button>
            <Button className="admin-buttons" onClick={() => handleClick(createFlights, flight)}>Create Flight</Button>
          </FormGroup>
        </Form>
      </Modal.Body>
    </Modal>
    
    {/* Bus Modal */}
    <Modal size="lg" show={createBus} onHide={() => setCreateBus(false)} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          Create BusTrip
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="d-flex justify-content-center flex-column">
          <Col className='d-flex justify-content-between'>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Origin Country</FormLabel>
              <div className="input-group login-form-inputs">
                <FormControl className="form-control" type="text" name='originCountry' placeholder="e.g. Kosovo" value={bus.originCountry} onChange={handleBusChange} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.originCountry}</p>
            </FormGroup>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Destination Country</FormLabel>
              <div className="input-group login-form-inputs">
                  <FormControl className="form-control" type="text" name="destinationCountry" placeholder="e.g. Albania" value={bus.destinationCountry} onChange={handleBusChange} />
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
                  selected={bus.departure}
                  onChange={(date) => setBus({...bus, departure: date})}
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
                  selected={bus.arrival}
                  onChange={(date) => setBus({...bus, arrival: date})}
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
                  <FormControl className="form-control" type="number" name="tickets" placeholder="e.g. 50" value={bus.tickets} onChange={handleBusChange} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.tickets}</p>
            </FormGroup>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Departure Date</FormLabel>
              <div className="input-group login-form-inputs">
                <DatePicker className='form-control modal-datepicker' selected={bus.date} onChange={(newDate) => setBus({...bus, date : newDate})} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.date}</p>
            </FormGroup>
          </Col>
          <Col className="d-flex justify-content-between">
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Ticket Price</FormLabel>
              <div className="input-group login-form-inputs">
                  <FormControl className="form-control" type="number" name="ticketPrice" placeholder="e.g. 49.99" value={bus.ticketPrice} onChange={handleBusChange} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.ticketPrice}</p>
            </FormGroup>
            <FormGroup className='formGroup modal-inputs'>
              <FormLabel>Company Name</FormLabel>
              <div className="input-group login-form-inputs">
                  <FormControl className="form-control" type="text" name="name" placeholder="e.g. AirSafe" value={bus.name} onChange={handleBusChange} />
              </div>
              <p className='invalidFeedback fullWidth'>{errors.name}</p>
            </FormGroup>
          </Col>
          <FormGroup className='formGroup d-flex justify-content-between'>
            <Button variant='danger' onClick={() => addRandom(createBuses)}>ADD RANDOM</Button>
            <Button className="admin-buttons" onClick={() => handleClick(createBuses, bus)}>Create BusTrip</Button>
          </FormGroup>
        </Form>
      </Modal.Body>
    </Modal>
    
    {/* PLANE MODAL */}
    <Modal size="sm" show={createPlane} onHide={() => setCreatePlane(false)} aria-labelledby="example-modal-sizes-title-sm">
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          Add Plane
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup className='formGroup modal-inputs'>
          <FormLabel>Plane Number</FormLabel>
          <div className="input-group login-form-inputs">
              <FormControl className="form-control" type="text" name="name" placeholder="e.g. Plane3" value={plane} onChange={e => setPlane(e.target.value)} />
          </div>
          <p className='invalidFeedback fullWidth'>{errors.plane}</p>
        </FormGroup>
        <FormGroup className='formGroup d-flex justify-content-between'>
          <Button className='' variant='danger' onClick={() => addRandom(createFlights)}>ADD RANDOM</Button>
          <Button className="admin-buttons" onClick={() => addPlane()}>Create Flight</Button>
        </FormGroup>
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

    <div className="offers">
      <h2>Reviews</h2>
      <Row className="g-4">
        {reviews.map((review, idx) => (
          <Col key={idx} md={6} lg={4}>
            <Card className="h-100 review-card">
              <Card.Body>
                <Card.Title className='text-start mb-3'>{review.name}</Card.Title>
                <Card.Text>{review.review}</Card.Text>
                <Card.Text>{review.date}</Card.Text>
              </Card.Body>
                <Card.Footer className="text-muted text-center">
                <Card.Text>{review.planeNumber}</Card.Text>
                  {renderStars(review.rating)}
                </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
    </>
  )
}

export default Dashboard;