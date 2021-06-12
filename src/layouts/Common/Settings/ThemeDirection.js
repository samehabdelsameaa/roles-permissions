import React from 'react';
import useSettings from 'src/hooks/useSettings';
import { Grid, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';

function ThemeDirection() {
  const { themeDirection, selectDirection } = useSettings();

  return (
    <RadioGroup
      name="themeDirection"
      value={themeDirection}
      onChange={selectDirection}
    >
      {['ltr', 'rtl'].map((direction) => (
        <Grid item xs={6} key={direction}>
          <FormControlLabel value={direction} control={<Radio />} />
        </Grid>
      ))}
    </RadioGroup>
  );
}

export default ThemeDirection;
