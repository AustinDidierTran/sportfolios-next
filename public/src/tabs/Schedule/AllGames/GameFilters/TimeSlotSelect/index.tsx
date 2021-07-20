import React from 'react';
import MultiSelect from '../../../../../components/Custom/MultiSelect';
import styles from './TimeSlotSelect.module.css';
import { useTranslation } from 'react-i18next';
import { formatFilter } from '../GameFilters.utils';

interface IProps {
  timeSlots: ITimeSlots[];
  allTimeSlots: ITimeSlots[];
  onChange: (timeSlot: ITimeSlots[]) => void;
}

interface ITimeSlots {
  value: string;
  display: string;
}

const TimeSlotSelect: React.FunctionComponent<IProps> = (props) => {
  const { onChange, allTimeSlots, timeSlots } = props;
  const { t } = useTranslation();

  const handleChange = (timeSlots: ITimeSlots[]): void => {
    onChange(formatFilter(timeSlots, t('all_time_slots')));
  };

  return (
    <div className={styles.select}>
      <MultiSelect
        options={allTimeSlots}
        namespace="time"
        autoFocus
        margin="dense"
        label={t('time_slot')}
        fullWidth
        onChange={handleChange}
        values={timeSlots}
      />
    </div>
  );
};
export default TimeSlotSelect;
