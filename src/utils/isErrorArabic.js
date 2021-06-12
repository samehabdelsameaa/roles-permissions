export const isErrorsArabic = (errors) => {
  const err =
    errors &&
    Object.keys(errors).map((e) => {
      return e.includes('_ar');
    });
  return err.length > 0;
};
