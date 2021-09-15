import React, { useEffect, useState } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import { Team } from '../../../../typescript/team';
import { getTeams } from '../../actions/service/team/get';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import styles from './AdminEntitiesView.module.css';
import CustomAvatar from '../../components/Custom/Avatar';
import Delete from '@material-ui/icons/Delete';
import { Restore } from '@material-ui/icons';

const TEAM_LIMIT = 5;

const AdminEntitiesView: React.FunctionComponent = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamCount, setTeamCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    getTeams(TEAM_LIMIT, page).then((res) => {
      setTeams(res.teams);
      setTeamCount(res.count);
    });
  }, []);

  return (
    <React.Fragment>
      {/* Teams */}
      <Paper className={styles.card}>
        <Typography gutterBottom variant="h5" component="h2">
          Teams
        </Typography>
        <List>
          {teams?.map((t: Team, index: number) => (
            <React.Fragment key={index}>
              <ListItem>
                <CustomAvatar photoUrl={t.photoUrl} />
                <ListItemText primary={t.name} />
                <IconButton edge="end">{t.deletedAt ? <Restore /> : <Delete />}</IconButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </React.Fragment>
  );
};

export default AdminEntitiesView;
