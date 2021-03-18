import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import styles from './AdminPanel.module.css';

import Typography from '@material-ui/core/Typography';
import { Container } from '../../components/Custom';
import SportsTable from './SportsTable';
import UsersTable from './UsersTable';
import GaEventsTable from './GoogleAnalyticsEventsTable';
import GaPageviewsTable from './GoogleAnalyticsPageviewsTable';
import TaxRatesTable from './TaxRatesTable';
import GraphNumberOfMembers from '../Analytics/GraphNumberOfMembers';
import Paper from '@material-ui/core/Paper';
import api from '../../actions/api';
import { formatRoute } from '../../../common/utils/stringFormat';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';

export default function AdminPanel() {
  const { t } = useTranslation();
  const [graphData, setGraphData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const getDataGraph = async () => {
    const { data } = await api(formatRoute('/api/entity/graphUserCount', null, null));
    if (!data) {
      return;
    }
    setGraphData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getDataGraph();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className={styles.container}>
      <Typography variant="h3" className={styles.title} style={{ marginTop: 24 }}>
        {t('admin_panel')}
      </Typography>
      <UsersTable />
      <SportsTable />
      <GaEventsTable />
      <GaPageviewsTable />
      <TaxRatesTable />
      <Paper>
        <GraphNumberOfMembers
          graphData={graphData}
          title={t('member.members_in', { time: new Date().getFullYear() })}
          totalTitle={'total_members'}
          newTitle={'new_members'}
        />
      </Paper>
    </Container>
  );
}
