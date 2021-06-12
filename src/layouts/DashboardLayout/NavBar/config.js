import React from 'react';
import { MIcon } from 'src/theme';
import { PATH_APP } from 'src/routes/paths';

const path = (name) => `/static/icons/navbar/${name}.svg`;

const ICONS = {
  dashboard: <MIcon src={path('ic_dashboard')} />,
  user: <MIcon src={path('ic_user')} />,
  settings: <MIcon src={path('ic_elements')} />
};

const navConfig = [
  {
    subheader: 'general',
    items: [
      {
        title: 'dashboard',
        icon: ICONS.dashboard,
        href: PATH_APP.general.root,
        items: [
          {
            title: 'app',
            href: PATH_APP.general.root
          }
        ]
      },
      {
        title: 'manageAdmins',
        icon: ICONS.user,
        href: PATH_APP.admins.root,
        items: [
          {
            title: 'list',
            href: PATH_APP.admins.root
          },
          {
            title: 'roles',
            href: PATH_APP.admins.roles
          }
        ]
      },
      {
        title: 'reservations',
        icon: ICONS.user,
        href: PATH_APP.reservations.root,
        items: [
          {
            title: 'flights',
            href: PATH_APP.reservations.flights
          },
          {
            title: 'hotels',
            href: PATH_APP.reservations.hotels
          }
        ]
      },
      {
        title: 'settings',
        icon: ICONS.settings,
        href: PATH_APP.settings.root
        // items: [
        //   {
        //     title: 'offices',
        //     href: PATH_APP.settings.offices
        //   },
        //   {
        //     title: 'departments',
        //     href: PATH_APP.settings.departments
        //   },
        //   {
        //     title: 'reservedCountries',
        //     href: PATH_APP.settings.reservedCountries
        //   }
        // ]
      }
    ]
  }
];

export default navConfig;
