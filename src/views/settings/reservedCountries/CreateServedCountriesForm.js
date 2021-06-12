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
import { isErrorsArabic } from 'src/utils/isErrorArabic';
import { addDepartment } from 'src/store/slices/settings/departments';
// import { countries, languages } from 'countries-list';
import { countries } from './countries';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

function CreateDepartmentForm({ departmentFormVisiblity, offices }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [tabIndex, setTabIndex] = useState('en');
  const { t } = useTranslation();

  const departmentsSchema = Yup.object().shape({
    name: Yup.string().required(t('departments.departmentIsRequired')),
    description: Yup.string(),
    name_ar: Yup.string().required(
      t('departments.departmentDescriptionIsRequired')
    ),
    description_ar: Yup.string(),
    officeId: Yup.string()
  });

  // console.log('ccc@@@', JSON.stringify(countries));

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      description: '',
      name_ar: '',
      description_ar: '',
      countriesList: []
    },

    validationSchema: departmentsSchema,

    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log('countries', values);
      setSubmitting(true);
      departmentFormVisiblity();
      // dispatch(addDepartment(values));
      setSubmitting(false);
      setTimeout(() => {
        enqueueSnackbar(t('departments.departmentAddedSuccessfully'), {
          variant: 'success'
        });
      }, 1000);
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

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
                    {t('departments.addNewDepartment')}
                  </Typography>
                </Grid>
              </Grid>
              {/* <TabContext value={tabIndex}>
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
                </TabList> */}
              <Box sx={{ my: 2 }}>
                {/* <TabPanel key="en" value="en"> */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('departments.departmentName')}
                      {...getFieldProps('name')}
                    />
                    {errors.name && touched.name ? (
                      <div className={classes.errorTxt}>{errors.name}</div>
                    ) : null}
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      label={t('departments.departmentDescription')}
                      {...getFieldProps('description')}
                    />
                    {errors.description && touched.description ? (
                      <div className={classes.errorTxt}>
                        {errors.description}
                      </div>
                    ) : null}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {/* <TextField
                          select
                          fullWidth
                          label={t('departments.office')}
                          placeholder={t('departments.office')}
                          {...getFieldProps('officeId')}
                          SelectProps={{ native: true }}
                          error={Boolean(touched.officeId && errors.officeId)}
                          helperText={touched.officeId && errors.officeId}
                          className={classes.margin}
                        >
                          <option value="" />
                          {countries &&
                            countries.map(({ code, label }) => (
                              <option key={code} value={code}>
                                {label}
                              </option>
                            ))}
                        </TextField> */}
                  </Grid>
                </Grid>
                {/* </TabPanel> */}
                {/* <TabPanel key="ar" value="ar" sx={{ mb: 3 }}> */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('departments.departmentName')}
                      {...getFieldProps('name_ar')}
                    />
                    {errors.name_ar && touched.name_ar ? (
                      <div className={classes.errorTxt}>{errors.name_ar}</div>
                    ) : null}
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      label={t('departments.departmentDescription')}
                      {...getFieldProps('description_ar')}
                    />
                    {errors.description_ar && touched.description_ar ? (
                      <div className={classes.errorTxt}>
                        {errors.description_ar}
                      </div>
                    ) : null}
                  </Grid>
                </Grid>
                {/* </TabPanel> */}
              </Box>
              {/* </TabContext> */}

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  pending={isSubmitting}
                  className={classes.addAdminBtn}
                >
                  {t('departments.addNewDepartment')}
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default CreateDepartmentForm;
