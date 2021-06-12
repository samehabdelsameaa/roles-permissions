import { createSlice } from '@reduxjs/toolkit';
import apiInstance from 'src/utils/api';

const initialState = {
  notifications: []
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getNotificationsSuccess(state, action) {
      const notifications = action.payload;
      state.notifications = notifications;
    },

    markAllAsRead(state) {
      const markAll = state.notifications.map((notification) => {
        return {
          ...notification,
          isUnRead: false
        };
      });

      state.notifications = markAll;
    }
  }
});

export default slice.reducer;

export const { markAllAsRead } = slice.actions;

export function getNotifications() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get('/notifications');
      dispatch(
        slice.actions.getNotificationsSuccess(response.data.data.notifications)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
