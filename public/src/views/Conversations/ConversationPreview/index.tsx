import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { IConversationPreview, Recipient } from '../../../../../typescript/conversation';
import styles from './ConversationPreview.module.css';
import CustomAvatar from '../../../components/Custom/Avatar';
import { goTo, ROUTES } from '../../../actions/goTo';
import moment from 'moment';

interface IProps {
  conversation: IConversationPreview;
  recipientId: string;
}

const ConversationPreview: React.FunctionComponent<IProps> = (props) => {
  const { conversation, recipientId } = props;
  const { t } = useTranslation();

  const photoUrl = useMemo(() => {
    if (!conversation.participants.length) {
      return;
    }
    const possiblePictures = conversation.participants
      .filter((p) => p.id !== recipientId)
      .map((o) => o.photoUrl)
      .filter((o) => o !== null);

    if (!possiblePictures || possiblePictures.length === 0) {
      return null;
    }
    const randomPhoto = possiblePictures[Math.floor(Math.random() * possiblePictures.length)];
    return randomPhoto;
  }, [conversation.participants]);

  const primary = useMemo(() => {
    if (conversation.name) {
      return conversation.name;
    }

    console.log(123, conversation.participants);

    return conversation.participants
      .filter((participant) => participant.id !== recipientId)
      .map((participant) => `${participant.name} ${participant.surname}`)
      .join(', ');
  }, [conversation.name, conversation.participants]);

  const secondary = useMemo(() => {
    if (!conversation.lastMessage) {
      return t('messaging.empty_conversation');
    }

    return conversation.lastMessage.content;
  }, [conversation.lastMessage?.content]);

  const time = useMemo(() => {
    if (!conversation.lastMessage) {
      return null;
    }

    return moment(conversation.lastMessage?.sentAt).fromNow();
  }, [conversation.lastMessage]);

  return (
    <div
      className={styles.message}
      onClick={() => goTo(ROUTES.conversation, { convoId: conversation.id }, { recipientId: recipientId })}
    >
      <CustomAvatar size="md" photoUrl={photoUrl} />
      <ListItemText
        secondaryTypographyProps={{ className: styles.text }}
        primaryTypographyProps={{ className: styles.name }}
        primary={primary}
        secondary={secondary}
      />
      <Typography variant="body2" className={styles.time}>
        {time}
      </Typography>
    </div>
  );
};

export default ConversationPreview;
