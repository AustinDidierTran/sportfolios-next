import React, { useState, useMemo } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './ExerciseItem.module.css';
import CustomCollapse from '../../Collapse';
import CustomIconButton from '../../IconButton';
import { Exercise } from '../../../../../../typescript/types';

interface IProps {
  exercise?: Exercise;
  index: number;
}

const ExerciseItem: React.FunctionComponent<IProps> = (props) => {
  const { exercise, index } = props;

  const [expanded, setExpanded] = useState<boolean>(false);

  const handleExpand = (): void => {
    setExpanded(!expanded);
  };

  const icon = useMemo(
    (): 'KeyboardArrowUp' | 'KeyboardArrowDown' => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'),
    [expanded]
  );

  return (
    <>
      <ListItem className={index % 2 === 0 ? styles.greycard : styles.card} onClick={handleExpand} key={exercise.id}>
        <ListItemText primary={`${exercise.name}`} />
        <CustomIconButton className={styles.grey} onClick={handleExpand} aria-expanded={expanded} icon={icon} />
      </ListItem>

      <CustomCollapse in={expanded} timeout="auto" unmountOnExit>
        <div className={styles.whiteSmoke}>
          <ListItem className={styles.div}>
            <ListItemText secondary={`Description : ${exercise.description}`} />
          </ListItem>
        </div>
      </CustomCollapse>
    </>
  );
};
export default ExerciseItem;
