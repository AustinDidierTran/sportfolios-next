import React from 'react';
import styles from './NotStartedRanking.module.css';
import Accordion from '../../../components/Custom/Accordion';
import List from '../../../components/Custom/List';
import NotStartedRankingItem from '../../../components/Custom/List/RankingItems/NotStartedRankingItem';
import { IPhase } from '../../../../../typescript/event';
import { useTranslation } from 'react-i18next';

interface IProps {
  phase: IPhase;
}

const NotStartedRanking: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { phase } = props;

  return (
    <div className={styles.div}>
      <Accordion title={phase.name} subtitle={t('phase.not_started')}>
        <List>
          {phase.rankings.map((ranking, index) => (
            <NotStartedRankingItem key={ranking.id} ranking={ranking} index={index} />
          ))}
        </List>
      </Accordion>
    </div>
  );
};
export default NotStartedRanking;
