import React, { useState, useEffect, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './AdminGeneralView.module.css';

import Paper from '@material-ui/core/Paper';
import api from '../../actions/api';
import { formatRoute } from '../../utils/stringFormats';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { Store } from '../../Store';

const SportsTable = dynamic(() => import('./SportsTable'));
const UsersTable = dynamic(() => import('./UsersTable'));
const GaEventsTable = dynamic(() => import('./GoogleAnalyticsEventsTable'));
const GaPageviewsTable = dynamic(() => import('./GoogleAnalyticsPageviewsTable'));
const TaxRatesTable = dynamic(() => import('./TaxRatesTable'));
const GraphLinear = dynamic(() => import('../Analytics/GraphLinear'));
const NewsLetterSubscriptions = dynamic(() => import('./NewsLetterSubscriptions'));
const LandingPageEmail = dynamic(() => import('./LandingPageEmail'));

const AdminGeneralView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [graphData, setGraphData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(moment(new Date()).format('yyyy-MM-DD'));
  const {
    state: { userInfo },
  } = useContext(Store);

  const getDataGraph = async () => {
    const { data } = await api(
      formatRoute('/api/entity/graphUserCount', null, {
        date: dateFilter,
        language: userInfo.language,
      }),
      { method: 'GET' }
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

  const dateChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setDateFilter(moment(e.currentTarget.value).format('yyyy-MM-DD'));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
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
    </div>
  );
};

export default AdminGeneralView;
