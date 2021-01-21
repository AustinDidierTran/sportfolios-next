import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Custom';
import { useTranslation } from 'react-i18next';

import styles from './EditEvents.module.css';
import { goTo, ROUTES } from '../../actions/goTo';
import { CARD_TYPE_ENUM, GLOBAL_ENUM } from '../../../common/enums';
import Card from '../../components/Custom/Card';
import api from '../../actions/api';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';

export default function Events(props) {
  const { t } = useTranslation();
  const { basicInfos } = props;
  const [events, setEvents] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  const getEntityEvents = async () => {
    const { data } = await api(
      formatRoute('/api/entity/ownedEvents', null, {
        organizationId: id,
      })
    );
    return data || [];
  };

  const handleClick = () => {
    goTo(ROUTES.create, null, {
      type: GLOBAL_ENUM.EVENT,
      id: basicInfos.id,
    });
  };

  const getData = async () => {
    const events = await getEntityEvents();
    setEvents(events);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.div}>
      <div className={styles.buttonDiv}>
        <Button onClick={handleClick} style={{ margin: '8px' }}>
          {t('create_event')}
        </Button>
      </div>

      <div className={styles.general}>
        {events.map((e, index) => (
          <Card type={CARD_TYPE_ENUM.EVENT} items={e} key={index} />
        ))}
      </div>
    </div>
  );
}
