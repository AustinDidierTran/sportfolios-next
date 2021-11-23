import React from 'react';
import { default as CloseButton } from '../../Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import { useTranslation } from 'react-i18next';
import styles from './ChangeNameDialog.module.css';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { useFormInput } from '../../../../hooks/forms';
import CustomTextField from '../../TextField';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';
import Button from '@material-ui/core/Button';
import { updateConversationName } from '../../../../actions/service/messaging';

export default function ChangeNameDialog(props) {
  const { open, onClose, conversationId, updateConversation } = props;
  const { t } = useTranslation();
  const content = useFormInput('');

  const handleConfirmed = () => {
    updateConversationName(conversationId, content.value);
    console.log('le nouveau nom de la convo  ', conversationId, 'est ', content.value);
    updateConversation();
    content.reset();
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <DialogTitle>
          <div className={styles.title}>
            <CreateIcon className={styles.create} fontSize="medium" />
            <Typography variant="h6"> {t('change_conversation_name')}</Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className={styles.center}>
            <CustomTextField
              {...content.inputProps}
              variant="standard"
              placeholder={t('type_here')}
              className={styles.textField}
              multiline
              rowsMax={Infinity}
              inputProps={{ className: styles.writing }}
            />
            <Button className={styles.button} onClick={handleConfirmed}>
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
