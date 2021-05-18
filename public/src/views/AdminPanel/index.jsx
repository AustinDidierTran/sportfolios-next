import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import styles from './AdminPanel.module.css';

import Typography from '@material-ui/core/Typography';
import { Container } from '../../components/Custom';
import Paper from '@material-ui/core/Paper';
import api from '../../actions/api';
import { formatRoute } from '../../utils/stringFormats';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import moment from 'moment';

import dynamic from 'next/dynamic';

const SportsTable = dynamic(() => import('./SportsTable'));
const UsersTable = dynamic(() => import('./UsersTable'));
const GaEventsTable = dynamic(() => import('./GoogleAnalyticsEventsTable'));
const GaPageviewsTable = dynamic(() => import('./GoogleAnalyticsPageviewsTable'));
const TaxRatesTable = dynamic(() => import('./TaxRatesTable'));
const GraphLinear = dynamic(() => import('../Analytics/GraphLinear'));
const NewsLetterSubscriptions = dynamic(() => import('./NewsLetterSubscriptions'));
const LandingPageEmail = dynamic(() => import('./LandingPageEmail'));

export default function AdminPanel() {
  const { t } = useTranslation();
  const [graphData, setGraphData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(moment(new Date()).format('yyyy-MM-DD'));

  const getDataGraph = async () => {
    const { data } = await api(
      formatRoute('/api/entity/graphUserCount', null, {
        date: dateFilter,
      })
    );
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
    setDateFilter(moment(e.target.value).format('yyyy-MM-DD'));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className={styles.container}>
      <Typography variant="h3" className={styles.title} style={{ marginTop: 24 }}>
        {t('admin_panel')}
      </Typography>
      <Paper>
        <GraphLinear
          dateGraph={dateFilter}
          onChangeDate={dateChanged}
          graphData={graphData}
          title={t('member.members_in', { time: new Date().getFullYear() })}
        />
      </Paper>
      <GaEventsTable />
      <GaPageviewsTable />
      <TaxRatesTable />
      <LandingPageEmail />
      <NewsLetterSubscriptions />
      <UsersTable />
      <SportsTable />
    </Container>
  );
}
