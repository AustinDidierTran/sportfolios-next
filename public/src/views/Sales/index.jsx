import React from 'react';
import { IgContainer, List } from '../../components/Custom';
import { useApiRoute } from '../../hooks/queries';
import { CircularProgress } from '@material-ui/core';
import { LIST_ITEM_ENUM } from '../../../common/enums';
import moment from 'moment';
import { useRouter } from 'next/router';

export default function Sales() {
  const router = useRouter();
  const { id } = router.query;
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
    return <></>;
  }
  return (
    <IgContainer>
      <List items={formatSales()} />
    </IgContainer>
  );
}
