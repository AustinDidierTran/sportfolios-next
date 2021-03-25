import React, { useEffect, useState, useContext } from 'react';

const IgContainer = loadable(() => import('../../../components/Custom/IgContainer'));
const HeaderHome = loadable(() => import('../../../components/Custom/HeaderHome'));
import { GLOBAL_ENUM, MEMBERSHIP_LENGTH_ENUM, FORM_DIALOG_TYPE_ENUM, LIST_ITEM_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import { Store } from '../../../Store';
import { useRouter } from 'next/router';
import api from '../../../actions/api';
import { formatRoute } from '../../../../common/utils/stringFormat';
import { formatDate, formatPrice, getMembershipName } from '../../../utils/stringFormats';
import moment from 'moment';
import styles from './Organization.module.css';
import CustomList from '../../../components/Custom/List';
import FormDialog from '../../../components/Custom/FormDialog';
import loadable from '@loadable/component';

const Memberships = loadable(() => import('../../../tabs/About/Memberships'));


export default function OrganizationMemberships(props) {
  const { t } = useTranslation();
  const { basicInfos, navBar } = props;
  const router = useRouter();
  const { id } = router.query;
  const [memberships, setMemberships] = useState([]);
  const [refreshMemberships, setRefreshMemberships] = useState(false);
  const [open, setOpen] = useState(false);
  const [defaultTypeValue, setDefaultTypeValue] = useState(-1);
  const onOpen = (id) => {
    setDefaultTypeValue(id);
    setOpen(true);
  };
  const onClose = () => {
    setRefreshMemberships(!refreshMemberships);
    getMemberships();
    setOpen(false);
  };
  const update = () => { };

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

      if (members && members.findIndex((o) => o.membershipId === d.id) >= 0) {
        alreadyMember = true;
        expirationDate = `${t('expiration_date')} : ${formatDate(
          moment(new Date(members[members.findIndex((o) => o.membershipId === d.id)].expirationDate))
        )}`;
      }
      return {
        value: d.id,
        display: formatMembership(d),
        type: LIST_ITEM_ENUM.MEMBERSHIP_INFO,
        onClick: () => { onOpen(d.id) },
        expirationDate,
        alreadyMember,
        tooltip: !alreadyMember ? t('become_member') : expirationDate,
      };
    });
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

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
    getMemberships();
  }, []);
  const {
    state: { userInfo },
  } = useContext(Store);

  return (
    <>
      <HeaderHome basicInfos={basicInfos} navTabs={navBar} type={GLOBAL_ENUM.ORGANIZATION} />
      <IgContainer className={styles.IgContainer}>
        <Paper className={styles.rootMargin}>
          <h3>{t('member.memberships_available')}</h3>
          <CustomList items={memberships} />

          {memberships.length == 0 && <div>{t('no.no_membership_available')}</div>}
        </Paper>

        <Memberships
        disableButton
        refreshMemberships={refreshMemberships} />
      </IgContainer>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER}
        items={{
          open,
          onClose,
          update,
          moreInfo: false,
          defaultTypeValue,
        }}
      />
    </>
  );
}
