import clsx from 'clsx';
import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { changePassword } from 'src/api/changePassword';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  margin: {
    marginBottom: theme.spacing(3)
  }
}));

ChangePassword.propTypes = {
  className: PropTypes.string
};

function ChangePassword({ className }) {
  const classes = useStyles();
  const { logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required(t('formValidation.oldPassRequired')),
    newPassword: Yup.string()
      .min(6, t('formValidation.leastCharpass'))
      .required(t('formValidation.newPasswordRequired')),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref('newPassword'), null],
      t('formValidation.passMustMatch')
    )
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await changePassword(values);
      setSubmitting(false);
      enqueueSnackbar(t('messages.passwordChanged'), { variant: 'success' });
      resetForm();
      logout();
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Card className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <TextField
            {...getFieldProps('oldPassword')}
            fullWidth
            type="password"
            label={t('form.oldPassword')}
            error={Boolean(touched.oldPassword && errors.oldPassword)}
            helperText={touched.oldPassword && errors.oldPassword}
            className={classes.margin}
          />

          <TextField
            {...getFieldProps('newPassword')}
            fullWidth
            type="password"
            label={t('form.newPassword')}
            error={Boolean(touched.newPassword && errors.newPassword)}
            helperText={
              (touched.newPassword && errors.newPassword) ||
              t('formValidation.leastCharpass')
            }
            className={classes.margin}
          />

          <TextField
            {...getFieldProps('confirmNewPassword')}
            fullWidth
            type="password"
            label={t('form.confirmNewPassword')}
            error={Boolean(
              touched.confirmNewPassword && errors.confirmNewPassword
            )}
            helperText={touched.confirmNewPassword && errors.confirmNewPassword}
            className={classes.margin}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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

export default ChangePassword;
