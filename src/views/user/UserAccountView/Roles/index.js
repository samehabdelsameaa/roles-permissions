import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import SetRolesForm from './SetRolesForm';

const useStyles = makeStyles((theme) => ({
  root: {},
  card: {
    position: 'relative',
    padding: theme.spacing(3),
    '&:not(:last-child)': {
      marginBottom: theme.spacing(3)
    }
  }
}));

function Roles({ roles, userProfile }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root)}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={9}>
          <SetRolesForm roles={roles} userProfile={userProfile} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Roles;
