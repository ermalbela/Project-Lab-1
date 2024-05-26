import React from 'react';
import Routers from './Route';
import { useState, useMemo } from 'react';
import FlightContext from './_helper/FlightContext';
import AuthContext from './_helper/AuthContext';
import BusContext from './_helper/BusContext';

function App() {

  const [data, setData] = useState([]);
  const dataValue = useMemo(() => ({data, setData}), [data, setData]);

  const [busData, setBusData] = useState([]);
  const busDataValue = useMemo(() => ({busData, setBusData}), [busData, setBusData]);

  const [role, setRole] = useState([]);
  const roleValue = useMemo(() => ({role, setRole}), [role, setRole]);

  return (
    <div className='App'>
      <AuthContext.Provider value={roleValue}>
        <FlightContext.Provider value={dataValue}>
          <BusContext.Provider value={busDataValue}>
            <Routers />
          </BusContext.Provider>
        </FlightContext.Provider>
      </AuthContext.Provider>
    </div>
  )
}

export default App