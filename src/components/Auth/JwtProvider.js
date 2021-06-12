import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getInitialize } from 'src/store/slices/auth';

JwtProvider.propTypes = {
  children: PropTypes.node
};

function JwtProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInitialize());
  }, [dispatch]);

  return <>{children}</>;
}

export default JwtProvider;
