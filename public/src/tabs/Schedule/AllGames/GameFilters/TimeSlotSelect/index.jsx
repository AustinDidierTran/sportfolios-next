import React, { useEffect, useState, useContext } from 'react';

import { Select } from '../../../../../components/Custom';
import styles from './TimeSlotSelect.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../../../actions/api';
import { SELECT_ENUM } from '../../../../../../common/enums';
import { formatDate } from '../../../../../utils/stringFormats';
import moment from 'moment';
import { formatRoute } from '../../../../../utils/stringFormats';
import { Store } from '../../../../../Store';

export default function TimeSlotSelect(props) {
  const { onChange, timeSlot } = props;
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (eventId) {
      getTimeSlots();
    }
  }, [eventId]);

  const getTimeSlots = async () => {
    const { data } = await api(formatRoute('/api/entity/slots', null, { eventId }));

    const res = data
      .map((d) => ({
        value: moment.utc(d.date).format('YYYY M D'),
        display: formatDate(moment.utc(d.date), 'DD MMM'),
      }))
      .reduce((prev, curr) => {
        if (prev) {
          if (!prev.map((p) => p.value).includes(curr.value)) {
            return [...prev, curr];
          }
          return prev;
        }
      }, []);

    setTimeSlots([{ value: SELECT_ENUM.ALL, display: t('all_time_slots') }, ...res]);
  };

  return (
    <div className={styles.select}>
      <Select
        options={timeSlots}
        namespace="time"
        autoFocus
        margin="dense"
        label={t('time_slot')}
        fullWidth
        onChange={onChange}
        value={timeSlot}
      />
    </div>
  );
}
