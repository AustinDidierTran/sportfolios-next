import React, { useContext, useEffect, useState } from 'react';

import { ROUTES_ENUM, STATUS_ENUM } from '../../../common/enums/index.js';
import api from '../../actions/api/index.js';
import { formatRoute, goTo, ROUTES } from '../../actions/goTo';
import { IgContainer, LoadingSpinner, Button } from '../../components/Custom';
import { Store } from '../../Store.js';
import RosterCard from '../../tabs/Rosters/RosterCard/index.jsx';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import styles from './RosterInvite.module.css';

export default function RosterInvite() {
  const { t } = useTranslation();
  const {
    state: { userInfo },
  } = useContext(Store);
  const [roster, setRoster] = useState();
  const [eventId, setEventId] = useState('');
  const router = useRouter();
  const { token } = router.query;

  const fetchRoster = async () => {
    if (!token) {
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
        expanded={true}
        whiteList={userInfo.persons.map((p) => p.entity_id)}
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
