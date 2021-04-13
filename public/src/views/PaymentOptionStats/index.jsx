import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import IgContainer from '../../components/Custom/IgContainer';
import Paper from '../../components/Custom/Paper';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import styles from './PaymentOptionStats.module.css';
import loadable from '@loadable/component';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';
import moment from 'moment';

import api from '../../actions/api';
const GraphNumberOfMembers = loadable(() => import('../Analytics/GraphNumberOfMembers'));

export default function PaymentOptionStats() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventPaymentId } = router.query;

  const [dateFilter, setDateFilter] = useState(moment(new Date()).format('yyyy-MM-DD'));
  const [isLoading, setIsLoading] = useState(true);
  const [graphData, setGraphData] = useState({});

  const getDataGraph = async () => {
    if (!eventPaymentId) {
      return;
    }
    const { data } = await api(formatRoute('/api/entity/graphAmountGeneratedByEvent', null, {
      eventPaymentId,
      date: dateFilter
    }));
    if (!data) {
      return;
    }
    setGraphData(data);
    setIsLoading(false);
  };

  const dateChanged = (e) => {
    setDateFilter(moment(e.target.value).format('yyyy-MM-DD'))
  }


  useEffect(() => {
    document.title = formatPageTitle(t('analytics'));
    getDataGraph();
  }, [eventPaymentId, dateFilter]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Paper className={styles.paper} title={t('graphs')}>
        {graphData.total.length === 0 && !graphData.minDate && (
          <div className={styles.divNoGraph}>
            {t('will_see_graph_payment')}
          </div>
        )}
        {(graphData.total.length > 0 || graphData.minDate) && (
          <GraphNumberOfMembers
            dateGraph={dateFilter}
            onChangeDate={dateChanged}
            graphData={graphData}
            title={t('member.members')}
            totalTitle={t('member.members')}
            newTitle={t('new_members')}
          />
        )}
      </Paper>
    </IgContainer>
  );
}
