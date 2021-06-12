import HeadTable from './HeadTable';
import Page from 'src/components/Page';
import { Icon } from '@iconify/react';
import ToolbarTable from './ToolbarTable';
import { PATH_APP } from 'src/routes/paths';
import {
  deleteRole,
  getPermissions,
  getRoles,
  getUserList,
  deactivateRole
} from 'src/store/slices/user';
import React, { useState, useEffect } from 'react';
import { visuallyHidden } from '@material-ui/utils';
import { useDispatch, useSelector } from 'react-redux';
import SearchNotFound from 'src/components/SearchNotFound';
import { HeaderDashboard } from 'src/layouts/Common';
import moreVerticalFill from '@iconify-icons/eva/more-vertical-fill';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Switch,
  Drawer,
  Menu,
  MenuItem
} from '@material-ui/core';
import { applySortFilter, getComparator } from 'src/utils/tableUtils';
import TransitionsDialogs from 'src/components/DialogView/TransitionsDialogs';
import CreateRoleForm from './CreateRoleForm';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { localize } from 'src/utils/localize';
import { capitalCase } from 'change-case';
import { MCircularProgress } from 'src/theme';
import useAuth from 'src/hooks/useAuth';

const TABLE_HEAD = [
  { id: 'name', label: 'name', alignRight: false },
  { id: 'userId', label: 'users', alignRight: false },
  { id: 'status', label: 'status', alignRight: false },
  { id: '' }
];

const useStyles = makeStyles((theme) => ({
  root: {},
  sortSpan: visuallyHidden,
  drawer: {
    zIndex: '1999 !important'
  },
  drawerPaper: {
    width: 800,
    padding: 30
  }
}));

const OPTIONS_MENU = ['delete', 'edit'];

function Roles({ history }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { roles, userList, isLoading } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState({ confirm: false, delete: false });
  const [selectedRow, setSelectedRow] = useState([]);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [verticalMenu, setVerticalMenu] = useState(null);
  const [allowedActions, setAllowedActions] = useState([]);
  const { t, i18n } = useTranslation();
  const { currentRolePermissions, permissionList, isSuperAdmin } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const confirmationBoxOpen = (target) => {
    setOpen({ ...open, [target]: true });
  };

  const confirmationBoxClose = () => {
    setOpen(false);
  };

  const toggleUserStatus = (e) => {
    confirmationBoxOpen('confirm');
    setSelectedRow([e.target.name, e.target.checked, e.target.id]);
  };

  const userConfirmAction = () => {
    dispatch(deactivateRole(selectedRow[2]));
    confirmationBoxClose();
    setTimeout(() => {
      enqueueSnackbar(t('roles.roleUpdatedSuccess'), { variant: 'success' });
    }, 1000);
  };

  const roleFormVisiblity = () => {
    setShowRoleForm(!showRoleForm);
  };

  const getCurrentRoute = () => {
    let currentRoute = history.location.pathname.split('/').pop();
    let filteredRoutes = permissionList.filter((p) =>
      currentRoute.includes(p.toLowerCase())
    );
    if (filteredRoutes.length > 0 && !isSuperAdmin) {
      let actions = currentRolePermissions[filteredRoutes];
      const filteredActions = actions.map((a) => {
        console.log('aaa', a);
        if (a == 'Update') {
          return 'Edit';
        }
        return a;
      });
      setAllowedActions(filteredActions);
    } else {
      setAllowedActions(['All', 'View', 'Add', 'Delete', 'Edit']);
    }
  };

  useEffect(() => {
    dispatch(getRoles());
    dispatch(getPermissions());
    dispatch(getUserList());
    getCurrentRoute();
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getUsersWithCurrentRoles = (id) => {
    const roles =
      userList &&
      userList.filter((user) => {
        let rolesIds = [];
        if (user.roleId && user.roleId.length > 0) {
          rolesIds = user.roleId.filter((ur) => ur.role && ur.role._id === id);
        }
        return rolesIds.length > 0 && user;
      });

    return roles.length;
  };

  const openActionsMenu = (event) => {
    setSelectedRow([event.currentTarget.id]);
    setVerticalMenu(event.currentTarget);
  };

  const closeActionsMenu = () => {
    setVerticalMenu(null);
  };

  const userDeletionConfirmAction = () => {
    dispatch(deleteRole(selectedRow[0]));
    confirmationBoxClose();
    setTimeout(() => {
      enqueueSnackbar(t('roles.roleDeletedSuccess'), { variant: 'success' });
    }, 1000);
  };

  const handleUserAction = (option) => {
    if (option === 'delete') {
      closeActionsMenu();
      confirmationBoxOpen('delete');
    }
    if (option === 'edit') {
      closeActionsMenu();
      history.push({
        pathname: `/app/admins/role/${selectedRow[0]}`,
        state: { roleId: selectedRow[0] }
      });
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roles.length) : 0;

  const filteredUsers = applySortFilter(
    roles,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Roles List | Travelyalla" className={classes.root}>
      <Container>
        <HeaderDashboard
          heading={t('roles.rolesList')}
          links={[
            { name: t('navitems.dashboard'), href: PATH_APP.root },
            { name: t('navitems.admins'), href: PATH_APP.admins.root },
            { name: t('navitems.roles') }
          ]}
        />

        <Card className={classes.card}>
          <ToolbarTable
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            roleFormVisiblity={roleFormVisiblity}
            userPermissions={allowedActions}
          />

          <TableContainer sx={{ minWidth: 800, height: 'auto', mb: 5 }}>
            <Table>
              <HeadTable
                order={order}
                classes={classes}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={roles.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody sx={{ mx: 3 }}>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const {
                      _id,
                      name,
                      description,
                      name_ar,
                      description_ar,
                      status
                    } = row;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        className={classes.row}
                      >
                        <TableCell component="th" scope="row" padding="none">
                          <Box
                            sx={{
                              py: 2,
                              alignItems: 'center'
                            }}
                          >
                            <Typography variant="subtitle2">
                              {capitalCase(
                                localize(name, name_ar, i18n.language)
                              )}
                            </Typography>
                            <Typography variant="caption">
                              {localize(
                                description,
                                description_ar,
                                i18n.language
                              )}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <>
                            {getUsersWithCurrentRoles(_id) === 0
                              ? t('app.none')
                              : `${getUsersWithCurrentRoles(_id)} 
                              ${t('app.user')}`}
                          </>
                        </TableCell>
                        <TableCell align="left">
                          <FormControlLabel
                            control={
                              <Switch
                                disabled={
                                  !(
                                    allowedActions &&
                                    allowedActions.includes('Edit')
                                  )
                                }
                                checked={status}
                                onChange={toggleUserStatus}
                                name={`isActive-${index}`}
                                color="primary"
                                id={_id}
                              />
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton id={_id} onClick={openActionsMenu}>
                            <Icon
                              width={20}
                              height={20}
                              icon={moreVerticalFill}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {!isLoading &&
                (isUserNotFound ? (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : null)}
              {isLoading && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      <Box
                        sx={{
                          py: 3
                        }}
                      >
                        <MCircularProgress color="info" />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 20, 25]}
            component="div"
            count={roles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <TransitionsDialogs
        open={open.confirm || false}
        handleClose={confirmationBoxClose}
        handleConfirm={userConfirmAction}
        title={t('roles.importantNotice')}
      >
        {t('roles.confirmActivationMsg')}
      </TransitionsDialogs>
      <TransitionsDialogs
        open={open.delete || false}
        handleClose={confirmationBoxClose}
        handleConfirm={userDeletionConfirmAction}
        title={t('roles.importantNotice')}
      >
        {t('roles.confirmDeletionMsg')}
      </TransitionsDialogs>
      <Drawer
        open={showRoleForm}
        anchor="right"
        onClose={roleFormVisiblity}
        classes={{
          root: classes.drawer,
          paper: classes.drawerPaper
        }}
      >
        <CreateRoleForm roleFormVisiblity={roleFormVisiblity} />
      </Drawer>
      <Menu
        keepMounted
        id="long-menu"
        anchorEl={verticalMenu}
        onClose={closeActionsMenu}
        open={Boolean(verticalMenu)}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch'
          }
        }}
      >
        {OPTIONS_MENU.map((option) => (
          <MenuItem
            key={option}
            selected={option === OPTIONS_MENU[1]}
            onClick={() => handleUserAction(option)}
            disabled={
              !(
                allowedActions &&
                allowedActions.includes(
                  option[0].toUpperCase() + option.slice(1)
                )
              )
            }
          >
            {t(`app.${option}`)}
          </MenuItem>
        ))}
      </Menu>
    </Page>
  );
}

export default Roles;
