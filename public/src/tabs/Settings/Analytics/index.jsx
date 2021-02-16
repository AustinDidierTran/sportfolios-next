import React, { useEffect, useState } from 'react';
import { Button, Paper } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { goTo, ROUTES } from '../../../actions/goTo';

import { List } from '../../../components/Custom';
import { LIST_ITEM_ENUM } from '../../../../common/enums';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../common/utils/stringFormat';

export default function Analytics() {
  const { t } = useTranslation();

  const router = useRouter();
  const { id } = router.query;

  const [items, setItems] = useState([]);

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    const { data } = await api(formatRoute('/api/entity/reports', null, { id }));
    const items = data.map((d) => ({
      metadata: d.metadata,
      reportType: d.type,
      type: LIST_ITEM_ENUM.REPORT,
      reportId: d.report_id,
      key: d.report_id,
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
}
