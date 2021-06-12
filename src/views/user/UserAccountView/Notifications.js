import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import format from 'date-fns/format';
import clockFill from '@iconify-icons/eva/clock-fill';
import { Card, Typography, Grid, Box, Avatar } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { MBadge } from 'src/theme';
import { localize } from 'src/utils/localize';

const useStyles = makeStyles((theme) => ({
  root: {},
  cardItem: {
    position: 'relative',
    marginBottom: theme.spacing(1)
  },
  card: {
    position: 'relative',
    padding: theme.spacing(3),
    '&:not(:last-child)': {
      marginBottom: theme.spacing(3)
    }
  },
  isUnRead: {
    backgroundColor: '#F4F6F8'
  }
}));

const notificationsIcons = {
  mail: '/static/icons/ic_notification_mail.svg',
  system: '/static/icons/navbar/ic_dashboard.svg'
};

Notifications.propTypes = {
  className: PropTypes.string
};

function Notifications({ notifications }) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={10}>
        <Card className={clsx(classes.root, classes.card)}>
          <Typography
            variant="overline"
            sx={{ mb: 2, display: 'block', ml: 1 }}
          >
            {t('userProfile.notifications')}
          </Typography>
          {notifications &&
            notifications.map(
              ({
                avatar,
                isRead,
                createdAt,
                _id,
                title,
                title_ar,
                description,
                description_ar,
                type
              }) => (
                <Card
                  className={clsx({
                    [classes.cardItem]: true,
                    [classes.isUnRead]: isRead
                  })}
                  key={_id}
                  sx={{ borderRadius: 1, p: 3, py: 1 }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.disabled'
                    }}
                  >
                    <Box
                      component={Icon}
                      icon={clockFill}
                      sx={{ mr: 0.5, width: 16, height: 16 }}
                    />
                    {format(new Date(createdAt), 'dd MMM yyyy  hh:mm  a')}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    {!isRead && (
                      <Typography sx={{ m: 0.7, mt: 1.7 }}>
                        <MBadge color="error" variant="dot" />
                      </Typography>
                    )}
                    <Box
                      component={Avatar}
                      src={
                        type === 'mail'
                          ? notificationsIcons.mail
                          : notificationsIcons.system
                      }
                      sx={{ m: 0.7, alignItems: 'center' }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{ m: 0.7, mt: 1.7, color: 'black' }}
                    >
                      {localize(title, title_ar, i18n.language)}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        m: 0.7,
                        mt: 1.7,
                        color: 'text.disabled'
                      }}
                    >
                      {localize(description, description_ar, i18n.language)}
                    </Typography>
                  </Box>
                </Card>
              )
            )}
        </Card>
      </Grid>
    </Grid>
  );
}

export default Notifications;
