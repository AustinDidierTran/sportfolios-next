import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import IconButton from '../../components/Custom/IconButton';
import IgContainer from '../../components/Custom/IgContainer';
import Paper from '../../components/Custom/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './Analytics.module.css';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import api from '../../../src/actions/api';
import { formatRoute } from '../../utils/stringFormats';
import moment from 'moment';
import CustomButton from '../../components/Custom/Button';
import { goTo, ROUTES } from '../../actions/goTo';
import { TABS_ENUM } from '../../../common/enums';
import dynamic from 'next/dynamic';
import { Store } from '../../Store';

const GraphLinear = dynamic(() => import('./GraphLinear'));
const MembersReport = dynamic(() => import('./MembersReport'));
const SalesReport = dynamic(() => import('./SalesReport'));

export default function Analytics() {
  const { t } = useTranslation();
  const {
    state: { id: organizationId },
  } = useContext(Store);

  const [graphData, setGraphData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [dateGraph, setDateGraph] = useState(moment(new Date()).format('yyyy-MM-DD'));

  const getDataGraph = async () => {
    if (!organizationId) {
      return;
    }

    const { data } = await api(
      formatRoute('/api/entity/graphMemberCount', null, {
        organizationId,
        date: dateGraph,
      }),
      { method: 'GET' }
    );
    if (!data) {
      return;
    }
    setGraphData(data);
    setIsLoading(false);
  };

  const dateChanged = (e) => {
    setDateGraph(moment(e.target.value).format('yyyy-MM-DD'));
  };

  useEffect(() => {
    document.title = formatPageTitle(t('analytics'));
    if (organizationId) {
      getDataGraph();
    }
  }, [organizationId, dateGraph]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Paper className={styles.paper} title={t('generate_report')}>
        <div className={styles.header}>
          <IconButton
            icon="ArrowBack"
            onClick={() => {
              history.back();
            }}
            tooltip={t('back')}
            className={styles.iconButton}
            style={{ color: 'primary' }}
          />
          <ListItemText primary={t('choose.choose_your_report')} className={styles.title} />
        </div>
        <MembersReport />
        <SalesReport />
      </Paper>
      <Paper title={t('graphs')}>
        {graphData.length === 0 && !graphData.minDate && (
          <div className={styles.divNoGraph}>
            {t('will_see_graph_member')}
            <CustomButton
              className={styles.buttonDivGraph}
              onClick={() => {
                goTo(ROUTES.entity, { id: organizationId }, { tab: TABS_ENUM.SETTINGS });
              }}
            >
              {t('add.add_membership')}
            </CustomButton>
          </div>
        )}

        {(graphData.length > 0 || graphData.minDate) && (
          <GraphLinear
            dateGraph={dateGraph}
            onChangeDate={dateChanged}
            graphData={graphData}
            title={t('member.active_members')}
          />
        )}
      </Paper>
    </IgContainer>
  );
}
