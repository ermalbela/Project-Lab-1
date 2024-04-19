import React, { useState } from 'react';
import {Row, Col, DropdownButton, DropdownItem, Button} from 'react-bootstrap';
import { countries } from '../Menu';
import MySelect from './MySelect';
import {components} from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import travel from '../assets/images/travel.webp';
import axios from 'axios';
import OfferCard from '../CommonElements/OfferCard';

const Dashboard = () => {

  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [passengerCounts, setPassengerCounts] = useState({adult: 0, child: 0, infant: 0});

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

  const handleItemClick = (type, action, e) => {
    e.stopPropagation();
    if(action === 'increment'){
      setPassengerCounts(prevCounts => ({
        ...prevCounts,
        [type]: prevCounts[type] + 1
      }))
    } else{
      setPassengerCounts(prevCounts => ({
        ...prevCounts,
        [type]: prevCounts[type] - 1
      }))
    }
  };

  const handleMenuClick = e => {
    e.stopPropagation();
  }


  const countriesWithLabels = countries.map(country => { //Updating the data so we can use React-Select properly
    return { value: country, label: country };
  });

  return (
    <>
    <Row className='justify-content-between'>
      <Col>
        <DropdownButton id="dropdown-basic-button" className="mb-4 top-button" title={dropdownVal}>
          {['Bus', 'Airplane'].map((item, idx) => <DropdownItem key={idx} onClick={() => setDropdownVal(item)}>{item}</DropdownItem>)}
        </DropdownButton>
    </Col>
    <Col className='d-flex justify-content-end'>
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