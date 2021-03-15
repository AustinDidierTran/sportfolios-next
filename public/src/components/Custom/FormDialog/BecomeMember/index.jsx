import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, STATUS_ENUM, COMPONENT_TYPE_ENUM, MEMBERSHIP_LENGTH_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { formatDate, formatPrice, getMembershipName } from '../../../../utils/stringFormats';
import moment from 'moment';
import { getExpirationDate } from '../../../../utils/memberships';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../../common/utils/stringFormat';

export default function BecomeMember(props) {
  const { open: openProps, onClose, update } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { userInfo },
  } = useContext(Store);
  const router = useRouter();
  const { id } = router.query;

  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState(userInfo.people);
  const [memberships, setMemberships] = useState([]);
  const [fullMemberships, setFullMemberships] = useState([]);

  useEffect(() => {
    setOpen(openProps);
    getPeople();
    if (people) {
      getMemberships();
    }
  }, [openProps]);

  const getPeople = async () => {
    const { data } = await api(formatRoute('/api/entity/primaryPerson', null, null));
    if (!data) {
      return;
    }
    formik.setFieldValue('person', data.id);
    const res = userInfo.persons.map((p) => ({
      value: p.entity_id,
      display: `${p.name} ${p?.surname}`,
    }));
    setPeople(res);
  };

  const getMemberships = async () => {
    const { data } = await api(
      formatRoute('/api/entity/memberships', null, {
        id,
      })
    );
    setFullMemberships(data);
    const memberships = data.map((d) => ({
      value: d.id,
      display: formatMembership(d),
    }));
    if (memberships[0]) {
      formik.setFieldValue('type', memberships[0].value);
    }
    setMemberships(memberships);
  };

  const formatMembership = (membership) => {
    const { length, fixed_date, membership_type, price } = membership;
    const name = getMembershipName(membership_type);
    if (length) {
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
        return `${t(name)} | ${formatPrice(price)} (${t('one_year')})`;
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
        return `${t(name)} | ${formatPrice(price)} (${t('six_month')})`;
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
        return `${t(name)} | ${formatPrice(price)} (${t('one_month')})`;
      }
    }
    if (fixed_date) {
      let finalDate;
      if (moment(new Date(fixed_date)).set('year', moment().get('year')) < moment()) {
        finalDate = moment(new Date(fixed_date)).set('year', moment().get('year')).add(1, 'year');
      } else {
        finalDate = moment(new Date(fixed_date)).set('year', moment().get('year'));
      }
      return `${t(name)} | ${formatPrice(price)} (${formatDate(finalDate)})`;
    }
    return null;
  };

  const handleClose = () => {
    formik.resetForm();
    update();
    onClose();
  };

  const validate = (values) => {
    const { type } = values;
    const errors = {};
    if (!type) {
      errors.type = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      person: '',
      type: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { person, type } = values;
      const membership = fullMemberships.find((m) => m.id === type);
      const res = await api(`/api/entity/member`, {
        method: 'POST',
        body: JSON.stringify({
          membershipId: type,
          membershipType: membership.membership_type,
          organizationId: membership.entity_id,
          personId: person,
          expirationDate: getExpirationDate(membership.length, membership.fixed_date),
        }),
      });
      if (res.status === STATUS_ENUM.ERROR || res.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('member.membership_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 4000,
        });
        handleClose();
      }
    },
  });

  const onClickMoreInfo = () => {
    router.push(`/${id}/memberships`);
    handleClose();
  };

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'person',
      label: t('person.person'),
      options: people,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'type',
      label: t('type'),
      options: memberships,
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
      open={open}
      title={t('become_member')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
      subtitle={t('learn_more')}
      subtitleOnClick={onClickMoreInfo}
    />
  );
}
