import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { PATH_PAGE } from 'src/routes/paths';
import { Form, FormikProvider } from 'formik';
import eyeFill from '@iconify-icons/eva/eye-fill';
import { Link as RouterLink } from 'react-router-dom';
import eyeOffFill from '@iconify-icons/eva/eye-off-fill';
import { passwordError, emailError } from 'src/utils/helpError';
import {
  Box,
  Link,
  TextField,
  IconButton,
  InputAdornment
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

ResetPasswordForm.propTypes = {
  formik: PropTypes.object.isRequired
};

function ResetPasswordForm({ formik }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label={t('form.password')}
          {...getFieldProps('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton onClick={handleShowPassword} edge="end">
                  <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                </IconButton>
              </InputAdornment>
            )
          }}
          error={
            Boolean(touched.password && errors.password) ||
            emailError(errors.afterSubmit).error
          }
          helperText={
            (touched.password && errors.password) ||
            emailError(errors.afterSubmit).helperText
          }
        />
        <Box sx={{ mb: 3 }} />
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label={t('form.confirmPassword')}
          {...getFieldProps('confirmPassword')}
          error={
            Boolean(touched.confirmPassword && errors.confirmPassword) ||
            passwordError(errors.afterSubmit).error
          }
          helperText={
            (touched.confirmPassword && errors.confirmPassword) ||
            passwordError(errors.afterSubmit).helperText
          }
        />
        <LoadingButton
          sx={{
            my: 2
          }}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          pending={isSubmitting}
        >
          {t('auth.login')}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}

export default ResetPasswordForm;
