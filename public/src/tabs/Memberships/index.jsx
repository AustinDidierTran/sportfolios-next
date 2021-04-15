import React, { useEffect, useState, useContext } from 'react';

import { MEMBERSHIP_LENGTH_ENUM, FORM_DIALOG_TYPE_ENUM, LIST_ITEM_ENUM } from '../../../common/enums';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../Store';
import { useRouter } from 'next/router';
import api from '../../actions/api';
import { formatRoute } from '../../../common/utils/stringFormat';
import { formatDate, formatPrice, getMembershipName } from '../../utils/stringFormats';
import moment from 'moment';
import styles from './Memberships.module.css';
import CustomList from '../../components/Custom/List';
import FormDialog from '../../components/Custom/FormDialog';
import Paper from '../../components/Custom/Paper';
import loadable from '@loadable/component';
import Typography from '@material-ui/core/Typography';

const MyMemberships = loadable(() => import('./MyMemberships'));

export default function Memberships() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  useEffect(() => {
    getMemberships();
  }, []);

  const [memberships, setMemberships] = useState([]);
  const [refreshMemberships, setRefreshMemberships] = useState(false);
  const [open, setOpen] = useState(false);
  const [defaultTypeValue, setDefaultTypeValue] = useState(-1);

  const onOpen = (id) => {
    setDefaultTypeValue(id);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const openDialog = () => {
    setOpen(true);
  };

  const update = () => {
    setRefreshMemberships(!refreshMemberships);
    getMemberships();
    updateCart();
  };

  const getMemberships = async () => {
    let members = undefined;
    if (userInfo.primaryPerson && userInfo.primaryPerson.entity_id) {
      const { data: dataMembers } = await api(
        formatRoute('/api/entity/members', null, {
          id,
          personId: userInfo.primaryPerson.entity_id,
        })
      );

      members = dataMembers;
    }

    const { data } = await api(
      formatRoute('/api/entity/memberships', null, {
        id,
      })
    );

    if (!data) {
      return;
    }
    const memberships = data.map((d) => {
      let alreadyMember = false;
      let expirationDate;

      if (members && members.findIndex((o) => o.memberType === d.membership_type) >= 0) {
        alreadyMember = true;
        expirationDate = `${t('expiration_date')} : ${formatDate(
          moment(new Date(members[members.findIndex((o) => o.memberType === d.membership_type)].expirationDate))
        )}`;
      }
      return {
        value: d.id,
        display: formatMembership(d),
        type: LIST_ITEM_ENUM.MEMBERSHIP_INFO,
        onClick: () => {
          onOpen(d.id);
        },
        expirationDate,
        alreadyMember,
        tooltip: !alreadyMember ? t('become_member') : expirationDate,
      };
    });
    setMemberships(memberships);
  };

  const updateCart = async () => {
    const { data: cartItems } = await api('/api/shop/getCartItems');
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: cartItems,
    });
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

  return (
    <>
      <Paper className={styles.rootMargin} title={t('member.memberships_available')}>
        {memberships.length == 0 ? (
          <Typography style={{ padding: '16px' }}>{t('no.no_membership_available')}</Typography>
        ) : (
          <CustomList items={memberships} />
        )}
      </Paper>
      <MyMemberships refreshMemberships={refreshMemberships} />
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER}
        items={{
          open,
          onClose,
          onOpen: openDialog,
          update,
          moreInfo: false,
          defaultTypeValue,
        }}
      />
    </>
  );
}
