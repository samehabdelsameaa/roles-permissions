import React, { useState } from 'react';
import { Box, Grid, TextField, Typography, Tab } from '@material-ui/core';
import { Form, FormikProvider, useFormik } from 'formik';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import * as Yup from 'yup';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { MBadge } from 'src/theme';
import { useTranslation } from 'react-i18next';
import { addOffice } from 'src/store/slices/settings/offices';
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

function CreateOfficeForm({ officeFormVisiblity }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [tabIndex, setTabIndex] = useState('en');
  const { t } = useTranslation();

  const officesSchema = Yup.object().shape({
    name: Yup.string().required(t('offices.officeIsRequired')),
    address: Yup.string(),
    name_ar: Yup.string().required(t('offices.officeAddressIsRequired')),
    address_ar: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      address: '',
      name_ar: '',
      address_ar: ''
    },

    validationSchema: officesSchema,

    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log('formik values', values);
      setSubmitting(true);
      officeFormVisiblity();
      dispatch(addOffice(values));
      setSubmitting(false);
      setTimeout(() => {
        enqueueSnackbar(t('offices.officeAddedSuccessfully'), {
          variant: 'success'
        });
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
                    {t('offices.addNewOffice')}
                  </Typography>
                </Grid>
              </Grid>
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
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('offices.officeName')}
                          {...getFieldProps('name')}
                        />
                        {errors.name && touched.name ? (
                          <div className={classes.errorTxt}>{errors.name}</div>
                        ) : null}
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          fullWidth
                          label={t('offices.address')}
                          {...getFieldProps('address')}
                        />
                        {errors.address && touched.address ? (
                          <div className={classes.errorTxt}>
                            {errors.address}
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
                          label={t('offices.officeName')}
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
                          label={t('offices.address')}
                          {...getFieldProps('address_ar')}
                        />
                        {errors.address_ar && touched.address_ar ? (
                          <div className={classes.errorTxt}>
                            {errors.address_ar}
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
                  {t('offices.addNewOffice')}
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default CreateOfficeForm;
