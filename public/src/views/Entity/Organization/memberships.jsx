import React, { useEffect, useState, useContext } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import HeaderHome from '../../../components/Custom/HeaderHome';
import { GLOBAL_ENUM, MEMBERSHIP_LENGTH_ENUM, FORM_DIALOG_TYPE_ENUM, LIST_ITEM_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme) => ({
  fabMobile: {
    position: 'absolute',
    bottom: theme.spacing(2) + 58,
    right: theme.spacing(2),
    zIndex: 100,
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2) + (window.innerWidth - 700) / 2,
    zIndex: 100,
    color: 'white',
  },
  IgContainer: {
    backgroundColor: '#f5f5f5 !important',
  },
  createPost: {
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
  },
}));

export default function OrganizationMemberships(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { basicInfos, navBar } = props;
  const router = useRouter();
  const { id } = router.query;
  const [memberships, setMemberships] = useState([]);
  const [open, setOpen] = useState(false);
  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const update = () => {};

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
        ...formatMembership(d),
        type: LIST_ITEM_ENUM.MEMBERSHIP_INFO,
        onClick: onOpen,
        icon: !alreadyMember ? 'AssignmentIcon' : 'AssignmentTurnedInIcon',
        tooltip: !alreadyMember ? t('become_member') : expirationDate,
      };
    });
    setMemberships(memberships);
  };

  const formatMembership = (membership) => {
    const { length, fixed_date, membership_type, price } = membership;
    const name = t(getMembershipName(membership_type));
    const priceInfo = formatPrice(price);
    let timeInfo;
    if (length) {
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
        timeInfo = t('one_year');
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
        timeInfo = t('six_month');
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
        timeInfo = t('one_month');
      }
    }
    if (fixed_date) {
      if (moment(new Date(fixed_date)).set('year', moment().get('year')) < moment()) {
        timeInfo = formatDate(moment(new Date(fixed_date)).set('year', moment().get('year')).add(1, 'year'));
      } else {
        timeInfo = formatDate(moment(new Date(fixed_date)).set('year', moment().get('year')));
      }
    }
    return {
      name,
      priceInfo,
      timeInfo,
    };
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
      <IgContainer className={classes.IgContainer}>
        <Paper className={styles.rootMargin}>
          <h3>{t('member.memberships_list')}</h3>
          <CustomList items={memberships} />

          {memberships.length == 0 && <div>{t('no.no_membership_available')}</div>}
        </Paper>
      </IgContainer>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER}
        items={{
          open,
          onClose,
          update,
        }}
      />
    </>
  );
}
