import React, { useState, useContext, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, STATUS_ENUM, COMPONENT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import CustomIconButton from '../../IconButton';
import { formatRoute } from '../../../../utils/stringFormats';
import * as yup from 'yup';
import { useFormik } from 'formik';

export default function AddRoster(props) {
  const { open: openProps, onClose, update } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: teamId },
  } = useContext(Store);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  useEffect(() => {
    if (teamId) {
      getPlayers();
    }
  }, [teamId]);

  const [open, setOpen] = useState(false);
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

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { name } = values;
      const res = await api(`/api/entity/roster`, {
        method: 'POST',
        body: JSON.stringify({
          teamId,
          players: people,
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
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('roster_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        update();
        handleClose();
        resetForm();
      }
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

  const blackList = useMemo(() => people.map((person) => person.id), [people]);

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
          players.map((player) => ({
            id: player.person_id,
            completeName: player.name,
            photoUrl: player.photo_url,
            type: 1,
          }))
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
      name: t('add.add'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      formik={formik}
      open={open}
      title={t('add.add_roster')}
      buttons={buttons}
      fields={fields}
      onClose={handleClose}
    />
  );
}
