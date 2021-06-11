import React, { useState, useContext, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, STATUS_ENUM, COMPONENT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import CustomIconButton from '../../IconButton';
import { Player } from '../../../../../../typescript/types';

interface IProps {
  open: boolean;
  onClose: () => void;
  update: () => void;
  players: Player[];
}

const AddPlayer: React.FunctionComponent<IProps> = (props) => {
  const { open: openProps, onClose, update, players } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: teamId },
  } = useContext(Store);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const [open, setOpen] = useState<boolean>(false);
  const [people, setPeople] = useState<Player[]>([]);

  const onSubmit = async ():Promise<void> => {
    const res = await api(`/api/entity/players`, {
      method: 'POST',
      body: JSON.stringify({
        teamId,
        players: people,
      }),
    });
    if (res.status === STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else {
      const message = people.length > 1 ? 'players_added' : 'player_added';
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t(message),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });
      update();
      handleClose();
    }
  };

  const handleClose = ():void => {
    setPeople([]);
    onClose();
  };

  const onClick = (newPerson: Player):void => {
    setPeople((p) => [...p, newPerson]);
  };

  const removePerson = (person: Player):void => {
    setPeople((currentPeople) => currentPeople.filter((p) => p.id != person.id));
  };

  const personComponent = useMemo(
    () =>
      people.map((person, index) => ({
        componentType: COMPONENT_TYPE_ENUM.PERSON_ITEM,
        person,
        secondary: t('player'),
        notClickable: true,
        secondaryActions: [
          <CustomIconButton
            key={index}
            icon="Remove"
            style={{ color: 'secondary' }}
            onClick={() => removePerson(person)}
          />,
        ],
      })),
    [people]
  );

  const blackList = useMemo(() => people.map((person) => person.id).concat(players.map((player) => player.personId)), [
    people,
    players,
  ]);

  const disabled = useMemo(() => {
    return people.length < 1;
  }, [people]);

  const fields = [
    ...personComponent,
    {
      componentType: COMPONENT_TYPE_ENUM.PERSON_SEARCH_LIST,
      namespace: 'person',
      label: t('player'),
      blackList,
      onClick,
    },
  ];

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      onClick: onSubmit,
      name: t('add.add'),
      color: 'primary',
      disabled,
    },
  ];

  return (
    <BasicFormDialog open={open} title={t('add.add_players')} buttons={buttons} fields={fields} onClose={handleClose} />
  );
};

export default AddPlayer;
