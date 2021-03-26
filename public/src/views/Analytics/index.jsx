import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import IconButton from '../../components/Custom/IconButton';
import IgContainer from '../../components/Custom/IgContainer';
import Paper from '../../components/Custom/Paper';
import MembersReport from './MembersReport';
import SalesReport from './SalesReport';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './Analytics.module.css';
// import GraphNumberOfMembers from './GraphNumberOfMembers';
// import MockData from './GraphNumberOfMembers/MockData.json';

export default function Analytics() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = formatPageTitle(t('analytics'));
  }, []);

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
      {/* NOT REAL DATA ONLY BACK END IS MISSING FOR GRAPH */}
      {/* <Paper className={styles.paper} title={t('graphs')}>
        <GraphNumberOfMembers
          graphData={MockData}
          title={t('member.members')}
          totalTitle={t('member.members')}
          newTitle={t('new_members')}
        />
      </Paper> */}
    </IgContainer>
  );
}
