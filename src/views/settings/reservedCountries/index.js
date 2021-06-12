import HeadTable from './HeadTable';
import Page from 'src/components/Page';
import { Icon } from '@iconify/react';
import ToolbarTable from './ToolbarTable';
import { PATH_APP } from 'src/routes/paths';
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
  Chip,
  Menu,
  MenuItem
} from '@material-ui/core';
import { applySortFilter, getComparator } from 'src/utils/tableUtils';
import TransitionsDialogs from 'src/components/DialogView/TransitionsDialogs';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { localize } from 'src/utils/localize';
import { MCircularProgress } from 'src/theme';
import useAuth from 'src/hooks/useAuth';
import CountriesForm from './CountriesForm';
import {
  deleteServedCountry,
  getServedCountries
} from 'src/store/slices/settings/servedCountries';
import EditCountriesForm from './EditCountriesForm';

const TABLE_HEAD = [
  { id: 'name', label: 'name', alignRight: false },
  { id: 'countries', label: 'countries', alignRight: false },
  { id: 'currency', label: 'currency', alignRight: false },
  { id: 'language', label: 'language', alignRight: false },
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

function Departments({ history }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { servedCountries, isLoading } = useSelector(
    (state) => state.servedCountries
  );
  const { offices } = useSelector((state) => state.offices);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState({ delete: false });
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedCountriesList, setSelectedCountriesList] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [verticalMenu, setVerticalMenu] = useState(null);
  const [allowedActions, setAllowedActions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editdialogOpen, seteditdialogOpen] = useState(false);
  const { currentRolePermissions, permissionList, isSuperAdmin } = useAuth();
  const { t, i18n } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const confirmationBoxOpen = (target) => {
    setOpen({ ...open, [target]: true });
  };

  const openCountriesList = () => {
    setDialogOpen(true);
    setEditMode(false);
  };

  const openEditCountriesList = () => {
    seteditdialogOpen(true);
  };

  const closeCountriesList = () => {
    setDialogOpen(false);
    seteditdialogOpen(false);
  };

  const confirmationBoxClose = () => {
    setOpen(false);
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
    dispatch(getServedCountries());
    getCurrentRoute();
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const openActionsMenu = (event) => {
    setEditMode(true);
    setSelectedRow([event.currentTarget.id]);
    setVerticalMenu(event.currentTarget);
  };

  const closeActionsMenu = () => {
    setVerticalMenu(null);
  };

  const userDeletionConfirmAction = () => {
    dispatch(deleteServedCountry(selectedRow[0]));
    confirmationBoxClose();
    setTimeout(() => {
      enqueueSnackbar(t('servedCountries.servedCountriesDeletedSuccess'), {
        variant: 'success'
      });
    }, 1000);
  };

  const handleUserAction = (option) => {
    if (option === 'delete') {
      closeActionsMenu();
      confirmationBoxOpen('delete');
    }
    if (option === 'edit') {
      let selectedCountriesList =
        servedCountries &&
        servedCountries.find((d) => d._id === selectedRow[0]);
      setSelectedCountriesList(selectedCountriesList);
      closeActionsMenu();
      openEditCountriesList();
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
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - servedCountries.length)
      : 0;

  const filteredUsers = applySortFilter(
    servedCountries,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  console.log('@@@@@@@@@', selectedCountriesList);

  return (
    <Page title="Served Countries List | Travelyalla" className={classes.root}>
      <Container>
        <HeaderDashboard
          heading={t('servedCountries.servedCountriesList')}
          links={[
            { name: t('navitems.dashboard'), href: PATH_APP.root },
            { name: t('navitems.settings'), href: PATH_APP.settings.root },
            { name: t('navitems.reservedCountries') }
          ]}
        />

        <Card className={classes.card}>
          <ToolbarTable
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            openCountriesList={openCountriesList}
            userPermissions={allowedActions}
          />

          <TableContainer sx={{ minWidth: 800, height: 'auto', mb: 5 }}>
            <Table>
              <HeadTable
                order={order}
                classes={classes}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={servedCountries.length}
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
                      countries,
                      currency,
                      language
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
                              {localize(name, name_ar, i18n.language)}
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
                          <Typography variant="caption">
                            {countries &&
                              countries.map((c, i) => {
                                return (
                                  <React.Fragment key={i}>
                                    <Chip label={c.label} />{' '}
                                  </React.Fragment>
                                );
                              })}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="caption">{currency} </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="caption">{language} </Typography>
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
            count={servedCountries.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <TransitionsDialogs
        open={open.delete || false}
        handleClose={confirmationBoxClose}
        handleConfirm={userDeletionConfirmAction}
        title={t('servedCountries.importantNotice')}
      >
        {t('servedCountries.confirmDeletionMsg')}
      </TransitionsDialogs>

      {/* {editMode ? (
        <EditCountriesForm
          selectedRow={selectedRow[0]}
          selectedCountriesList={selectedCountriesList}
          isOpen={dialogOpen}
          onClose={closeCountriesList}
        />
      ) : (
        <CountriesForm isOpen={dialogOpen} onClose={closeCountriesList} />
      )} */}
      <EditCountriesForm
        selectedRow={selectedRow[0]}
        selectedCountriesList={selectedCountriesList}
        isOpen={editdialogOpen}
        onClose={closeCountriesList}
      />
      <CountriesForm isOpen={dialogOpen} onClose={closeCountriesList} />

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

export default Departments;
