import React, { useContext, useState, useEffect } from 'react';
import {Row, Col, DropdownButton, DropdownItem, Button, Modal, Form, FormGroup, FormControl, FormLabel, Card, CardBody, CardHeader, DropdownMenu} from 'react-bootstrap';
import { countries } from '../Menu';
import MySelect from '../CommonElements/MySelect';
import {components} from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import travel from '../assets/images/travel.webp';
import axios from 'axios';
import OfferCard from '../CommonElements/OfferCard';
import { patterns } from '../Validation';
import { createFlights, filteredFlights, createBuses, filteredTrips, createPlanes, getPlanes, addBusCompany, getBuses } from '../Endpoint';
import moment from 'moment/moment';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import FlightContext from '../_helper/FlightContext';
import AuthContext from '../_helper/AuthContext';
import BusContext from '../_helper/BusContext';
import Loader from '../Layout/Loader';
import germany from '../assets/images/germany.jpg'
import turkey from '../assets/images/turkey.jpg'
import greece from '../assets/images/greece.jpg'

const Dashboard = () => {

  const {role, setRole} = useContext(AuthContext);

  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [errors, setErrors] = useState({});
  const [createFlight, setCreateFlight] = useState(false);
  const [createBus, setCreateBus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlane, setSelectedPlane] = useState('Select Plane');
  const [selectedBus, setSelectedBus] = useState('Select Bus');

  const initialData = {
    originCountry: '',
    destinationCountry: '',
    departure: '',
    arrival: '',
    tickets: '',
    ticketPrice: '',
    date: '',
    planeNum: []
  }
  const initialBusData = {
    originCountry: '',
    destinationCountry: '',
    departure: '',
    arrival: '',
    tickets: '',
    ticketPrice: '',
    date: '',
    busNum: []
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
  const [bus, setBus] = useState(initialBusData);
  
  const getPlaneData = async () => {
    const response = await axios.get(getPlanes, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })

    setFlight(prev => ({...prev, planeNum: response.data}));
  }

  const getBusData = async () => {
    const response = await axios.get(getBuses, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })

    setBus(prev => ({...prev, busNum: response.data}));
  }

  useEffect(() => {
    getPlaneData();
    getBusData();
  }, []);

 

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
  const [startDate, setStartDate] = useState(null);
  const [dropdownVal, setDropdownVal] = useState('Traveling with');

  const initialValues = [ // How the data should look like for Offers
    {
      originCountry : {
        value: 'Kosovo', 
        label: 'Kosovo'
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
        value: 'Kosovo', 
        label: 'Kosovo'
      },
      destinationCountry: {
        value: 'Greece', 
        label: 'Greece'
      },
      text: '79.99$',
      img: greece
    },
    {
      originCountry : {
        value: 'Kosovo', 
        label: 'Kosovo'
      },
      destinationCountry: {
        value: 'Turkey', 
        label: 'Turkey'
      },
      text: '99.99$',
      img: turkey
    },
    {
      originCountry : {
        value: 'Kosovo', 
        label: 'Kosovo'
      },
      destinationCountry: {
        value: 'Germany', 
        label: 'Germany'
      },
      text: '99.99$',
      img: germany
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
      WebkitOverflowScrolling: "touch"
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      overflow: 'hidden'
    }),
    option: (styles, {isFocused, isSelected}) => {
      return{
        ...styles,
        backgroundColor: isSelected ? '#6ea4c2' : isFocused ? '#cee6e2' : '#fff',
        color: !isSelected ? '#000' : isSelected || isFocused ? '#000' : '',
        borderRadius: '5px'
      }
    }
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
    if(vals.selectedPlane == undefined || vals.selectedPlane == 0 || vals.selectedPlane == 'Select Plane'){
      errors.selectedPlane = 'Please choose a Plane';
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
    if(category.originCountry !== '' && category.destinationCountry !== '' && category.date !== '' && category.tickets !== '' && category.departure !== '' && category.arrival !== '' && category.ticketPrice !== '' && category.selectedPlane !== ''){
        axios.post(url, {PlaneId: category.selectedPlane, OriginCountry: category.originCountry, DestinationCountry: category.destinationCountry, Reservation: category.date, TicketsLeft: category.tickets, Departure: timeDeparture, Arrival: timeArrival, TicketPrice: category.ticketPrice}, {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        })
          .then(res => {
            Swal.fire('Trip Added Successfully', '', 'success');
            setCreateFlight(false);
            setFlight(initialData);
            setCreateBus(false);
            setBus(initialData);
          })
          .catch(err => {
            Swal.fire(err.response?.data?.message || 'Something went wrong', '', 'error');
          })
    }     
  }

  //Create Bus
  const handleBusClick = async () => {
    const depDate = new Date(bus.departure);
    const timeDeparture = depDate.toLocaleTimeString([], {hour12: false});
    const arrDate = new Date(bus.arrival);
    const timeArrival = arrDate.toLocaleTimeString([], { hour12: false });

    setErrors(validate(bus));
    if(bus.originCountry !== '' && bus.destinationCountry !== '' && bus.date !== '' && bus.tickets !== '' && bus.departure !== '' && bus.arrival !== '' && bus.ticketPrice !== '' && bus.selectedBus !== ''){
        axios.post(createBuses, {BusId: bus.selectedBus, Origin: bus.originCountry, Destination: bus.destinationCountry, Reservation: bus.date, TicketsAvailable: bus.tickets, DepartureTime: timeDeparture, ArrivalTime: timeArrival, TicketPrice: bus.ticketPrice}, {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        })
          .then(res => {
            Swal.fire('Bus Trip Added Successfully', '', 'success');
            setCreateBus(false);
            setBus(initialBusData);
          })
          // .catch(err => {
          //   if(!err.response){
          //     Swal.fire('Error, No Server Response!', '', 'error');
          //   } else if (err.response?.status === 401) {
          //     Swal.fire('Unauthorized!!!', '', 'error');
          //     history('/');
          //   } else{
          //     Swal.fire(err.response?.data || 'Something Went Wrong!', '', 'error');
          //   }
          // });
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
        Origin: fromCountry['value'],
        DestinationCountry: toCountry['value'],
        Destination: toCountry['value'],
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
          if(dropdownVal == 'Bus'){
            setBusData(res.data?.filtered_buses);
            history('/bus');
          } else{
            setData(res.data?.filtered_flights);
            history('/flights');
          }
        })
        .catch(err => {
          if(!err.response){
            Swal.fire('Error, No Server Response!', '', 'error');
          } else if (err.response?.status === 401) {
            Swal.fire('Unauthorized!!!', '', 'error');
          } else{
            Swal.fire(err.response?.data || 'Fetching filtered flights failed, please try again!', '', 'error');
          }
        })
    }
  }


  //=========================ADD RANDOM FLIGHT============================
  const addRandom = async () => {
    //Countries you wanna add in Origin Country and Destination Country
    const countries = ['Italy', 'Greece', 'Kosovo', 'Kosovo'];
    let ticketPrice = (Math.random() * 600 + 60).toFixed(2);


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
    
    // Choose a random planeId from the planeNum array
    const randomPlane = Math.floor(Math.random() * flight.planeNum.length);


    const finalData = {
      PlaneId: flight.planeNum[randomPlane - 1].planeId,
      OriginCountry: originCountry,
      DestinationCountry: destinationCountry,
      Reservation: new Date(),
      TicketsLeft: Math.floor(Math.random() * 60) + 60,
      Departure: departureTime.toLocaleTimeString('en-US', { hour12: false }),
      Arrival: arrivalTime.toLocaleTimeString('en-US', { hour12: false }),
      TicketPrice: ticketPrice
    };


    axios.post(createFlights, finalData, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
      .then(res => {
        Swal.fire('Trip Added Successfully', '', 'success');
        setCreateFlight(false);
        setFlight(initialData);
        setCreateBus(false);
        setBus(initialData);
        getPlaneData();
      })
      .catch(err => {
        if(!err.response){
          Swal.fire('Error, No Server Response!', '', 'error');
        } else if (err.response?.status === 401) {
          Swal.fire('Unauthorized!!!', '', 'error');
          history('/login');
        } else{
          Swal.fire(err.response?.data || 'Something went wrong!', '', 'error');
        }
      })
  }
  //=========================ADD RANDOM Bus============================
    const addRandomBus = async () => {
      //Countries you wanna add in Origin Country and Destination Country
    const countries = ['Italy', 'Greece', 'Kosovo', 'Albania'];
    let names = ['FlixBus', 'MegaBus', 'HappyBus', 'GreenBus'];
    let  ticketPrice = (Math.random() * 200 + 20).toFixed(2);


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
      BusId: 3,
      Origin: originCountry,
      Destination: destinationCountry,
      Reservation: new Date(),
      TicketsAvailable: Math.floor(Math.random() * 60) + 60,
      DepartureTime: departureTime.toLocaleTimeString('en-US', { hour12: false }),
      ArrivalTime: arrivalTime.toLocaleTimeString('en-US', { hour12: false }),
      TicketPrice: ticketPrice
    };


    
    axios.post(createBuses, finalData, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
      .then(res => {
        Swal.fire('Bus Trip Added Successfully', '', 'success');
        setCreateBus(false);
        setBus(initialData);
      })
      .catch(err => {
        if(!err.response){
          Swal.fire('Error, No Server Response!', '', 'error');
        } else if (err.response?.status === 401) {
          Swal.fire('Unauthorized!!!', '', 'error');
          history('/login');
        } else{
          Swal.fire('Something went wrong!', '', 'error');
        }
      })
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

  return isLoading ? (
    <Loader />
  ) : (
    <>
    <div className="title">
      <h2>Dashboard</h2>
    </div>
    <Card>
      <CardHeader>
        <Row className='justify-content-between'>
          <Col>
            <DropdownButton id="dropdown-basic-button" className="mb-4 top-button" title={dropdownVal}>
              {['Bus', 'Airplane'].map((item, idx) => <DropdownItem key={idx} onClick={() => setDropdownVal(item)}>{item}</DropdownItem>)}
            </DropdownButton>
          </Col>
          <Col className='d-flex justify-content-end'>
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
              className='form-control digits'
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              isClearable
              placeholderText="Select Date...."
            />
            {/* <DatePicker
              dateFormat="yyyy/MM/dd"
              className="form-control digits"
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              placeholderText='Select Date...'
            /> */}
          </Col>
          <Col className='d-flex justify-content-end'>
            <Button className='w-100' onClick={handleSearch}>Search</Button>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <Row>
          <Col sm={12} xl={6} className="d-flex flex-column">
            <Card className="flex-grow-1 d-flex flex-column">
              <CardHeader>
                <h4>Cheap Flight Offers</h4>
              </CardHeader>
              <CardBody className="d-flex flex-column">
                <div className='offers flex-grow-1'>
                  <Row className="g-4">
                    {initialValues.map((itemProps, idx) => (
                      <Col sm={6} key={idx} className="d-flex" onClick={() => {
                        setFromCountry(itemProps.originCountry);
                        setToCountry(itemProps.destinationCountry);
                        setDateRange(['04/26/2024', '05/02/2024']);
                      }}>
                        <OfferCard props={itemProps} className="flex-grow-1"/>
                      </Col>
                    ))}
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col sm={12} xl={6} className="d-flex flex-column">
            <Card className="flex-grow-1 d-flex flex-column">
              <Card.Header>
                <h4>Reviews</h4>
              </Card.Header>
              <CardBody className="d-flex flex-column">
                <div className="offers flex-grow-1">
                  <Row className="g-4">
                    {reviews.map((review, idx) => (
                      <Col sm={6} key={idx} className="d-flex">
                        <Card className="flex-grow-1 review-card d-flex flex-column">
                          <CardBody className="d-flex flex-column">
                            <Card.Title className='text-start mb-3'>{review.name}</Card.Title>
                            <Card.Text className='mb-3'>{review.review}</Card.Text>
                            <Card.Text className='mb-3'>{review.date}</Card.Text>
                            <div className="mt-auto">
                              <Card.Footer className="text-muted text-center p-0 bg-white" style={{borderRadius: '0'}}>
                                <Card.Text className='mb-2'>{review.planeNumber}</Card.Text>
                                {renderStars(review.rating)}
                              </Card.Footer>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </CardBody>
            </Card>
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
                  <FormLabel>Plane </FormLabel>
                      {/* <FormControl className="form-control" type="text" name="name" placeholder="e.g. AirSafe" value={flight.name} onChange={handleChange} /> */}
                      <div className="input-group login-form-inputs">
                        <FormGroup className='input-group modal-inputs'>
                          <DropdownButton id="planes-dropdown-button" style={{width: 'inherit', height: 'inherit'}} title={selectedPlane}>
                            {flight.planeNum && flight.planeNum.map((item, idx) => (
                              <DropdownItem key={idx} onClick={() => {
                                
                                setFlight(prev => ({ ...prev, selectedPlane: item.planeId }))
                                setSelectedPlane(item.planeNumber);
                              }}>{item.planeNumber}</DropdownItem>
                            ))}
                          </DropdownButton>
                        </FormGroup>
                      </div>  
                  <p className='invalidFeedback fullWidth'>{errors.name}</p>
                </FormGroup>
              </Col>
              <FormGroup className='formGroup d-flex justify-content-between'>
                <Button className='' variant='danger' onClick={() => addRandom()}>ADD RANDOM</Button>
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
                  <FormLabel>Plane </FormLabel>
                      {/* <FormControl className="form-control" type="text" name="name" placeholder="e.g. AirSafe" value={flight.name} onChange={handleChange} /> */}
                      <div className="input-group login-form-inputs">
                        <FormGroup className='input-group modal-inputs'>
                          <DropdownButton id="planes-dropdown-button" style={{width: 'inherit', height: 'inherit'}} title={selectedBus}>
                            {bus.busNum && bus.busNum.map((item, idx) => (
                              <DropdownItem key={idx} onClick={() => {
                                
                                setBus(prev => ({ ...prev, selectedBus: item.busId }))
                                setSelectedBus(item.busNumber);
                              }}>{item.busNumber}</DropdownItem>
                            ))}
                          </DropdownButton>
                        </FormGroup>
                      </div>  
                  <p className='invalidFeedback fullWidth'>{errors.name}</p>
                </FormGroup>
              </Col>
              <FormGroup className='formGroup d-flex justify-content-between'>
                <Button variant='danger' onClick={() => addRandomBus()}>ADD RANDOM</Button>
                <Button className="admin-buttons" onClick={() => handleBusClick()}>Create BusTrip</Button>
              </FormGroup>
            </Form>
          </Modal.Body>
        </Modal>
      </CardBody>
    </Card>
  </>
  )
}

export default Dashboard;