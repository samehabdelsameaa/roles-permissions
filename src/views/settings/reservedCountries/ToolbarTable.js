import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify-icons/eva/search-fill';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  OutlinedInput,
  InputAdornment,
  Button
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

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
      width: 540,
      transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
      }),
      '&.Mui-focused': { width: 520, boxShadow: theme.shadows[25].z8 },
      '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.grey[500_32]} !important`
      }
    },
    [theme.breakpoints.down('sm')]: {
      search: {
        width: 240,
        '&.Mui-focused': { width: 320, boxShadow: theme.shadows[25].z8 }
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
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  className: PropTypes.string,
  openCountriesList: PropTypes.func
};

function ToolbarTable({
  filterName,
  onFilterName,
  openCountriesList,
  userPermissions,
  className
}) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Toolbar className={clsx(classes.root, className)}>
      <OutlinedInput
        value={filterName}
        onChange={onFilterName}
        placeholder={t('app.search')}
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

      <Button
        variant="contained"
        sx={{ mx: 2 }}
        disabled={!(userPermissions && userPermissions.includes('Add'))}
        onClick={openCountriesList}
      >
        {t('app.addNew')}
      </Button>
    </Toolbar>
  );
}

export default ToolbarTable;
