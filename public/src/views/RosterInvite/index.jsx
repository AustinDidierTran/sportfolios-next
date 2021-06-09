import React, { useContext, useEffect, useState } from 'react';

import { ROUTES_ENUM, STATUS_ENUM } from '../../../common/enums/index.js';
import api from '../../actions/api/index.js';
import { goTo, goToAndReplace, ROUTES } from '../../actions/goTo';
import IgContainer from '../../components/Custom/IgContainer';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import Button from '../../components/Custom/Button';
import { Store } from '../../Store.js';
import { useTranslation } from 'react-i18next';
import styles from './RosterInvite.module.css';
import { formatRoute } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';

const RosterCard = dynamic(() => import('../../tabs/Rosters/RosterCard/index.jsx'));

export default function RosterInvite(props) {
  const { t } = useTranslation();
  const {
    state: { userInfo, isAuthenticated },
  } = useContext(Store);
  const { token } = props;
  const [roster, setRoster] = useState();
  const [eventId, setEventId] = useState('');

  const fetchRoster = async () => {
    if (!token) {
      return;
    }
    if (!isAuthenticated) {
      goToAndReplace(ROUTES.login, null, {
        redirectUrl: formatRoute(ROUTES.rosterInviteLink, {
          token,
        }),
      });
      return;
    }
    const res = await api(
      formatRoute('/api/entity/rosterFromInviteToken', null, {
        token,
      })
    );
    if (res.status == STATUS_ENUM.SUCCESS_STRING) {
      setRoster({ ...res.data.roster });
      setEventId(res.data.eventId);
    } else {
      goTo(ROUTES_ENUM.entityNotFound);
    }
  };
  useEffect(() => {
    fetchRoster();
  }, [token]);

  if (!roster) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <RosterCard
        roster={roster}
        update={fetchRoster}
        expanded
        whiteList={userInfo.persons.map((p) => p.personId)}
        editableRoster={false}
        withMyPersonsQuickAdd
      />
      <div className={styles.div}>
        <Button
          onClick={() => {
            if (eventId) {
              goTo(ROUTES.entity, { id: eventId });
            }
          }}
          className={styles.button}
        >
          {t('go_to_event')}
        </Button>
      </div>
    </IgContainer>
  );
}
