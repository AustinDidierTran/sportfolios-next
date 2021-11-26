import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EditMember.module.css';
import Delete from '@material-ui/icons/Delete';
import Avatar from '../Avatar';
import CreateIcon from '@material-ui/icons/Create';
import { Typography } from '@material-ui/core';
import { removeParticipant } from '../../../actions/service/messaging';
import { useFormInput } from '../../../hooks/forms';
import ChangeNicknameSection from '.././Dialog/ManageParticipantsDialog/ChangeNicknameSection';
import Tooltip from '@material-ui/core/Tooltip';

export default function EditMember(props) {
  const { t } = useTranslation();
  const { conversationId, member, updateConversation } = props;
  const [clicked, setClicked] = useState(false);

  const handleEdit = () => {
    setClicked(true);
  };

  const handleDelete = () => {
    removeParticipant(conversationId, member.id).then(() => {
      updateConversation();
    });
  };

  const nickname = useMemo(() => {
    if (!member.nickname) {
      return t('no.no_nickname');
    }
    return member.nickname;
  }, [member.nickname]);

  if (clicked) {
    return (
      <ChangeNicknameSection
        updateConversation={updateConversation}
        member={member}
        clicked={clicked}
        setClicked={setClicked}
        conversationId={conversationId}
      />
    );
  }

  return (
    <div className={styles.member}>
      <div className={styles.profile}>
        <Avatar photoUrl={member.photoUrl} className={styles.avatar} />
        <div className={styles.text}>
          <Typography className={styles.name}>{`${member.name} ${member.surname}`}</Typography>
          <Typography className={styles.nickname}>{nickname}</Typography>
        </div>
      </div>
      <div className={styles.grow} />
      <Tooltip title={t('change_nicknames')}>
        <CreateIcon className={styles.create} onClick={handleEdit} />
      </Tooltip>
      <Tooltip title={t('delete.delete_participants')}>
        <Delete className={styles.delete} onClick={handleDelete} />
      </Tooltip>
    </div>
  );
}
