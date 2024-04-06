// import Dashboard from "../Components/Dashboard";
// import Clients from "../Components/Clients";
// import Users from "../Components/Users";
// // import Login from "../Components/Login";
// import Settings from "../Components/Settings";
// import Visits from "../Components/Visits";
// import SmartReports from '../Components/SmartReports';
import Header from "../Layout/Header"
import React from "react";

export const routes = [
  // {path: `${process.env.PUBLIC_URL}/`, Component: <Dashboard />},
  // {path: `${process.env.PUBLIC_URL}/clients`, Component: <Clients />},
  // {path: `${process.env.PUBLIC_URL}/users`, Component: <Users />},
  // {path: `${process.env.PUBLIC_URL}/settings`, Component: <Settings />},
  // {path: `${process.env.PUBLIC_URL}/visits`, Component: <Visits />},
  // {path: `${process.env.PUBLIC_URL}/smartReports`, Component: <SmartReports />}
  {path: `http://localhost:5173//header`, Component: <Header />}

]
