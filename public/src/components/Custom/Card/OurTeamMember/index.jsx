import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import styles from './OurTeamMember.module.css';

export default function OurTeamMember(props) {
  const { name, role, src } = props;

  return (
    <Card className={styles.root} elevation={5}>
      <CardMedia className={styles.image} component="img" src={src} />
      <CardContent className={styles.firstCardContent}>
        <Typography style={{ whiteSpace: 'pre-line' }} variant="h5">
          {name}
        </Typography>
      </CardContent>
      <CardContent className={styles.secondCardContent}>
        <Typography style={{ whiteSpace: 'pre-line' }} variant="body1" className={styles.role}>
          {role}
        </Typography>
      </CardContent>
    </Card>
  );
}
