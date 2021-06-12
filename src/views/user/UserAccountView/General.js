import clsx from 'clsx';
import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
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
import { useDispatch } from 'react-redux';
import { updateUserProfile } from 'src/store/slices/user';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

General.propTypes = {
  className: PropTypes.string
};

function General({ offices, departments, userProfile, userProfileId }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [tabIndex, setTabIndex] = useState('en');
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const { t } = useTranslation();
  console.log('@@@@@@@user', userProfile);
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
  } = userProfile && userProfile;

  const handleTabItem = (event, newValue) => {
    setTabIndex(newValue);
  };

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Name is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      title: title || '',
      firstName_ar: firstName_ar || '',
      lastName_ar: lastName_ar || '',
      title_ar: title_ar || '',
      email: email || '',
      phone: phone || '',
      whatsapp: whatsapp || '',
      avatar: avatar || '',
      address: address || '',
      address_ar: address_ar || '',
      about: about || '',
      about_ar: about_ar || '',
      office: (office && office._id) || null,
      department: (department && department._id) || null,
      country: country || '',
      status: status || '',
      roleId: roleId || ''
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log('value account', values, userProfileId);
      try {
        setSubmitting(true);
        dispatch(updateUserProfile(userProfileId, values));
        setSubmitting(false);
        if (isMountedRef.current) {
          setIsEditEnabled(false);
        }
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

  console.log('state edit ', isEditEnabled);

  return (
    <div className={clsx(classes.root)}>
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
                    disabled={isEditEnabled}
                    value={
                      typeof values.avatar === 'string' ? values.avatar : null
                    }
                    onChange={(value) => setFieldValue('avatar', value)}
                    url="/upload"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={() => setIsEditEnabled(!isEditEnabled)}
                        color="primary"
                        value={isEditEnabled}
                        checked={isEditEnabled}
                      />
                    }
                    labelPlacement="start"
                    label="Enable Edit Profile Mode"
                  />
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
                              disabled={!isEditEnabled}
                              fullWidth
                              label="First Name"
                              {...getFieldProps('firstName')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!isEditEnabled}
                              fullWidth
                              label="Last Name"
                              {...getFieldProps('lastName')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              disabled={!isEditEnabled}
                              label="Email"
                              {...getFieldProps('email')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!isEditEnabled}
                              fullWidth
                              label="Title"
                              {...getFieldProps('title')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!isEditEnabled}
                              select
                              fullWidth
                              label="Office"
                              placeholder="Office"
                              {...getFieldProps('office')}
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
                              disabled={!isEditEnabled}
                              select
                              fullWidth
                              label="Department"
                              placeholder="Department"
                              {...getFieldProps('department')}
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
                              disabled={!isEditEnabled}
                              fullWidth
                              label="Phone Number"
                              {...getFieldProps('phone')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              disabled={!isEditEnabled}
                              fullWidth
                              label="Whatsapp Number"
                              {...getFieldProps('whatsapp')}
                            />
                          </Grid>

                          <Grid item xs={8}>
                            <TextField
                              disabled={!isEditEnabled}
                              {...getFieldProps('address')}
                              fullWidth
                              multiline
                              label="Address"
                            />
                          </Grid>

                          <Grid item xs={4}>
                            <TextField
                              select
                              disabled={!isEditEnabled}
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
                              disabled={!isEditEnabled}
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
                              disabled={!isEditEnabled}
                              fullWidth
                              label="First Name"
                              {...getFieldProps('firstName_ar')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              disabled={!isEditEnabled}
                              label="Last Name"
                              {...getFieldProps('lastName_ar')}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12}>
                            <TextField
                              fullWidth
                              disabled={!isEditEnabled}
                              label="Title"
                              {...getFieldProps('title_ar')}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              disabled={!isEditEnabled}
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
