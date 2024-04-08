import Dashboard from "../Components/Dashboard";
import Header from "../Layout/Header"
import React from "react";


export const routes = [
  {path: `/header`, Component: <Header />},
  {path: `/`, Component: <Dashboard />}

]
