import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Tab
} from '@material-ui/core';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import PermissionsList from './PermissionsList';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { updateRole } from 'src/store/slices/user';
import { MBadge } from 'src/theme';

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
      '& > *': {
        margin: `${theme.spacing(1)} !important`
      },
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

function EditRoleForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState('en');
  const { permissions, selectedRole } = useSelector((state) => state.user);

  const { enqueueSnackbar } = useSnackbar();

  const {
    _id,
    name,
    name_ar,
    description,
    description_ar,
    status,
    permissions: initialPermissions
  } = selectedRole;

  const rolesSchema = Yup.object().shape({
    name: Yup.string().required('Role Name is required'),
    description: Yup.string(),
    name_ar: Yup.string().required('Role Name is required'),
    description_ar: Yup.string(),
    status: Yup.boolean()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: name || '',
      description: description || '',
      name_ar: name_ar || '',
      description_ar: description_ar || '',
      status: status || false,
      permissions: !initialPermissions ? permissions : initialPermissions
    },

    validationSchema: rolesSchema,

    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      dispatch(updateRole(_id, values));
      setSubmitting(false);
      setTimeout(() => {
        enqueueSnackbar('Role updated successfully', { variant: 'success' });
      }, 1000);
    }
  });

  const {
    errors,
    touched,
    isSubmitting,
    values,
    handleSubmit,
    getFieldProps
  } = formik;

  const handleTabItem = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ m: 3 }}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TabContext value={tabIndex}>
                <TabList onChange={handleTabItem}>
                  <Tab key="en" label="english" value="en" />
                  <Tab
                    key="ar"
                    label={
                      (errors.name_ar && touched.name_ar) ||
                      (errors.description_ar && touched.description_ar) ? (
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
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Role Name EN"
                          {...getFieldProps('name')}
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.name && touched.name ? (
                          <div className={classes.errorTxt}>{errors.name}</div>
                        ) : null}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              {...getFieldProps('status')}
                              color="primary"
                            />
                          }
                          labelPlacement="start"
                          label={values.status ? 'Active' : 'inActive'}
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          fullWidth
                          label="Description en"
                          {...getFieldProps('description')}
                          InputLabelProps={{ shrink: true }}
                        />
                        {errors.description && touched.description ? (
                          <div className={classes.errorTxt}>
                            {errors.description}
                          </div>
                        ) : null}
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel key="ar" value="ar" sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Role Name"
                          {...getFieldProps('name_ar')}
                        />
                        {errors.name_ar && touched.name_ar ? (
                          <div className={classes.errorTxt}>
                            {errors.name_ar}
                          </div>
                        ) : null}
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          {...getFieldProps('description_ar')}
                        />
                        {errors.description_ar && touched.description_ar ? (
                          <div className={classes.errorTxt}>
                            {errors.description_ar}
                          </div>
                        ) : null}
                      </Grid>
                    </Grid>
                  </TabPanel>
                </Box>
              </TabContext>

              <Grid container spacing={2} sx={{ display: 'flex' }}>
                <Grid item xs={12} md={12}>
                  <Typography
                    variant="h5"
                    sx={{ my: 4, mx: 0.2, color: '#3a3a3a' }}
                  >
                    Edit Role's Permissions
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <PermissionsList
                  options={permissions}
                  {...getFieldProps('permissions')}
                  value={values.permissions}
                />
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  pending={isSubmitting}
                  className={classes.addAdminBtn}
                >
                  Update Role
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}

export default EditRoleForm;
