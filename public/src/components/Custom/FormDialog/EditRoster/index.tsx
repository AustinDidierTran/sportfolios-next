import React, { useContext, useEffect, useState, useMemo } from 'react';

import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';
import IconButton from '../../IconButton';
import { Roster, Player, Person } from '../../../../../../typescript/types';
import { updateRoster } from '../../../../actions/service/entity/put';
import { getPlayers as getPlayersApi } from '../../../../actions/service/entity/get';

interface IProps {
  open: boolean;
  onClose: () => void;
  update: () => void;
  roster: Roster;
  players: Player[];
}

type PickPerson = Pick<Person, 'id' | 'completeName' | 'photoUrl'>;

interface IPersonComponent {
  componentType: string;
  person: PickPerson;
  secondary: string;
  notClickable: boolean;
  secondaryActions: any[];
}
const EditRoster: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { open: openProps, onClose, roster, update, players: rosterPlayers } = props;

  const {
    dispatch,
    state: { id: teamId },
  } = useContext(Store);

  const [open, setOpen] = useState<boolean>(false);
  const [people, setPeople] = useState<PickPerson[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect((): void => {
    if (teamId) {
      getPlayers();
    }
  }, [teamId]);

  useEffect((): void => {
    setOpen(openProps);
    formik.setFieldValue('name', roster.name);
  }, [openProps]);

  const getPlayers = async () => {
    const players = await getPlayersApi(teamId);
    setPlayers(players);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      const { name } = values;
      const status = await updateRoster(people, roster.id, name);
      if (status === REQUEST_STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        handleClose();
      }
      update();
    },
  });

  const handleClose = (): void => {
    formik.resetForm();
    setPeople([]);
    onClose();
  };

  const onClick = (newPerson: PickPerson) => {
    setPeople((p) => [...p, newPerson]);
  };

  const removePerson = (person: PickPerson) => {
    setPeople((currentPeople) => currentPeople.filter((p) => p.id != person.id));
  };

  const personComponent = useMemo(
    (): IPersonComponent[] =>
      people.map((person, index) => ({
        componentType: COMPONENT_TYPE_ENUM.PERSON_ITEM,
        person,
        secondary: t('player'),
        notClickable: true,
        secondaryActions: [
          <IconButton key={index} icon="Remove" style={{ color: 'secondary' }} onClick={() => removePerson(person)} />,
        ],
      })),
    [people]
  );

  const blackList = useMemo(
    (): string[] => people.map((person) => person.id).concat(rosterPlayers.map((player) => player.personId)),
    [people, rosterPlayers]
  );

  const whiteList = useMemo((): (string | undefined)[] => players.map((player) => player.personId), [players]);

  const fields = [
    {
      namespace: 'name',
      label: t('roster_name'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.BUTTON,
      onClick: () => {
        const res: PickPerson[] = players
          .map((player) => {
            const res: PickPerson = { id: player.personId, completeName: player.name, photoUrl: player.photoUrl };
            return res;
          })
          .filter((player) => !blackList.includes(player.id));
        setPeople(res);
      },
      children: t('add.add_all_players'),
    },
    ...personComponent,
    {
      componentType: COMPONENT_TYPE_ENUM.PERSON_SEARCH_LIST,
      namespace: 'person',
      label: t('player'),
      blackList,
      whiteList,
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
      type: 'submit',
      name: t('edit.edit'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('edit.edit_roster')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
};

export default EditRoster;
