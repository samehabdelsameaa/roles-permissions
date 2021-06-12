import General from './General';
import { Icon } from '@iconify/react';
import Page from 'src/components/Page';
import Notifications from './Notifications';
import { PATH_APP } from 'src/routes/paths';
import ChangePassword from './ChangePassword';
import React, { useState, useEffect } from 'react';
import bellFill from '@iconify-icons/eva/bell-fill';
import { useDispatch, useSelector } from 'react-redux';
import roundVpnKey from '@iconify-icons/ic/round-vpn-key';
import roundReceipt from '@iconify-icons/ic/round-receipt';
import { HeaderDashboard } from 'src/layouts/Common';
import roundAccountBox from '@iconify-icons/ic/round-account-box';
import roundVerifiedUser from '@iconify-icons/ic/round-verified-user';
import {
  getactivityLogs,
  getNotifications,
  getUsersActivityLogs,
  getRoles
} from 'src/store/slices/user';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Tab, Box, Tabs } from '@material-ui/core';
import Roles from './Roles';
import ActivityLog from './ActivityLog';
import { useTranslation } from 'react-i18next';
import { getOffices } from 'src/store/slices/settings/offices';
import { getDepartments } from 'src/store/slices/settings/departments';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(5)
  }
}));

function AccountView() {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('general');
  const dispatch = useDispatch();
  const {
    user: { _id: userId },
    isSuperAdmin
  } = useAuth();
  const { activityLogs, notifications, roles, usersActivityLogs } = useSelector(
    (state) => state.user
  );
  const { offices } = useSelector((state) => state.offices);
  const { departments } = useSelector((state) => state.departments);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getUsersActivityLogs());
    dispatch(getactivityLogs(userId));
    dispatch(getNotifications(userId));
    dispatch(getRoles());
    dispatch(getOffices());
    dispatch(getDepartments());
  }, [dispatch, userId]);

  const ACCOUNT_TABS = [
    {
      title: t('userProfile.general'),
      value: 'general',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <General offices={offices} departments={departments} />
    },
    {
      title: t('userProfile.activity'),
      value: 'activity',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <ActivityLog activityLogs={usersActivityLogs} />
    },
    {
      title: t('userProfile.notifications'),
      value: 'notifications',
      icon: <Icon icon={bellFill} width={20} height={20} />,
      component: <Notifications notifications={notifications} />
    },
    {
      title: t('userProfile.changePassword'),
      value: 'changePassword',
      icon: <Icon icon={roundVpnKey} width={20} height={20} />,
      component: <ChangePassword />
    }
  ];

  const ACCOUNT_TABS_USER = [
    {
      title: t('userProfile.general'),
      value: 'general',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <General offices={offices} departments={departments} />
    },
    {
      title: t('userProfile.notifications'),
      value: 'notifications',
      icon: <Icon icon={bellFill} width={20} height={20} />,
      component: <Notifications notifications={notifications} />
    },
    {
      title: t('userProfile.changePassword'),
      value: 'changePassword',
      icon: <Icon icon={roundVpnKey} width={20} height={20} />,
      component: <ChangePassword />
    }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const AllowedTabs = isSuperAdmin ? ACCOUNT_TABS : ACCOUNT_TABS_USER;

  return (
    <Page title="Account Management | Travelyalla" className={classes.root}>
      <Container>
        <HeaderDashboard
          heading={t('account.account')}
          links={[
            { name: t('navitems.dashboard'), href: PATH_APP.general.root },
            { name: t('navitems.admins'), href: PATH_APP.admins.root },
            { name: t('navitems.accountSettings') }
          ]}
        />

        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={handleChangeTab}
          className={classes.tabBar}
        >
          {AllowedTabs.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={tab.title}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}

export default AccountView;
