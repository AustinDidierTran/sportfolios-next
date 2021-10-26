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
  const [open, setOpen] = useState<boolean>(false);

  /*const handleDisable = () => {
    return !participants.length;
  };
*/
  const createConvo = () => {
    let participantsId: string[] = [userInfo.primaryPerson?.personId];
    participants.map((player) => {
      participantsId = [...participantsId, player.id];
    });
    console.log('les id des personnes participants de la convo sont : ', participantsId);
    //goTo(ROUTES.conversation,{convoId});
  };

  const handleDeleteParticipant = (personId: string) => {
    setParticipants(participants.filter((e) => e.id != personId));
  };
  console.log('Particpants :', participants);
  const addNewFriend = async (person: IPerson) => {
    let warn = 0;
    participants.map((participant) => {
      if (participant.id === person.id) {
        warn = 1;
      }
    });
    if (person.id === userInfo.primaryPerson?.personId) {
      console.log('allo');
      warn = 1;
    }
    if (warn === 1) {
      setOpen(true);
      setParticipants([...participants]);
    }
    if (warn === 0) {
      setOpen(false);
      setParticipants([...participants, person]);
    }
  };

  const closeWarning = () => {
    setOpen(false);
  };
  return (
    <IgContainer>
      <div className={styles.container}>
        <Typography className={styles.title} variant="h4">
          {t('someone_new')}
        </Typography>

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
          {t('create_message')}
        </Button>
      </div>
      <MessageDialog open={open} onClose={closeWarning} />
    </IgContainer>
  );
};

export default newMessage;
