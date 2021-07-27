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
import { SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';
import { COLORS } from '../../../utils/colors';

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: COLORS.lightGrey },
    justifySelf: 'end',
  },
}));

const getTeamstyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? '#F0F0F0' : COLORS.white,
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'whitesmoke' : COLORS.white,
  width: '100%',
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function PrerankAccordionDnD(props) {
  const { title, ranking, update, id, ...otherProps } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);
  const [width] = useWindowSize();

  const [expanded, setExpanded] = useState(false);
  const [madeChanges, setMadeChanges] = useState(false);
  const [preranking, setPreranking] = useState(ranking);

  useEffect(() => {
    setPreranking(ranking);
  }, [ranking]);

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
    const newPreranking = reorder(preranking, result.source.index, result.destination.index);
    setMadeChanges(true);
    setPreranking(newPreranking);
  };

  const onCancel = () => {
    update();
  };

  const onSave = async () => {
    const res = await api(`/api/entity/updatePreRanking`, {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        ranking: preranking,
      }),
    });
    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
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
                  button.onClick(preranking, id);
                  setMadeChanges(false);
                }}
                color={button.color}
                type={button.type}
                disabled={!madeChanges}
                endIcon={width < MOBILE_WIDTH ? '' : button.endIcon}
                className={styles.prerankButton}
                key={index}
              >
                {width < MOBILE_WIDTH ? <Icon icon={button.endIcon} tooltip={''} /> : button.name}
              </Button>
            ))}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                  {preranking.length ? (
                    <div>
                      {preranking.map((rank, index) => (
                        <Draggable key={rank.rankingId} draggableId={rank.rankingId} index={index}>
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
                                  {rank.rosterId ? (
                                    <ListItemText className={styles.name} primary={rank.content} />
                                  ) : (
                                    <ListItemText className={styles.name} secondary={rank.content} />
                                  )}
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
