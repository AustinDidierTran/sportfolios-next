import React, { useContext, useEffect, useState, useMemo } from 'react';

import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import api from '../../../../actions/api';
import BasicFormDialog from '../BasicFormDialog';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';
import { formatRoute } from '../../../../utils/stringFormats';
import IconButton from '../../IconButton';
import { roster, player } from '../../../../../../typescript/types';

interface IProps {
  open: boolean;
  onClose: () => void;
  update: () => void;
  roster: roster;
  players: player[];
}

const EditRoster: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { open: openProps, onClose, roster, update, players: rosterPlayers } = props;

  const {
    dispatch,
    state: { id: teamId },
  } = useContext(Store);

  const [open, setOpen] = useState<boolean>(false);
  const [people, setPeople] = useState<player[]>([]);
  const [players, setPlayers] = useState<player[]>([]);

  useEffect(() => {
    if (teamId) {
      getPlayers();
    }
  }, [teamId]);

  useEffect(() => {
    setOpen(openProps);
    formik.setFieldValue('name', roster.name);
  }, [openProps]);

  const getPlayers = async () => {
    const { data } = await api(
      formatRoute('/api/entity/players', null, {
        teamId,
      })
    );
    setPlayers(data);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      const { name } = values;
      const res = await api('/api/entity/roster', {
        method: 'PUT',
        body: JSON.stringify({
          players: people,
          id: roster.id,
          name,
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
        handleClose();
      }
      update();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setPeople([]);
    onClose();
  };

  const onClick = (newPerson: player) => {
    setPeople((p) => [...p, newPerson]);
  };

  const removePerson = (person: player) => {
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
          <IconButton key={index} icon="Remove" style={{ color: 'secondary' }} onClick={() => removePerson(person)} />,
        ],
      })),
    [people]
  );

  const blackList = useMemo(
    () => people.map((person) => person.personId).concat(rosterPlayers.map((player) => player.personId)),
    [people, rosterPlayers]
  );

  console.log({ people, rosterPlayers });

  const whiteList = useMemo(() => players.map((player) => player.personId), [players]);

  const fields = [
    {
      namespace: 'name',
      label: t('roster_name'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.BUTTON,
      onClick: () => {
        setPeople(
          players
            .map((player) => {
              const res: player = { personId: player.personId, name: player.name, photoUrl: player.photoUrl };
              return res;
            })
            .filter((player: player) => !blackList.includes(player.personId))
        );
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
