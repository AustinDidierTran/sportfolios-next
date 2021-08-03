import React, { useEffect, useState } from 'react';
import styles from './TeamRankingCard.module.css';
import Typography from '@material-ui/core/Typography';
import { getEntity } from '../../../../actions/service/entity/get';
import { Entity } from '../../../../../../typescript/types';

interface IProps {
  position: any;
  teamId: string;
}

const TeamRankingCard: React.FunctionComponent<IProps> = (props) => {
  const { position, teamId } = props;
  const [team, setTeam] = useState<Entity>();

  const getTeam = async () => {
    getEntity(teamId).then(setTeam);
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
};
export default TeamRankingCard;
