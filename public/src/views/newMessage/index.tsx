import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IgContainer from '../../components/Custom/IgContainer';
import { Typography } from '@material-ui/core';
import PersonSearchList from '../../components/Custom/SearchList/PersonSearchList';
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
import { ContactSupportOutlined } from '@material-ui/icons';
import Button from '../../components/Custom/Button';
import { goTo, ROUTES } from '../../actions/goTo';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { createConversation } from '../../actions/service/messaging';

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
  const { t } = useTranslation();
  const query = useFormInput('');
  const inputRef = useRef(null);
  const [participants, setParticipants] = useState<IPerson[]>([]);

  const handleArrowBack = () => {
    goTo(ROUTES.conversations);
  };
  const createConvo = () => {
    let creatorId: string = userInfo.primaryPerson?.personId;
    let participantsId: string[] = participants.map((player) => player.id);

    createConversation(participantsId, creatorId).then((newConversationId) => {
      goTo(ROUTES.conversation, { id: newConversationId });
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
        <PersonSearchList
          className={styles.search}
          clearOnSelect={false}
          label={t('to')}
          onClick={addNewFriend}
          query={query}
          secondary={t('player')}
          withoutIcon
          autoFocus
          inputRef={inputRef}
          participants={participants}
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
        <Button className={styles.button} disabled={participants.length === 0} onClick={createConvo}>
          {t('create.create_message')}
        </Button>
      </div>
    </IgContainer>
  );
};

export default newMessage;
