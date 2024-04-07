import { Fragment, useState, useEffect } from 'react';
import React from 'react';

const Loader = () => {

  const [show, setShow] = useState(true);

  useEffect(() => {
       const timeout = setTimeout(() => {
          setShow(false);
      }, 1500);

      return () => {
        clearTimeout(timeout);
      };

  }, [show]);

  return (
    <Fragment>
      <div className={`loader-wrapper ${show ? '' : 'loader-hide'}`}>
        <div className="theme-loader">
            <div className="loader-p"></div>
        </div>
      </div>
    </Fragment>
  );
};

export default Loader;