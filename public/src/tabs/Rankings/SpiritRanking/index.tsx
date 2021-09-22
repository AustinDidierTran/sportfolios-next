import React from 'react';

import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';

import { ISpiritRanking } from '../../../../../typescript/event';
import { List } from '../../../components/Custom';
import Accordion from '../../../components/Custom/Accordion';
import SpiritScoreItem from '../../../components/Custom/List/SpiritScoreItem';
import styles from './SpiritRanking.module.css';

interface IProps {
  spirit: [ISpiritRanking];
}

const SpiritRanking: React.FunctionComponent<IProps> = ({ spirit }) => {
  const { t } = useTranslation();

  if (!spirit?.length) {
    return <></>;
  }

  return (
    <div className={styles.div}>
      <Accordion title={t('score.spirit')}>
        <List>
          {spirit.map((s, index) => (
            <React.Fragment key={index}>
              <SpiritScoreItem spirit={s} index={index + 1} />
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Accordion>
    </div>
  );
};

export default SpiritRanking;
