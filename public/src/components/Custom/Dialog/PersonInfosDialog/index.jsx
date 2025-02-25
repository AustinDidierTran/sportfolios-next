import React from 'react';
import Button from '../../Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

export default function PersonInfosDialog(props) {
  const { personInfos, open, onDecline, onSubmit, onClose, withoutButton } = props;
  const { t } = useTranslation();

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <DialogTitle id="dialog-title">{`${personInfos?.name || ''} ${personInfos?.surname || ''}`}</DialogTitle>
        <DialogContent dividers>
          <Typography color={personInfos?.birthDate ? 'textPrimary' : 'error'}>
            {t('birth_date')}: {personInfos?.birthDate || t('missing_info')}
          </Typography>
          <Typography color={personInfos?.gender ? 'textPrimary' : 'error'}>
            {t('gender')}: {t(personInfos?.gender) || t('missing_info')}
          </Typography>
          <Typography color={personInfos?.address?.city ? 'textPrimary' : 'error'}>
            {t('city')}: {personInfos?.address?.city || t('missing_info')}
          </Typography>
          <Typography color={personInfos?.address?.zip ? 'textPrimary' : 'error'}>
            {t('postal_code')}: {personInfos?.address?.zip || t('missing_info')}
          </Typography>
        </DialogContent>
        {withoutButton ? null : (
          <DialogActions>
            <Button onClick={onClose} color={'default'} variant="text">
              {t('cancel')}
            </Button>
            <Button onClick={onSubmit} color={'primary'} variant="text">
              {t('accept')}
            </Button>
            <Button onClick={onDecline} color={'secondary'} variant="text">
              {t('decline')}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
