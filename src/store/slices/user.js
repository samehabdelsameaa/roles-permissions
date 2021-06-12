import jwtDecode from 'jwt-decode';
import { createSlice } from '@reduxjs/toolkit';
import apiInstance from 'src/utils/api';

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  userProfile: null,
  userList: [],
  usersRoleList: [],
  activityLogs: [],
  usersActivityLogs: [],
  notifications: null,
  userNotifications: null,
  roles: [],
  selectedRole: {},
  isSuccess: false,
  permissions: [],
  userRoles: null
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.myProfile = action.payload;
    },

    getUserProfileSuccess(state, action) {
      state.isLoading = false;
      state.userProfile = action.payload;
    },

    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    },

    getUsersRoleListSuccess(state, action) {
      state.isLoading = false;
      state.usersRoleList = action.payload;
    },

    getUserRolesSuccess(state, action) {
      state.isLoading = false;
      state.userRoles = action.payload;
    },

    getactivityLogsSuccess(state, action) {
      state.isLoading = false;
      state.activityLogs = action.payload;
    },

    getUsersActivityLogsSuccess(state, action) {
      state.isLoading = false;
      state.usersActivityLogs = action.payload;
    },

    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.notifications = action.payload;
    },

    getUserNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.userNotifications = action.payload;
    },

    deleteRoleSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = action.payload;
    },

    deleteUserSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = action.payload;
    },

    addedRoleSuccess(state, action) {
      state.isLoading = false;
      state.roles.push(action.payload);
    },

    getRolesSuccess(state, action) {
      state.isLoading = false;
      state.roles = action.payload;
    },

    getCurrentRoleSuccess(state, action) {
      state.isLoading = false;
      state.selectedRole = action.payload;
    },

    getPermissionsSuccess(state, action) {
      state.isLoading = false;
      state.permissions = action.payload;
    }
  }
});

export default slice.reducer;

export const { onToggleFollow } = slice.actions;

const decodeToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  return decoded.id;
};

export function getProfile() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const token = await localStorage.getItem('accessToken');
      const id = decodeToken(token);
      const response = await apiInstance.post('/profile/me', {
        id
      });
      dispatch(slice.actions.getProfileSuccess(response.data.data.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUserDetails(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get(`/user/${id}`);
      dispatch(slice.actions.getUserProfileSuccess(response.data.data.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getactivityLogs(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get(`/activity/logs/${id}`);
      const populatedLogs = response.data.data.logs.filter(Boolean);
      dispatch(slice.actions.getactivityLogsSuccess(populatedLogs));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUsersActivityLogs() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get('/activity/logs');
      console.log('from logs', response);
      dispatch(
        slice.actions.getUsersActivityLogsSuccess(response.data.data.logs)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUserList() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get('/users');
      const token = await localStorage.getItem('accessToken');
      const id = decodeToken(token);
      const usersList = response.data.data.users.filter((u) => u._id !== id);
      dispatch(slice.actions.getUserListSuccess(usersList));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateUserProfileRoles(id, values) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.patch(`/user/${id}`, values);
      if (response.data.status) {
        dispatch(slice.actions.getUserProfileSuccess(response.data.data.user));
      }
    } catch (error) {
      console.error(error);
    }
  };
}

export function deleteUser(id) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.delete(`/user/${id}`);
      if (response.data.status) {
        const filteredList = getState().user.userList.filter(
          (u) => u._id !== id
        );
        dispatch(slice.actions.getUserListSuccess(filteredList));
        dispatch(slice.actions.deleteUserSuccess(response.data.status));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createNewUser(values) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.post(`/user`, values);
      const usersList = [...getState().user.userList, response.data.data.user];
      dispatch(slice.actions.getUserListSuccess(usersList));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateUserProfile(id, values) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.put(`/user/${id}`, values);
      dispatch(slice.actions.getUserProfileSuccess(response.data.data.user));
    } catch (error) {
      console.error(error);
    }
  };
}

export function updateUser(id, values) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.put(`/user/${id}`, values);
      const users = await apiInstance.get('/users');
      const token = await localStorage.getItem('accessToken');
      const id = decodeToken(token);
      const usersList = users.data.data.users.filter((u) => u._id !== id);
      dispatch(slice.actions.getUserListSuccess(usersList));
    } catch (error) {
      console.error(error);
    }
  };
}

export function deleteMultipleUsers(ids) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.delete(`/users`, {
        ids
      });
      const filteredList = getState().user.userList.filter(
        (u) => !ids.includes(u._id)
      );
      dispatch(slice.actions.getUserListSuccess(filteredList));
      dispatch(slice.actions.deleteUserSuccess(response.data.status));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUsersRoleList(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get(`/users/${id}/role`);
      dispatch(slice.actions.getUsersRoleListSuccess(response.data.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUserNotifications(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get(`/notifications/${id}`);
      dispatch(
        slice.actions.getUserNotificationsSuccess(
          response.data.data.notifications
        )
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function markAllAsReadForUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.patch(
        `/notifications/${id}/markAllAsRead`
      );
      dispatch(
        slice.actions.getUserNotificationsSuccess(
          response.data.data.notifications
        )
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getNotifications(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get(`/notifications/${id}`);
      dispatch(
        slice.actions.getNotificationsSuccess(response.data.data.notifications)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function markAllAsRead(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.patch(
        `/notifications/${id}/markAllAsRead`
      );
      dispatch(
        slice.actions.getNotificationsSuccess(response.data.data.notifications)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getRoles() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get('/roles');
      dispatch(slice.actions.getRolesSuccess(response.data.data.roles));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getRoleDetails(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get(`/role/${id}`);
      dispatch(slice.actions.getCurrentRoleSuccess(response.data.data.role));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteRole(roleId) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.delete(`/role/${roleId}`);
      const roles = getState().user.roles.filter((r) => r._id !== roleId);
      dispatch(slice.actions.deleteRoleSuccess(response.data.status));
      dispatch(slice.actions.getRolesSuccess(roles));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addRole(roleData) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.post(`/role`, roleData);
      dispatch(slice.actions.addedRoleSuccess(response.data.data.role));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateRole(id, roleData) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.put(`/role/${id}`, roleData);
      dispatch(slice.actions.addedRoleSuccess(response.data.data.role));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deactivateRole(id) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.patch(`/role/${id}/activate`);
      const effectiveRoles = getState().user.roles.map((r) => {
        if (r._id === id) {
          return {
            ...r,
            status: !r.status
          };
        }
        return r;
      });

      dispatch(slice.actions.deleteRoleSuccess(response.data.status));
      dispatch(slice.actions.getRolesSuccess(effectiveRoles));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function unAssignRole(id) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.patch(`/user/${id}/unassign`);
      const currentUsersRole = getState().user.usersRoleList.filter(
        (r) => r._id !== id
      );

      dispatch(slice.actions.deleteRoleSuccess(response.data.status));
      dispatch(slice.actions.getUsersRoleListSuccess(currentUsersRole));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getPermissions() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get('/resources');
      dispatch(
        slice.actions.getPermissionsSuccess(response.data.data.resources)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
