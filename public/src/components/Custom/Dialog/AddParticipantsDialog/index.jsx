import React, { useState, useRef } from 'react';
import { default as CloseButton } from '../../Button';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import { useTranslation } from 'react-i18next';
import styles from './AddParticipantsDialog.module.css';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { useFormInput } from '../../../../hooks/forms';
import ParticipantsSearchList from '../../SearchList/ParticipantsSearchList';
import { Chip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { addParticipants } from '../../../../actions/service/messaging';

export default function AddParticipantsDialog(props) {
  const { open, onClose, otherParticipants, conversationId, updateConversation } = props;
  const { t } = useTranslation();
  const query = useFormInput('');
  const inputRef = useRef(null);
  const [newParticipants, setNewParticipants] = useState([]);

  const handleDeleteParticipant = (personId) => {
    setNewParticipants(newParticipants.filter((e) => e.id != personId));
  };

  const addNewFriend = async (person) => {
    setNewParticipants([...newParticipants, person]);
  };

  const confirmParticipants = () => {
    addParticipants(
      conversationId,
      newParticipants.map((p) => p.id)
    ).then(() => {
      console.log(
        'Add ',
        newParticipants.map((p) => p.id),
        'to the convo ',
        conversationId
      );
      updateConversation().then(() => {
        setNewParticipants([]);
      });
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
              label={t('search')}
              onClick={addNewFriend}
              query={query}
              secondary={t('player')}
              withoutIcon
              autoFocus
              inputRef={inputRef}
              participants={newParticipants}
              otherParticipants={otherParticipants}
            />
            {newParticipants.length ? (
              <List>
                {newParticipants.map((p) => (
                  <Chip
                    className={styles.chip}
                    label={p.completeName}
                    color="primary"
                    variant="outlined"
                    onDelete={() => handleDeleteParticipant(p.id)}
                  />
                ))}
              </List>
            ) : (
              <></>
            )}
            <Button className={styles.button} onClick={confirmParticipants}>
              <div className={styles.confirmDisplay}>
                <Typography className={styles.confirm} variant="body2">
                  {t('confirm')}
                </Typography>
                <DoneIcon className={styles.done} />
              </div>
            </Button>
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
