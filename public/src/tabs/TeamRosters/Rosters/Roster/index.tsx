import React, { useState, useEffect, useMemo, useContext } from 'react';

import styles from './Roster.module.css';
import Icon from '../../../../components/Custom/Icon';
import Button from '../../../../components/Custom/Button';
import FormDialog from '../../../../components/Custom/FormDialog';
import AlertDialog from '../../../../components/Custom/Dialog/AlertDialog';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import RosterPlayer from './RosterPlayer';
import { useTranslation } from 'react-i18next';
import { FORM_DIALOG_TYPE_ENUM, SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';
import { Roster as RosterType, Player } from '../../../../../../typescript/types';
import { getRosterPlayers } from '../../../../actions/service/entity/get';
import { deleteRoster as deleteRosterApi, deleteRosterPlayer } from '../../../../actions/service/entity/delete';
import { remainsOneCaptainOrCoach } from '../../../../utils/validators';

interface IProps {
  roster: RosterType;
  index: number;
  isAdmin: boolean;
  update: () => void;
}

const Roster: React.FunctionComponent<IProps> = (props) => {
  const { roster, index, isAdmin, update } = props;
  const { t } = useTranslation();

  const { dispatch } = useContext(Store);

  useEffect((): void => {
    if (roster.id) {
      getPlayers();
    }
  }, [roster.id]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [deleteRoster, setDeleteRoster] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  const getPlayers = async () => {
    const players = await getRosterPlayers(roster.id);
    setPlayers(players);
  };

  const onExpand = (): void => {
    setExpanded(!expanded);
  };

  const style = useMemo((): string => {
    if (index % 2 === 0) {
      return styles.even;
    } else {
      return styles.odd;
    }
  }, [index]);

  const onDelete = async () => {
    const status = await deleteRosterApi(roster.id);
    if (status === REQUEST_STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else {
      setDeleteRoster(false);
    }
    update();
  };

  const onDeletePlayer = async (id: string) => {
    if (!remainsOneCaptainOrCoach(players, id)) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team.team_player_role_error'),
        severity: SEVERITY_ENUM.ERROR,
      });
      return;
    }

    const status = await deleteRosterPlayer(id);
    if (status === REQUEST_STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
    update();
  };
  return (
    <Accordion expanded={expanded} onChange={onExpand}>
      <AccordionSummary className={style} expandIcon={<Icon icon="ExpandMore" />}>
        <Typography className={styles.name}>{roster.name}</Typography>
      </AccordionSummary>
      <AccordionDetails className={styles.accordionDetail}>
        <List className={styles.list}>
          {players.map((player, index) => (
            <RosterPlayer
              key={player.id}
              player={player}
              index={index}
              update={getPlayers}
              isAdmin={isAdmin}
              onDeletePlayer={onDeletePlayer}
            />
          ))}
          {isAdmin ? (
            <div className={styles.divButton}>
              <Button
                className={styles.button}
                onClick={() => {
                  setEdit(true);
                }}
              >
                {t('edit.edit_roster')}
              </Button>
              <Button
                className={styles.button}
                onClick={() => {
                  setDeleteRoster(true);
                }}
                color="secondary"
              >
                {t('delete.delete')}
              </Button>
            </div>
          ) : null}
        </List>
        <AlertDialog
          open={deleteRoster}
          onCancel={() => {
            setDeleteRoster(false);
          }}
          title={t('delete.delete_roster_confirmation', { name: roster.name })}
          onSubmit={onDelete}
        />
        <FormDialog
          type={FORM_DIALOG_TYPE_ENUM.EDIT_ROSTER}
          items={{
            open: edit,
            onClose: () => setEdit(false),
            roster,
            players,
            update: () => {
              getPlayers();
              update();
            },
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default Roster;
