import React from 'react';
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
import AddParticipantsSection from './AddParticipantsSection';
import EditMember from '../../EditMember';

export default function ManageParticipantsDialog(props) {
  const { open, onClose, otherParticipants, recipientId, conversationId, updateConversation } = props;
  const { t } = useTranslation();

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
          <List>
            {otherParticipants?.map((o) => (
              <EditMember
                key={conversationId}
                member={o}
                conversationId={conversationId}
                updateConversation={updateConversation}
              />
            ))}
          </List>
          <AddParticipantsSection
            otherParticipants={otherParticipants}
            conversationId={conversationId}
            updateConversation={updateConversation}
            recipientId={recipientId}
          />
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
