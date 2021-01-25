import React, { useEffect, useState } from 'react';
import api from '../../../../actions/api';
import styles from './TeamRankingCard.module.css';
import { Typography } from '@material-ui/core';
import { formatRoute } from '../../../../../common/utils/stringFormat';

export default function TeamRankingCard(props) {
  const { position, teamId } = props;
  const [team, setTeam] = useState({});

  const getTeam = async () => {
    const {
      data: { basicInfos: data },
    } = await api(
      formatRoute('/api/entity', null, {
        id: teamId,
      })
    );
    setTeam(data);
  };

  useEffect(() => {
    getTeam();
  }, [teamId]);

  return (
    <div className={styles.div}>
      <Typography>{position}</Typography>
      <Typography>{team.name}</Typography>
    </div>
  );
}
