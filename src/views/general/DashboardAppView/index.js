import React from 'react';
import Welcome from './Welcome';
import Page from 'src/components/Page';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

function DashboardAppView() {
  const classes = useStyles();

  return (
    <Page title="Dashboard App | TravelYalla" className={classes.root}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Welcome />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default DashboardAppView;
