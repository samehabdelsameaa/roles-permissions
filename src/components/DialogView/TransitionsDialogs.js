import React, { forwardRef } from 'react';
import {
  Slide,
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TransitionsDialogs({
  open,
  handleClose,
  handleConfirm,
  title,
  children
}) {
  const { t } = useTranslation();

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title"> {title} </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            {t('app.cancel')}
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            {t('app.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TransitionsDialogs;
