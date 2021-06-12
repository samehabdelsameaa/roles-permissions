import General from './General';
import { Icon } from '@iconify/react';
import Page from 'src/components/Page';
import Notifications from './Notifications';
import { PATH_APP } from 'src/routes/paths';
import React, { useState, useEffect } from 'react';
import bellFill from '@iconify-icons/eva/bell-fill';
import { useDispatch, useSelector } from 'react-redux';
import roundReceipt from '@iconify-icons/ic/round-receipt';
import { HeaderDashboard } from 'src/layouts/Common';
import roundAccountBox from '@iconify-icons/ic/round-account-box';
import roundVerifiedUser from '@iconify-icons/ic/round-verified-user';
import {
  getactivityLogs,
  getNotifications,
  getRoles
} from 'src/store/slices/user';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Tab, Box, Tabs } from '@material-ui/core';
import Roles from './Roles';
import ActivityLog from './ActivityLog';
import { useTranslation } from 'react-i18next';
import { getOffices } from 'src/store/slices/settings/offices';
import { getDepartments } from 'src/store/slices/settings/departments';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(5)
  }
}));

function UserAccountView({ match }) {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('general');
  const dispatch = useDispatch();
  const { activityLogs, notifications, userProfile, roles } = useSelector(
    (state) => state.user
  );
  const { offices } = useSelector((state) => state.offices);
  const { departments } = useSelector((state) => state.departments);
  const { t } = useTranslation();
  const userProfileId = match.params.id;

  useEffect(() => {
    dispatch(getactivityLogs(userProfileId));
    dispatch(getNotifications(userProfileId));
    dispatch(getRoles());
    dispatch(getOffices());
    dispatch(getDepartments());
  }, [dispatch, userProfileId]);

  const ACCOUNT_TABS = [
    {
      title: t('userProfile.general'),
      value: 'general',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: (
        <General
          offices={offices}
          userProfile={userProfile}
          departments={departments}
          userProfileId={userProfileId}
        />
      )
    },
    {
      title: t('userProfile.roles'),
      value: 'roles',
      icon: <Icon icon={roundVerifiedUser} width={20} height={20} />,
      component: <Roles roles={roles} userProfile={userProfile} />
    },
    {
      title: t('userProfile.activity'),
      value: 'activity',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <ActivityLog activityLogs={activityLogs} />
    },
    {
      title: t('userProfile.notifications'),
      value: 'notifications',
      icon: <Icon icon={bellFill} width={20} height={20} />,
      component: <Notifications notifications={notifications} />
    }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

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
          {ACCOUNT_TABS.map((tab) => (
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

export default UserAccountView;
