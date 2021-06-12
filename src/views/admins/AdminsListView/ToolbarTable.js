import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify-icons/eva/search-fill';
import trash2Fill from '@iconify-icons/eva/trash-2-fill';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Button
} from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  const isLight = theme.palette.mode === 'light';
  return {
    root: {
      height: 96,
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 1, 0, 3)
    },
    search: {
      width: 240,
      transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
      }),
      '&.Mui-focused': { width: 320, boxShadow: theme.shadows[25].z8 },
      '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.grey[500_32]} !important`
      }
    },
    highlight: isLight
      ? {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.lighter
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark
        }
  };
});

ToolbarTable.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  className: PropTypes.string
};

function ToolbarTable({
  numSelected,
  filterName,
  onFilterName,
  onDelete,
  userPermissions,
  adminFormVisiblity,
  className
}) {
  const classes = useStyles();

  return (
    <Toolbar
      className={clsx(
        classes.root,
        { [classes.highlight]: numSelected > 0 },
        className
      )}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Box
                component={Icon}
                icon={searchFill}
                sx={{ color: 'text.disabled' }}
              />
            </InputAdornment>
          }
          className={classes.search}
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          sx={{ mx: 2 }}
          variant="contained"
          disabled={!(userPermissions && userPermissions.includes('Add'))}
          onClick={() => adminFormVisiblity(true)}
        >
          Add New Admin
        </Button>
      )}
    </Toolbar>
  );
}

export default ToolbarTable;
