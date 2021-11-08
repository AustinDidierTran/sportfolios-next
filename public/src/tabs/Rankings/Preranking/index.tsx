import React, { useMemo } from 'react';
import styles from './Ranking.module.css';

import Accordion from '../../../components/Custom/Accordion';
import List from '../../../components/Custom/List';
import PrerankingItem from '../../../components/Custom/List/RankingItems/PrerankingItem';
import { Ranking as RankingType } from '../../../../../typescript/types';
import { IPreranking } from '../../../../../typescript/event';
import { useTranslation } from 'react-i18next';

interface IProps {
  preranking: IPreranking[];
}

interface IItems extends RankingType {
  type: string;
  index: number;
  key: number;
  withoutPosition: boolean;
}

const Ranking: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();

  const { preranking } = props;

  return (
    <div className={styles.div}>
      <Accordion title={t('event.preranking')}>
        <List>
          {preranking.map((p, i) => (
            <PrerankingItem key={i} index={i} positionName={p.team?.name} position={p.position} />
          ))}
        </List>
      </Accordion>
    </div>
  );
};
export default Ranking;
