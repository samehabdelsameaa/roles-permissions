import { PATH_APP } from './paths';
import { lazy } from 'react';

import DashboardLayout from 'src/layouts/DashboardLayout';
import AuthProtect from 'src/components/Auth/AuthProtect';

const AppRoutes = {
  path: PATH_APP.root,
  guard: AuthProtect,
  layout: DashboardLayout,
  routes: [
    {
      exact: true,
      path: PATH_APP.general.root,
      component: lazy(() => import('src/views/general/DashboardAppView'))
    },
    {
      exact: true,
      path: PATH_APP.admins.root,
      component: lazy(() => import('src/views/admins/AdminsListView'))
    },
    {
      exact: true,
      path: PATH_APP.admins.roles,
      component: lazy(() => import('src/views/admins/Roles'))
    },
    {
      exact: true,
      path: PATH_APP.admins.currentRole,
      component: lazy(() => import('src/views/admins/Roles/EditRole'))
    },
    {
      exact: true,
      path: PATH_APP.profile.root,
      component: lazy(() => import('src/views/general/DashboardAppView'))
    },
    {
      exact: true,
      path: PATH_APP.profile.account,
      component: lazy(() => import('src/views/user/AccountView'))
    },
    {
      exact: true,
      path: PATH_APP.profile.userAccount,
      component: lazy(() => import('src/views/user/UserAccountView'))
    },
    {
      exact: true,
      path: PATH_APP.reservations.hotels,
      component: lazy(() => import('src/views/reservations/hotels'))
    },
    {
      exact: true,
      path: PATH_APP.reservations.flights,
      component: lazy(() => import('src/views/reservations/flights'))
    },
    {
      exact: true,
      path: PATH_APP.settings.root,
      component: lazy(() => import('src/views/settings'))
    },
    {
      exact: true,
      path: PATH_APP.settings.offices,
      component: lazy(() => import('src/views/settings/offices'))
    },
    {
      exact: true,
      path: PATH_APP.settings.departments,
      component: lazy(() => import('src/views/settings/departments'))
    },
    {
      exact: true,
      path: PATH_APP.settings.reservedCountries,
      component: lazy(() => import('src/views/settings/reservedCountries'))
    }
  ]
};

export default AppRoutes;
