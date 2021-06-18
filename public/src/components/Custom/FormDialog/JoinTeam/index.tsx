import { useFormik } from 'formik';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM, GLOBAL_ENUM } from '../../../../../common/enums';
import api from '../../../../actions/api';
import { sendRequestToJoinTeam } from '../../../../actions/service/entity';
import { Store } from '../../../../Store';
import { formatRoute } from '../../../../utils/stringFormats';
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
  } = useContext(Store);

  const [open, setOpen] = useState<boolean>(false);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    setOpen(openProps);
    getPeople();
  }, [openProps]);

  const formik = useFormik({
    initialValues: {
      person: '',
    },
    onSubmit: () => {
      console.log({ person: formik.values.person, teamId });
      sendRequestToJoinTeam(formik.values.person, teamId);
    },
  });

  const getPeople = async () => {
    const { data } = await api(
      formatRoute('/api/user/ownedPersons', null, {
        type: GLOBAL_ENUM.PERSON,
      })
    );
    //Permet de mettre la primary person comme 1er élément de la liste
    for (var i = 0; i < data.length; i++) {
      if (data[i].isPrimaryPerson) {
        data.unshift(data.splice(i, 1)[0]);
        break;
      }
    }
    const res = data.map((d: any) => ({
      display: d.complete_name,
      value: d.id,
    }));
    setPeople(res);
    formik.setFieldValue('person', res[0].value);
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
