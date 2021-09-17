import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import List from '../../components/Custom/List';
import IgContainer from '../../components/Custom/IgContainer';
import { LIST_ITEM_ENUM } from '../../../common/enums';
import { Store } from '../../Store';
import CustomIconButton from '../../components/Custom/IconButton';
import { getSoldItems as getSoldItemsApi } from '../../actions/service/shop';
import { SoldItem } from '../../../../typescript/shop';
import Paper from '../../components/Custom/Paper';
import styles from './Sales.module.css';
import { LoadingSpinner } from '../../components/Custom';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import { useFormInput } from '../../hooks/forms';

const Sales: React.FunctionComponent = () => {
  const {
    state: { id },
  } = useContext(Store);
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sales, setSales] = useState<SoldItem[]>();
  const searchQuery = useFormInput('');

  const getSoldItems = useCallback((): void => {
    if (id) {
      setIsLoading(true);
      getSoldItemsApi(id, searchQuery.value).then((res) => {
        setSales(
          res.filter(
            (d) =>
              `${d.buyer.primaryPerson.name} ${d.buyer.primaryPerson.surname}`.includes(searchQuery.value) ||
              d.buyer.email.includes(searchQuery.value)
          )
        );
      });
      setIsLoading(false);
    }
  }, [id, searchQuery.value]);

  useEffect((): void => {
    getSoldItems();
  }, [getSoldItems]);

  const goBack = (): void => {
    history.back();
  };

  const formatSales = (): SoldItem[] =>
    sales
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
        <TextField {...searchQuery.inputProps} placeholder={t('search')} />

        {sales ? <List items={formatSales()} /> : <Typography> {t('no.no_sales')} </Typography>}
      </Paper>
    </IgContainer>
  );
};
export default Sales;
