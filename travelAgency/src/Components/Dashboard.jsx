import React, { useState, useEffect, useRef } from 'react';
import {Row, Col, DropdownButton, DropdownItem, Button} from 'react-bootstrap';
import { countries } from '../Menu';
import MySelect from './MySelect';
import {components} from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const Dashboard = () => {

  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [passengerCounts, setPassengerCounts] = useState({adult: 0, child: 0, infant: 0});

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;


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

  const customStyles = {
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


  const countriesWithLabels = countries.map(country => {
    return { value: country, label: country };
  });

  return (
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
      <Col sm={2}>
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
      <Col sm={1}>
        <Button style={{height: '39px'}}>Search</Button>
      </Col>
    </Row>
  )
}

export default Dashboard;