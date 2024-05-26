import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from '../Route/routes';
import AppLayout from './Layout';
import Offers from '../Components/Offers';

const LayoutRoutes = () => {

  return (
    <>
      <Routes>
        {routes.map(({ path, Component }, i) => (
          <Route element={<AppLayout />} key={i}>
            <Route path={path} element={Component} />
            <Route path='/offers' element={<Offers />} />
          </Route>
        ))}
      </Routes>
    </>
  );
};

export default LayoutRoutes;