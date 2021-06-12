import { filter } from 'lodash';

export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applySortFilter(
  array,
  comparator,
  query,
  queryFields = ['name']
) {
  const stabilizedThis = array && array.map((el, index) => [el, index]);
  stabilizedThis &&
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
  if (query) {
    array = filter(array, (_user) => {
      return queryFields.some((q) => {
        return _user[q].toLowerCase().startsWith(query.toLowerCase());
      });
    });
    return array;
  }
  return stabilizedThis.map((el) => el[0]);
}
