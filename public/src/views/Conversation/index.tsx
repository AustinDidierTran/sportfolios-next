import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Store } from '../../Store';
import { IConversationMessage, IConversationPreview } from '../../../../typescript/conversation';
import IgContainer from '../../components/Custom/IgContainer';
import styles from './Conversation.module.css';
import CustomAvatar from '../../components/Custom/Avatar';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import MyMessage from '../../components/MyMessage';
import FriendMessage from '../../components/FriendMessage';
import { goTo, ROUTES } from '../../actions/goTo';
import IconButton from '../../components/Custom/IconButton';
import { useFormInput } from '../../hooks/forms';
import CustomTextField from '../../components/Custom/TextField';
import { getConversationMessages, sendMessage } from '../../actions/service/messaging';
import { LoadingSpinner } from '../../components/Custom';
import moment from 'moment';

interface IProps {
  convoId: string;
}

const Conversation: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { convoId } = props;
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);
  //AJOUT BACKEND
  const [conversation, setConversation] = useState<IConversationPreview>();
  const [messages, setMessages] = useState<IConversationMessage[]>();

  const updateConversation = useCallback(() => {
    getConversationMessages(convoId).then(({ conversation, messages }) => {
      setConversation(conversation);
      setMessages(messages.sort((a, b) => (moment(a.sentAt).isBefore(b.sentAt) ? -1 : 1)));
    });
  }, [convoId]);

  useEffect(() => {
    updateConversation();
  }, [updateConversation]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateConversation();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [updateConversation]);

  //AJOUT BACKEND

  const content = useFormInput('');

  const otherParticipants = useMemo(() => {
    if (!conversation) {
      return [];
    }
    return (conversation.participants || []).filter((p) => p.id !== userInfo.primaryPerson?.personId);
  }, [conversation]);

  const onSendMessage = useCallback(() => {
    sendMessage(convoId, content.value, userInfo.primaryPerson?.personId).then(() => {
      updateConversation();
      content.reset();
    });
  }, [convoId, content.value, userInfo.primaryPerson?.personId, updateConversation]);

  const name = useMemo(() => {
    if (!conversation) {
      return '';
    }

    if (conversation.name) {
      return conversation.name;
    }

    return (conversation.participants || [])
      .filter((p) => p.id !== userInfo.primaryPerson?.personId)
      .map((p) => `${p.name} ${p.surname}`)
      .join(', ');
  }, [conversation]);

  const photoUrl = useMemo(() => {
    if (!otherParticipants.length) {
      return;
    }
    const possiblePictures = otherParticipants?.map((o) => o.photoUrl).filter((o) => o !== null);
    if (possiblePictures.length === 0) {
      return null;
    }
    const randomPhoto = possiblePictures[Math.floor(Math.random() * possiblePictures.length)];
    return randomPhoto;
  }, [otherParticipants]);

  if (!convoId || !conversation) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer className={styles.container}>
      <div className={styles.header}>
        <ArrowBackIosRoundedIcon
          onClick={() => {
            goTo(ROUTES.conversations);
          }}
          className={styles.back}
        />
        <CustomAvatar size="md" className={styles.avatar} photoUrl={photoUrl} />
        <Typography variant="h4" className={styles.name}>
          {name}
        </Typography>
      </div>
      <div className={styles.exchange}>
        {messages?.map((m: IConversationMessage) => {
          return m.sender.id === userInfo.primaryPerson?.personId ? (
            <MyMessage message={m} />
          ) : (
            <FriendMessage message={m} />
          );
        })}
      </div>
      <div className={styles.messageInput}>
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
                <IconButton onClick={onSendMessage} className={styles.send} icon="Send" />
              </div>
            ),
          }}
        />
      </div>
    </IgContainer>
  );
};
export default Conversation;
