import React, { useEffect, useState, useContext, useMemo } from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Divider from '@material-ui/core/Divider';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './PhaseAccordionDnD.module.css';
import Icon from '../../../components/Custom/Icon';
import Button from '../../../components/Custom/Button';
import IconButton from '../../../components/Custom/IconButton';
import EditPhase from '../EditPhase';
import { useTranslation } from 'react-i18next';
import { PHASE_STATUS_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import { ACTION_ENUM, Store } from '../../../Store';
import api from '../../../actions/api';
import { ERROR_ENUM } from '../../../../common/errors';
import { useRouter } from 'next/router';
import AddTeamPhase from './AddTeamPhase';
import Menu from '../Menu';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
    justifySelf: 'end',
  },
  summary: {
    margin: '0px !important',
  },
}));

const AccordionSummary = withStyles({
  content: {
    '&$expanded': {
      margin: '8px 0',
    },
    margin: '4px 0',
  },
})(MuiAccordionSummary);

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? '#F0F0F0' : 'white',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'whitesmoke' : 'white',
  width: '100%',
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function PhaseAccordionDnD(props) {
  const {
    phase,
    handleDeleteTeam,
    update,
    expandedPhases,
    onShrink,
    onExpand,
    startPhase,
    onOpenDeleteDialog,
    ...otherProps
  } = props;
  const { content, ranking, status, spots, phaseId } = phase;

  const classes = useStyles();
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const [madeChanges, setMadeChanges] = useState(false);
  const [teams, setTeams] = useState(ranking);
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);

  const [initialPosition, setInitialPosition] = useState();

  useEffect(() => {
    setTeams(ranking);
  }, [ranking]);

  const isOneExpanded = useMemo(() => expandedPhases.length > 0, [expandedPhases.length]);
  const expanded = useMemo(() => expandedPhases.includes(phaseId), [expandedPhases, phaseId]);

  const onDragEnd = (result) => {
    if (result.destination.index === result.source.index) {
      return;
    } else {
      const newTeams = reorder(teams, result.source.index, result.destination.index);
      setMadeChanges(true);
      setTeams(newTeams);
    }
  };

  const closeEdit = () => {
    setEdit(false);
  };

  const openEdit = () => {
    setEdit(true);
  };

  const closeAdd = () => {
    setAdd(false);
    if (update) {
      update();
    }
  };

  const openAdd = (rank, e) => {
    e.stopPropagation();
    setInitialPosition(rank);
    setAdd(true);
  };

  const onSave = async () => {
    const res = await api(`/api/entity/updateInitialPositionPhase`, {
      method: 'PUT',
      body: JSON.stringify({
        phaseId,
        eventId,
        teams,
      }),
    });

    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('ranking_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };

  const buttons = [
    {
      onClick: startPhase,
      name: t('start_phase'),
      color: 'primary',
      endIcon: 'Play',
      className: styles.button,
    },
    {
      onClick: onSave,
      name: t('save'),
      color: 'primary',
      endIcon: 'SaveIcon',
      className: styles.save,
    },
    {
      onClick: update,
      name: t('cancel'),
      color: 'secondary',
      endIcon: 'Close',
      className: styles.cancel,
    },
  ];

  return (
    <>
      <Accordion expanded={expanded} onChange={expanded ? onShrink : onExpand} {...otherProps}>
        <AccordionSummary expandIcon={<Icon icon="ExpandMore" className={classes.primary} />}>
          <div className={styles.reorder}>
            <ListItemIcon>{!(expanded || isOneExpanded) && <Icon icon="Reorder" color="textSecondary" />}</ListItemIcon>
          </div>
          <ListItemText primary={content} secondary={t('phase_not_started')} />
        </AccordionSummary>
        <div className={styles.container}>
          <div className={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <Button
                onClick={(event) => {
                  button.onClick(phase, event, madeChanges);
                  if (button.name !== t('start_phase')) {
                    setMadeChanges(false);
                  }
                }}
                color={button.color}
                type={button.type}
                disabled={button.name === t('start_phase') ? false : !madeChanges}
                endIcon={window.innerWidth < 600 ? '' : button.endIcon}
                className={button.className}
                key={index}
              >
                {window.innerWidth < 600 ? <Icon icon={button.endIcon}></Icon> : button.name}
              </Button>
            ))}
          </div>
          <div className={styles.menuContainer}>
            <Menu
              className={styles.menu}
              phase={phase}
              openEdit={openEdit}
              onOpenDeleteDialog={onOpenDeleteDialog}
            ></Menu>
          </div>
        </div>
        <AccordionDetails>
          <div className={styles.div}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {spots || spots > 0 ? (
                      <div>
                        {teams.map((team, index) => (
                          <Draggable
                            key={team.rankingId}
                            draggableId={team.rankingId}
                            index={index}
                            isDragDisabled={status !== PHASE_STATUS_ENUM.NOT_STARTED}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                              >
                                {team.isEmpty ? (
                                  <ListItem button onClick={(e) => {
                                    openAdd(index + 1, e);
                                  }}>
                                    <ListItemIcon>
                                      <Icon icon="Reorder" color="textSecondary" />
                                    </ListItemIcon>
                                    <div className={styles.spots} style={{ width: '100%' }}>
                                      <ListItemText className={styles.positionHolder} secondary={index + 1} />
                                      <ListItemText
                                        className={styles.title}
                                        secondary={t('add.add_position') + '...'}
                                      />
                                      <ListItemIcon className={styles.add}>
                                        <IconButton
                                          className={styles.iconButton}
                                          icon="Add"
                                          style={{ color: 'grey' }}
                                          tooltip={t('add.add_team')}
                                        ></IconButton>
                                      </ListItemIcon>
                                    </div>
                                  </ListItem>
                                ) : (
                                  <ListItem>
                                    <ListItemIcon>
                                      <Icon icon="Reorder" color="textSecondary" />
                                    </ListItemIcon>
                                    <div className={styles.main} style={{ width: '100%' }}>
                                      <ListItemText className={styles.position} secondary={index + 1} />
                                      <ListItemText className={styles.name} primary={team.content} />
                                      <ListItemIcon className={styles.edit}>
                                        <IconButton
                                          className={styles.iconButton}
                                          onClick={() => {
                                            handleDeleteTeam(phaseId, index + 1);
                                          }}
                                          icon="Delete"
                                          style={{ color: 'grey' }}
                                          tooltip={t('delete.delete_team')}
                                        ></IconButton>
                                      </ListItemIcon>
                                    </div>
                                  </ListItem>
                                )}
                                <Divider />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    ) : (
                      <ListItemText className={styles.name} primary={t('no.no_team_number')} />
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </AccordionDetails>
      </Accordion>
      <EditPhase isOpen={edit} onClose={closeEdit} phaseId={phaseId} currentSpots={spots} update={update} />
      <AddTeamPhase
        isOpen={add}
        onClose={closeAdd}
        phaseId={phaseId}
        update={update}
        initialPosition={initialPosition}
        teams={teams}
      />
    </>
  );
}
