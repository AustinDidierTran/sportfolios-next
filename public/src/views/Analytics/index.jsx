import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import IconButton from '../../components/Custom/IconButton';
import IgContainer from '../../components/Custom/IgContainer';
import Paper from '../../components/Custom/Paper';
import MembersReport from './MembersReport';
import SalesReport from './SalesReport';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './Analytics.module.css';
const GraphNumberOfMembers = loadable(() => import('./GraphNumberOfMembers'));
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import api from '../../../src/actions/api';
import { formatRoute } from '../../../common/utils/stringFormat';
import { useRouter } from 'next/router';
import moment from 'moment';
import CustomButton from '../../components/Custom/Button';
import loadable from '@loadable/component';
import { goTo, ROUTES } from '../../actions/goTo';
import { TABS_ENUM } from '../../../common/enums';

export default function Analytics() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: organizationId } = router.query;

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
      })
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
    getDataGraph();
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
        {graphData.total.length === 0 && !graphData.minDate && (
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

        {(graphData.total.length > 0 || graphData.minDate) && (
          <GraphNumberOfMembers
            dateGraph={dateGraph}
            onChangeDate={dateChanged}
            graphData={graphData}
            title={t('member.organization_member')}
            totalTitle={t('member.members')}
            newTitle={t('new_members')}
          />
        )}
      </Paper>
    </IgContainer>
  );
}
