import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { COMPONENT_TYPE_ENUM, FORM_DIALOG_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import FormDialog from '../../FormDialog';
import { useRouter } from 'next/router';
import { getEntity, getMembership as getMembershipApi } from '../../../../actions/service/entity/get';
import { getOwnedPerson } from '../../../../actions/service/user';

export default function BecomeMemberCoupon(props) {
  const { t } = useTranslation();
  const router = useRouter();

  const { open: openProps, onClose, items } = props;
  const { metadata } = items;
  const { expirationDate, organizationId, membershipType } = metadata;
  const [people, setPeople] = useState([]);
  const [open, setOpen] = useState(false);
  const [organization, setOrganization] = useState({});
  const [openBecomeMember, setOpenBecomeMember] = useState(false);
  const [membership, setMembership] = useState(null);

  useEffect(() => {
    setOpen(openProps);
    getPeople();
  }, [openProps]);

  useEffect(() => {
    if (organizationId) {
      getOrganization();
    }
  }, [organizationId]);

  useEffect(() => {
    if (organizationId && membershipType) {
      getMembership();
    }
  }, [organizationId, membershipType]);

  const getOrganization = () => {
    getEntity(organizationId).then(setOrganization);
  };

  const getMembership = () => {
    getMembershipApi(organizationId, membershipType).then(setMembership);
  };

  const onCloseBecomeMember = () => {
    setOpenBecomeMember(false);
  };

  const getPeople = async () => {
    const data = await getOwnedPerson();

    //Permet de mettre la primary person comme 1er élément de la liste
    data.sort((a, b) => (a.isPrimaryPerson ? -1 : b.isPrimaryPerson ? 1 : 0));

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
        organizationName: organization?.name || '',
        expirationDate: formatDate(moment.utc(expirationDate)),
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
        router.query.expirationDate = expirationDate;
        router.query.membership = membership;
        router.query.tokenId = items.token_id;
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
