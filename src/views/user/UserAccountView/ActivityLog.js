import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Card,
  Typography,
  Grid,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CardHeader
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { MLabel } from 'src/theme';
import format from 'date-fns/format';
import { changeCase } from 'src/utils/changeCase';
import { Icon } from '@iconify/react';
import clockFill from '@iconify-icons/eva/clock-fill';
import MoreButton from 'src/components/MoreButton';
import Scrollbars from 'src/components/Scrollbars';

const useStyles = makeStyles((theme) => ({
  root: {},
  activityItem: {
    position: 'relative',
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.neutral
  },
  card: {
    position: 'relative',
    padding: theme.spacing(3),
    '&:not(:last-child)': {
      marginBottom: theme.spacing(3)
    }
  }
}));

ActivityLog.propTypes = {
  className: PropTypes.string
};

function ActivityLog({ activityLogs }) {
  console.log('logss@', activityLogs);
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <div className={clsx(classes.root)}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={12}>
          <Card className={clsx(classes.root, classes.card)}>
            <Typography variant="overline">
              {t('userProfile.activityLog')}
            </Typography>
            {activityLogs &&
              activityLogs.map(
                ({
                  data: { fieldId, action, changedValues },
                  resource,
                  issuedAt,
                  userId
                }) => (
                  <div className={classes.activityItem} key={issuedAt}>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.disabled'
                      }}
                    >
                      <Box
                        component={Icon}
                        icon={clockFill}
                        sx={{ mr: 0.5, width: 16, height: 16 }}
                      />
                      {format(new Date(issuedAt), 'dd MMM yyyy  hh:mm  a')}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ color: 'text.secondary', fontSize: 12 }}
                    >
                      <MLabel
                        variant={
                          theme.palette.mode === 'light' ? 'ghost' : 'filled'
                        }
                        color={
                          action === 'DELETE'
                            ? 'error'
                            : action === 'PUT'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {changeCase(action)}
                      </MLabel>
                      {action === 'POST' &&
                        `  A new ${resource} With Name : "${
                          typeof changedValues.name === 'string' &&
                          changedValues.name
                        }"`}
                      {action === 'DELETE' &&
                        `  an Existing ${resource}
                        `}
                      {action === 'PUT' &&
                        `  an Existing ${resource} With Name : "${
                          typeof changedValues.name === 'string' &&
                          changedValues.name
                        }"`}
                    </Typography>
                    {action === 'PUT' && (
                      <Card className={clsx(classes.root)}>
                        <CardHeader title="Updated Data" />
                        <TableContainer sx={{ minWidth: 720 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Field Name</TableCell>
                                <TableCell>Old Value</TableCell>
                                <TableCell>New Value</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {changedValues &&
                                Object.entries(changedValues).map(
                                  ([key, value], i) => (
                                    <TableRow key={i}>
                                      <TableCell>{key}</TableCell>
                                      <TableCell>
                                        <MLabel
                                          variant={
                                            theme.palette.mode === 'light'
                                              ? 'ghost'
                                              : 'filled'
                                          }
                                          color="error"
                                        >
                                          {typeof value.oldValue !== 'object'
                                            ? value.oldValue
                                            : 'Updated'}
                                        </MLabel>
                                      </TableCell>
                                      <TableCell>
                                        <MLabel
                                          variant={
                                            theme.palette.mode === 'light'
                                              ? 'ghost'
                                              : 'filled'
                                          }
                                          color="success"
                                        >
                                          {typeof value.newValue !== 'object'
                                            ? value.newValue
                                            : 'Updated'}
                                          {typeof true === 'object'}
                                        </MLabel>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Card>
                    )}
                  </div>
                )
              )}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default ActivityLog;
