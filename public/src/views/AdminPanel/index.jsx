import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import styles from './AdminPanel.module.css';

import Typography from '@material-ui/core/Typography';
import { Container } from '../../components/Custom';
import Paper from '@material-ui/core/Paper';
import api from '../../actions/api';
import { formatRoute } from '../../../common/utils/stringFormat';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import moment from 'moment';

import loadable from '@loadable/component';

const SportsTable = loadable(() => import('./SportsTable'));
const UsersTable = loadable(() => import('./UsersTable'));
const GaEventsTable = loadable(() => import('./GoogleAnalyticsEventsTable'));
const GaPageviewsTable = loadable(() => import('./GoogleAnalyticsPageviewsTable'));
const TaxRatesTable = loadable(() => import('./TaxRatesTable'));
const GraphLinear = loadable(() => import('../Analytics/GraphLinear'));
const NewsLetterSubscriptions = loadable(() => import('./NewsLetterSubscriptions'));

export default function AdminPanel() {
  const { t } = useTranslation();
  const [graphData, setGraphData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(moment(new Date()).format('yyyy-MM-DD'));

  const getDataGraph = async () => {
    const { data } = await api(formatRoute('/api/entity/graphUserCount', null, {
      date: dateFilter
    }));
    if (!data) {
      return;
    }
    setGraphData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getDataGraph();
  }, [dateFilter]);

  const dateChanged = (e) => {
    setDateFilter(moment(e.target.value).format('yyyy-MM-DD'))
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className={styles.container}>
      <Typography variant="h3" className={styles.title} style={{ marginTop: 24 }}>
        {t('admin_panel')}
      </Typography>
      <UsersTable />
      <NewsLetterSubscriptions />
      <SportsTable />
      <GaEventsTable />
      <GaPageviewsTable />
      <TaxRatesTable />
      <Paper>
        <GraphLinear
          dateGraph={dateFilter}
          onChangeDate={dateChanged}
          graphData={graphData}
          title={t('member.members_in', { time: new Date().getFullYear() })}
        />
      </Paper>
    </Container>
  );
}
