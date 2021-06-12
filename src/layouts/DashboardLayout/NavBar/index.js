import NavItem from './NavItem';
import MenuLinks from './config';
import PropTypes from 'prop-types';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import React, { useEffect } from 'react';
import MyAvatar from 'src/components/MyAvatar';
import Scrollbars from 'src/components/Scrollbars';
import { PATH_APP } from 'src/routes/paths';
import { Link as RouterLink, useLocation, matchPath } from 'react-router-dom';
import { alpha, makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Link,
  List,
  Drawer,
  Hidden,
  Typography,
  ListSubheader,
  Button
} from '@material-ui/core';

const DRAWER_WIDTH = 280;

const useStyles = makeStyles((theme) => {
  const isLight = theme.palette.mode === 'light';

  return {
    logoImage: {
      margin: '0 auto',
      paddingVertial: 20
    },
    drawer: {
      [theme.breakpoints.up('lg')]: {
        flexShrink: 0,
        width: DRAWER_WIDTH
      }
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
      background: theme.palette.background.default
    },
    subHeader: {
      ...theme.typography.overline,
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
      paddingLeft: theme.spacing(5),
      color: theme.palette.text.primary
    },
    account: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(2, 2.5),
      margin: theme.spacing(1, 2.5, 5),
      borderRadius: theme.shape.borderRadiusSm,
      background: theme.palette.grey[isLight ? 200 : 800]
    },
    doc: {
      padding: theme.spacing(2.5),
      borderRadius: theme.shape.borderRadiusMd,
      backgroundColor: isLight
        ? alpha(theme.palette.primary.main, 0.08)
        : theme.palette.primary.lighter
    }
  };
});

function reduceChild({ array, item, pathname, level }) {
  const key = item && item.href + level;

  if (item) {
    if (item.items) {
      const match = matchPath(pathname, {
        path: item.href,
        exact: false
      });

      array = [
        ...array,
        <NavItem
          key={key}
          level={level}
          icon={item.icon}
          info={item.info}
          href={item.href}
          title={item.title}
          open={Boolean(match)}
        >
          {renderNavItems({
            pathname,
            level: level + 1,
            items: item.items
          })}
        </NavItem>
      ];
    } else {
      array = [
        ...array,
        <NavItem
          key={key}
          level={level}
          href={item.href}
          icon={item.icon}
          info={item.info}
          title={item.title}
        />
      ];
    }
  }
  return array;
}

function renderNavItems({ items, pathname, level = 0 }) {
  return (
    <List disablePadding>
      {items.reduce(
        (array, item) => reduceChild({ array, item, pathname, level }),
        []
      )}
    </List>
  );
}

NavBar.propTypes = {
  onCloseNav: PropTypes.func,
  isOpenNav: PropTypes.bool
};

function NavBar({ isOpenNav, onCloseNav }) {
  const classes = useStyles();
  const { pathname } = useLocation();
  const {
    user: { firstName, lastName, title },
    permissionList,
    isSuperAdmin
  } = useAuth();

  useEffect(() => {
    if (isOpenNav && onCloseNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getAllowedNavigations = (navConfig) => {
    return navConfig[0].items.map((item) => {
      if (item.items) {
        const newItems = item.items.map((childItem) => {
          if (
            permissionList.some((v) =>
              childItem.href.split('/').pop().includes(v.toLowerCase())
            )
          ) {
            return childItem;
          }
        });
        return { ...item, items: newItems };
      } else {
        return item;
      }
    });
  };

  const menuItems = !isSuperAdmin
    ? [
        {
          subheader: 'general',
          items: getAllowedNavigations(MenuLinks)
        }
      ]
    : MenuLinks;

  const renderContent = (
    <Scrollbars>
      <Box sx={{ px: 2.5, py: 3 }}>
        <RouterLink to="/app/dashboard">
          <Logo className={classes.logoImage} />
        </RouterLink>
      </Box>

      <Link
        underline="none"
        component={RouterLink}
        to={PATH_APP.profile.account}
      >
        <div className={classes.account}>
          <MyAvatar />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {`${firstName} ${lastName}`}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {title && title}
            </Typography>
          </Box>
        </div>
      </Link>

      {menuItems.map((list) => {
        return (
          <List
            disablePadding
            key={list.subheader}
            subheader={
              <ListSubheader
                disableSticky
                disableGutters
                className={classes.subHeader}
              >
                {list.subheader}
              </ListSubheader>
            }
          >
            {renderNavItems({
              items: list.items,
              pathname: pathname
            })}
          </List>
        );
      })}
    </Scrollbars>
  );

  return (
    <nav className={classes.drawer}>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          open={isOpenNav}
          variant="temporary"
          onClose={onCloseNav}
          classes={{ paper: classes.drawerPaper }}
        >
          {renderContent}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          open
          anchor="left"
          variant="persistent"
          classes={{ paper: classes.drawerPaper }}
        >
          {renderContent}
        </Drawer>
      </Hidden>
    </nav>
  );
}

export default NavBar;
