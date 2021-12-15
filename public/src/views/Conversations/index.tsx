import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IgContainer from '../../components/Custom/IgContainer';
import { useTranslation } from 'react-i18next';
import styles from './Conversations.module.css';
import React, { useEffect, useCallback, useContext, useState, useMemo } from 'react';
import moment from 'moment';
import { Store } from '../../Store';
import IconButton from '../../components/Custom/IconButton';
import { goTo, ROUTES } from '../../actions/goTo';
import { IConversationPreview, IConversationMessage, Recipient } from '../../../../typescript/conversation';
import { SOCKET_EVENT } from '../../../common/enums';
import { getConversations, getAllOwnedEntitiesMessaging } from '../../actions/service/messaging';
import ConversationPreview from './ConversationPreview';
import ChooseRecipient from '../../components/Custom/ChooseRecipient';
import { Person } from '../../../../typescript/entity';
import CustomAvatar from '../../components/Custom/Avatar';
import { CodeSharp } from '@material-ui/icons';

interface IProps {
  recipientId: string;
}

const Conversations: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { recipientId } = props;
  const {
    state: { userInfo: userInfo, socket },
  } = useContext(Store);
  const [conversations, setConversations] = useState<IConversationPreview[]>([]);
  const [recipientOptions, setRecipientOptions] = useState<Recipient[]>([]);

  const updateConversations = useCallback(() => {
    getConversations({ recipientId: recipientId }).then((newConversations: IConversationPreview[]) => {
      if (!newConversations) {
        return;
      }
      setConversations(newConversations);
      getAllOwnedEntitiesMessaging().then((recipients: Recipient[]) => {
        if (!recipients) {
          console.log('!recipient');
          return;
        }
        console.log('recipientOptions : ', recipients);
        setRecipientOptions(recipients);
      });
    });
  }, [recipientId]);

  const incrementUnSeenMessages = useCallback(
    async (message) => {
      if (!recipientOptions) {
        return;
      }
      console.log('message', message);
      const recipientOptionsCopy = [...recipientOptions];
      const activeConversation = conversations.filter((c) => c.id === message.conversationId);
      console.log('activeConversation', activeConversation);
      if (activeConversation.length === 0) {
        console.log('renter');
        updateConversations();
        return;
      }
      const participantsId = activeConversation[0].participants.map((p) => p.id);
      participantsId.map((p) => {
        const optionsId = recipientOptions.map((op) => op.id);
        const index = optionsId.indexOf(p);
        console.log('index:', index);
        if (index !== -1 && recipientOptions[index].id !== message.sender.id) {
          console.log('recipient qui est dans la convo', recipientOptionsCopy[index].name);
          recipientOptionsCopy[index].unreadMessagesAmount = recipientOptionsCopy[index].unreadMessagesAmount + 1;
        }
      });
      console.log('recipientOptionsCopy : ', recipientOptionsCopy);
      console.log('recpientoptions : ', recipientOptions);
      setRecipientOptions(recipientOptionsCopy);
    },
    [recipientOptions, conversations, updateConversations]
  );

  const recipient = useMemo<Recipient>(() => {
    if (recipientOptions.length === 0) {
      return;
    }
    return recipientOptions.find((r: Recipient) => r.id === recipientId);
  }, [recipientOptions, recipientId]);

  useEffect(() => {
    updateConversations();
  }, [updateConversations]);

  useEffect(() => {
    socket.on(SOCKET_EVENT.MESSAGES, (message: IConversationMessage) => {
      if (!message) {
        return;
      }
      incrementUnSeenMessages(message).then(() => {
        setConversations((oldConversations) => {
          const conversationsCopy = [...oldConversations];
          const conversationIds = conversationsCopy?.map((c) => c.id);
          const index = conversationIds.indexOf(message.conversationId);
          if (!conversationsCopy) {
            return;
          }
          if (index === -1) {
            updateConversations();
            return;
          }
          conversationsCopy[index].lastMessage = message;

          return conversationsCopy;
        });
      });
    });
    return () => {
      socket.off(SOCKET_EVENT.MESSAGES);
    };
  }, [conversations]);

  const orderedConversations = useMemo(() => {
    if (!conversations) {
      return;
    }
    const ordered = conversations.sort((a, b) => {
      if (!b.lastMessage) {
        return -1;
      }
      if (!a.lastMessage) {
        return 1;
      }

      return moment(b.lastMessage.sentAt).isBefore(moment(a.lastMessage.sentAt)) ? -1 : 1;
    });
    return ordered;
  }, [conversations]);

  //Change Person
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleChangePerson = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    //Change Person
  };

  return (
    <IgContainer>
      <div className={styles.center}>
        <Card className={styles.card}>
          <CardHeader
            className={styles.cardHeader}
            title={
              <div className={styles.header}>
                <Typography className={styles.title} variant="h3">
                  {t('messages')}
                </Typography>
              </div>
            }
            action={
              <div className={styles.options}>
                <div onClick={handleChangePerson}>
                  <CustomAvatar photoUrl={recipient?.photoUrl} className={styles.recipient} />
                </div>
                <IconButton
                  onClick={() => {
                    goTo(ROUTES.newMessage, null, { recipientId: recipientId });
                  }}
                  className={styles.create}
                  tooltip={t('new_message')}
                  icon="Add"
                  size="large"
                />
              </div>
            }
          />
          <div className={styles.cardContent}>
            <List>
              {orderedConversations?.map((c) => (
                <ConversationPreview conversation={c} recipientId={recipientId} />
              ))}
            </List>
          </div>
        </Card>
      </div>
      <ChooseRecipient
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        recipientOptions={recipientOptions}
        updateConversations={updateConversations}
        setRecipientOptions={setRecipientOptions}
      />
    </IgContainer>
  );
};

export default Conversations;
