import React, { useEffect, useState, useContext } from 'react';

import { MEMBERSHIP_LENGTH_ENUM, FORM_DIALOG_TYPE_ENUM, LIST_ITEM_ENUM } from '../../../common/enums';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../Store';
import { formatDate, formatPrice, getMembershipName } from '../../utils/stringFormats';
import moment from 'moment';
import styles from './Memberships.module.css';
import CustomList from '../../components/Custom/List';
import FormDialog from '../../components/Custom/FormDialog';
import Paper from '../../components/Custom/Paper';
import dynamic from 'next/dynamic';
import Typography from '@material-ui/core/Typography';
import { getMembers, getMemberships as getMembershipsApi } from '../../actions/service/entity/get';
import { EntityMembership, Member } from '../../../../typescript/types';
import { getCartItems } from '../../actions/service/cart';

const MyMemberships = dynamic(() => import('./MyMemberships'));

interface IMembershipItem {
  value: string;
  display: string;
  type: string;
  onClick: () => void;
  expirationDate: string;
  alreadyMember: boolean;
  tooltip: string;
}

const Memberships: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id, userInfo },
  } = useContext(Store);

  useEffect(() => {
    if (id) {
      getMemberships();
    }
  }, [id]);

  const [memberships, setMemberships] = useState<IMembershipItem[]>([]);
  const [refreshMemberships, setRefreshMemberships] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [defaultTypeValue, setDefaultTypeValue] = useState<string>('-1');

  const onOpen = (id: string): void => {
    setDefaultTypeValue(id);
    setOpen(true);
  };

  const onClose = (): void => {
    setOpen(false);
  };
  const openDialog = (): void => {
    setOpen(true);
  };

  const update = (): void => {
    setRefreshMemberships(!refreshMemberships);
    getMemberships();
    updateCart();
  };

  const getMemberships = async (): Promise<void> => {
    let members: Member[] = undefined;
    if (userInfo.primaryPerson && userInfo.primaryPerson.personId) {
      const dataMembers = await getMembers(id, userInfo.primaryPerson.personId);

      members = dataMembers;
    }

    const data = await getMembershipsApi(id);

    if (!data) {
      return;
    }
    const memberships = data.map((d) => {
      let alreadyMember = false;
      let expirationDate;

      if (members && members.findIndex((o) => o.memberType === d.membershipType) >= 0) {
        alreadyMember = true;
        expirationDate = `${t('expiration_date')} : ${formatDate(
          moment.utc(new Date(members[members.findIndex((o) => o.memberType === d.membershipType)].expirationDate))
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

  const updateCart = async (): Promise<void> => {
    const cartItems = await getCartItems();
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: cartItems,
    });
  };

  const formatMembership = (membership: EntityMembership): string => {
    const { length, fixedDate, membershipType, price } = membership;
    const name = getMembershipName(membershipType);
    if (length) {
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
        return `${name} | ${formatPrice(price)} (${t('one_year')})`;
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
        return `${name} | ${formatPrice(price)} (${t('six_month')})`;
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
        return `${name} | ${formatPrice(price)} (${t('one_month')})`;
      }
    }
    if (fixedDate) {
      let finalDate;
      if (moment(new Date(fixedDate)).set('year', moment().get('year')) < moment()) {
        finalDate = moment(new Date(fixedDate)).set('year', moment().get('year')).add(1, 'year');
      } else {
        finalDate = moment(new Date(fixedDate)).set('year', moment().get('year'));
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
};
export default Memberships;
