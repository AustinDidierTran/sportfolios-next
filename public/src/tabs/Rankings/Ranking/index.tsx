import React, { useState, useEffect } from 'react';
import styles from './Ranking.module.css';
import { LIST_ITEM_ENUM } from '../../../../common/enums';
import Accordion from '../../../components/Custom/Accordion';
import List from '../../../components/Custom/List';
import { Ranking } from '../../../../../typescript/types';

interface IProps {
  ranking: Ranking[];
  title: string;
  subtitle?: string;
  withStats?: boolean;
  withoutPosition?: boolean;
  allTeamsEqual?: boolean;
}

interface IItems extends Ranking {
  type: string;
  index: number;
  key: number;
  withoutPosition: boolean;
}

const Ranking: React.FunctionComponent<IProps> = (props) => {
  const { ranking, title, subtitle, withStats, withoutPosition, allTeamsEqual } = props;

  const [items, setItems] = useState<IItems[]>([]);

  const getItems = (): void => {
    if (withStats) {
      const items = ranking.map((r: Ranking, index: number) => ({
        ...r,
        type: LIST_ITEM_ENUM.RANKING_WITH_STATS,
        index: index + 1,
        key: index,
        withoutPosition,
      }));
      if (allTeamsEqual) {
        setItems(items.sort((a, b) => a.initialPosition - b.initialPosition));
      }
      setItems(items);
    } else {
      const items = ranking.map((r, index) => ({
        ...r,
        type: LIST_ITEM_ENUM.RANKING,
        index: index + 1,
        key: index,
        withoutPosition,
      }));
      setItems(items);
    }
  };

  useEffect((): void => {
    getItems();
  }, [ranking]);

  return (
    <div className={styles.div}>
      <Accordion title={title} subtitle={subtitle} content={<List items={items} />} />
    </div>
  );
};
export default Ranking;
