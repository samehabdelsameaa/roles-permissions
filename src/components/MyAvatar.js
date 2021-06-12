import React from 'react';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';
import { MAvatar } from 'src/theme';
import createAvatar from 'src/utils/createAvatar';

MyAvatar.propTypes = {
  className: PropTypes.string
};

function MyAvatar({ className, ...other }) {
  const { user } = useAuth();

  return (
    <MAvatar
      src={user.avatar}
      alt={`${user.firstName} ${user.lasttName}`}
      color={user.avatar ? 'default' : createAvatar(user.firstName).color}
      className={className}
      {...other}
    >
      {createAvatar(user.firstName).name}
    </MAvatar>
  );
}

export default MyAvatar;
