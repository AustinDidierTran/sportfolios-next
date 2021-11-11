import React, { useState, useMemo } from 'react';
import Button from '../../Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import FaceIcon from '@material-ui/icons/Face';
import { useTranslation } from 'react-i18next';
import styles from './ChangeNicknameDialog.module.css';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Avatar from '../../Avatar';
import CreateIcon from '@material-ui/icons/Create';
import CustomTextField from '../../TextField';
import IconButton from '../../IconButton';
import { Button as CheckButton } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { useFormInput } from '../../../../hooks/forms';

export default function ChangeNicknameDialog(props) {
  const { open, onClose, otherParticipants, id } = props;
  const { t } = useTranslation();
  const [members, setMembers] = useState(otherParticipants.map((participant) => ({ ...participant, clicked: false })));
  const content = useFormInput('');

  const handleEdit = (participant) => {
    if (open) {
      let newMembers = members;
      const index = members.indexOf(participant);
      newMembers[index].clicked = true;
      setMembers(newMembers);
    }
  };

  const handleConfirmed = (participant) => {
    if (open) {
      console.log('nouveau surnom de ', participant.name, 'est : ', content.value, 'de la conversation ', id);
      let newMembers = members;
      const index = members.indexOf(participant);
      newMembers[index].clicked = false;
      setMembers(newMembers);
      content.reset();
    }
  };

  const handleCanceled = (participant) => {
    if (open) {
      let newMembers = members;
      const index = members.indexOf(participant);
      newMembers[index].clicked = false;
      setMembers(newMembers);
      content.reset();
    }
  };

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
            <FaceIcon className={styles.face} fontSize="medium" />
            <Typography variant="h6">{t('change_nicknames')}</Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <List className={styles.list}>
            {members.map((o) =>
              !o.clicked ? (
                <div className={styles.member}>
                  <div className={styles.profile}>
                    <Avatar photoUrl={o.photoUrl} className={styles.avatar} />
                    <div className={styles.text}>
                      <Typography className={styles.name}>{`${o.name} ${o.surname}`}</Typography>
                      <Typography className={styles.nickname}>{nickname(o)}</Typography>
                    </div>
                  </div>
                  <div className={styles.grow} />
                  <CreateIcon className={styles.create} onClick={() => handleEdit(o)} />
                </div>
              ) : (
                <div className={styles.messageInput}>
                  <Avatar photoUrl={o.photoUrl} className={styles.avatar} />
                  <CustomTextField
                    {...content.inputProps}
                    placeholder={t('type_here')}
                    className={styles.textField}
                    multiline
                    rowsMax={Infinity}
                    inputProps={{ className: styles.writing }}
                    InputProps={{
                      disableUnderline: true,
                      endAdornment: (
                        <div style={{ display: 'flex' }}>
                          <CheckCircleIcon className={styles.check} onClick={() => handleConfirmed(o)} />
                          <CancelIcon className={styles.cancel} onClick={() => handleCanceled(o)} />
                        </div>
                      ),
                    }}
                  />
                </div>
              )
            )}
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
