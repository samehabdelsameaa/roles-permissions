import React from 'react';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';
import { Redirect } from 'react-router-dom';
import { PATH_PAGE } from 'src/routes/paths';
import LoadingScreen from 'src/components/LoadingScreen';
import { useSelector } from 'react-redux';

Restricted.propTypes = {
  children: PropTypes.node
};

function Restricted({ children }) {
  console.log('from restriction', children.props.children.props.children.props);
  const { isLoading, isAuthenticated } = useAuth();
  const { userRole } = useSelector((state) => state.user);
  const permitted = Object.keys(userRole.permissions);
  const childArray = children.props.children.props.children.props.children;

  console.log('hh', permitted);

  childArray &&
    childArray.forEach(({ props: { path } }) => {
      // console.log('route', path);
      permitted.forEach((i) => {
        if (path.includes(i.toLowerCase()) === !true) {
          console.log('not', path);
          return <Redirect to={PATH_PAGE.auth.login} />;
        } else {
          console.log('yes', path);
        }
      });
    });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect to={PATH_PAGE.auth.login} />;
  }

  return <>{children}</>;
}

export default Restricted;
