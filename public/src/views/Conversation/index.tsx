import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ListItemText, Typography } from '@material-ui/core';
import moment from 'moment';
import { Store } from '../../Store';
import { ConversationView, Message } from '../../../../typescript/types';
import IgContainer from '../../components/Custom/IgContainer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { StylesContext } from '@material-ui/styles';
import styles from './Conversation.module.css';
import CustomAvatar from '../../components/Custom/Avatar';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import List from '@material-ui/core/List';
interface IProps {
  convoId: string;
}

const Conversation: React.FunctionComponent<IProps> = (props) => {
  const { convoId } = props;
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);
  const conversation: ConversationView = {
    id: convoId,
    messages: [
      {
        id: 'kafhgnsrh',
        sender: {
          id: userInfo.primaryPerson?.personId,
          name: userInfo.primaryPerson?.name,
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 11:00:12',
        content: 'Merci ! ',
      },
      {
        id: 'kafhgndfsfgsfsrh',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick Bertrand',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-yeekv-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sentAt: '2021-10-21 07:20:12',
        content: 'Allo ! Comment ca va? ',
      },
      {
        id: 'kagfsgfdghgrh',
        sender: {
          id: userInfo.primaryPerson?.personId,
          name: userInfo.primaryPerson?.name,
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 09:43:12',
        content: "Bien, quelles sont les lyrics de I'm blue ? ",
      },
      {
        id: 'kafgghhjjmnbvch',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick Bertrand',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-yeekv-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sentAt: '2021-10-21 12:43:12',
        content: 'Derien ! ',
      },
      {
        id: 'kafhgbgfnhjmh',
        sender: {
          id: userInfo.primaryPerson?.personId,
          name: userInfo.primaryPerson?.name,
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 06:41:12',
        content: 'Salut! ',
      },
      {
        id: 'kafgtehyjukirh',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick Bertrand',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-yeekv-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sentAt: '2021-10-21 10:43:12',
        content:
          "blue his house. with a blue little. and a blue carvet. and everything is blue for him. and him self. and everybody around. cause he ain't got nobody to listen. Im blue (daba dee ba da die) x7. Im blue (daba dee ba da die) x7. ",
      },
    ],
  };

  const test = (m: any) => {
    console.log('m.sender.id : ', m.sender.id, 'userInfo.id : ', userInfo.primaryPerson?.personId);
    let truth = false;
    if (m.sender.id === userInfo.pirmaryPersonon?.personId) {
      truth = true;
      console.log(truth);
      return truth;
    }
    console.log(truth);
    return truth;
  };

  conversation.messages.sort(
    (a, b) => moment(a.sentAt).diff(moment(), 'seconds') - moment(b.sentAt).diff(moment(), 'seconds')
  );

  const { t } = useTranslation();
  return (
    <IgContainer className={styles.container}>
      <div className={styles.conversation}>
        <div className={styles.friend}>
          <ArrowBackIosRoundedIcon className={styles.back} />
          <CustomAvatar size="md" className={styles.avatar} photoUrl={conversation.messages[1].sender.photoUrl} />
          <Typography variant="h4" className={styles.name}>
            {conversation.messages[1].sender.name}
          </Typography>
        </div>
        <div className={styles.exchange}>
          <List>
            {conversation.messages.map((m, index) => (
              <div className={styles.avatarConvo}>
                {test(m) ? <></> : <CustomAvatar photoUrl={m.sender.photoUrl} />}
                <ListItemText primary={m.content} />
              </div>
            ))}
          </List>
        </div>
      </div>
    </IgContainer>
  );
};
export default Conversation;
