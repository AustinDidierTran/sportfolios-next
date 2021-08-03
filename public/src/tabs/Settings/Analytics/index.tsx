import React, { useEffect, useState, useContext } from 'react';
import { Button, Paper } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../actions/goTo';

import { List } from '../../../components/Custom';
import { LIST_ITEM_ENUM, REPORT_TYPE_ENUM } from '../../../../common/enums';
import { Store } from '../../../Store';
import { getReports as getReportsApi } from '../../../actions/service/entity/get';

interface IReportItem {
  metadata: string;
  reportType: REPORT_TYPE_ENUM;
  type: LIST_ITEM_ENUM;
  reportId: string;
  key: string;
  update: () => Promise<void>;
}
const Analytics: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    state: { id },
  } = useContext(Store);

  const [items, setItems] = useState<IReportItem[]>();

  useEffect((): void => {
    if (id) {
      getReports();
    }
  }, [id]);

  const getReports = async (): Promise<void> => {
    const data = await getReportsApi(id);
    const items = data.map((d) => ({
      metadata: d.metadata,
      reportType: d.type,
      type: LIST_ITEM_ENUM.REPORT,
      reportId: d.reportId,
      key: d.reportId,
      update: getReports,
    }));
    setItems(items);
  };

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
      <List items={items} />
    </Paper>
  );
};
export default Analytics;
