import { Suspense, useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import Loader from '../Layout/Loader';
import LayoutRoutes from '../Layout/LayoutRoutes';
import React from "react";
import Login from '../Components/Login';
import Register from '../Components/Register';
import AuthContext from '../_helper/AuthContext';
import { getRole } from '../Endpoint';
import axios from 'axios';
import PrivateRoute from './PrivateRoute';

const Routers = () => {

  const {role} = useContext(AuthContext);

  return (
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path='*' element={<PrivateRoute />}>
              {
                role !== '' && role !== undefined && role.length > 0? 
                <Route path={`*`} element={<LayoutRoutes />}/>
                : ''
              }
            </Route>
            <Route path={`/login`} element={<Login />}/>
            <Route path={`/register`} element={<Register />}/>
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
};

export default Routers;