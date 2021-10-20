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
import ChatIcon from '@material-ui/icons/Chat';
import IconButton from '../../components/Custom/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';

const message: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);

  const conversationMessagApp = [
    {
      id: 1,
      lastMessage: {
        id: 1,
        sender: {
          id: 'a5f36c06-b0ce-4071-b761-e21293aed4bb',
          name: 'Matthiew Visosckis',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-8az1a-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sent_at: moment().year(2021).month(9).date(12).hour(11).minute(1).second(50),
        content: 'Allo gab!',
      },
    },
    {
      id: 2,
      lastMessage: {
        id: 2,
        sender: {
          id: '4f8930fc-e1c4-469f-8864-7e4847d0264c',
          name: 'Sabrina Vincent',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-2jd9f-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sent_at: moment().year(2021).month(9).date(20).hour(8).minute(1).second(5),
        content: 'Oui, ce sera parfait!',
      },
    },
    {
      id: 3,
      lastMessage: {
        id: 3,
        sender: {
          id: '359a363a-e459-415c-b615-c431e641aadc',
          name: 'Sylvie Lamer',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-hajb9-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sent_at: moment().year(2021).month(9).date(20).hour(10).minute(33).second(10),
        content: 'On se voit demain! ',
      },
    },

    {
      id: 4,
      lastMessage: {
        id: 4,
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick Bertrand',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-yeekv-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sent_at: moment().year(2021).month(9).date(20).hour(10).minute(37).second(7),
        content:
          "blue his house. with a blue little. and a blue carvet. and everything is blue for him. and him self. and everybody around. cause he ain't got nobody to listen. Im blue (daba dee ba da die) x7. Im blue (daba dee ba da die) x7. ",
      },
    },
  ];
  conversationMessagApp.sort(
    (a, b) => b.lastMessage.sent_at.diff(moment(), 'seconds') - a.lastMessage.sent_at.diff(moment(), 'seconds')
  );

  const handleMessageView = (c: any) => {};
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
            action={<IconButton className={styles.create} tooltip={t('new_message')} icon="Create" size="large" />}
          />
          <CardContent>
            <Divider className={styles.divider} />
            <List>
              {conversationMessagApp.map((c, index) => (
                <>
                  {index > 0 ? <Divider className={styles.divider} /> : null}
                  <div className={styles.message}>
                    <CustomAvatar size="md" photoUrl={c.lastMessage.sender.photoUrl} />
                    <ListItemText
                      secondaryTypographyProps={{ className: styles.text }}
                      primaryTypographyProps={{ className: styles.name }}
                      primary={c.lastMessage.sender.name}
                      secondary={c.lastMessage.content}
                      onClick={() => handleMessageView(c)}
                    />
                    <Typography variant="body2" className={styles.time}>
                      {moment(c.lastMessage.sent_at).fromNow()}
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
