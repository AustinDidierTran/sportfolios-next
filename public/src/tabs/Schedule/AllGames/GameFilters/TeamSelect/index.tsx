import React, { useEffect, useState, useContext } from 'react';

import { Select } from '../../../../../components/Custom';
import styles from './TeamSelect.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../../../actions/api';
import { SELECT_ENUM } from '../../../../../../common/enums';
import { formatRoute } from '../../../../../utils/stringFormats';
import { Store } from '../../../../../Store';

interface IProps {
  onChange: (team: any) => void;
  teamId: string;
}

interface ITeams {
  value: string;
  display: string;
  teamId: string;
  rosterId: string;
  eventId: string;
  name: string;
}

const TeamSelect: React.FunctionComponent<IProps> = (props) => {
  const { onChange, teamId } = props;
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const [teams, setTeams] = useState<ITeams[]>([]);

  useEffect((): void => {
    if (eventId) {
      getTeams();
    }
  }, [eventId]);

  const getTeams = async (): Promise<void> => {
    const { data } = await api(formatRoute('/api/entity/teamsSchedule', null, { eventId }));
    const res = data.map((d:ITeams) => ({
      value: d.rosterId,
      display: d.name,
    }));

    setTeams([{ value: SELECT_ENUM.ALL, display: t('all_teams') }, ...res]);
  };

  const handleChange = (teamId: string): void => {
    const team = teams.find((team) => team.value === teamId);
    onChange(team);
  };

  return (
    <div className={styles.select}>
      <Select
        options={teams}
        namespace="team"
        autoFocus
        margin="dense"
        label={t('team.team')}
        fullWidth
        onChange={handleChange}
        value={teamId}
      />
    </div>
  );
}
export default TeamSelect;