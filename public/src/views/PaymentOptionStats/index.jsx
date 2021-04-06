import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import IgContainer from '../../components/Custom/IgContainer';
import Paper from '../../components/Custom/Paper';
import MockData from '../Analytics/GraphNumberOfMembers/MockData.json';
import styles from './PaymentOptionStats.module.css';
import loadable from '@loadable/component';

const GraphNumberOfMembers = loadable(() => import('../Analytics/GraphNumberOfMembers'));

export default function PaymentOptionStats() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = formatPageTitle(t('analytics'));
  }, []);

  return (
    <IgContainer>
      <Paper className={styles.paper} title={t('graphs')}>
        <GraphNumberOfMembers
          graphData={MockData}
          title={t('member.members')}
          totalTitle={t('member.members')}
          newTitle={t('new_members')}
        />
      </Paper>
    </IgContainer>
  );
}
