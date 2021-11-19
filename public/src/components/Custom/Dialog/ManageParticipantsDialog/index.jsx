import React, { useState, useMemo } from 'react';
import Button from '../../Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import FaceIcon from '@material-ui/icons/Face';
import { useTranslation } from 'react-i18next';
import styles from './ManageParticipantsDialog.module.css';
import List from '@material-ui/core/List';
import Avatar from '../../Avatar';
import CreateIcon from '@material-ui/icons/Create';
import ChangeNicknameSection from './ChangeNicknameSection';
import AddParticipantsSection from './AddParticipantsSection';
import { useFormInput } from '../../../../hooks/forms';
import Delete from '@material-ui/icons/Delete';

export default function ManageParticipantsDialog(props) {
  const { open, onClose, otherParticipants, conversationId } = props;
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

  const handleDelete = (participant) => {
    console.log(participant.name, 'is removed from conversation ', conversationId);
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
            <Typography variant="h6">{t('manage_participants')}</Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <List className={styles.list}>
            {members?.map((o) =>
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
                  <Delete className={styles.delete} onClick={() => handleDelete(o)} />
                </div>
              ) : (
                <ChangeNicknameSection
                  participant={o}
                  open={open}
                  members={members}
                  setMembers={setMembers}
                  conversationId={conversationId}
                />
              )
            )}
          </List>
          <AddParticipantsSection otherParticipants={otherParticipants} conversationId={conversationId} />
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
