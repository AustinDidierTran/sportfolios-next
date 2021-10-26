import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ListItemText, Typography } from '@material-ui/core';
import moment from 'moment';
import { Store } from '../../Store';
import { Conversation, Message } from '../../../../typescript/conversation';
import IgContainer from '../../components/Custom/IgContainer';
import styles from './Conversation.module.css';
import CustomAvatar from '../../components/Custom/Avatar';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import link from 'next/link';
import MyMessage from '../../components/MyMessage';
import FriendMessage from '../../components/FriendMessage';
import { goTo, ROUTES } from '../../actions/goTo';
import TextField from '@material-ui/core/TextField';
import IconButton from '../../components/Custom/IconButton';
interface IProps {
  convoId: string;
}

const conversation: React.FunctionComponent<IProps> = (props) => {
  const { convoId } = props;
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);

  const conversation: Conversation = {
    id: convoId,
    messages: [
      {
        id: 'kafhgnsrh',
        sender: {
          id: userInfo.primaryPerson?.personId,
          name: userInfo.primaryPerson?.name,
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 11:00:12',
        content: 'Merci ! ',
      },
      {
        id: 'kafhgndfsfgsfsrh',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
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
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 09:43:12',
        content: "Bien, quelles sont les lyrics de I'm blue ? ",
      },
      {
        id: 'kafgghhjjmnbvch',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
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
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 06:41:12',
        content: 'Salut! ',
      },
      {
        id: 'kafgtehyjukirh',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-yeekv-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sentAt: '2021-10-21 10:43:12',
        content:
          "blue his house. with a blue little. and a blue carvet. and everything is blue for him. and him self. and everybody around. cause he ain't got nobody to listen. Im blue (daba dee ba da die) x7. Im blue (daba dee ba da die) x7. ",
      },
      {
        id: 'kafhgnsrh',
        sender: {
          id: userInfo.primaryPerson?.personId,
          name: userInfo.primaryPerson?.name,
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 11:00:12',
        content: 'Merci ! ',
      },
      {
        id: 'kafhgndfsfgsfsrh',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
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
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 09:43:12',
        content: "Bien, quelles sont les lyrics de I'm blue ? ",
      },
      {
        id: 'kafgghhjjmnbvch',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
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
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 06:41:12',
        content: 'Salut! ',
      },
      {
        id: 'kafgtehyjukirh',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-yeekv-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sentAt: '2021-10-21 10:43:12',
        content:
          "blue his house. with a blue little. and a blue carvet. and everything is blue for him. and him self. and everybody around. cause he ain't got nobody to listen. Im blue (daba dee ba da die) x7. Im blue (daba dee ba da die) x7. ",
      },
      {
        id: 'kafhgnsrh',
        sender: {
          id: userInfo.primaryPerson?.personId,
          name: userInfo.primaryPerson?.name,
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 11:00:12',
        content: 'Merci ! ',
      },
      {
        id: 'kafhgndfsfgsfsrh',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
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
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 09:43:12',
        content: "Bien, quelles sont les lyrics de I'm blue ? ",
      },
      {
        id: 'kafgghhjjmnbvch',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
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
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 06:41:12',
        content: 'Salut! ',
      },
      {
        id: 'kafgtehyjukirh',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-yeekv-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sentAt: '2021-10-21 10:43:12',
        content:
          "blue his house. with a blue little. and a blue carvet. and everything is blue for him. and him self. and everybody around. cause he ain't got nobody to listen. Im blue (daba dee ba da die) x7. Im blue (daba dee ba da die) x7. ",
      },
      {
        id: 'kafhgnsrh',
        sender: {
          id: userInfo.primaryPerson?.personId,
          name: userInfo.primaryPerson?.name,
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 11:00:12',
        content: 'Merci ! ',
      },
      {
        id: 'kafhgndfsfgsfsrh',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
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
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 09:43:12',
        content: "Bien, quelles sont les lyrics de I'm blue ? ",
      },
      {
        id: 'kafgghhjjmnbvch',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
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
          surname: 'none',
          photoUrl: userInfo.primaryPerson?.photoUrl,
        },
        sentAt: '2021-10-21 06:41:12',
        content: 'Salut! ',
      },
      {
        id: 'kafgtehyjukirh',
        sender: {
          id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
          name: 'Yanick',
          surname: 'Bertrand',
          photoUrl:
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-yeekv-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
        },
        sentAt: '2021-10-21 10:43:12',
        content:
          "blue his house. with a blue little. and a blue carvet. and everything is blue for him. and him self. and everybody around. cause he ain't got nobody to listen. Im blue (daba dee ba da die) x7. Im blue (daba dee ba da die) x7. ",
      },
    ],
    participants: [
      {
        id: 'e9fd6cc3-5fea-4990-880a-307b7c4461ac',
        name: 'Yanick',
        surname: 'Bertrand',
        photoUrl:
          'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210728-yeekv-8bb2aab0-1292-4e18-9bf8-2b0b10d264f6',
      },
    ],
  };

  const handleArrowBack = () => {
    goTo(ROUTES.messages);
  };

  const handleWhoMessage = (m: any) => {
    return m.sender.id === userInfo.primaryPerson?.personId;
  };

  conversation.messages.sort(
    (a, b) => moment(a.sentAt).diff(moment(), 'seconds') - moment(b.sentAt).diff(moment(), 'seconds')
  );

  const { t } = useTranslation();
  return (
    <IgContainer className={styles.container}>
      <div className={styles.header}>
        <ArrowBackIosRoundedIcon onClick={handleArrowBack} className={styles.back} />
        <CustomAvatar size="md" className={styles.avatar} photoUrl={conversation.messages[1].sender.photoUrl} />
        <Typography variant="h4" className={styles.name}>
          {conversation.participants[0].name + ' ' + conversation.participants[0].surname}
        </Typography>
      </div>
      <div className={styles.exchange}>
        {conversation.messages.map((m: any) =>
          handleWhoMessage(m) ? <MyMessage message={m} /> : <FriendMessage message={m} />
        )}
      </div>
      <div className={styles.messageInput}>
        <TextField
          placeholder={t('type_here')}
          className={styles.textField}
          multiline
          rowsMax={Infinity}
          //value={editPostContent}
          inputProps={{ className: styles.writing }}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <div style={{ display: 'flex' }}>
                <IconButton className={styles.send} icon="Send" />
              </div>
            ),
          }}
        />
      </div>
    </IgContainer>
  );
};
export default conversation;
