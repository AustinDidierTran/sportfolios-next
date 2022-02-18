import { Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Icon from '../../../../components/Custom/Icon';
import Select from '../../../../components/Custom/Select';
import React, { useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { COLORS } from '../../../../utils/colors';

import styles from './RankingItem.module.css';
import { updateRosterIdInRankings } from '../../../../actions/service/event';

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  background: isDragging ? COLORS.draggedWhite : COLORS.white,
  ...draggableStyle,
});

interface IItem {
  id: string;
  name: string;
  wins: number;
  loses: number;
  pointFor: number;
  pointAgainst: number;
  finalPosition: number;
  positionName: string; // Should be infered from other props
  rosterId: string;
  rankingId: string;
}

interface IProps {
  index: number;
  isOverride: boolean;
  item: IItem;
  preRanking: any[];
  update: any;
}

/**
 * Step 1: set this inside it's own compontent [x]
 * Step 2: Add a button to turn into edit mode
 * Step 3: Bind button to edit mode
 * Step 4: When in edit mode, you can select any team from the preranking
 * Step 5: Add the call to the service + add the route
 * Step 6: When team has been confirmed, remove the secondary
 */

const RankingItem: React.FunctionComponent<IProps> = (props) => {
  const { item, index, isOverride, preRanking, update } = props;

  const onChange = useCallback(
    (value) => {
      updateRosterIdInRankings(value, item.rankingId).then(() => {
        update();
      });
    },
    [item.rankingId]
  );

  return (
    <Draggable draggableId={item.id} index={index} isDragDisabled={!isOverride}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        >
          <div>
            <ListItem>
              {isOverride && (
                <ListItemIcon>
                  <Icon icon="Reorder" color="textSecondary" />
                </ListItemIcon>
              )}
              <div className={styles.stats}>
                <ListItemText
                  className={styles.position}
                  secondary={item.finalPosition ? item.finalPosition : index + 1}
                />
                {/* Should there be an edit mode instead? */}
                <div>
                  <Select
                    onChange={onChange}
                    options={preRanking
                      .filter((team) => team.rosterId)
                      .map((team) => ({
                        display: team.content,
                        value: team.rosterId,
                      }))}
                    value={item.rosterId}
                  />
                </div>
                <ListItemText className={styles.win} primary={item.wins} secondary={'W'} />
                <ListItemText className={styles.lose} primary={item.loses} secondary={'L'} />
                <ListItemText className={styles.pointFor} primary={item.pointFor} secondary={'+'} />
                <ListItemText className={styles.pointAgainst} primary={item.pointAgainst} secondary={'-'} />
                <ListItemText className={styles.delta} primary={item.pointFor - item.pointAgainst} secondary={'+/-'} />
              </div>
            </ListItem>
            <Divider />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default RankingItem;
