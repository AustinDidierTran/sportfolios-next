import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import IgContainer from '../../components/Custom/IgContainer';
import Paper from '../../components/Custom/Paper';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import styles from './PaymentOptionStats.module.css';
import dynamic from 'next/dynamic';
import { formatRoute, formatPrice } from '../../utils/stringFormats';
import moment from 'moment';
import { ACTION_ENUM, Store } from '../../Store';
import api from '../../actions/api';
import { SEVERITY_ENUM } from '../../../common/enums';
import { ERROR_ENUM } from '../../../common/errors';
import { goBack } from '../../actions/goTo';

const Graph = dynamic(() => import('../Analytics/Graph'));

export default function PaymentOptionStats() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: eventPaymentId },
  } = useContext(Store);

  const [dateFilter, setDateFilter] = useState(moment(new Date()).format('yyyy-MM-DD'));
  const [dateFilterFees, setDateFilterFees] = useState(moment(new Date()).format('yyyy-MM-DD'));
  const [isLoading, setIsLoading] = useState(true);
  const [graphData, setGraphData] = useState({});
  const [graphDataFees, setGraphDataFees] = useState({});

  const getDataGraph = async () => {
    if (!eventPaymentId) {
      return;
    }

    const { data: dataFees } = await api(
      formatRoute('/api/entity/graphFeesByEvent', null, {
        eventPaymentId,
        date: dateFilterFees,
      })
    );

    const { data } = await api(
      formatRoute('/api/entity/graphAmountGeneratedByEvent', null, {
        eventPaymentId,
        date: dateFilter,
      })
    );
    if (!data || !dataFees) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      goBack();
      return;
    }
    setGraphData(data);
    setGraphDataFees(dataFees);
    setIsLoading(false);
  };

  const dateChanged = (e) => {
    setDateFilter(moment(e.target.value).format('yyyy-MM-DD'));
  };

  const dateChangedFees = (e) => {
    setDateFilterFees(moment(e.target.value).format('yyyy-MM-DD'));
  };

  useEffect(() => {
    document.title = formatPageTitle(t('analytics'));
    if (eventPaymentId) {
      getDataGraph();
    }
  }, [eventPaymentId, dateFilter, dateFilterFees]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Paper className={styles.paper} title={t('graphs')}>
        {graphData.total.length === 0 && !graphData.minDate && (
          <div className={styles.divNoGraph}>{t('will_see_graph_payment')}</div>
        )}
        {(graphData.total.length > 0 || graphData.minDate) && (
          <Graph
            dateGraph={dateFilter}
            onChangeDate={dateChanged}
            graphData={graphData}
            title={`${t('income_for')} ${graphData.name}`}
            totalTitle={t('total_income')}
            newTitle={t('new_income')}
            formatData={(x) => formatPrice(x * 100)}
          />
        )}
        {(graphDataFees.total.length > 0 || graphDataFees.minDate) && (
          <Graph
            dateGraph={dateFilterFees}
            onChangeDate={dateChangedFees}
            graphData={graphDataFees}
            title={`${t('payment.transaction_fee_for')} ${graphDataFees.name}`}
            totalTitle={t('payment.total_transaction_fee')}
            newTitle={t('payment.new_transaction_fee')}
            formatData={(x) => formatPrice(x * 100)}
          />
        )}
      </Paper>
    </IgContainer>
  );
}
