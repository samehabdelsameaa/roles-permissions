import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import apiInstance, { unProtectedApiInstance } from 'src/utils/api';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  resetTokenSent: false,
  isSuperAdmin: false,
  user: {},
  errors: {},
  isSuccess: false,
  currentRolePermissions: {},
  permissionList: []
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.errors = action.payload;
    },

    getInitialize(state, action) {
      state.isLoading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.currentRolePermissions = action.payload.permissions;
      state.isSuccess = true;
      state.permissionList =
        action.payload.permissions && Object.keys(action.payload.permissions);
    },

    loginSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.currentRolePermissions = action.payload.permissions;
      state.isSuccess = true;
      state.permissionList =
        action.payload.permissions && Object.keys(action.payload.permissions);
    },

    updatedSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.notifications = action.payload;
    },

    userUpdatedSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
    },

    markAsSuperAdmin(state, action) {
      state.isSuperAdmin = true;
    },

    currentRolePermissionsSuccess(state, action) {
      state.currentRolePermissions = action.payload.permissions;
    },

    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.currentRolePermissions = {};
      state.permissionList = [];
      state.user = null;
    },

    resetPasswordTokenSentSuccess(state) {
      state.resetTokenSent = true;
    }
  }
});

export default slice.reducer;

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

export function login({ email, password }) {
  return async (dispatch) => {
    try {
      const response = await unProtectedApiInstance.post('/login', {
        email,
        password
      });
      const { user, token } = response.data.data;
      setSession(token);
      const permissions = await getCurrentUserPermissions(user.roleId);
      console.log('from auth slice', permissions);
      if (user && token && email === 'superadmin@travelyalla.com') {
        dispatch(slice.actions.markAsSuperAdmin());
        dispatch(
          slice.actions.loginSuccess({
            user,
            permissions: {
              All: ['*']
            }
          })
        );
      } else if (user && token && email !== 'superadmin@travelyalla.com') {
        dispatch(slice.actions.loginSuccess({ user, permissions }));
      } else {
        const error = response.errors.name;
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error.name));
    }
  };
}

export function logout() {
  return async (dispatch) => {
    setSession(null);
    dispatch(slice.actions.logoutSuccess());
  };
}

export function forgetPassword(email) {
  return async (dispatch) => {
    const response = await unProtectedApiInstance.post('/password/forget', {
      email
    });
    console.log('reset response', response);
    const { status } = response.data;
    if (status) {
      dispatch(slice.actions.resetPasswordTokenSentSuccess());
    }
  };
}

export function resetPassword(token, { password, confirmPassword }) {
  return async (dispatch) => {
    console.log('reset password', token, password, confirmPassword);
    const response = await unProtectedApiInstance.put(
      `/password/reset/${token}`,
      {
        password,
        confirmPassword
      }
    );
    console.log('reset response', response);
    const { status } = response.data;
    if (status) {
      dispatch(slice.actions.resetPasswordTokenSentSuccess());
    }
  };
}

const decodeToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  return decoded.id;
};

export function updateProfile(values) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.put('/profile/me/update', values);
      if (response.data.status) {
        dispatch(getInitialize());
        // dispatch(slice.actions.updatedSuccess(response.data.user));
        dispatch(slice.actions.userUpdatedSuccess());
      }
    } catch (error) {
      console.error(error);
    }
  };
}

export function updateUserRoles(values) {
  console.log('zzzzzs', values);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.patch('/profile/me/update', values);
      console.log('response', response);
      if (response.data.status) {
        dispatch(getInitialize());
        // dispatch(slice.actions.updatedSuccess(response.data.user));
        dispatch(slice.actions.userUpdatedSuccess());
      }
    } catch (error) {
      console.error(error);
    }
  };
}

export function getInitialize() {
  console.log('initializing.......');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get(`/profile/me`);
      let user = response.data.data.user;
      const permissions = await getCurrentUserPermissions(user.roleId);
      console.log('QQQQQQQQQ', user.roleId);
      console.log('ppppppppppp@', permissions);
      dispatch(
        slice.actions.getInitialize({
          isAuthenticated: true,
          user,
          permissions
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        slice.actions.getInitialize({
          isAuthenticated: false,
          user: null
        })
      );
    }
  };
}

const getCurrentUserPermissions = async (userRoleState) => {
  let output = {};
  if (userRoleState.length > 1) {
    let userRoleState1 = userRoleState && userRoleState[0].role.permissions,
      userRoleState2 = userRoleState && userRoleState[1].role.permissions;

    for (let key in userRoleState1) {
      if (!userRoleState2[key]) {
        userRoleState2[key] = userRoleState1[key];
      } else {
        userRoleState2[key] = [
          ...new Set([...userRoleState2[key], ...userRoleState1[key]])
        ];
      }
    }

    for (let key in userRoleState2) {
      if (userRoleState2[key].length > 0) {
        output[key] = userRoleState2[key];
      }
    }
  } else {
    let userRoleState2 = userRoleState && userRoleState[0].role.permissions;
    for (let key in userRoleState2) {
      if (userRoleState2[key].length > 0) {
        output[key] = userRoleState2[key];
      }
    }
  }

  console.log('outpppppput@', output);

  return await output;
};
