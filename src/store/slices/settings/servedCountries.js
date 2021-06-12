import { createSlice } from '@reduxjs/toolkit';
import apiInstance from 'src/utils/api';

const initialState = {
  isLoading: false,
  error: false,
  servedCountries: [],
  isSuccess: false
};

const slice = createSlice({
  name: 'servedCountries',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getServedCountrysSuccess(state, action) {
      state.isLoading = false;
      state.servedCountries = action.payload;
    }
  }
});

export default slice.reducer;

export function getServedCountries() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get('/servedCountries');
      dispatch(
        slice.actions.getServedCountrysSuccess(
          response.data.data.servedCountries
        )
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getServedCountryDetails(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get(`/servedCountry/${id}`);
      dispatch(
        slice.actions.getSelectedOfficeSuccess(response.data.data.office)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteServedCountry(sId) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.delete(`/servedCountry/${sId}`);
      const countriesList = getState().servedCountries.servedCountries.filter(
        (r) => r._id !== sId
      );
      dispatch(slice.actions.getServedCountrysSuccess(countriesList));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addServedCountry(data) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.post(`/servedCountry`, data);
      const servedList = [
        ...getState().servedCountries.servedCountries,
        response.data.data.servedCountry
      ];
      dispatch(slice.actions.getServedCountrysSuccess(servedList));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateServedCountry(id, listData) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.put(`/servedCountry/${id}`, listData);
      const filteredList = getState().servedCountries.servedCountries.filter(
        (o) => o._id !== id
      );

      const offices = [...filteredList, response.data.data.servedCountry];
      dispatch(slice.actions.getServedCountrysSuccess(offices));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
