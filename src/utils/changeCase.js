export const changeCase = (action) => {
  const methods = {
    PUT: 'Update',
    DELETE: 'Delete',
    POST: 'Create',
    PATCH: 'Update',
    GET: 'view'
  };
  return methods[action];
};
