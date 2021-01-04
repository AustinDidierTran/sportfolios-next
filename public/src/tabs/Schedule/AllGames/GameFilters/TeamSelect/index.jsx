import React, { useEffect, useState } from 'react';

import { Select } from '../../../../../components/Custom';
import styles from './TeamSelect.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../../../actions/api';
import { formatRoute } from '../../../../../actions/goTo';
import { SELECT_ENUM } from '../../../../../../common/enums';
import { useRouter } from 'next/router';

export default function TeamSelect(props) {
  const { onChange, teamId } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getTeams();
  }, []);

  const getTeams = async () => {
    const { data } = await api(formatRoute('/api/entity/teamsSchedule', null, { eventId }));
    const res = data
      //TO BE REMOVED ONLY FOR MEMPHRE
      .filter((d) => d.name.length > 2)
      .map((d) => ({
        value: d.roster_id,
        display: d.name,
      }));

    setTeams([{ value: SELECT_ENUM.ALL, display: t('all_teams') }, ...res]);
  };

  const handleChange = (teamId) => {
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
        label={t('team')}
        fullWidth
        onChange={handleChange}
        value={teamId}
      />
    </div>
  );
}
