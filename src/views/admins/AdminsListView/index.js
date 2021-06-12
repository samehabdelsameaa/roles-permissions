import HeadTable from './HeadTable';
import Page from 'src/components/Page';
import { Icon } from '@iconify/react';
import ToolbarTable from './ToolbarTable';
import { PATH_APP } from 'src/routes/paths';
import {
  deleteUser,
  getUserList,
  deleteMultipleUsers,
  getRoles,
  getUserDetails,
  getactivityLogs,
  getNotifications
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
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
  Drawer,
  Menu,
  MenuItem
} from '@material-ui/core';
import CreateAdminForm from './CreateAdmin';
import EditAdmin from './EditAdmin';
import { applySortFilter, getComparator } from 'src/utils/tableUtils';
import { localize } from 'src/utils/localize';
import { useTranslation } from 'react-i18next';
import { MCircularProgress } from 'src/theme';
import { useSnackbar } from 'notistack';
import TransitionsDialogs from 'src/components/DialogView/TransitionsDialogs';
import { getOffices } from 'src/store/slices/settings/offices';
import { getDepartments } from 'src/store/slices/settings/departments';
import useAuth from 'src/hooks/useAuth';

const TABLE_HEAD = [
  { id: 'firstName', label: 'Name', alignRight: false },
  { id: 'office', label: 'Office', alignRight: false },
  { id: 'department', label: 'Department', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
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

const OPTIONS_MENU = ['edit'];

function UserListView({ history }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { userList, isLoading, isSuccess } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [open, setOpen] = useState({ delete: false });
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [verticalMenu, setVerticalMenu] = useState(null);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedRow, setSelectedRow] = useState([]);
  const { t, i18n } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const { offices } = useSelector((state) => state.offices);
  const { departments } = useSelector((state) => state.departments);
  const { roles } = useSelector((state) => state.user);
  const [allowedActions, setAllowedActions] = useState([]);
  const { currentRolePermissions, permissionList, isSuperAdmin } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getUserList());
    dispatch(getOffices());
    dispatch(getDepartments());
    dispatch(getRoles());
    getCurrentRoute();
  }, [dispatch]);

  const confirmationBoxOpen = (target) => {
    setOpen({ ...open, [target]: true });
  };

  const confirmationBoxClose = () => {
    setOpen(false);
  };

  const closeActionsMenu = () => {
    setVerticalMenu(null);
  };

  const openActionsMenu = (event) => {
    setEditMode(true);
    setSelectedRow([event.currentTarget.id]);
    setVerticalMenu(event.currentTarget);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const adminFormVisiblity = (show) => {
    setShowAdminForm(show);
    setEditMode(false);
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

  const navigateToProfile = (id) => {
    dispatch(getUserDetails(id));
    dispatch(getNotifications(id));
    dispatch(getactivityLogs(id));
    history.push({
      pathname: `${PATH_APP.profile.account}/${id}`,
      state: { id: id }
    });
  };

  const deleteSelectedUser = () => {
    if (selected.length === 1) {
      dispatch(deleteUser(selected[0]));
      setTimeout(() => {
        enqueueSnackbar(t('admins.userDeletedSuccessfully'), {
          variant: 'success'
        });
      }, 1000);
      confirmationBoxClose();
      setSelected([]);
    } else {
      dispatch(deleteMultipleUsers(selected));
      setTimeout(() => {
        enqueueSnackbar(t('admins.selectedUsersDeletedSuccessfully'), {
          variant: 'success'
        });
      }, 1000);
      confirmationBoxClose();
      setSelected([]);
    }
  };

  const handleUserAction = (option) => {
    if (option === 'edit') {
      let selectedUser =
        userList && userList.find((o) => o._id === selectedRow[0]);
      setSelectedUser(selectedUser);
      closeActionsMenu();
      setShowAdminForm(true);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName,
    ['firstName', 'lastName']
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Admins List" className={classes.root}>
      <Container>
        <HeaderDashboard
          heading="Admins List"
          links={[
            { name: 'Manage Admins', href: PATH_APP.admins.root },
            { name: 'List', href: PATH_APP.admins.root }
          ]}
        />

        <Card className={classes.card}>
          <ToolbarTable
            numSelected={selected.length}
            filterName={filterName}
            onDelete={() => confirmationBoxOpen('delete')}
            onFilterName={handleFilterByName}
            userPermissions={allowedActions}
            adminFormVisiblity={adminFormVisiblity}
          />

          <TableContainer sx={{ minWidth: 800, height: 'auto', mb: 5 }}>
            <Table>
              <HeadTable
                order={order}
                classes={classes}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={userList.length}
                numSelected={selected.length}
                userPermissions={allowedActions}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const {
                      _id,
                      firstName,
                      lastName,
                      firstName_ar,
                      lastName_ar,
                      office,
                      department,
                      email,
                      title,
                      title_ar,
                      avatar
                    } = row;
                    const isItemSelected = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        className={classes.row}
                      >
                        <TableCell
                          padding="checkbox"
                          sx={{
                            display:
                              allowedActions &&
                              !allowedActions.includes('Delete')
                                ? 'none'
                                : ''
                          }}
                        >
                          <Checkbox
                            checked={isItemSelected}
                            onClick={(event) => {
                              handleClick(event, _id);
                            }}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Box
                            sx={{
                              py: 1,
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer'
                            }}
                            onClick={() => navigateToProfile(_id)}
                          >
                            <Box
                              component={Avatar}
                              alt={firstName}
                              src={avatar}
                              sx={{ mr: 2 }}
                            />
                            <Box>
                              <Typography
                                variant="subtitle2"
                                noWrap
                                sx={{ lineHeight: 1.6 }}
                              >
                                {localize(
                                  `${firstName} ${lastName}`,
                                  `${firstName_ar} ${lastName_ar}`,
                                  i18n.language
                                )}
                              </Typography>
                              <Typography variant="caption">
                                {localize(title, title_ar, i18n.language)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          {office && office.name && office.name}
                        </TableCell>
                        <TableCell align="left">
                          {department && department.name && department.name}
                        </TableCell>
                        <TableCell align="left">{email}</TableCell>
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Drawer
        open={showAdminForm}
        anchor="right"
        onClose={() => adminFormVisiblity(false)}
        classes={{
          root: classes.drawer,
          paper: classes.drawerPaper
        }}
      >
        {editMode ? (
          <EditAdmin
            selectedRow={selectedRow[0]}
            selectedUser={selectedUser}
            offices={offices}
            departments={departments}
            roles={roles}
            adminFormVisiblity={adminFormVisiblity}
          />
        ) : (
          <CreateAdminForm
            adminFormVisiblity={adminFormVisiblity}
            offices={offices}
            departments={departments}
            roles={roles}
          />
        )}
      </Drawer>
      <TransitionsDialogs
        open={open.delete || false}
        handleClose={confirmationBoxClose}
        handleConfirm={deleteSelectedUser}
        title={t('admins.importantNotice')}
      >
        {t('admins.confirmDeletionMsg')}
      </TransitionsDialogs>

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

export default UserListView;
