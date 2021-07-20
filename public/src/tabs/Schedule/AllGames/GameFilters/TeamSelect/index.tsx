import React from 'react';
import MultiSelect from '../../../../../components/Custom/MultiSelect';
import styles from './TeamSelect.module.css';
import { useTranslation } from 'react-i18next';
import { formatFilter } from '../GameFilters.utils';

interface IProps {
  onChange: (teams: ITeams[]) => void;
  teams: ITeams[];
  allTeams: ITeams[];
}

interface ITeams {
  value: string;
  display: string;
}

const TeamSelect: React.FunctionComponent<IProps> = (props) => {
  const { onChange, teams, allTeams } = props;
  const { t } = useTranslation();

  const handleChange = (teams: ITeams[]): void => {
    onChange(formatFilter(teams, t('all_teams')));
  };

  return (
    <div className={styles.select}>
      <MultiSelect
        options={allTeams}
        namespace="team"
        autoFocus
        margin="dense"
        label={t('team.team')}
        fullWidth
        onChange={handleChange}
        values={teams}
      />
    </div>
  );
};
export default TeamSelect;
