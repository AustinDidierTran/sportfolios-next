import React from 'react';
import MultiSelect from '../../../../../components/Custom/MultiSelect';
import styles from './PhaseSelect.module.css';
import { useTranslation } from 'react-i18next';
import { formatFilter } from '../GameFilters.utils';

interface IProps {
  phases: IPhases[];
  onChange: (phases: IPhases[]) => void;
  allPhases: IPhases[];
}

interface IPhases {
  value: string;
  display: string;
}

const PhaseSelect: React.FunctionComponent<IProps> = (props) => {
  const { onChange, phases, allPhases } = props;
  const { t } = useTranslation();

  const handleChange = (phases: IPhases[]): void => {
    onChange(formatFilter(phases, t('all_phases')));
  };

  return (
    <div className={styles.select}>
      <MultiSelect
        options={allPhases}
        namespace="phase"
        autoFocus
        margin="dense"
        label={t('phase')}
        fullWidth
        onChange={handleChange}
        values={phases}
      />
    </div>
  );
};
export default PhaseSelect;
