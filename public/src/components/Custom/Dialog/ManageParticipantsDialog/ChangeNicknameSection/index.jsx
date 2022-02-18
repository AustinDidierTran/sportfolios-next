import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ChangeNicknameSection.module.css';
import Avatar from '../../../Avatar';
import CustomTextField from '../../../TextField';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { useFormInput } from '../../../../../hooks/forms';
import { updateNickname } from '../../../../../actions/service/messaging';

export default function ChangeNicknameSection(props) {
  const { member, conversationId, setClicked, updateConversation } = props;
  const content = useFormInput('');
  const { t } = useTranslation();

  const handleConfirmed = () => {
    updateNickname(conversationId, member.id, content.value).then(() => {
      updateConversation().then(() => {
        content.reset();
        setClicked(false);
      });
    });
  };

  const handleCanceled = () => {
    setClicked(false);
    content.reset();
  };
  return (
    <div className={styles.messageInput}>
      <Avatar photoUrl={member.photoUrl} className={styles.avatar} />
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
              <CancelIcon className={styles.cancel} onClick={handleCanceled} />
            </div>
          ),
        }}
      />
    </div>
  );
}
