import Bus from "../Components/Buses";
import Dashboard from "../Components/Dashboard";
import FlightCompanies from "../Components/FlightCompanies";
import Flights from "../Components/Flights";
import React from "react";
import BusCompany from "../Components/BusCompanies";
import MyStatus from "../Components/MyStatus";



export const routes = [
  {path: `/`, Component: <Dashboard />, name: 'Dashboard', show: true},
  {path: '/flights', Component: <Flights />, name: 'Flights', show: false},
  {path: '/bus', Component: <Bus />, name: 'Bus', show: false},
  {path: '/flight_companies', Component: <FlightCompanies />, name: 'Flight Companies', show: true},
  {path: '/buses_companies', Component: <BusCompany />, name: 'Buses Companies', show: true},
  {path: '/bookings', Component: <MyStatus />, name: 'Bookings', show: true},
]