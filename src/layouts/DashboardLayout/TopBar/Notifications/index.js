import { Icon } from '@iconify/react';
import Scrollbars from 'src/components/Scrollbars';
import NotificationItem from './NotificationItem';
import PopoverMenu from 'src/components/PopoverMenu';
import bellFill from '@iconify-icons/eva/bell-fill';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef, useState, useEffect } from 'react';
import doneAllFill from '@iconify-icons/eva/done-all-fill';
import {
  markAllAsReadForUser,
  getUserNotifications
} from 'src/store/slices/user';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  List,
  Badge,
  Button,
  Tooltip,
  Divider,
  Typography,
  ListSubheader
} from '@material-ui/core';
import { MIconButton } from 'src/theme';
import { useTranslation } from 'react-i18next';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {},
  listSubheader: {
    ...theme.typography.overline,
    lineHeight: 'unset',
    textTransform: 'uppercase',
    padding: theme.spacing(1, 2.5)
  }
}));

function Notifications() {
  const classes = useStyles();
  const anchorRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const dispatch = useDispatch();
  const {
    user: { _id: userId }
  } = useAuth();
  const { notifications } = useSelector((state) => state.user);
  const totalUnRead =
    notifications &&
    notifications.filter((item) => item.isRead === false).length;
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getUserNotifications(userId));
  }, [dispatch, userId]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsReadForUser(userId));
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={() => setOpen(true)}
        color={isOpen ? 'primary' : 'default'}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </MIconButton>

      <PopoverMenu
        width={360}
        open={isOpen}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              {t('notification.notifications')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {`
                 ${t('notification.have')}
                 ${totalUnRead} 
                 ${t('notification.unreadMsgs')}
              `}
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <MIconButton color="primary" onClick={handleMarkAllAsRead}>
                <Icon icon={doneAllFill} width={20} height={20} />
              </MIconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Box sx={{ height: { xs: 340, sm: 'auto' } }}>
          <Scrollbars>
            <List
              disablePadding
              subheader={
                <ListSubheader
                  disableSticky
                  disableGutters
                  className={classes.listSubheader}
                >
                  {t('notification.new')}
                </ListSubheader>
              }
            >
              {notifications &&
                notifications
                  .slice(0, 2)
                  .map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                    />
                  ))}
            </List>

            <List
              disablePadding
              subheader={
                <ListSubheader
                  disableSticky
                  disableGutters
                  className={classes.listSubheader}
                >
                  {t('notification.beforeThat')}
                </ListSubheader>
              }
            >
              {notifications &&
                notifications
                  .slice(2, 5)
                  .map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                    />
                  ))}
            </List>
          </Scrollbars>
        </Box>

        <Divider />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple component={RouterLink} to="#">
            {t('app.viewAll')}
          </Button>
        </Box>
      </PopoverMenu>
    </>
  );
}

export default Notifications;
