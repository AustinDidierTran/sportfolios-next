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
import React, { useEffect, useContext, useMemo } from 'react';
import CustomAvatar from '../../components/Custom/Avatar';
import moment from 'moment';
import { Store } from '../../Store';
import IconButton from '../../components/Custom/IconButton';
import { goTo, ROUTES } from '../../actions/goTo';
import { ConversationPreview } from '../../../../typescript/conversation';
import ArrowBack from '@material-ui/icons/ArrowBack';

const message: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const conversationMessagApp: ConversationPreview[] = [
    {
      id: 'asuhdi23',
      lastMessage: {
        id: 'fwnerjv',
        sender: {
          id: 'a5f36c06-b0ce-4071-b761-e21293aed4bb',
          name: 'Matthiew',
          surname: 'Visockis',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-8az1a-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sentAt: '2021-10-21 11:20:12',
        content: 'Allo gab!',
      },
    },
    {
      id: 'dhjaefhew',
      lastMessage: {
        id: 'fjwnvbf',
        sender: {
          id: '4f8930fc-e1c4-469f-8864-7e4847d0264c',
          name: 'Sabrina',
          surname: 'Vincent',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-2jd9f-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sentAt: '2021-10-21 11:30:12',
        content: 'Oui, ce sera parfait!',
      },
    },
    {
      id: 'fhiauhbvue',
      lastMessage: {
        id: 'kfivjren',
        sender: {
          id: '359a363a-e459-415c-b615-c431e641aadc',
          name: 'Sylvie',
          surname: 'Lamer',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-hajb9-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sentAt: '2021-10-22 16:20:12',
        content: 'On se voit demain! ',
      },
    },

    {
      id: 'fijcna',
      lastMessage: {
        id: 'fhgeruvwjieko',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-yeekv-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sentAt: '2021-10-22 10:42:12',
        content:
          "blue his house. with a blue little. and a blue carvet. and everything is blue for him. and him self. and everybody around. cause he ain't got nobody to listen. Im blue (daba dee ba da die) x7. Im blue (daba dee ba da die) x7. ",
      },
    },
  ];
  conversationMessagApp.sort(
    (a, b) =>
      moment(b.lastMessage.sentAt).diff(moment(), 'seconds') - moment(a.lastMessage.sentAt).diff(moment(), 'seconds')
  );
  const handleNewMessage = () => {
    goTo(ROUTES.newMessage);
  };

  const handleConversation = (id: any) => {
    goTo(ROUTES.conversation, { id });
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
              {conversationMessagApp.map((c, index) => (
                <>
                  {index > 0 ? <Divider className={styles.divider} /> : null}
                  <div className={styles.message} onClick={() => handleConversation(c.id)}>
                    <CustomAvatar size="md" photoUrl={c.lastMessage.sender.photoUrl} />
                    <ListItemText
                      secondaryTypographyProps={{ className: styles.text }}
                      primaryTypographyProps={{ className: styles.name }}
                      primary={c.lastMessage.sender.name + '  ' + c.lastMessage.sender.surname}
                      secondary={c.lastMessage.content}
                    />
                    <Typography variant="body2" className={styles.time}>
                      {moment(c.lastMessage.sentAt).fromNow()}
                    </Typography>
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
