import Loader from './Loader';
// import Taptop from './TapTop';
// import Header from './Header';
// import Sidebar from './Sidebar';
import React, { Fragment } from 'react';
// import ThemeCustomize from '../Layout/ThemeCustomizer';
// import { ToastContainer } from 'react-toastify';
import { useContext } from 'react';
// import CustomizerContext from '../_helper/Customizer';
import { useLocation, Outlet } from 'react-router-dom';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import AnimationThemeContext from '../_helper/AnimationTheme';
// import ConfigDB from '../Config/ThemeConfig';

const AppLayout = ({ children, classNames, ...rest }) => {
  // const location = useLocation();
  // const { sidebar_types } = useContext(CustomizerContext);
  // const queryData = location?.search?.split('=')[1]?.toString();
  // const settings1 = localStorage.getItem('sidebar_Settings') || ConfigDB.data.settings.sidebar_setting || queryData;
  // const sidebar_types1 = localStorage.getItem('sidebar_types') || ConfigDB.data.settings.sidebar.type || sidebar_types;
  // const { animation } = useContext(AnimationThemeContext);
  // const animationTheme = localStorage.getItem('animation') || animation || ConfigDB.data.router_animation;
    
  
  return (
      <Fragment>
        {/* <Loader />
        <Taptop /> */}
        <div className={`page-wrapper `} id='pageWrapper'>
          <Header />
          <div className='page-body-wrapper horizontal-menu'> 
            <Sidebar />
            {/* <TransitionGroup {...rest}>
              <CSSTransition key={location.key} timeout={100} classNames={animationTheme} unmountOnExit> */}
                <div className='page-body'>
                  <Outlet />
                </div>
              {/* </CSSTransition> */}
            {/* </TransitionGroup> */}
          </div>
        </div> 
        {/* <ThemeCustomize />
        <ToastContainer />  */}
      </Fragment>
    );  
};
export default AppLayout;
