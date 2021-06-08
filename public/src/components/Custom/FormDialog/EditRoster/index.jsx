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

export default function EditRoster(props) {
  const { t } = useTranslation();
  const { open: openProps, onClose, roster, update, players: rosterPlayers } = props;
  const [open, setOpen] = useState(false);

  const {
    dispatch,
    state: { id: teamId },
  } = useContext(Store);

  useEffect(() => {
    if (teamId) {
      getPlayers();
    }
  }, [teamId]);

  useEffect(() => {
    setOpen(openProps);
    formik.setFieldValue('name', roster.name);
  }, [openProps]);

  const [people, setPeople] = useState([]);
  const [players, setPlayers] = useState([]);

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

  const onClick = (newPerson) => {
    setPeople((p) => [...p, newPerson]);
  };

  const removePerson = (person) => {
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
    () => people.map((person) => person.id).concat(rosterPlayers.map((player) => player.person_id)),
    [people, rosterPlayers]
  );

  const whiteList = useMemo(() => players.map((player) => player.person_id), [players]);

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
            .map((player) => ({
              id: player.person_id,
              completeName: player.name,
              photoUrl: player.photo_url,
              type: 1,
            }))
            .filter((player) => !blackList.includes(player.id))
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
}
