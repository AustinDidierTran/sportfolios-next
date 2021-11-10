import React from 'react';
import Button from '../../Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/Delete';
import { useTranslation } from 'react-i18next';
import styles from './RemoveParticipantsDialog.module.css';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

export default function RemoveParticipantsDialog(props) {
  const { open, onClose, otherParticipants } = props;
  const { t } = useTranslation();

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <DialogTitle>
          <div className={styles.title}>
            <Delete className={styles.delete} fontSize="medium" />
            <Typography variant="h6">{t('delete.delete_participants')}</Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {otherParticipants.map((o) => (
              <ListItemText primary={`${o.name} ${o.surname}`} />
            ))}
          </List>
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
