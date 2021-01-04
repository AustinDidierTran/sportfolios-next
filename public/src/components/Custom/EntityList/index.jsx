import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './EntityList.module.css';
import { Paper, List, Button, FeatureContainer } from '../../../components/Custom';
import { goTo, ROUTES } from '../../../actions/goTo';
import api from '../../../actions/api';

import { GLOBAL_ENUM } from '../../../../common/enums';
import { useMemo } from 'react';
import { FEATURE_FLAGS } from '../../../../common/flags';

export default function EntityList(props) {
  const { t } = useTranslation();

  const { type } = props;

  const [entities, setEntities] = useState([]);

  const getEntities = async () => {
    const route = type ? `/api/entity/all?type=${type}` : '/api/entity/all';

    const { data } = await api(route);

    setEntities(data);
  };

  useEffect(() => {
    getEntities();
  }, [type]);

  const entityDictionary = useMemo(
    () => ({
      [GLOBAL_ENUM.ORGANIZATION]: {
        title: t('organizations'),
        buttonLabel: t('create_organization'),
      },
      [GLOBAL_ENUM.TEAM]: {
        title: t('teams'),
        buttonLabel: t('create_team'),
      },
      [GLOBAL_ENUM.PERSON]: {
        title: t('people'),
        buttonLabel: t('create_person'),
        flag: FEATURE_FLAGS.CHILD_ACCOUNTS,
      },
      [GLOBAL_ENUM.EVENT]: {
        title: t('event'),
        buttonLabel: t('create_event'),
      },
    }),
    []
  );

  const entityObject = useMemo(() => entityDictionary[type] || {}, [entityDictionary, type]);

  const handleClick = () => {
    goTo(ROUTES.create, null, { type });
  };

  return (
    <Paper childrenProps={{ className: styles.card }} title={entityObject.title}>
      <FeatureContainer feature={entityObject.flag} options={{ displayComingSoon: true }}>
        <>
          <Button onClick={handleClick} style={{ marginBottom: 16 }} className={styles.button}>
            {entityObject.buttonLabel}
          </Button>
          <List
            items={entities.map((entity, index) => ({
              id: entity.id,
              name: entity.name,
              photoUrl: entity.photoUrl,
              type: Number(entity.type),
              key: { index },
            }))}
          />
        </>
      </FeatureContainer>
    </Paper>
  );
}
