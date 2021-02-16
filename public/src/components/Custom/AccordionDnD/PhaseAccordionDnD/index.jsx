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
import styles from './PhaseAccordionDnD.module.css';
import Icon from '../../Icon';
import Button from '../../Button';
import IconButton from '../../IconButton';
import { v4 as uuidv4 } from 'uuid';

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

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? '#F0F0F0' : 'white',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'whitesmoke' : 'white',
  width: '100%',
});

export default function CustomAccordionDnD(props) {
  const {
    title,
    items: itemsProps,
    withIndex,
    buttons,
    editIconButton,
    addIconButton,
    isDone,
    spots,
    id,
    ...otherProps
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);
  const [madeChanges, setMadeChanges] = useState(false);
  const [items, setItems] = useState(itemsProps);
  const [emptySpots, setEmptySpots] = useState([]);

  useEffect(() => {
    setItems(itemsProps);
  }, [itemsProps]);

  useEffect(() => {
    setEmptySpots(getEmptySpots(spots));
  }, [spots]);

  const onExpand = () => {
    setExpanded((exp) => !exp);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newItems = reorder(items, result.source.index, result.destination.index);
    setItems(newItems);
    setMadeChanges(true);
  };

  const getEmptySpots = (number) => {
    setEmptySpots([]);
    var emptySpots = [];
    if (items.length >= spots || id === 'preranking') {
      return emptySpots;
    }
    for (var i = 0; i < number - items.length; ++i) {
      emptySpots.push({
        index: i.toString(),
        id: uuidv4(),
      });
    }
    return emptySpots;
  };

  return (
    <Accordion expanded={expanded} onChange={onExpand} {...otherProps}>
      <AccordionSummary expandIcon={<Icon icon="ExpandMore" className={classes.primary} />}>
        {id !== 'preranking' ? (
          <ListItemText primary={isDone ? title + ' - ' + t('phase_done') : title + ' - ' + t('phase_in_progress')} />
        ) : (
          <ListItemText primary={title} />
        )}
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.div}>
          <div className={id !== 'preranking' ? styles.buttonContainer : styles.prerankButtonContainer}>
            {buttons.map((button, index) => (
              <Button
                onClick={() => {
                  button.onClick(items, id);
                  setMadeChanges(false);
                }}
                color={button.color}
                type={button.type}
                disabled={button.name === t('edit_team_number') ? isDone : isDone || !madeChanges}
                endIcon={button.endIcon}
                className={id !== 'preranking' ? styles.button : styles.prerankButton}
                key={index}
              >
                {button.name}
              </Button>
            ))}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                  {spots || spots > 0 ? (
                    <div>
                      {items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                            >
                              <ListItem>
                                <ListItemIcon>
                                  <Icon icon="Reorder" color="textSecondary" />
                                </ListItemIcon>
                                <div className={styles.main} style={{ width: '100%' }}>
                                  <ListItemText className={styles.position} secondary={index + 1} />
                                  <ListItemText className={styles.name} primary={item.content} />
                                  <ListItemIcon className={styles.edit}>
                                    <IconButton
                                      className={styles.iconButton}
                                      onClick={() => {
                                        editIconButton.onClick(item);
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
                    <ListItemText className={styles.name} primary={t('no_teams_number')} />
                  )}
                  {emptySpots ? (
                    <div>
                      {emptySpots.map((spot, index) => (
                        <Draggable
                          key={spot.id}
                          draggableId={spot.id}
                          index={index + items.length}
                          isDragDisabled={true}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                            >
                              <ListItem>
                                <div className={styles.spots} style={{ width: '100%' }}>
                                  <ListItemText
                                    className={styles.positionHolder}
                                    secondary={index + 1 + items.length}
                                  />
                                  <ListItemText className={styles.title} primary={t('add_team') + '...'} />
                                  <ListItemIcon className={styles.add}>
                                    <IconButton
                                      className={styles.iconButton}
                                      onClick={() => {
                                        addIconButton.onClick();
                                      }}
                                      icon="Add"
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
                    <></>
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
