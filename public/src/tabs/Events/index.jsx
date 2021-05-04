import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Events.module.css';
import { CARD_TYPE_ENUM } from '../../../common/enums';
import Card from '../../components/Custom/Card';
import api from '../../actions/api';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';
import { goTo, ROUTES } from '../../actions/goTo';
import CustomButton from '../../components/Custom/Button';

export default function Events() {
  const { t } = useTranslation();
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

  const getData = async () => {
    const events = await getEntityEvents();
    setEvents(events);
  };

  const createEvent = () => {
    goTo(ROUTES.createEvent, null, {id: id });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    
    <div className={styles.div}>
      <div className={styles.buttons}>
        <CustomButton onClick={createEvent} endIcon="Add" color="primary" className={styles.button}>
          {t('add.add')}
        </CustomButton></div>
      <div className={styles.general}>
        {events.length ? (
          <>
            {events.map((e, index) => (
              <Card type={CARD_TYPE_ENUM.EVENT} items={e} key={index} />
            ))}
          </>
        ) : (
          <Typography>{t('this_organization_has_no_events')}</Typography>
        )}
      </div>
    </div>
  );
}
