import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import trash2Fill from '@iconify-icons/eva/trash-2-fill';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  TextField,
  Autocomplete,
  Grid,
  Box,
  Typography,
  IconButton
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@material-ui/lab';
import { MButton } from 'src/theme';
import { v4 as uuidv4 } from 'uuid';
import useAuth from 'src/hooks/useAuth';
import { updateUserProfileRoles } from 'src/store/slices/user';
import { useDispatch } from 'react-redux';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  margin: {
    marginBottom: theme.spacing(3)
  },
  roleItem: {
    position: 'relative',
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.neutral
  }
}));

SetRolesForm.propTypes = {
  className: PropTypes.string
};

const roleServedCountries = ['egypt', 'ksa'];

function SetRolesForm({ className, roles, userProfile }) {
  const classes = useStyles();
  const [rolesSetValues, setRolesSet] = useState([]);
  const {
    user: { roleId, _id }
  } = useAuth();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();

  const addFieldsRow = (rowId) => {
    setRolesSet([...rolesSetValues, { role: rowId, assignedCountry: [] }]);
  };

  useEffect(() => {
    if (isMountedRef) {
      setRolesSet(userProfile.roleId);
    }
  }, [userProfile.roleId, isMountedRef]);

  const removeFieldsRow = (rowId) => {
    const filteredRows =
      rolesSetValues && rolesSetValues.filter((r) => r.role !== rowId);
    setRolesSet(filteredRows);
  };

  const SetRoleFormSchema = Yup.object().shape({
    rolesSet: Yup.array().of(
      Yup.object().shape({
        role: Yup.string().required(t('formValidation.role')),
        assignedCountry: Yup.array().required(
          t('formValidation.assignedCountry')
        )
      })
    )
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      rolesSet: rolesSetValues
    },
    validationSchema: SetRoleFormSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log('values from roles set', values);
      dispatch(updateUserProfileRoles(userProfile._id, values));
      setSubmitting(false);
      enqueueSnackbar(t('messages.passwordChanged'), { variant: 'success' });
      resetForm();
    }
  });

  const {
    errors,
    values,
    touched,
    isSubmitting,
    handleSubmit,
    setFieldValue
  } = formik;

  console.log('value formik', values);
  console.log('values rolesSetValues', rolesSetValues);

  return (
    <Card className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Typography
            variant="overline"
            sx={{ mb: 2, display: 'block', ml: 1 }}
          >
            Set Roles
          </Typography>
          <div className={classes.roleItem}>
            {rolesSetValues &&
              rolesSetValues.map(({ role, assignedCountry }, i) => {
                console.log('$$$', assignedCountry);
                console.log('%%%', role);
                console.log('%%%', roles);
                return (
                  <Grid container spacing={3} sx={{ mb: 2 }} key={uuidv4()}>
                    <Grid item xs={12} md={5}>
                      <Autocomplete
                        fullWidth
                        options={roles}
                        getOptionLabel={(r) => r.name}
                        name={`rolesSet[${i}].role`}
                        onChange={(e, value) => {
                          setFieldValue(
                            `rolesSet[${i}].role`,
                            value !== null ? value._id : values.rolesSet[i].role
                          );

                          const setedRoles = rolesSetValues.filter(
                            (r) => r.role !== role
                          );

                          setRolesSet([
                            ...setedRoles,
                            { role: value._id, assignedCountry }
                          ]);
                        }}
                        defaultValue={
                          roles && roles.find((r) => r._id === role)
                        }
                        style={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name={`rolesSet[${i}].role`}
                            error={Boolean(touched.role && errors.role)}
                            helperText={touched.role && errors.role}
                            label="Roles"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}></Grid>
                    <Grid item xs={12} md={5}>
                      <Autocomplete
                        multiple
                        fullWidth
                        options={roleServedCountries}
                        getOptionLabel={(country) => country}
                        defaultValue={assignedCountry}
                        name={`rolesSet[${i}].assignedCountry`}
                        onChange={(e, value) => {
                          console.log('value!!!!', value);
                          setFieldValue(
                            `rolesSet[${i}].assignedCountry`,
                            value !== null
                              ? value
                              : values.rolesSet[i].assignedCountry
                          );

                          const setedRoles = rolesSetValues.filter(
                            (r) => r.role !== role
                          );

                          setRolesSet([
                            ...setedRoles,
                            { role, assignedCountry: value }
                          ]);
                        }}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            name={`rolesSet[${i}].assignedCountry`}
                            error={Boolean(
                              touched.assignedCountry && errors.assignedCountry
                            )}
                            helperText={
                              touched.assignedCountry && errors.assignedCountry
                            }
                            {...params}
                            label="For Country"
                            placeholder="Country"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <IconButton onClick={() => removeFieldsRow(role)}>
                        <Icon icon={trash2Fill} width={25} height={25} />
                      </IconButton>
                    </Grid>
                  </Grid>
                );
              })}
            <Box
              sx={{
                px: 3,
                mt: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <MButton
                onClick={() => addFieldsRow(uuidv4())}
                variant="outlined"
                color="info"
                sx={{ px: 7 }}
              >
                Add Role
              </MButton>
            </Box>
          </div>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              pending={isSubmitting}
            >
              {t('app.saveChanges')}
            </LoadingButton>
          </Box>
        </Form>
      </FormikProvider>
    </Card>
  );
}

export default SetRolesForm;
