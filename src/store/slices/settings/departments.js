import { createSlice } from '@reduxjs/toolkit';
import apiInstance from 'src/utils/api';

const initialState = {
  isLoading: false,
  error: false,
  departments: [],
  selectedDepartment: {},
  isSuccess: false
};

const slice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getDepartmentsSuccess(state, action) {
      state.isLoading = false;
      state.departments = action.payload;
    },

    getSelectedDepartmentSuccess(state, action) {
      state.isLoading = false;
      state.selectedDepartment = action.payload;
    }
  }
});

export default slice.reducer;

export function getDepartments() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get('/departments');
      console.log('@from departments', response);
      dispatch(
        slice.actions.getDepartmentsSuccess(response.data.data.departments)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getDepartmentDetails(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.get(`/department/${id}`);
      dispatch(
        slice.actions.getSelectedDepartmentSuccess(
          response.data.data.department
        )
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteDepartment(departmentId) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.delete(`/department/${departmentId}`);
      const departments = getState().departments.departments.filter(
        (r) => r._id !== departmentId
      );
      dispatch(slice.actions.getDepartmentsSuccess(departments));
      dispatch(slice.actions.deleteDepartmentSuccess(response.data.status));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addDepartment(departmentData) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.post(`/department`, departmentData);
      const departments = await apiInstance.get(`/departments`);
      dispatch(
        slice.actions.getDepartmentsSuccess(departments.data.data.departments)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateDepartment(id, departmentData) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiInstance.put(
        `/department/${id}`,
        departmentData
      );
      const departments = await apiInstance.get(`/departments`);
      // const filteredDepartments = getState().departments.departments.filter(
      //   (o) => o._id !== id
      // );

      // const departments = [
      //   ...filteredDepartments,
      //   response.data.data.department
      // ];
      console.log('depa', departments);
      dispatch(
        slice.actions.getDepartmentsSuccess(departments.data.data.departments)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
