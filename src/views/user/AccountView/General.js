import clsx from 'clsx';
import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { countries } from './countries';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import { UploadAvatar } from 'src/components/Upload';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Form, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Card,
  Switch,
  TextField,
  CardContent,
  FormControlLabel,
  Tab
} from '@material-ui/core';
import { LoadingButton, TabContext, TabList, TabPanel } from '@material-ui/lab';
import { MBadge } from 'src/theme';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateProfile } from 'src/store/slices/auth';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

General.propTypes = {
  className: PropTypes.string
};

function General({ className, offices, departments }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isSuperAdmin } = useAuth();
  const [tabIndex, setTabIndex] = useState('en');
  const { t } = useTranslation();

  const {
    firstName,
    lastName,
    title,
    firstName_ar,
    lastName_ar,
    title_ar,
    email,
    phone,
    whatsapp,
    avatar,
    address,
    address_ar,
    about,
    about_ar,
    office,
    department,
    country,
    status,
    roleId
  } = user;

  const handleTabItem = (event, newValue) => {
    setTabIndex(newValue);
  };

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Name is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName,
      lastName,
      title,
      firstName_ar,
      lastName_ar,
      title_ar,
      email,
      phone,
      whatsapp,
      avatar,
      address,
      address_ar,
      about,
      about_ar,
      office: (office && office._id) || null,
      department: (department && department._id) || null,
      country,
      status,
      roleId,
      isEditEnabled: false
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log('@@@values', values);
      try {
        setSubmitting(true);
        dispatch(updateProfile(values));
        // if (isMountedRef.current) {
        setSubmitting(false);
        // }
        setTimeout(() => {
          enqueueSnackbar('updated successfully!', { variant: 'success' });
        }, 1000);
      } catch (error) {
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.code });
          setSubmitting(false);
        }
      }
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

  return (
    <div className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <Box
                  sx={{
                    my: 10,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <UploadAvatar
                    isDisabled={isSuperAdmin}
                    value={
                      typeof values.avatar === 'string' ? values.avatar : null
                    }
                    onChange={(value) => setFieldValue('avatar', value)}
                    url="/profile/me/avatar/update"
                  />
                  {!isSuperAdmin && (
                    <FormControlLabel
                      control={
                        <Switch
                          {...getFieldProps('isEditEnabled')}
                          color="primary"
                        />
                      }
                      labelPlacement="start"
                      label="Enable Edit Profile Mode"
                    />
                  )}
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <TabContext value={tabIndex}>
                    <TabList onChange={handleTabItem}>
                      <Tab key="en" label="english" value="en" />
                      <Tab
                        key="ar"
                        label={
                          (errors.firstName_ar && touched.firstName_ar) ||
                          (errors.lastName_ar && touched.lastName_ar) ? (
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
                    <Box sx={{ my: 3 }}>
                      <TabPanel key="en" value="en">
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!values.isEditEnabled}
                              fullWidth
                              label="First Name"
                              {...getFieldProps('firstName')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!values.isEditEnabled}
                              fullWidth
                              label="Last Name"
                              {...getFieldProps('lastName')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              disabled={!values.isEditEnabled}
                              label="Email"
                              {...getFieldProps('email')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!values.isEditEnabled}
                              fullWidth
                              label="Title"
                              {...getFieldProps('title')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!values.isEditEnabled}
                              select
                              fullWidth
                              label="Office"
                              placeholder="Office"
                              {...getFieldProps('office._id')}
                              SelectProps={{ native: true }}
                              InputLabelProps={{ shrink: true }}
                              error={Boolean(touched.office && errors.office)}
                              helperText={touched.office && errors.office}
                              className={classes.margin}
                            >
                              <option value="" />
                              {offices &&
                                offices.map(({ name, _id }) => (
                                  <option key={_id} value={_id}>
                                    {name}
                                  </option>
                                ))}
                            </TextField>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!values.isEditEnabled}
                              select
                              fullWidth
                              label="Department"
                              placeholder="Department"
                              {...getFieldProps('department._id')}
                              InputLabelProps={{ shrink: true }}
                              SelectProps={{ native: true }}
                              error={Boolean(
                                touched.department && errors.department
                              )}
                              helperText={
                                touched.department && errors.department
                              }
                              className={classes.margin}
                            >
                              <option value="" />
                              {departments &&
                                departments.map(({ name, _id }) => (
                                  <option key={_id} value={_id}>
                                    {name}
                                  </option>
                                ))}
                            </TextField>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!values.isEditEnabled}
                              fullWidth
                              label="Phone Number"
                              {...getFieldProps('phone')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!values.isEditEnabled}
                              fullWidth
                              label="Whatsapp Number"
                              {...getFieldProps('whatsapp')}
                            />
                          </Grid>

                          <Grid item xs={8}>
                            <TextField
                              disabled={!values.isEditEnabled}
                              {...getFieldProps('address')}
                              fullWidth
                              multiline
                              label="Address"
                            />
                          </Grid>

                          <Grid item xs={4}>
                            <TextField
                              select
                              disabled={!values.isEditEnabled}
                              {...getFieldProps('country')}
                              fullWidth
                              SelectProps={{ native: true }}
                              label="Country"
                              error={Boolean(touched.country && errors.country)}
                              helperText={touched.country && errors.country}
                            >
                              <option value=" " />
                              <option value="egypt">Egypt</option>
                              <option value="ksa">KSA</option>
                            </TextField>
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              disabled={!values.isEditEnabled}
                              {...getFieldProps('about')}
                              fullWidth
                              multiline
                              minRows={4}
                              maxRows={4}
                              label="About"
                            />
                          </Grid>
                        </Grid>
                      </TabPanel>
                      <TabPanel key="ar" value="ar" sx={{ mb: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!values.isEditEnabled}
                              fullWidth
                              label="First Name"
                              {...getFieldProps('firstName_ar')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              disabled={!values.isEditEnabled}
                              label="Last Name"
                              {...getFieldProps('lastName_ar')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12}>
                            <TextField
                              fullWidth
                              disabled={!values.isEditEnabled}
                              label="Title"
                              {...getFieldProps('title_ar')}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              disabled={!values.isEditEnabled}
                              {...getFieldProps('about_ar')}
                              fullWidth
                              multiline
                              minRows={4}
                              maxRows={4}
                              label="About"
                            />
                          </Grid>
                        </Grid>
                      </TabPanel>
                    </Box>
                  </TabContext>

                  <Box
                    sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <LoadingButton
                      disabled={isSuperAdmin}
                      type="submit"
                      variant="contained"
                      pending={isSubmitting}
                    >
                      {t('app.saveChanges')}
                    </LoadingButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default General;
