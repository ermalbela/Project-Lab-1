import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loader from '../Layout/Loader';
import LayoutRoutes from '../Layout/LayoutRoutes';
// import Login from '../Components/Login';
import PrivateRoute from './PrivateRoute';
import React from "react";

const Routers = () => {

  return (
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path='*' element={<PrivateRoute />}>
              <Route path={`*`} element={<LayoutRoutes />}/>
            </Route>
            {/* <Route path={`${process.env.PUBLIC_URL}/login`} element={<Login />}/> */}
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
};

export default Routers;