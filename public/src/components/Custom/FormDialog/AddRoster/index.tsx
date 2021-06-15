import React, { useState, useContext, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { ERROR_ENUM } from '../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, STATUS_ENUM, COMPONENT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import CustomIconButton from '../../IconButton';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Player, Person } from '../../../../../../typescript/types';
import { addRoster, getPlayers as getPlayersApi } from '../../../../actions/service/entity';

interface IProps {
  open: boolean;
  onClose: () => void;
  update: () => void;
}

interface IPersonComponent {
  componentType: string;
  person: PickPerson;
  secondary: string;
  notClickable: boolean;
  secondaryActions: any[];
}

type PickPerson = Pick<Person, 'id' | 'completeName' | 'photoUrl'>;

const AddRoster: React.FunctionComponent<IProps> = (props) => {
  const { open: openProps, onClose, update } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: teamId },
  } = useContext(Store);

  useEffect((): void => {
    setOpen(openProps);
  }, [openProps]);

  useEffect((): void => {
    if (teamId) {
      getPlayers();
    }
  }, [teamId]);

  const [open, setOpen] = useState<boolean>(false);
  const [people, setPeople] = useState<PickPerson[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const getPlayers = async () => {
    const players = await getPlayersApi(teamId);
    setPlayers(players);
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

      const status = await addRoster(teamId, people, name);
      if (status === STATUS_ENUM.ERROR) {
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
  const handleClose = (): void => {
    formik.resetForm();
    setPeople([]);
    onClose();
  };

  const onClick = (newPlayer: PickPerson): void => {
    setPeople((p) => [...p, newPlayer]);
  };

  const removePlayer = (player: PickPerson): void => {
    setPeople((currentPeople) => currentPeople.filter((p) => p.id != player.id));
  };

  const personComponent = useMemo(
    (): IPersonComponent[] =>
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
            onClick={() => removePlayer(person)}
          />,
        ],
      })),
    [people]
  );

  const blackList = useMemo((): (string | undefined)[] => people.map((person) => person.id), [people]);

  const whiteList = useMemo((): (string | undefined)[] => players.map((player) => player.personId), [players]);

  const fields = [
    {
      namespace: 'name',
      label: t('roster_name'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.BUTTON,
      onClick: () => {
        setPeople(
          players.map((player) => ({ id: player.personId, completeName: player.name, photoUrl: player.photoUrl }))
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
};

export default AddRoster;
