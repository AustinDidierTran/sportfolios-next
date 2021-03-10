import React, { useEffect, useState, useContext } from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './PrerankAccordionDnD.module.css';
import Icon from '../../../components/Custom/Icon';
import Button from '../../../components/Custom/Button';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { ACTION_ENUM, Store } from '../../../Store';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { useRouter } from 'next/router';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
    justifySelf: 'end',
  },
}));

const getTeamstyle = (isDragging, draggableStyle) => ({
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

export default function PrerankAccordionDnD(props) {
  const { title, teams: teamsProps, update, id, ...otherProps } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const [expanded, setExpanded] = useState(false);
  const [madeChanges, setMadeChanges] = useState(false);
  const [teams, setTeams] = useState(teamsProps);

  useEffect(() => {
    setTeams(teamsProps);
  }, [teamsProps]);

  const onExpand = () => {
    setExpanded((exp) => !exp);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    const newteams = reorder(teams, result.source.index, result.destination.index);
    setMadeChanges(true);
    setTeams(newteams);
  };

  const onCancel = () => {
    update();
  };

  const onSave = async () => {
    const res = await api(`/api/entity/updatePreRanking`, {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        ranking: teams,
      }),
    });
    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('preranking_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
      update();
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
      onClick: onSave,
      name: t('save'),
      color: 'primary',
      endIcon: 'SaveIcon',
    },
    {
      onClick: onCancel,
      name: t('cancel'),
      color: 'secondary',
      endIcon: 'Close',
    },
  ];

  return (
    <Accordion expanded={expanded} onChange={onExpand} {...otherProps}>
      <AccordionSummary expandIcon={<Icon icon="ExpandMore" className={classes.primary} />}>
        <ListItemText primary={title} className={styles.title} />
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.div}>
          <div className={styles.prerankButtonContainer}>
            {buttons.map((button, index) => (
              <Button
                onClick={() => {
                  button.onClick(teams, id);
                  setMadeChanges(false);
                }}
                color={button.color}
                type={button.type}
                disabled={!madeChanges}
                endIcon={window.innerWidth < 600 ? '' : button.endIcon}
                className={styles.prerankButton}
                key={index}
              >
                {window.innerWidth < 600 ? <Icon icon={button.endIcon} tooltip={''}></Icon> : button.name}
              </Button>
            ))}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                  {teams.length ? (
                    <div>
                      {teams.map((team, index) => (
                        <Draggable key={team.rosterId} draggableId={team.rosterId} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getTeamstyle(snapshot.isDragging, provided.draggableProps.style)}
                            >
                              <ListItem>
                                <ListItemIcon>
                                  <Icon icon="Reorder" color="textSecondary" />
                                </ListItemIcon>
                                <div className={styles.main} style={{ width: '100%' }}>
                                  <ListItemText className={styles.position} secondary={index + 1} />
                                  <ListItemText className={styles.name} primary={team.content} />
                                </div>
                              </ListItem>
                              <Divider />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  ) : (
                    <ListItemText className={styles.name} primary={t('no.no_teams_registered')} />
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
