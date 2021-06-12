import React from 'react';
import PropTypes from 'prop-types';
import {
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel
} from '@material-ui/core';

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

function HeadTable({ headLabel }) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell, i) => (
          <TableCell
            key={i}
            align={headCell.alignRight ? 'right' : 'left'}
            style={{
              borderRadius: 0,
              boxShadow: 'none',
              paddingTop: 10,
              paddingBottom: 10
            }}
          >
            <TableSortLabel> {headCell.label} </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default HeadTable;
