import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './EntityList.module.css';
import CustomButton from '../Button';
import CustomList from '../List';
import CustomPaper from '../Paper';
import FeatureContainer from '../FeatureContainer';
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
        buttonLabel: t('create.create_organization'),
      },
      [GLOBAL_ENUM.TEAM]: {
        title: t('team.teams'),
        buttonLabel: t('create.create_team'),
      },
      [GLOBAL_ENUM.PERSON]: {
        title: t('people'),
        buttonLabel: t('create.create_person'),
        flag: FEATURE_FLAGS.CHILD_ACCOUNTS,
      },
      [GLOBAL_ENUM.EVENT]: {
        title: t('event.event'),
        buttonLabel: t('create.create_event'),
      },
    }),
    []
  );

  const entityObject = useMemo(() => entityDictionary[type] || {}, [entityDictionary, type]);

  const handleClick = () => {
    goTo(ROUTES.create, null, { type });
  };

  return (
    <CustomPaper childrenProps={{ className: styles.card }} title={entityObject.title}>
      <FeatureContainer feature={entityObject.flag} options={{ displayComingSoon: true }}>
        <>
          <CustomButton onClick={handleClick} style={{ marginBottom: 16 }} className={styles.button}>
            {entityObject.buttonLabel}
          </CustomButton>
          <CustomList
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
    </CustomPaper>
  );
}
