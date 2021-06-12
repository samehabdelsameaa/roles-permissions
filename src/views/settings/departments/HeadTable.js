import React from 'react';
import PropTypes from 'prop-types';
import {
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

HeadTable.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  classes: PropTypes.object,
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func
};

function HeadTable({ order, classes, orderBy, headLabel, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label && t(`departments.tablesHead.${headCell.label}`)}
              {orderBy === headCell.id ? (
                <span className={classes.sortSpan}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default HeadTable;
