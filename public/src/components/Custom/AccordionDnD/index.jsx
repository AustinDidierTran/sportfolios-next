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
import styles from './AccordionDnD.module.css';
import CustomIcon from '../Icon';
import CustomButton from '../Button';
import { COLORS } from '../../../utils/colors';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: COLORS.lightGrey },
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
  background: isDragging ? COLORS.whiteSmoke : COLORS.white,
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? COLORS.whiteSmoke : COLORS.white,
  width: '100%',
});

export default function CustomAccordionDnD(props) {
  const { title, items: itemsProps, withIndex, buttons, ...otherProps } = props;
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState(itemsProps);

  useEffect(() => {
    setItems(itemsProps);
  }, [itemsProps]);

  const onExpand = () => {
    const exp = !expanded;
    setExpanded(exp);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newItems = reorder(items, result.source.index, result.destination.index);
    setItems(newItems);
  };

  return (
    <Accordion expanded={expanded} onChange={onExpand} {...otherProps}>
      <AccordionSummary expandIcon={<CustomIcon icon="ExpandMore" className={classes.primary} />}>
        <ListItemText primary={title} />
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.div}>
          {buttons.map((button, index) => (
            <CustomButton
              onClick={() => {
                button.onClick(items);
              }}
              color={button.color}
              type={button.type}
              disabled={button.disabled}
              endIcon={button.endIcon}
              className={styles.button}
              key={index}
            >
              {button.name}
            </CustomButton>
          ))}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          {withIndex ? (
                            <ListItem>
                              <ListItemIcon>
                                <CustomIcon icon="Reorder" color="textSecondary" />
                              </ListItemIcon>
                              <div className={styles.main} style={{ width: '100%' }}>
                                <ListItemText className={styles.position} secondary={index + 1} />
                                <ListItemText className={styles.name} primary={item.content} />
                              </div>
                            </ListItem>
                          ) : (
                            <ListItem>
                              <div style={{ width: '100%' }}>
                                <ListItemText primary={item.content} />
                              </div>
                            </ListItem>
                          )}
                          <Divider />
                        </div>
                      )}
                    </Draggable>
                  ))}
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
