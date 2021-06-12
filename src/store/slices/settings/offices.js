import { createSlice } from '@reduxjs/toolkit';
import apiInstance from 'src/utils/api';

const initialState = {
  isLoading: false,
  error: false,
  offices: [],
  selectedOffice: {},
  isSuccess: false
};

const slice = createSlice({
  name: 'offices',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getOfficesSuccess(state, action) {
      state.isLoading = false;
      state.offices = action.payload;
    },

    getSelectedOfficeSuccess(state, action) {
      state.isLoading = false;
      state.selectedOffice = action.payload;
    }
  }
});

export default slice.reducer;

export function getOffices() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get('/offices');
      console.log('@from offices', response);
      dispatch(slice.actions.getOfficesSuccess(response.data.data.offices));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getOfficeDetails(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get(`/office/${id}`);
      dispatch(
        slice.actions.getSelectedOfficeSuccess(response.data.data.office)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteOffice(officeId) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.delete(`/office/${officeId}`);
      const offices = getState().offices.offices.filter(
        (r) => r._id !== officeId
      );
      dispatch(slice.actions.getOfficesSuccess(offices));
      dispatch(slice.actions.deleteRoleSuccess(response.data.status));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addOffice(officeData) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.post(`/office`, officeData);
      const offices = [
        ...getState().offices.offices,
        response.data.data.office
      ];
      dispatch(slice.actions.getOfficesSuccess(offices));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateOffice(id, officeData) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.put(`/office/${id}`, officeData);
      const filteredOffices = getState().offices.offices.filter(
        (o) => o._id !== id
      );

      const offices = [...filteredOffices, response.data.data.office];
      dispatch(slice.actions.getOfficesSuccess(offices));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
