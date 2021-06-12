function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS = {
  app: '/app',
  auth: '/auth'
};

export const PATH_PAGE = {
  auth: {
    root: ROOTS.auth,
    login: path(ROOTS.auth, '/login'),
    forgetPassword: path(ROOTS.auth, '/password/forget'),
    resetPassword: path(ROOTS.auth, '/password/reset/:token')
  }
};

export const PATH_APP = {
  root: ROOTS.app,
  general: {
    root: path(ROOTS.app, '/app/dashboard')
  },
  admins: {
    root: path(ROOTS.app, '/admins'),
    roles: path(ROOTS.app, '/admins/roles'),
    currentRole: path(ROOTS.app, '/admins/role/:id')
  },
  profile: {
    root: path(ROOTS.app, '/profile'),
    account: path(ROOTS.app, '/profile/account'),
    userAccount: path(ROOTS.app, '/profile/account/:id')
  },
  reservations: {
    root: path(ROOTS.app, '/reservations'),
    hotels: path(ROOTS.app, '/reservations/hotels'),
    flights: path(ROOTS.app, '/reservations/flights')
  },
  settings: {
    root: path(ROOTS.app, '/settings'),
    offices: path(ROOTS.app, '/settings/offices'),
    departments: path(ROOTS.app, '/settings/departments'),
    reservedCountries: path(ROOTS.app, '/settings/reservedCountries')
  }
};
