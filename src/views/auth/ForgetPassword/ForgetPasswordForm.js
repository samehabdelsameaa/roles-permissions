import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider } from 'formik';
import { emailError } from 'src/utils/helpError';
import { Box, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

ForgetPasswordForm.propTypes = {
  formik: PropTypes.object.isRequired
};

function ForgetPasswordForm({ formik }) {
  const { t } = useTranslation();
  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <TextField
          fullWidth
          {...getFieldProps('email')}
          type="email"
          label="Email address"
          error={
            Boolean(touched.email && errors.email) ||
            emailError(errors.afterSubmit).error
          }
          helperText={
            (touched.email && errors.email) ||
            emailError(errors.afterSubmit).helperText
          }
        />
        <Box sx={{ mt: 3 }}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            pending={isSubmitting}
          >
            {t('auth.forgetPassword')}
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
}

export default ForgetPasswordForm;
