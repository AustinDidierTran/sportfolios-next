import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IgContainer from '../../components/Custom/IgContainer';
import { Typography } from '@material-ui/core';
import ParticipantsSearchList from '../../components/Custom/SearchList/ParticipantsSearchList';
import { useFormInput } from '../../hooks/forms';
import { getAllThePeople } from '../../actions/service/person/admin';
import styles from './newMessage.module.css';
import { Divider } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import IconButton from '../../components/Custom/IconButton';
import { Person } from '../../../../typescript/entity';
import { List } from '../../components/Custom';
import { Chip } from '../../components/Custom';
import MessageDialog from '../../components/Custom/Dialog/MessageDialog';
import { Store } from '../../Store';
import { ContactSupportOutlined, ReceiptOutlined } from '@material-ui/icons';
import Button from '../../components/Custom/Button';
import { goTo, ROUTES } from '../../actions/goTo';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { createConversation } from '../../actions/service/messaging';
import ChooseRecipientForNew from '../../components/Custom/ChooseRecipientForNew';

interface IPerson {
  id: string;
  completeName: string;
  photoUrl: string;
  type: number;
}

const newMessage: React.FunctionComponent = () => {
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);
  console.log(userInfo);
  const { t } = useTranslation();
  const query = useFormInput('');
  const inputRef = useRef(null);
  const [participants, setParticipants] = useState<IPerson[]>([]);
  const [recipient, setRecipient] = useState<Person>(userInfo.primaryPerson);

  const handleArrowBack = () => {
    goTo(ROUTES.conversations);
  };
  const createConvo = () => {
    let creatorId: string = recipient.id;
    let participantsId: string[] = participants.map((player) => player.id);

    createConversation(participantsId, creatorId).then((newConversationId) => {
      goTo(ROUTES.conversation, { convoId: newConversationId }, { recipientId: recipient.id });
    });
  };

  const handleDeleteParticipant = (personId: string) => {
    setParticipants(participants.filter((e) => e.id != personId));
  };
  const addNewFriend = async (person: IPerson) => {
    setParticipants([...participants, person]);
  };

  return (
    <IgContainer>
      <div className={styles.container}>
        <div className={styles.header}>
          <ArrowBackIosRoundedIcon onClick={handleArrowBack} className={styles.back} />
          <Typography className={styles.title} variant="h4">
            {t('someone_new')}
          </Typography>
        </div>
        <ParticipantsSearchList
          className={styles.search}
          clearOnSelect={false}
          label={t('with')}
          onClick={addNewFriend}
          query={query}
          secondary={t('player')}
          withoutIcon
          autoFocus
          inputRef={inputRef}
          participants={participants}
          recipient={recipient}
        />
        {participants.length ? (
          <List>
            {participants.map((p) => (
              <Chip
                className={styles.chip}
                label={p.completeName}
                color="primary"
                variant="outlined"
                onDelete={() => handleDeleteParticipant(p.id)}
              />
            ))}
          </List>
        ) : (
          <></>
        )}

        <ChooseRecipientForNew recipient={recipient} setRecipient={setRecipient} />

        <Button className={styles.button} disabled={participants.length === 0} onClick={createConvo}>
          {t('create.create_message')}
        </Button>
      </div>
    </IgContainer>
  );
};

export default newMessage;
