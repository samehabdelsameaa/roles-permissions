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
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import * as Yup from 'yup';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { addRole } from 'src/store/slices/user';
import { useSelector } from 'react-redux';
import PermissionsList from './PermissionsList';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
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

function CreateRoleForm({ roleFormVisiblity }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { permissions } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();
  const [tabIndex, setTabIndex] = useState('en');

  const rolesSchema = Yup.object().shape({
    name: Yup.string().required('Role Name is required'),
    description: Yup.string(),
    name_ar: Yup.string().required('Role Name is required'),
    description_ar: Yup.string(),
    status: Yup.boolean()
  });

  const getInitialPermissions = () => {
    const initialPermissions =
      permissions &&
      permissions.reduce((obj, { name }) => {
        return { ...obj, [name]: [] };
      }, {});
    return initialPermissions;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      description: '',
      name_ar: '',
      description_ar: '',
      status: true,
      permissions: getInitialPermissions() || {}
    },

    validationSchema: rolesSchema,

    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log('formik values@@@@@', values);
      setSubmitting(true);
      roleFormVisiblity();
      dispatch(addRole(values));
      setSubmitting(false);
      setTimeout(() => {
        enqueueSnackbar('Role added successfully', { variant: 'success' });
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
    <div>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={2} sx={{ display: 'flex' }}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="h5"
                    sx={{ my: 2, mx: 0.1, color: '#333' }}
                  >
                    Add New Role
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        {...getFieldProps('status')}
                        checked={values.status}
                        color="primary"
                      />
                    }
                    labelPlacement="start"
                  />
                </Grid>
              </Grid>
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
                          label="Role Name en"
                          {...getFieldProps('name')}
                        />
                        {errors.name && touched.name ? (
                          <div className={classes.errorTxt}>{errors.name}</div>
                        ) : null}
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          fullWidth
                          label="Description en"
                          {...getFieldProps('description')}
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
                    Set Role's Permissions
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <PermissionsList
                  options={permissions}
                  {...getFieldProps('permissions')}
                  value={values}
                />
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  pending={isSubmitting}
                  className={classes.addAdminBtn}
                >
                  Add New Role
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default CreateRoleForm;
