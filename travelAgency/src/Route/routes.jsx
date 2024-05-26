import Bus from "../Components/Buses";
import Dashboard from "../Components/Dashboard";
import Flights from "../Components/Flights";
import React from "react";


export const routes = [
  {path: `/`, Component: <Dashboard />, name: 'Dashboard'},
  {path: '/flights', Component: <Flights />, name: 'Flights'},
  {path: '/bus', Component: <Bus />, name: 'Bus'},
]