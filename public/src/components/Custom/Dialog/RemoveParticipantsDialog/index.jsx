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
import Avatar from '../../Avatar';

export default function RemoveParticipantsDialog(props) {
  const { open, onClose, otherParticipants } = props;
  const { t } = useTranslation();

  const nickname = (participant) => {
    if (!participant.nickname) {
      return t('no.no_nickname');
    }
    return participant.nickname;
  };

  return (
    <div>
      <Dialog
        className={styles.dialog}
        open={open}
        onClose={onClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        fullWidth="true"
      >
        <DialogTitle>
          <div className={styles.title}>
            <Delete className={styles.face} fontSize="medium" />
            <Typography variant="h6">{t('delete.delete_participants')}</Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <List className={styles.list}>
            {otherParticipants.map((o) => (
              <div className={styles.member}>
                <div className={styles.profile}>
                  <Avatar photoUrl={o.photoUrl} className={styles.avatar} />
                  <div className={styles.text}>
                    <Typography className={styles.name}>{`${o.name} ${o.surname}`}</Typography>
                    <Typography className={styles.nickname}>{nickname(o)}</Typography>
                  </div>
                </div>
                <div className={styles.grow} />
                <Delete className={styles.create} />
              </div>
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
