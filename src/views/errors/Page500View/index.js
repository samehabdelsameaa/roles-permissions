import React from 'react';
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Container } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10)
  },
  header: {
    top: 0,
    left: 0,
    lineHeight: 0,
    width: '100%',
    position: 'absolute',
    padding: theme.spacing(3, 3, 0),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(5, 5, 0)
    }
  }
}));

function Page500View() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Page
      title="500 Internal Server Error | TravelYalla"
      className={classes.root}
    >
      <header className={classes.header}>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
      </header>

      <Container>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            {t('errors.pageServerError')}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {t('errors.pageServerErrorMessage')}
          </Typography>

          <Box
            component="img"
            alt="500"
            src="/static/illustrations/illustration_500.svg"
            sx={{ width: '100%', maxHeight: 240, my: { xs: 5, sm: 10 } }}
          />
        </Box>
      </Container>
    </Page>
  );
}

export default Page500View;
