import NProgress from 'nprogress';
import AppRoutes from './AppRoutes';
import LoadingScreen from 'src/components/LoadingScreen';
import { Switch, Route } from 'react-router-dom';
import React, { Suspense, Fragment, lazy, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PATH_PAGE } from './paths';
import GuestProtect from 'src/components/Auth/GuestProtect';
import Page404View from 'src/views/errors/Page404View';
import { store } from 'src/store/store';

const nprogressStyle = makeStyles((theme) => ({
  '@global': {
    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        top: 0,
        left: 0,
        height: 2,
        width: '100%',
        position: 'fixed',
        zIndex: theme.zIndex.snackbar,
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 0 2px ${theme.palette.primary.main}`
      },
      '& .peg': {
        right: 0,
        opacity: 1,
        width: 100,
        height: '100%',
        display: 'block',
        position: 'absolute',
        transform: 'rotate(3deg) translate(0px, -4px)',
        boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`
      }
    }
  }
}));

function RouteProgress(props) {
  nprogressStyle();

  NProgress.configure({
    speed: 500,
    showSpinner: false
  });

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, []);

  return <Route {...props} />;
}

export function renderRoutes(routes = []) {
  // let permissions = store.getState().auth.permissionList;
  // let permissions = Object.keys(userRoleState);
  // console.log('ppppee', permissions);
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, i) => {
          const Component = route.component;
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;

          return (
            <RouteProgress
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => {
                return (
                  <Guard>
                    <Layout>
                      {route.routes ? (
                        renderRoutes(route.routes)
                      ) : (
                        <Component {...props} />
                      )}
                      {/* {permissions &&
                        permissions.some((v) =>
                          route.path.includes(v.toLowerCase()) ? (
                            <>
                              <p>
                                You are not permitted to access this resource.
                              </p>
                              <Page404View />
                            </>
                          ) : route.routes ? (
                            renderRoutes(route.routes)
                          ) : (
                            <Component {...props} />
                          )
                        )} */}
                    </Layout>
                  </Guard>
                );
              }}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
}

const routes = [
  {
    exact: true,
    guard: GuestProtect,
    path: PATH_PAGE.auth.login,
    component: lazy(() => import('src/views/auth/Login'))
  },
  {
    exact: true,
    path: PATH_PAGE.auth.forgetPassword,
    component: lazy(() => import('src/views/auth/ForgetPassword'))
  },
  {
    exact: true,
    path: PATH_PAGE.auth.resetPassword,
    component: lazy(() => import('src/views/auth/ResetPassword'))
  },
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/errors/Page404View'))
  },
  {
    exact: true,
    path: '/500',
    component: lazy(() => import('src/views/errors/Page500View'))
  },

  AppRoutes
];

export default routes;
