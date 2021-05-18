import React, { useEffect, useState } from 'react';

import { Select } from '../../../../../components/Custom';
import styles from './TimeSlotSelect.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../../../actions/api';
import { SELECT_ENUM } from '../../../../../../common/enums';
import { formatDate } from '../../../../../utils/stringFormats';
import moment from 'moment';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../../utils/stringFormats';

export default function TimeSlotSelect(props) {
  const { onChange, timeSlot } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    getTimeSlots();
  }, []);

  const getTimeSlots = async () => {
    const { data } = await api(formatRoute('/api/entity/slots', null, { eventId }));

    const res = data
      .map((d) => ({
        value: moment(d.date).format('YYYY M D'),
        display: formatDate(moment(d.date), 'DD MMM'),
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
