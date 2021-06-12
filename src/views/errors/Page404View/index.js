import React from 'react';
import Logo from 'src/components/Logo';
import Page from 'src/components/Page';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  MotionContainer,
  varBounce,
  varBounceIn
} from 'src/components/Animate';
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

function Page404View() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Page title="404 Page Not Found | TravelYalla" className={classes.root}>
      <header className={classes.header}>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
      </header>

      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounce}>
              <Typography variant="h3" gutterBottom>
                {t('errors.pageNotFoundError')}
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              {t('errors.pageNotFoundErrorMessage')}
            </Typography>
            <Box
              component={motion.img}
              variants={varBounceIn}
              alt="404"
              src="/static/illustrations/illustration_404.svg"
              sx={{ width: '100%', maxHeight: 240, my: { xs: 5, sm: 10 } }}
            />
          </Box>
        </MotionContainer>
      </Container>
    </Page>
  );
}

export default Page404View;
