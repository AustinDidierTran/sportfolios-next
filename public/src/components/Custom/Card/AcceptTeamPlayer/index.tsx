import React from 'react';

import styles from './AcceptPlayerInfos.module.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Avatar from '../../Avatar';
import { PendingPlayer } from '../../../../../../typescript/types';
import StatusChip from '../../StatusChip';

const AcceptTeamPlayer: React.FunctionComponent<PendingPlayer> = (props) => {
  const { status, name, photoUrl } = props;

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.header}
        avatar={<Avatar aria-label="recipe" photoUrl={photoUrl}></Avatar>}
        title={
          <div className={styles.title}>
            <Typography variant="h5">{name}</Typography>
            <div className={styles.chip}>
              <StatusChip status={status} />
            </div>
          </div>
        }
      />
    </Card>
  );
};
export default AcceptTeamPlayer;
