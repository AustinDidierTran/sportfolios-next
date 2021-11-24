import React, { useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Store } from '../../Store';
import { IConversationMessage, IConversationPreview } from '../../../../typescript/conversation';
import IgContainer from '../../components/Custom/IgContainer';
import styles from './Conversation.module.css';
import CustomAvatar from '../../components/Custom/Avatar';
import Options from '../../components/Custom/Options';
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
import { SOCKET_EVENT } from '../../../common/enums';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

interface IHash {
  [details: string]: string;
}

interface IProps {
  convoId: string;
  recipientId: string;
}

const Conversation: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { convoId, recipientId } = props;
  const {
    state: { socket, userInfo: userInfo },
  } = useContext(Store);
  //AJOUT BACKEND
  const [conversation, setConversation] = useState<IConversationPreview>();
  const [messages, setMessages] = useState<IConversationMessage[]>();

  useEffect(() => {
    socket.on(SOCKET_EVENT.MESSAGES, (message: IConversationMessage) => {
      if (convoId === message.conversationId) {
        console.log('message: ', message);
        setMessages((messages) => {
          console.log('[...messages, message]', [...messages, message]);
          return [...messages, message];
        });
      }
    });
    return () => {
      socket.off(SOCKET_EVENT.MESSAGES);
    };
  }, []);

  const updateConversation = useCallback(async () => {
    return getConversationMessages(convoId).then(
      ({ conversation, messages } = { conversation: null, messages: [] }) => {
        if (!conversation) {
          return;
        }

        setConversation(conversation);
        setMessages(messages.sort((a, b) => (moment(a.sentAt).isBefore(b.sentAt) ? -1 : 1)));
      }
    );
  }, [convoId]);

  useEffect(() => {
    updateConversation();
  }, [updateConversation]);

  //AJOUT BACKEND

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const content = useFormInput('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const nicknameMap = useMemo<IHash>(() => {
    if (!conversation) {
      return {};
    }

    return conversation.participants.reduce(
      (prev, participant) => ({
        ...prev,
        [participant.id]: participant.nickname,
      }),
      {}
    );
  }, [
    conversation?.participants.map((p) => {
      p.nickname;
    }),
  ]);

  const findNickname = useCallback(
    (message: IConversationMessage) => nicknameMap[message.sender.id],
    [
      conversation?.participants.map((p) => {
        p.nickname;
      }),
    ]
  );

  const otherParticipants = useMemo(() => {
    if (!conversation) {
      return [];
    }
    return (conversation.participants || []).filter((p) => p.id !== recipientId);
  }, [conversation]);

  const onSendMessage = useCallback(() => {
    sendMessage(convoId, content.value, recipientId).then(() => {
      content.reset();
    });
  }, [convoId, content.value, recipientId, updateConversation]);

  const name = useMemo(() => {
    if (!conversation) {
      return '';
    }

    if (conversation.name) {
      return conversation.name;
    }

    return (conversation.participants || [])
      .filter((p) => p.id !== recipientId)
      .map((p) => `${p.name} ${p.surname}`)
      .join(', ');
  }, [conversation]);

  const photoUrl = useMemo(() => {
    if (!otherParticipants || !otherParticipants.length) {
      return;
    }
    const possiblePictures = otherParticipants?.map((o) => o.photoUrl).filter((o) => o !== null);
    if (!possiblePictures || possiblePictures.length === 0) {
      return null;
    }
    const randomPhoto = possiblePictures[Math.floor(Math.random() * possiblePictures.length)];
    return randomPhoto;
  }, [otherParticipants]);

  if (!convoId || !conversation) {
    return <LoadingSpinner />;
  }
  //TEST

  console.log('recipient dans conversation : ', conversation.participants.filter((p) => p.id === recipientId)[0].name);

  return (
    <IgContainer className={styles.container}>
      <div className={styles.header}>
        <ArrowBackIosRoundedIcon
          onClick={() => {
            goTo(ROUTES.conversations, null, { recipientId: recipientId });
          }}
          className={styles.back}
        />
        <CustomAvatar size="md" className={styles.avatar} photoUrl={photoUrl} />
        <Typography variant="h4" className={styles.name}>
          {name}
        </Typography>
        <div className={styles.grow} />
        <Tooltip title={t('settings')}>
          <Button onClick={handleClick} className={styles.button}>
            <MoreVertIcon className={styles.settings} />
          </Button>
        </Tooltip>
      </div>
      <div className={styles.exchange}>
        {messages?.map((m: IConversationMessage) => {
          return m.sender.id === recipientId ? (
            <MyMessage message={m} />
          ) : (
            <FriendMessage message={m} nickname={nicknameMap[m.sender.id]} />
          );
        })}
        <div ref={messagesEndRef} />
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
      <Options
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        otherParticipants={otherParticipants}
        conversationId={conversation.id}
        updateConversation={updateConversation}
      />
    </IgContainer>
  );
};
export default Conversation;
