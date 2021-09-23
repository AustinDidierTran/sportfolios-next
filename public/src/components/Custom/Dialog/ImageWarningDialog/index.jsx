import React from 'react';
import Button from '../../Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

export default function ImageWarningDialog(props) {
  const { open, onClose } = props;
  const { t } = useTranslation();

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <DialogTitle> {t('warning')} </DialogTitle>
        <DialogContent dividers>
          <Typography>{t('transfer_person_description')} </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="text">
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
