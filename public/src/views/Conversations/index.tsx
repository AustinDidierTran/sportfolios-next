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
import { IConversationPreview, IConversationMessage } from '../../../../typescript/conversation';
import { SOCKET_EVENT } from '../../../common/enums';
import { getConversations } from '../../actions/service/messaging';
import ConversationPreview from './ConversationPreview';

const Conversations: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<IConversationPreview[]>([]);

  const {
    state: { userInfo: userInfo, socket },
  } = useContext(Store);

  console.log('userInfo  :', userInfo);
  // TODO: Call this function on websocket update
  const updateConversations = useCallback(() => {
    getConversations({ recipientId: userInfo.primaryPerson?.id }).then((newConversations: IConversationPreview[]) => {
      if (!newConversations) {
        return;
      }
      setConversations(newConversations);
    });
  }, [userInfo.primaryPerson?.id]);

  useEffect(() => {
    updateConversations();
  }, [updateConversations]);

  useEffect(() => {
    // if (!conversations.length) {
    //   return;
    // }
    socket.on(SOCKET_EVENT.MESSAGES, (message: IConversationMessage) => {
      if (!message) {
        console.log('!message');
        return;
      }

      setConversations((oldConversations) => {
        const conversationsCopy: IConversationPreview[] = [...oldConversations];
        console.log('conversaitonsCopy', conversationsCopy);
        const conversationIds = conversationsCopy?.map((c) => c.id);
        console.log('conversaitonsIds: ', conversationIds);
        const index = conversationIds.indexOf(message.conversationId);
        console.log('index : ', index);
        if (!conversationsCopy) {
          return;
        }
        if (index === -1) {
          return;
        }
        console.log('message : ', message);
        console.log('oldLastMessage : ', conversationsCopy[index].lastMessage);
        conversationsCopy[index].lastMessage = message;
        console.log('NewLastMessage : ', conversationsCopy[index].lastMessage);
        return conversationsCopy;
      });
    });
    return () => {
      socket.off(SOCKET_EVENT.MESSAGES);
    };
  }, [conversations]);

  const orderedConversations = useMemo(
    () =>
      conversations.sort((a, b) => {
        if (!b.lastMessage) {
          return -1;
        }
        if (!a.lastMessage) {
          return 1;
        }

        return moment(b.lastMessage.sentAt).isBefore(moment(a.lastMessage.sentAt)) ? -1 : 1;
      }),
    [conversations]
  );

  return (
    <IgContainer>
      <div className={styles.center}>
        <Card className={styles.card}>
          <CardHeader
            title={
              <div className={styles.header}>
                <Typography className={styles.title} variant="h3">
                  {t('messages')}
                </Typography>
              </div>
            }
            action={
              <IconButton
                onClick={() => {
                  goTo(ROUTES.newMessage);
                }}
                className={styles.create}
                tooltip={t('new_message')}
                icon="Create"
                size="large"
              />
            }
          />
          <CardContent>
            <Divider className={styles.divider} />
            <List>
              {orderedConversations.map((c) => (
                <>
                  <ConversationPreview conversation={c} userInfo={userInfo} />
                  <Divider className={styles.divider} />
                </>
              ))}
            </List>
          </CardContent>
        </Card>
      </div>
    </IgContainer>
  );
};

export default Conversations;
