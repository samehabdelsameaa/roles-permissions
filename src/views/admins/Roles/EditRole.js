import Page from 'src/components/Page';
import { PATH_APP } from 'src/routes/paths';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderDashboard } from 'src/layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, Container, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import EditRoleForm from './EditRoleForm';
import { getPermissions, getRoleDetails } from 'src/store/slices/user';
import RoleUsersList from './RoleUsersList';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

function EditRole({ match }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [tabIndex, setTabValue] = useState('roles');
  const { permissions } = useSelector((state) => state.user);

  const ChangeTabPanel = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    dispatch(getRoleDetails(match.params.id));
    dispatch(getPermissions());
  }, []);

  return (
    <Page title="Edit Role List | Travelyalla" className={classes.root}>
      <Container>
        <HeaderDashboard
          heading="Edit Role"
          links={[
            { name: 'Dashboard', href: PATH_APP.root },
            { name: 'Role', href: PATH_APP.admins.roles },
            { name: 'Edit' }
          ]}
        />

        <Card className={classes.card}>
          <TabContext value={tabIndex}>
            <Box
              sx={{
                pr: 3,
                width: '100%',
                borderTopRightRadius: 1,
                borderTopLefttRadius: 1,
                bgcolor: 'grey.50024'
              }}
            >
              <TabList onChange={ChangeTabPanel}>
                <Tab key="roles" label="Roles" value="roles" sx={{ pl: 3 }} />
                <Tab key="users" label="Users" value="users" />
              </TabList>
            </Box>
            <Box>
              <TabPanel key="roles" value="roles">
                <EditRoleForm />
              </TabPanel>
              <TabPanel key="users" value="users">
                <RoleUsersList />
              </TabPanel>
            </Box>
          </TabContext>
        </Card>
      </Container>
    </Page>
  );
}

export default EditRole;
