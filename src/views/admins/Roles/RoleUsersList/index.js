import HeadTable from './HeadTable';
import { Icon } from '@iconify/react';
import { getUsersRoleList, unAssignRole } from 'src/store/slices/user';
import React, { useState, useEffect } from 'react';
import { visuallyHidden } from '@material-ui/utils';
import { useDispatch, useSelector } from 'react-redux';
import moreVerticalFill from '@iconify-icons/eva/more-vertical-fill';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import { applySortFilter, getComparator } from 'src/utils/tableUtils';
import { MCircularProgress } from 'src/theme';
import TransitionsDialogs from 'src/components/DialogView/TransitionsDialogs';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

const TABLE_HEAD = [
  { label: 'Name' },
  { id: 'office', label: 'Office', alignRight: false },
  { id: 'department', label: 'Department', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

const useStyles = makeStyles(() => ({
  root: {},
  sortSpan: visuallyHidden
}));

const OPTIONS_MENU = ['unassign'];

function RoleUsersList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { usersRoleList, isLoading, selectedRole } = useSelector(
    (state) => state.user
  );
  const [page, setPage] = useState(0);
  const [order] = useState('asc');
  const [orderBy] = useState('name');
  const [filterName] = useState('');
  const [verticalMenu, setVerticalMenu] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { t } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();
  const { _id: selectedRoleId } = selectedRole;

  useEffect(() => {
    dispatch(getUsersRoleList(selectedRoleId));
  }, [dispatch, selectedRoleId]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const confirmationBoxOpen = (target) => {
    setOpen(true);
  };

  const confirmationBoxClose = () => {
    setOpen(false);
  };

  const closeActionsMenu = () => {
    setVerticalMenu(null);
  };

  const handleUserAction = (option) => {
    if (option === 'unassign') {
      closeActionsMenu();
      confirmationBoxOpen();
    }
  };

  const toggleUserStatus = (e) => {
    confirmationBoxOpen('confirm');
    setSelectedRow([e.target.name, e.target.checked, e.target.id]);
  };

  const userConfirmAction = () => {
    dispatch(unAssignRole(selectedRow[0]));
    confirmationBoxClose();
    setTimeout(() => {
      enqueueSnackbar(t('roles.roleUpdatedSuccess'), { variant: 'success' });
    }, 1000);
  };

  const openActionsMenu = (event) => {
    setSelectedRow([event.currentTarget.id]);
    setVerticalMenu(event.currentTarget);
  };

  const filteredUsers = applySortFilter(
    usersRoleList,
    getComparator(order, orderBy),
    filterName
  );

  return (
    <>
      <TableContainer sx={{ width: '100%', margin: 0, height: 'auto' }}>
        <Table>
          <HeadTable headLabel={TABLE_HEAD} rowCount={usersRoleList.length} />
          <TableBody>
            {filteredUsers &&
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const {
                    _id,
                    firstName,
                    lastName,
                    office: { name: officeName },
                    department: { name: departmentName },
                    email,
                    avatar,
                    status
                  } = row;

                  return (
                    <TableRow
                      hover
                      key={_id}
                      tabIndex={-1}
                      className={classes.row}
                    >
                      <TableCell component="th" scope="row" padding="none">
                        <Box
                          sx={{
                            py: 1,
                            display: 'flex',
                            alignItems: 'center'
                          }}
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
                              sx={{ lineHeight: 0.8 }}
                            >
                              {firstName} {lastName}
                            </Typography>
                            <Typography variant="caption">{email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="left">{officeName}</TableCell>
                      <TableCell align="left">{departmentName}</TableCell>
                      <TableCell align="left">
                        <FormControlLabel
                          control={
                            <Switch
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
          </TableBody>
          {isLoading && (
            <TableBody>
              <TableRow>
                <TableCell align="center" colSpan={6}>
                  <Box sx={{ py: 3 }}>
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
        count={usersRoleList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <TransitionsDialogs
        open={open}
        handleClose={confirmationBoxClose}
        handleConfirm={userConfirmAction}
        title={t('roles.importantNotice')}
      >
        {t('roles.confirmActivationMsg')}
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
            selected={option === OPTIONS_MENU[0]}
            onClick={() => handleUserAction(option)}
          >
            {t(`app.${option}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default RoleUsersList;
