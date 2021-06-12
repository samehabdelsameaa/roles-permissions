import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Autocomplete,
  Typography,
  Button,
  Tab
} from '@material-ui/core';
import Block from 'src/components/Block';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import * as Yup from 'yup';
import clsx from 'clsx';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import UploadAvatar from '../../../components/Upload/UploadAvatar';
import apiInstance from 'src/utils/api';
import { getRoles, getUserList, updateUser } from 'src/store/slices/user';
import { getOffices } from 'src/store/slices/settings/offices';
import { getDepartments } from 'src/store/slices/settings/departments';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { MBadge } from 'src/theme';
import { isErrorsArabic } from 'src/utils/isErrorArabic';

const useStyles = makeStyles((theme) => {
  const isLight = theme.palette.mode === 'light';

  return {
    root: {},
    blockContainer: {
      minHeight: 160,
      marginLeft: 16,
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadiusSm,
      border: `solid 1px ${theme.palette.divider}`,
      backgroundColor: theme.palette.grey[isLight ? 100 : 800],
      marginTop: 16,
      textAlign: 'center'
    },
    rolesTitle: {
      textAlign: 'left'
    },
    rolesInputsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    addRoleBtn: {
      width: 300,
      margin: '23px auto',
      padding: '5px 57.2px 7px 58px',
      borderRadius: '8px',
      border: 'solid 1px rgba(98, 137, 176, 0.32)',
      backgroundColor: '#ebf5fe'
    },
    addAdminBtn: {
      width: '100%'
    },
    errorTxt: {
      fontSize: 11,
      color: 'red'
    }
  };
});

const roleServedCountries = ['egypt', 'ksa'];

function EditAdmin({
  adminFormVisiblity,
  offices,
  departments,
  roles,
  selectedRow,
  selectedUser
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { t } = useTranslation();
  const [rolesSetValues, setRolesSet] = useState([
    { role: uuidv4(), assignedCountry: [] }
  ]);
  const [tabIndex, setTabIndex] = useState('en');

  const { enqueueSnackbar } = useSnackbar();

  console.log('user', selectedUser, selectedRow);

  const {
    firstName,
    lastName,
    email,
    title,
    firstName_ar,
    lastName_ar,
    title_ar,
    phone,
    whatsapp,
    avatar,
    office,
    department,
    roleId,
    countries
  } = selectedUser;

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    firstName_ar: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    lastName_ar: Yup.string().required('Last Name is required'),
    title: Yup.string().required('Title is required'),
    title_ar: Yup.string().required('Title is required'),
    phone: Yup.string().required('Phone is required'),
    whatsapp: Yup.string(),
    email: Yup.string()
      .email('type a valid email')
      .required('email is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      title: title || '',
      firstName_ar: firstName_ar || '',
      lastName_ar: lastName_ar || '',
      title_ar: title_ar || '',
      phone: phone || '',
      whatsapp: whatsapp || '',
      avatar: avatar || '',
      office: (office && office._id) || null,
      department: (department && department._id) || null,
      roleId,
      countries: countries || '',
      status: true
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log('admin values', values);
      dispatch(updateUser(selectedRow, values));
      setSubmitting(false);
      adminFormVisiblity(false);
      setTimeout(() => {
        enqueueSnackbar('Admin added successfully', { variant: 'success' });
      }, 500);
    }
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue
  } = formik;

  const removeFieldsRow = (rowId) => {
    const filteredRows =
      rolesSetValues && rolesSetValues.filter((r) => r.role !== rowId);
    setRolesSet(filteredRows);
  };

  const addFieldsRow = (rowId) => {
    setRolesSet([...rolesSetValues, { role: rowId, assignedCountry: [] }]);
  };

  const handleTabItem = (event, newValue) => {
    setTabIndex(newValue);
  };

  console.log('formik vals', values);
  console.log('form state', rolesSetValues);

  return (
    <div>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <UploadAvatar
                value={values.avatar}
                onChange={(value) => setFieldValue('avatar', value)}
                url="/upload"
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TabContext value={tabIndex}>
                <TabList onChange={handleTabItem}>
                  <Tab key="en" label="english" value="en" />
                  <Tab
                    key="ar"
                    label={
                      isErrorsArabic(errors) ? (
                        <MBadge color="error" variant="dot">
                          Arabic
                        </MBadge>
                      ) : (
                        'Arabic'
                      )
                    }
                    value="ar"
                    sx={{ px: 1 }}
                  />
                </TabList>
                <Box sx={{ my: 2 }}>
                  <TabPanel key="en" value="en">
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          {...getFieldProps('firstName')}
                        />
                        {errors.firstName && touched.firstName ? (
                          <div className={classes.errorTxt}>
                            {errors.firstName}
                          </div>
                        ) : null}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          {...getFieldProps('lastName')}
                        />
                        {errors.lastName && touched.lastName ? (
                          <div className={classes.errorTxt}>
                            {errors.lastName}
                          </div>
                        ) : null}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          {...getFieldProps('email')}
                        />
                        {errors.email && touched.email ? (
                          <div className={classes.errorTxt}>{errors.email}</div>
                        ) : null}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="title"
                          {...getFieldProps('title')}
                        />
                        {errors.title && touched.title ? (
                          <div className={classes.errorTxt}>{errors.title}</div>
                        ) : null}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          {...getFieldProps('phone')}
                        />
                        {errors.phone && touched.phone ? (
                          <div className={classes.errorTxt}>{errors.phone}</div>
                        ) : null}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Whatsapp Number"
                          {...getFieldProps('whatsapp')}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Office"
                          placeholder="Office"
                          {...getFieldProps('office')}
                          SelectProps={{ native: true }}
                          error={Boolean(touched.office && errors.office)}
                          helperText={touched.office && errors.office}
                          className={classes.margin}
                        >
                          <option value="" />
                          {offices &&
                            offices.map((option) => (
                              <option key={option._id} value={option._id}>
                                {option.name}
                              </option>
                            ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Department"
                          placeholder="Department"
                          {...getFieldProps('department')}
                          SelectProps={{ native: true }}
                          error={Boolean(
                            touched.department && errors.department
                          )}
                          helperText={touched.department && errors.department}
                          className={classes.margin}
                        >
                          <option value="" />
                          {departments &&
                            departments.map((option) => (
                              <option key={option._id} value={option._id}>
                                {option.name}
                              </option>
                            ))}
                        </TextField>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={12}
                        className={classes.blockContainer}
                      >
                        <Typography
                          gutterBottom
                          variant="subtitle2"
                          sx={{ color: 'text.secondary' }}
                          className={classes.rolesTitle}
                        >
                          Set Roles
                        </Typography>
                        {roleId &&
                          roleId.map(({ role, assignedCountry }, i) => {
                            let rId = role._id;
                            return (
                              <Grid
                                container
                                spacing={0}
                                sx={{ mb: 1 }}
                                key={uuidv4()}
                              >
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    select
                                    fullWidth
                                    label="Role"
                                    placeholder="Role"
                                    {...getFieldProps(`roleId[${i}].role`)}
                                    SelectProps={{ native: true }}
                                    error={Boolean(touched.role && errors.role)}
                                    helperText={touched.role && errors.role}
                                    className={classes.margin}
                                  >
                                    <option value="" />
                                    {roles &&
                                      roles.map((option) => (
                                        <option
                                          key={option._id}
                                          value={option._id}
                                        >
                                          {option.name}
                                        </option>
                                      ))}
                                  </TextField>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    select
                                    fullWidth
                                    label="For Country"
                                    placeholder="Country"
                                    {...getFieldProps(
                                      `roleId[${i}].assignedCountry`
                                    )}
                                    SelectProps={{ native: true }}
                                    error={Boolean(
                                      touched.assignedCountry &&
                                        errors.assignedCountry
                                    )}
                                    helperText={
                                      touched.assignedCountry &&
                                      errors.assignedCountry
                                    }
                                    className={classes.margin}
                                  >
                                    <option value="" />
                                    {roleServedCountries &&
                                      roleServedCountries.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                  </TextField>
                                </Grid>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel key="ar" value="ar" sx={{ mb: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          {...getFieldProps('firstName_ar')}
                        />
                        {errors.firstName_ar && touched.firstName_ar ? (
                          <div className={classes.errorTxt}>
                            {errors.firstName_ar}
                          </div>
                        ) : null}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          {...getFieldProps('lastName_ar')}
                        />
                        {errors.lastName_ar && touched.lastName_ar ? (
                          <div className={classes.errorTxt}>
                            {errors.lastName_ar}
                          </div>
                        ) : null}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="title"
                          {...getFieldProps('title_ar')}
                        />
                        {errors.title_ar && touched.title_ar ? (
                          <div className={classes.errorTxt}>
                            {errors.title_ar}
                          </div>
                        ) : null}
                      </Grid>
                    </Grid>
                  </TabPanel>
                </Box>
              </TabContext>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  pending={isSubmitting}
                  className={classes.addAdminBtn}
                >
                  Update
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default EditAdmin;
