import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import List from '../../components/Custom/List';
import IgContainer from '../../components/Custom/IgContainer';
import { LIST_ITEM_ENUM } from '../../../common/enums';
import { Store } from '../../Store';
import CustomIconButton from '../../components/Custom/IconButton';
import { getSoldItems } from '../../actions/service/shop';
import { ShopCartItems } from '../../../../typescript/types';
import Paper from '../../components/Custom/Paper';
import styles from './Sales.module.css';
import { LoadingSpinner } from '../../components/Custom';
import { Typography } from '@material-ui/core';

const Sales: React.FunctionComponent = () => {
  const {
    state: { id },
  } = useContext(Store);
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<ShopCartItems[]>();

  useEffect((): void => {
    getSoldItems(id).then((res) => {
      setResponse(res);
      setIsLoading(false);
    });
  }, []);

  const goBack = (): void => {
    history.back();
  };

  const formatSales = (): ShopCartItems[] =>
    response
      .sort((a, b) => Math.abs(new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()))
      .map((s) => ({
        ...s,
        type: LIST_ITEM_ENUM.SALES,
      }));

  if (isLoading) {
    return (
      <IgContainer>
        <LoadingSpinner />
      </IgContainer>
    );
  }

  return (
    <IgContainer>
      <Paper titleStyle={styles.paper} title={t('sales')}>
        <div className={styles.button}>
          <CustomIconButton
            size="medium"
            icon="ArrowBack"
            tooltip={t('back')}
            style={{ color: 'primary' }}
            onClick={goBack}
          />
        </div>
        {response ? <List items={formatSales()} /> : <Typography> {t('no.no_sales')} </Typography>}
      </Paper>
    </IgContainer>
  );
};
export default Sales;
