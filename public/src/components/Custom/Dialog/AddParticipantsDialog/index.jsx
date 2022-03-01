import React, { useRef } from 'react';
import { default as CloseButton } from '../../Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import { useTranslation } from 'react-i18next';
import styles from './AddParticipantsDialog.module.css';
import { useFormInput } from '../../../../hooks/forms';
import ParticipantsSearchList from '../../SearchList/ParticipantsSearchList';
import { addParticipants } from '../../../../actions/service/messaging';

export default function AddParticipantsDialog(props) {
  const { open, onClose, otherParticipants, conversationId, updateConversation, recipientId } = props;
  const { t } = useTranslation();
  const query = useFormInput('');
  const inputRef = useRef(null);
  const addNewFriend = async (person) => {
    const personId = [person.id];
    addParticipants(conversationId, personId).then(() => {
      updateConversation();
    });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        fullWidth="true"
      >
        <DialogTitle>
          <div className={styles.title}>
            <Add className={styles.add} fontSize="medium" />
            <Typography variant="h6">{t('add.add_people')}</Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className={styles.content}>
            <ParticipantsSearchList
              className={styles.search}
              clearOnSelect={false}
              label={t('search.title')}
              onClick={addNewFriend}
              query={query}
              secondary={t('player')}
              withoutIcon
              autoFocus
              inputRef={inputRef}
              otherParticipants={otherParticipants}
              recipientId={recipientId}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <CloseButton onClick={onClose} variant="text">
            {t('close')}
          </CloseButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
