import Dashboard from "../Components/Dashboard";
import Flights from "../Components/Flights";
import Header from "../Layout/Header"
import React from "react";


export const routes = [
  {path: `/`, Component: <Dashboard />, name: 'Dashboard'},
  {path: '/flights', Component: <Flights />, name: 'Flights'}
]
