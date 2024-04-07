import { Suspense } from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import Loader from '../Layout/Loader';
import LayoutRoutes from '../Layout/LayoutRoutes';
import PrivateRoute from './PrivateRoute';
import React from "react";
import Header from '../Layout/Header';

const Routers = () => {

  return (
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path='*' element={<Outlet />}>
              <Route path={`*`} element={<LayoutRoutes />}/>
            </Route>
            {/* <Route path={`/login`} element={<Login />}/> */}
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
};

export default Routers;