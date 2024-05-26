import Dashboard from "../Components/Dashboard";
import Flights from "../Components/Flights";
import React from "react";
import Offers from "../Components/Offers";


export const routes = [
  {path: `/`, Component: <Dashboard />, name: 'Dashboard'},
  {path: '/flights', Component: <Flights />, name: 'Flights'},
]
