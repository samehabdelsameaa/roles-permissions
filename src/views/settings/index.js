import Page from 'src/components/Page';
import { PATH_APP } from 'src/routes/paths';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, Typography, Divider } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { HeaderDashboard } from 'src/layouts/Common';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

function Departments() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Page title="Departments List | Travelyalla" className={classes.root}>
      <HeaderDashboard
        heading={'Settings'}
        links={[{ name: null }]}
        sx={{ px: 2 }}
      />

      <Card className={classes.card} sx={{ padding: 5 }}>
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Dashboard Settings
          </Typography>
          <Card sx={{ borderRadius: 1, p: 3, py: 2 }}>
            <Box sx={{ px: 2.5, mb: 1, mt: 1 }}>
              <RouterLink to={PATH_APP.settings.departments}>
                {t('navitems.departments')}
              </RouterLink>
            </Box>
            <Box sx={{ px: 2.5, mb: 1 }}>
              <RouterLink to={PATH_APP.settings.offices}>
                {t('navitems.offices')}
              </RouterLink>
            </Box>
          </Card>
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Control Cetnter Settings
          </Typography>
          <Card sx={{ borderRadius: 1, p: 3, py: 2 }}>
            <Box sx={{ px: 2.5, mb: 1, mt: 1 }}>
              <RouterLink to={PATH_APP.settings.reservedCountries}>
                {t('navitems.reservedCountries')}
              </RouterLink>
            </Box>
          </Card>
        </Box>
      </Card>
    </Page>
  );
}

export default Departments;
