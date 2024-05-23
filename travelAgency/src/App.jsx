import React from 'react';
import Routers from './Route';
import { useState, useMemo } from 'react';
import FlightContext from './_helper/FlightContext';
import AuthContext from './_helper/AuthContext';

function App() {
<<<<<<< HEAD
=======

  const [data, setData] = useState([]);
  const dataValue = useMemo(() => ({data, setData}), [data, setData]);

  const [role, setRole] = useState([]);
  const roleValue = useMemo(() => ({role, setRole}), [role, setRole]);

>>>>>>> 698a96ff1a44a7e8521bfbf79ba2a056b5f0025c
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
