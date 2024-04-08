import Loader from './Loader';
import Header from './Header';
import React from 'react';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  
  return (
      <>
        <Loader />
        <Header />
        <div className='page-wrapper'>
          <Outlet />
        </div> 
      </>
    );  
};
export default AppLayout;
