import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react';
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
import { useFormInput } from '../../hooks/forms';
import CustomTextField from '../../components/Custom/TextField';
import { QueryBuilder } from '@material-ui/icons';
import { getConversationMessages } from '../../actions/service/messaging';
import { LoadingSpinner } from '../../components/Custom';

interface IProps {
  convoId: string;
}

const conversation: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { convoId } = props;
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);
  //AJOUT BACKEND
  const [conversation, setConversation] = useState<Conversation>();

  const updateConversation = useCallback(() => {
    getConversationMessages(convoId).then(setConversation);
  }, [convoId]);

  useEffect(() => {
    updateConversation();
  }, [updateConversation]);

  //AJOUT BACKEND

  const content = useFormInput('');

  const otherParticipants = useMemo(() => {
    if (!conversation) {
      return [];
    }
    return conversation.participants.filter((p) => p.id !== userInfo.primaryPerson?.personId);
  }, [conversation]);

  const handleSend = () => {
    console.log(
      'conversationId : ',
      convoId,
      'content : ',
      content.value,
      'senderId :',
      userInfo.primaryPerson?.personId
    );
  };

  const name = useMemo(() => {
    if (conversation.name) {
      return conversation.name;
    }

    return conversation.participants
      .filter((p) => p.id !== userInfo.primaryPerson?.personId)
      .map((p) => `${p.name} ${p.surname}`)
      .join(', ');
  }, [conversation]);

  const photoUrl = useMemo(() => {
    const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];

    return randomParticipant.photoUrl;
  }, [otherParticipants]);

  if (!convoId || !conversation) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer className={styles.container}>
      <div className={styles.header}>
        <ArrowBackIosRoundedIcon
          onClick={() => {
            goTo(ROUTES.conversations);
          }}
          className={styles.back}
        />
        <CustomAvatar size="md" className={styles.avatar} photoUrl={photoUrl} />
        <Typography variant="h4" className={styles.name}>
          {name}
        </Typography>
      </div>
      <div className={styles.exchange}>
        {conversation.messages?.map((m: any) =>
          m.sender.id === userInfo.primaryPerson?.personId ? <MyMessage message={m} /> : <FriendMessage message={m} />
        )}
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
                <IconButton onClick={handleSend} className={styles.send} icon="Send" />
              </div>
            ),
          }}
        />
      </div>
    </IgContainer>
  );
};
export default conversation;

/*const conversation: Conversation = {
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

      {
        id: userInfo.primaryPerson?.personId,
        name: userInfo.primaryPerson?.name,
        surname: 'none',
        photoUrl: userInfo.primaryPerson?.photoUrl,
      },
    ],
  };
*/
