import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';
import Divider from '@material-ui/core/Divider';
import IgContainer from '../../components/Custom/IgContainer';
import { useTranslation } from 'react-i18next';
import styles from './Message.module.css';
import React, { useEffect, useCallback, useContext, useMemo, useState } from 'react';
import CustomAvatar from '../../components/Custom/Avatar';
import moment from 'moment';
import { Store } from '../../Store';
import IconButton from '../../components/Custom/IconButton';
import { goTo, ROUTES } from '../../actions/goTo';
import { ConversationPreview, Participant } from '../../../../typescript/conversation';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { getConversations } from '../../actions/service/messaging';

const message: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);

  const {
    state: { userInfo: userInfo },
  } = useContext(Store);

  // TODO: Call this function on websocket update
  const updateConversations = useCallback(() => {
    getConversations({ recipientId: userInfo.primaryPerson?.id }).then(setConversations);
  }, [userInfo.primaryPerson?.id]);

  useEffect(() => {
    updateConversations();
  }, [updateConversations]);

  console.log('-->', userInfo);
  //const conversationMessageApp: ConversationPreview[] = [
  /*{
      
    */
  //];

  //Sort conversation messages by last sent
  conversations.sort((a, b) => (moment(b.lastMessage?.sentAt).isBefore(moment(a.lastMessage?.sentAt)) ? 1 : -1));
  //Create Title of conversation
  // let otherThanMe: Participant[] = [];
  // const otherThanMe = conversations.map((convo) =>
  //   convo.participants.reduce(
  //     (prev, participant) =>
  //       participant.id === userInfo.primaryPerson?.personId
  //         ? prev
  //         : `${prev} ${participant.name} ${participant.surname}`,
  //     convo.name
  //   )
  // );

  // console.log({ otherThanMe });

  // conversations.map((c) => {
  //   otherThanMe = c.participants.filter((p) => p.id !== userInfo.primaryPerson?.personId);
  //   otherThanMe.map((o) => {
  //     console.log('cname : ', c.name);
  //     c.name = c.name + o.name + ' ' + o.surname + '  ';
  //   });
  // });

  console.log('conversations : ', conversations);
  const handleNewMessage = () => {
    goTo(ROUTES.newMessage);
  };

  const handleConversation = (id: any) => {
    goTo(ROUTES.conversation, { id });
  };
  //Random selection of the participants for the group photo
  const handleWhoPhoto = (conversation: ConversationPreview) => {
    const photoGuy = conversation.participants.filter((p) => p.id !== userInfo.primaryPerson?.personId);
    return photoGuy[Math.floor(Math.random() * photoGuy.length)].photoUrl;
  };

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
                onClick={handleNewMessage}
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
              {conversations.map((c, index) => (
                <>
                  {index > 0 ? <Divider className={styles.divider} /> : null}
                  <div className={styles.message} onClick={() => handleConversation(c.id)}>
                    <>
                      <CustomAvatar size="md" photoUrl={handleWhoPhoto(c)} />
                      <ListItemText
                        secondaryTypographyProps={{ className: styles.text }}
                        primaryTypographyProps={{ className: styles.name }}
                        primary={
                          c.name ||
                          c.participants
                            .filter((participant) => participant.id !== userInfo.primaryPerson?.personId)
                            .map((participant) => `${participant.name} ${participant.surname}`)
                            .join(', ')
                        }
                        secondary={c.lastMessage?.content}
                      />
                      <Typography variant="body2" className={styles.time}>
                        {moment(c.lastMessage?.sentAt).fromNow()}
                      </Typography>
                    </>
                  </div>
                </>
              ))}
            </List>
          </CardContent>
        </Card>
      </div>
    </IgContainer>
  );
};

export default message;
