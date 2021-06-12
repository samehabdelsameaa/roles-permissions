import React from 'react';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify-icons/eva/arrow-ios-downward-fill';
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion,
  Typography,
  AccordionDetails,
  AccordionSummary,
  Grid,
  FormControlLabel,
  Switch,
  Card
} from '@material-ui/core';
import { FieldArray } from 'formik';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  }
}));

const rolesAction = ['All', 'View', 'Add', 'Delete', 'Update'];

function PermissionsList({ value, options }) {
  console.log('value', value);
  const classes = useStyles();
  return (
    <React.Fragment>
      {options &&
        options.map(({ name: heading }, i) => (
          <Card className={classes.root} sx={{ mb: 2 }} key={i}>
            <Accordion key={i}>
              <AccordionSummary
                expandIcon={
                  <Icon icon={arrowIosDownwardFill} width={20} height={20} />
                }
              >
                <Typography variant="subtitle1">{heading}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ boxShadow: 'none' }}>
                <Grid container spacing={2}>
                  <FieldArray
                    name={`permissions.${heading}`}
                    render={(arrayHelpers) => {
                      let targetProperty =
                        value && value[`${heading}`] && value[`${heading}`];
                      return (
                        <React.Fragment>
                          {options &&
                            [...Array(5)].map((_, index) => {
                              return (
                                <Grid item xs={2} md={2} key={index}>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        name={`permissions.${heading}`}
                                        value={rolesAction[index]}
                                        checked={
                                          targetProperty &&
                                          targetProperty.includes(
                                            rolesAction[index]
                                          )
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked)
                                            arrayHelpers.push(
                                              rolesAction[index]
                                            );
                                          else {
                                            const idx =
                                              targetProperty &&
                                              targetProperty.indexOf(
                                                rolesAction[index]
                                              );
                                            arrayHelpers.remove(idx);
                                          }
                                        }}
                                        color="primary"
                                      />
                                    }
                                    labelPlacement="start"
                                    label={rolesAction[index]}
                                  />
                                </Grid>
                              );
                            })}
                        </React.Fragment>
                      );
                    }}
                  />
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))}
    </React.Fragment>
  );
}

export default PermissionsList;
