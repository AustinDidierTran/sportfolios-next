import { useFormik } from 'formik';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../common/errors';
import { getMyTeamPlayers, getMyTeamPlayersRequest } from '../../../../actions/service/entity/get';
import { sendRequestToJoinTeam } from '../../../../actions/service/entity/post';
import { getOwnedPerson } from '../../../../actions/service/user';
import { ACTION_ENUM, Store } from '../../../../Store';
import BasicFormDialog from '../BasicFormDialog';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const JoinTeam: React.FunctionComponent<IProps> = (props) => {
  const { open: openProps, onClose } = props;
  const { t } = useTranslation();

  const {
    state: { id: teamId },
    dispatch,
  } = useContext(Store);

  const [open, setOpen] = useState<boolean>(false);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  useEffect(() => {
    if (teamId) {
      getPeople();
    }
  }, [teamId]);

  const formik = useFormik({
    initialValues: {
      person: '',
    },
    onSubmit: async () => {
      const status = await sendRequestToJoinTeam(teamId, formik.values.person);
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
          message: t('request_sent'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        onClose();
      }
    },
  });

  const getPeople = async (): Promise<void> => {
    const data = await getOwnedPerson();
    const playersIds = (await getMyTeamPlayers(teamId)).map((p) => p.personId);
    const pendingPlayersIds = (await getMyTeamPlayersRequest(teamId)).map((p) => p.id);
    const ids = playersIds.concat(pendingPlayersIds);

    const res = data.map((d: any) => {
      if (ids.includes(d.id)) {
        return { display: d.complete_name, value: d.id, disabled: true };
      }
      return { display: d.complete_name, value: d.id };
    });

    const available = res.find((r) => !r.disabled);

    setPeople(res);
    if (available) {
      formik.setFieldValue('person', available.value);
    }
  };

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'person',
      label: t('person.person'),
      options: people,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('send_request_to_team_owner'),
    },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('send'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      formik={formik}
      open={open}
      title={t('join_team')}
      buttons={buttons}
      fields={fields}
      onClose={onClose}
    />
  );
};
export default JoinTeam;
