import React, { useEffect, useState } from 'react';

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
import Icon from '../../Icon';
import Button from '../../Button';
import IconButton from '../../IconButton';

import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
    justifySelf: 'end',
  },
}));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getTeamstyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? '#F0F0F0' : 'white',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'whitesmoke' : 'white',
  width: '100%',
});

export default function PrerankAccordionDnD(props) {
  const { title, teams: teamsProps, buttons, editIconButton, isDone, id, ...otherProps } = props;
  const classes = useStyles();
  const { t } = useTranslation();

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
    const newteams = reorder(teams, result.source.index, result.destination.index);
    setTeams(newteams);
    setMadeChanges(true);
  };

  return (
    <Accordion expanded={expanded} onChange={onExpand} {...otherProps}>
      <AccordionSummary expandIcon={<Icon icon="ExpandMore" className={classes.primary} />}>
        <ListItemText primary={title} />
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
                  {teams ? (
                    <div>
                      {teams.map((team, index) => (
                        <Draggable key={team.id} draggableId={team.id} index={index} isDragDisabled={isDone}>
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
                                  <ListItemIcon className={styles.edit}>
                                    <IconButton
                                      className={styles.iconButton}
                                      onClick={() => {
                                        editIconButton.onClick(team);
                                      }}
                                      icon="Edit"
                                      style={{ color: 'grey' }}
                                      tooltip={t('change_team')}
                                    ></IconButton>
                                  </ListItemIcon>
                                </div>
                              </ListItem>
                              <Divider />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  ) : (
                    //FIXME: changer no teams number pour add team to event
                    <ListItemText className={styles.name} primary={t('no_teams_number')} />
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
