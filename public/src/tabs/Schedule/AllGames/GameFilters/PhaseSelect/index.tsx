import React, { useEffect, useState, useContext } from 'react';

import { Select } from '../../../../../components/Custom';
import styles from './PhaseSelect.module.css';
import { useTranslation } from 'react-i18next';
import { SELECT_ENUM } from '../../../../../../common/enums';
import { Store } from '../../../../../Store';
import { getPhases as getPhasesApi } from '../../../../../actions/service/entity';

interface IProps {
  phaseId: string;
  onChange: (phase: any) => void;
}
interface IPhases {
  value: string;
  display: string;
}

const PhaseSelect: React.FunctionComponent<IProps> = (props) => {
  const { onChange, phaseId } = props;
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const [phases, setPhases] = useState<IPhases[]>([]);

  useEffect((): void => {
    if (eventId) {
      getPhases();
    }
  }, [eventId]);

  const getPhases = async (): Promise<void> => {
    const data = await getPhasesApi(eventId);
    const res = data.map((d) => ({
      value: d.id,
      display: d.name,
    }));

    setPhases([{ value: SELECT_ENUM.ALL, display: t('all_phases') }, ...res]);
  };

  const handleChange = (phaseId: string): void => {
    const phase = phases.find((phase) => {
      return phase.value === phaseId;
    });
    onChange(phase);
  };

  return (
    <div className={styles.select}>
      <Select
        options={phases}
        namespace="phase"
        autoFocus
        margin="dense"
        label={t('phase')}
        fullWidth
        onChange={handleChange}
        value={phaseId}
      />
    </div>
  );
};
export default PhaseSelect;
