import React, { useState } from 'react';
import {Row, Col, FormControl} from 'react-bootstrap';
import { countries } from '../Menu';
import MySelect from './MySelect';
import {components} from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const Dashboard = () => {

  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [passengerVal, setPassengerVal] = useState('');

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
        // ':hover': {
        //   color: '#030303'
        // }
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
    control: (provided, state) => ({
      ...provided,
      borderColor: 'hsl(0, 0%, 80%);',
      boxShadow: 'none',
      ':hover': {
        borderColor: 'hsl(0, 0%, 80%);',
        boxShadow: 'none'
      }
    }),
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
      <Col>
        <FormControl 
          value={passengerVal} 
          onChange={(e) => setPassengerVal(e.target.value)} 
          placeholder='Passengers'
        />
      </Col>
    </Row>
  )
}

export default Dashboard;