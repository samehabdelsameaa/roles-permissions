import jwtDecode from 'jwt-decode';
import apiInstance from 'src/utils/api';

export const changePassword = async ({ oldPassword, newPassword }) => {
  const token = await localStorage.getItem('accessToken');
  const id = decodeToken(token);
  await apiInstance.patch('/profile/me/password/update', {
    id,
    currentPassword: oldPassword,
    password: newPassword
  });
};

export const decodeToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  return decoded.id;
};
