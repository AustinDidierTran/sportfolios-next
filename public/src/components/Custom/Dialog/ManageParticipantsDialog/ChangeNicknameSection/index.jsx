import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ChangeNicknameSection.module.css';
import Avatar from '../../../Avatar';
import CustomTextField from '../../../TextField';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { useFormInput } from '../../../../../hooks/forms';

export default function ChangeNicknameSection(props) {
  const { participant, open, members, setMembers, conversationId } = props;
  const content = useFormInput('');
  const { t } = useTranslation();

  const handleConfirmed = (participant) => {
    if (open) {
      console.log(
        'nouveau surnom de ',
        participant.name,
        'est : ',
        content.value,
        'de la conversation ',
        conversationId
      );
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
  return (
    <div className={styles.messageInput}>
      <Avatar photoUrl={participant.photoUrl} className={styles.avatar} />
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
              <CheckCircleIcon className={styles.check} onClick={() => handleConfirmed(participant)} />
              <CancelIcon className={styles.cancel} onClick={() => handleCanceled(participant)} />
            </div>
          ),
        }}
      />
    </div>
  );
}
