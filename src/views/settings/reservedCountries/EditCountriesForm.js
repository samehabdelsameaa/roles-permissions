import React, { forwardRef, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {
  Slide,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Autocomplete,
  TextField,
  Box,
  Grid,
  makeStyles,
  Tab,
  Divider
} from '@material-ui/core';
import { MBadge } from 'src/theme';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { countries as countriesList } from './countries';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { isErrorsArabic } from 'src/utils/isErrorArabic';
import { currencies } from './currencies';
import { updateServedCountry } from 'src/store/slices/settings/servedCountries';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

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

const languages = ['arabic', 'english', 'francais', 'spanish'];

function EditCountriesForm({
  isOpen,
  onClose,
  selectedCountriesList,
  selectedRow
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [tabIndex, setTabIndex] = useState('en');
  const { t } = useTranslation();

  const {
    name,
    description,
    name_ar,
    description_ar,
    countries,
    currency,
    language
  } = selectedCountriesList;

  console.log('xxxx', selectedCountriesList);
  console.log('xxxx', selectedRow);

  const departmentsSchema = Yup.object().shape({
    name: Yup.string().required(t('departments.departmentIsRequired')),
    description: Yup.string(),
    name_ar: Yup.string().required(
      t('departments.departmentDescriptionIsRequired')
    ),
    description_ar: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: name || '',
      description: description || '',
      name_ar: name_ar || '',
      description_ar: description_ar || '',
      language: language || '',
      currency: currency || '',
      countries: countries || []
    },

    validationSchema: departmentsSchema,

    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      console.log('countries', values);
      setSubmitting(true);
      dispatch(updateServedCountry(selectedRow, values));
      setSubmitting(false);
      setTimeout(() => {
        enqueueSnackbar(t('servedCountries.servedCountriesAddedSuccessfully'), {
          variant: 'success'
        });
      }, 1000);
      onClose();
      resetForm();
    }
  });

  const {
    errors,
    touched,
    values,
    handleSubmit,
    getFieldProps,
    setFieldValue
  } = formik;

  const handleTabItem = (event, newValue) => {
    setTabIndex(newValue);
  };

  console.log('ccc', countries);

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <AppBar position="relative">
            <Toolbar>
              <IconButton color="inherit" edge="start" onClick={onClose}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flex: 1, ml: 2 }}>
                Create Served Countries
              </Typography>
              <Button autoFocus color="inherit" type="submit">
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} sx={{ mx: 5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={2} sx={{ display: 'flex' }}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h5"
                        sx={{ my: 2, mx: 0.1, color: '#333' }}
                      >
                        Add new Countries List
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
                              label={t('departments.departmentName')}
                              {...getFieldProps('name')}
                            />
                            {errors.name && touched.name ? (
                              <div className={classes.errorTxt}>
                                {errors.name}
                              </div>
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
                          <Grid item xs={12} md={12} sx={{ my: 3 }}>
                            <Divider variant="middle" />
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <Autocomplete
                              multiple
                              id="tags-outlined"
                              options={countriesList}
                              name={values.countries}
                              onChange={(e, value) => {
                                console.log('e', value);
                                setFieldValue(
                                  `countries`,
                                  value !== null ? value : values.countries
                                );
                              }}
                              getOptionLabel={(option) => option.label}
                              defaultValue={values.countries}
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  label="filterSelectedOptions"
                                  placeholder="Countries"
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              select
                              fullWidth
                              label="language"
                              placeholder="language"
                              {...getFieldProps('language')}
                              SelectProps={{ native: true }}
                              error={Boolean(
                                touched.language && errors.language
                              )}
                              helperText={touched.language && errors.language}
                              className={classes.margin}
                            >
                              <option value="" />
                              {languages &&
                                languages.map((name) => (
                                  <option key={name} value={name}>
                                    {name}
                                  </option>
                                ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              select
                              fullWidth
                              label="currency"
                              placeholder="currency"
                              {...getFieldProps('currency')}
                              SelectProps={{ native: true }}
                              error={Boolean(
                                touched.officeId && errors.officeId
                              )}
                              helperText={touched.currency && errors.currency}
                              className={classes.margin}
                            >
                              <option value="" />
                              {currencies &&
                                currencies.map(({ code, name }) => (
                                  <option key={code} value={code}>
                                    {`${code} - ${name}`}
                                  </option>
                                ))}
                            </TextField>
                          </Grid>
                        </Grid>
                      </TabPanel>
                      <TabPanel key="ar" value="ar" sx={{ mb: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label={t('departments.departmentName')}
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
                      </TabPanel>
                    </Box>
                  </TabContext>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}

export default EditCountriesForm;
