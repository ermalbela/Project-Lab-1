import React from 'react';
import Routers from './Route';
import { useState, useMemo } from 'react';
import FlightContext from './_helper/FlightContext';
import AuthContext from './_helper/AuthContext';

function App() {

  const [data, setData] = useState([]);
  const dataValue = useMemo(() => ({data, setData}), [data, setData]);

  const [role, setRole] = useState([]);
  const roleValue = useMemo(() => ({role, setRole}), [role, setRole]);

  return (
    <div className='App'>
      <AuthContext.Provider value={roleValue}>
        <FlightContext.Provider value={dataValue}>
          <Routers />
        </FlightContext.Provider>
      </AuthContext.Provider>
    </div>
  )
}

export default App
