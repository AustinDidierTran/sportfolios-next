import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import styles from './QuitConvoDialog.module.css';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '../../Button';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { Store } from '../../../../Store';
import { removeParticipant } from '../../../../actions/service/messaging';

export default function QuitConvoDialog(props) {
  const { open, onClose, conversationId, updateConversation } = props;
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);
  const { t } = useTranslation();

  const handleQuit = () => {
    removeParticipant(conversationId, userInfo.primaryPerson?.id);
    console.log('Remove ', userInfo.primaryPerson?.id, 'from conversaton ', conversationId);
    goTo(ROUTES.conversations);
  };
  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <DialogTitle>
          <div className={styles.title}>
            <ExitToAppIcon className={styles.exit} fontSize="medium" />
            <Typography variant="h6"> {t('quit_conversation')}</Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>{t('are_you_sure_quit')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="text" className={styles.cancel}>
            {t('cancel')}
          </Button>
          <Button onClick={handleQuit} variant="text" className={styles.quit}>
            {t('quit')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
