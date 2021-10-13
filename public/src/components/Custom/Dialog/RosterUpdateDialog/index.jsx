import React from 'react';
import Button from '../../Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

export default function RosterUpdateDialog(props) {
  const { open, onClose, onAccept } = props;
  const { t } = useTranslation();

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        onAccept={onAccept}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle> {t('update_roster')}</DialogTitle>
        <DialogContent dividers>
          <Typography>{t('update_roster_message')} </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="text" textColor="red">
            {t('decline')}
          </Button>
          <Button onClick={onAccept} variant="text">
            {t('accept')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
