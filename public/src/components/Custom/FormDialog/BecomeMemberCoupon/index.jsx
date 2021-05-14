import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import api from '../../../../actions/api';
import { COMPONENT_TYPE_ENUM, FORM_DIALOG_TYPE_ENUM, GLOBAL_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import { formatRoute } from '../../../../../common/utils/stringFormat';
import FormDialog from '../../FormDialog';
import { useRouter } from 'next/router';

export default function BecomeMemberCoupon(props) {
  const { t } = useTranslation();
  const router = useRouter();

  const { open: openProps, onClose, items } = props;
  const { metadata } = items;
  const { expirationDate, organizationId } = metadata;
  const [people, setPeople] = useState([]);
  const [open, setOpen] = useState(false);
  const [organization, setOrganization] = useState({});
  const [openBecomeMember, setOpenBecomeMember] = useState(false);

  useEffect(() => {
    setOpen(openProps);
    getPeople();
  }, [openProps]);

  useEffect(() => {
    getOrganization();
  }, [organizationId]);

  const getOrganization = async () => {
    const { data } = await api(
      formatRoute('/api/entity', null, {
        id: organizationId,
      })
    );
    setOrganization(data);
  };

  const onCloseBecomeMember = () => {
    setOpenBecomeMember(false);
  };

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
    const res = data.map((d) => ({
      display: d.complete_name,
      value: d.id,
    }));
    setPeople(res);
    formik.setFieldValue('person', res[0].value);
  };

  const formik = useFormik({
    initialValues: {
      person: '',
    },
  });

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('become_member_of', {
        organizationName: organization?.basicInfos?.name || '',
        expirationDate: formatDate(moment(expirationDate)),
      }),
    },
    people.length === 1
      ? {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          primary: people[0]?.display,
        }
      : {
          componentType: COMPONENT_TYPE_ENUM.SELECT,
          namespace: 'person',
          label: t('person.person'),
          options: people,
        },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      onClick: () => {
        onClose();
        setOpenBecomeMember(true);
        router.query.coupon = 'coupon';
        router.query.id = organizationId;
        router.query.expirationDate = expirationDate;
      },
      name: t('next'),
      color: 'primary',
    },
  ];

  return (
    <>
      <BasicFormDialog
        open={open}
        title={t('member.member_coupon')}
        description={t('this_coupon_is_only_good_once')}
        buttons={buttons}
        fields={fields}
        formik={formik}
        onClose={onClose}
      />
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER}
        items={{
          open: openBecomeMember,
          onClose: onCloseBecomeMember,
          onOpen: () => {},
          update: () => {},
        }}
      />
    </>
  );
}
