import React, { useContext } from 'react';
import List from '../../components/Custom/List';
import IgContainer from '../../components/Custom/IgContainer';
import { useApiRoute } from '../../hooks/queries';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LIST_ITEM_ENUM } from '../../../common/enums';
import moment from 'moment';
import { Store } from '../../Store';

export default function Sales() {
  const {
    state: { id },
  } = useContext(Store);

  const { isLoading, response } = useApiRoute(`/api/shop/sales?id=${id}`);

  const formatSales = () =>
    response
      .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
      .map((s) => ({
        ...s,
        type: LIST_ITEM_ENUM.SALES,
      }));

  if (isLoading) {
    return (
      <IgContainer>
        <CircularProgress />
      </IgContainer>
    );
  }

  if (!response) {
    return null;
  }
  return (
    <IgContainer>
      <List items={formatSales()} />
    </IgContainer>
  );
}
