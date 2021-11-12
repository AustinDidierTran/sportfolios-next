import React from 'react';
import Button from '../../Button';
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

export default function ChangeNameDialog(props) {
  const { open, onClose, otherParticipants, conversationId } = props;
  const { t } = useTranslation();
  const content = useFormInput('');

  const handleConfirmed = () => {
    console.log('le nouveau nom de la convo  ', conversationId, 'est ', content.value);
    content.reset();
  };
  const handleCanceled = () => {
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
              placeholder={t('type_here')}
              className={styles.textField}
              multiline
              rowsMax={Infinity}
              inputProps={{ className: styles.writing }}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <div style={{ display: 'flex' }}>
                    <CheckCircleIcon className={styles.check} onClick={handleConfirmed} />
                  </div>
                ),
              }}
            />
          </div>
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
