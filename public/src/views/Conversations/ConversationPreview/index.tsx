import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { IConversationPreview } from '../../../../../typescript/conversation';
import styles from './ConversationPreview.module.css';
import CustomAvatar from '../../../components/Custom/Avatar';
import { goTo, ROUTES } from '../../../actions/goTo';
import moment from 'moment';
import { UserInfo } from '../../../../../typescript/user';

interface IProps {
  conversation: IConversationPreview;
  userInfo: UserInfo;
}

const ConversationPreview: React.FunctionComponent<IProps> = (props) => {
  const { conversation, userInfo } = props;
  const { t } = useTranslation();

  const photoUrl = useMemo(() => {
    const otherParticipants = conversation.participants.filter((p) => p.id !== userInfo.primaryPerson?.personId);
    const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];

    return randomParticipant.photoUrl;
  }, [conversation.participants]);

  const primary = useMemo(() => {
    if (conversation.name) {
      return conversation.name;
    }

    return conversation.participants
      .filter((participant) => participant.id !== userInfo.primaryPerson?.id)
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
    <div className={styles.message} onClick={() => goTo(ROUTES.conversation, { id: conversation.id })}>
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
