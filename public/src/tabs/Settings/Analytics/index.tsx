import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Button, Paper } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../actions/goTo';

import { List } from '../../../components/Custom';
import { Store } from '../../../Store';
import ReportItem from '../../../components/Custom/List/ReportItem';
import { getReports } from '../../../actions/service/organization';
import { Report } from '../../../../../typescript/types';

const Analytics: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    state: { id },
  } = useContext(Store);

  const [reports, setReports] = useState<Report[]>([]);

  const updateReports = useCallback(async (): Promise<void> => {
    if (!id) {
      return;
    }

    const data = await getReports(id);
    const items = data.map((d) => ({
      metadata: d.metadata,
      type: d.type,
      reportId: d.reportId,
      key: d.reportId,
    }));
    setReports(items);
  }, [id]);

  useEffect((): void => {
    updateReports();
  }, [updateReports]);

  return (
    <Paper title={t('analytics_and_reports')}>
      <Button
        size="small"
        variant="contained"
        style={{ margin: '8px' }}
        onClick={() => {
          goTo(ROUTES.analytics, null, { id });
        }}
      >
        {t('see_my_analytics')}
      </Button>
      <List>
        {reports.map((report) => (
          <ReportItem
            metadata={report.metadata}
            type={report.type}
            reportId={report.reportId}
            key={report.reportId}
            update={updateReports}
          />
        ))}
      </List>
    </Paper>
  );
};
export default Analytics;
