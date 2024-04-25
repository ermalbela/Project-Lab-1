import React from 'react';
import Routers from './Route';
import { useState, useMemo } from 'react';
import FlightContext from './_helper/FlightContext';
function App() {

  const [data, setData] = useState([]);
  const dataValue = useMemo(() => ({data, setData}), [data, setData]);

  return (
    <div className='App'>
      <FlightContext.Provider value={dataValue}>
        <Routers />
      </FlightContext.Provider>
    </div>
  )
}

export default App
