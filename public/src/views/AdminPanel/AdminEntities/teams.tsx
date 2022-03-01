import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import { Team } from '../../../../../typescript/entity';
import { deleteTeam, getTeams } from '../../../actions/service/team/admin';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import styles from '../AdminEntitiesView.module.css';
import CustomAvatar from '../../../components/Custom/Avatar';
import Delete from '@material-ui/icons/Delete';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import Restore from '@material-ui/icons/Restore';
import Button from '@material-ui/core/Button';
import { useFormInput } from '../../../hooks/forms';

const TEAM_LIMIT = 10;

const Teams: React.FunctionComponent<Record<string, unknown>> = () => {
  const { t } = useTranslation();

  const [teams, setTeams] = useState<Team[]>([]);
  const [teamCount, setTeamCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const teamSearchQuery = useFormInput('');

  const pageAmount = useMemo(() => Math.ceil(teamCount / TEAM_LIMIT), [teamCount, TEAM_LIMIT]);

  const updateTeams = useCallback(() => {
    getTeams(TEAM_LIMIT, page, teamSearchQuery.value).then((res) => {
      setTeams(res.teams);
      setTeamCount(res.count);
    });
  }, [TEAM_LIMIT, page, teamSearchQuery.value]);

  const onTeamDelete = useCallback((id, restore) => {
    deleteTeam(id, restore).then(() => updateTeams());
  }, []);

  useEffect(() => {
    updateTeams();
  }, [updateTeams]);

  return (
    <Paper className={styles.card}>
      <Typography gutterBottom variant="h5" component="h2">
        {t('team.teams')}
      </Typography>
      <TextField {...teamSearchQuery.inputProps} placeholder={t('search.title')} />
      <div className={styles.paging}>
        <Button startIcon={<ArrowBackIosRoundedIcon />} onClick={() => setPage((page) => Math.max(1, page - 1))} />
        <span>
          Page {page} of {pageAmount}
        </span>
        <Button
          endIcon={<ArrowForwardIosRoundedIcon />}
          onClick={() => setPage((page) => Math.min(pageAmount, page + 1))}
        />
      </div>
      <List>
        {teams?.map((t: Team, index: number) => (
          <React.Fragment key={index}>
            <ListItem>
              <CustomAvatar photoUrl={t.photoUrl} />
              <ListItemText primary={t.name} />
              <IconButton edge="end" onClick={() => onTeamDelete(t.id, Boolean(t.deletedAt))}>
                {t.deletedAt ? <Restore /> : <Delete />}
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default Teams;
