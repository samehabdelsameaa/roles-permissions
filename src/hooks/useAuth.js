import { useDispatch, useSelector } from 'react-redux';
import {
  forgetPassword,
  login,
  logout,
  resetPassword
} from 'src/store/slices/auth';

export default function useAuth() {
  const dispatch = useDispatch();
  const {
    user,
    isLoading,
    isAuthenticated,
    resetTokenSent,
    errors,
    permissionList,
    currentRolePermissions,
    isSuperAdmin
  } = useSelector((state) => state.auth);

  return {
    user,
    isLoading,
    isAuthenticated,
    resetTokenSent,
    errors,
    permissionList,
    currentRolePermissions,
    isSuperAdmin,

    login: ({ email, password }) =>
      dispatch(
        login({
          email: email,
          password: password
        })
      ),

    logout: () => dispatch(logout()),

    forgetPassword: (email) => dispatch(forgetPassword(email)),

    resetPassword: (token, passwords) =>
      dispatch(resetPassword(token, passwords))
  };
}
