import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import styles from './AdminPanel.module.css';

import Typography from '@material-ui/core/Typography';
import Container from '../../components/Custom/Container';
import dynamic from 'next/dynamic';

import { useFormInput } from '../../hooks/forms';
import { Select } from '../../components/Custom';

const AdminGeneralView = dynamic(() => import('./AdminGeneralView'));
const AdminEntitiesView = dynamic(() => import('./AdminEntitiesView'));

enum VIEWS {
  GENERAL = 'general',
  ENTITIES = 'entities',
}

export default function AdminPanel(): React.ReactElement {
  const { t } = useTranslation();
  const view = useFormInput(VIEWS.GENERAL);

  const SelectedComponent = useMemo(() => {
    if (view.value === VIEWS.GENERAL) {
      return AdminGeneralView;
    }
    if (view.value === VIEWS.ENTITIES) {
      return AdminEntitiesView;
    }

    // Default!
    return AdminGeneralView;
  }, [view.value]);

  return (
    <Container className={styles.container}>
      <Typography variant="h3" className={styles.title} style={{ marginTop: 24 }}>
        {t('admin_panel')}
      </Typography>
      <Select
        className={styles.select}
        {...view.inputProps}
        options={[
          {
            display: 'GENERAL',
            value: VIEWS.GENERAL,
          },
          {
            display: 'ENTITIES',
            value: VIEWS.ENTITIES,
          },
        ]}
      />
      <SelectedComponent />
    </Container>
  );
}
