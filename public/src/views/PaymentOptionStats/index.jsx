import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import IgContainer from '../../components/Custom/IgContainer';
import Paper from '../../components/Custom/Paper';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import styles from './PaymentOptionStats.module.css';
import dynamic from 'next/dynamic';
import { formatRoute } from '../../utils/stringFormats';
import moment from 'moment';
import { ACTION_ENUM, Store } from '../../Store';
import api from '../../actions/api';
import { SEVERITY_ENUM } from '../../../common/enums';
import { ERROR_ENUM } from '../../../common/errors';
import { goBack } from '../../actions/goTo';

const GraphLinearTwoLines = dynamic(() => import('../Analytics/GraphLinear/TwoLinesGraph'));

export default function PaymentOptionStats() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    dispatch,
    state: { userInfo },
  } = useContext(Store);
  const { id: eventPaymentId } = router.query;

  const [dateFilter, setDateFilter] = useState(moment(new Date()).format('yyyy-MM-DD'));
  const [isLoading, setIsLoading] = useState(true);
  const [graphData, setGraphData] = useState({});

  const getDataGraph = async () => {
    if (!eventPaymentId) {
      return;
    }
    const { data } = await api(
      formatRoute('/api/entity/graphAmountGeneratedByEvent', null, {
        eventPaymentId,
        language: userInfo.language,
        date: dateFilter,
      })
    );
    if (!data) {
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
    setIsLoading(false);
  };

  const dateChanged = (e) => {
    setDateFilter(moment(e.target.value).format('yyyy-MM-DD'));
  };

  useEffect(() => {
    document.title = formatPageTitle(t('analytics'));
    if (eventPaymentId) {
      getDataGraph();
    }
  }, [eventPaymentId, dateFilter]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Paper className={styles.paper} title={t('graphs')}>
        {graphData.data.length === 0 && !graphData.minDate && (
          <div className={styles.divNoGraph}>{t('will_see_graph_payment')}</div>
        )}
        {(graphData.data.length > 0 || graphData.minDate) && (
          <GraphLinearTwoLines
            isMoney
            dateGraph={dateFilter}
            onChangeDate={dateChanged}
            graphData={graphData}
            title={`${t('income_and_transaction_fee_for')} ${graphData.name}`}
          />
        )}
      </Paper>
    </IgContainer>
  );
}
