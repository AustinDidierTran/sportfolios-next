import React, { useEffect, useState, useContext } from 'react';
import List from '../../components/Custom/List';
import IgContainer from '../../components/Custom/IgContainer';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LIST_ITEM_ENUM, REQUEST_STATUS_ENUM } from '../../../common/enums';
import moment from 'moment';
import { Store } from '../../Store';
import api from '../../actions/api';

export default function Sales() {
  const {
    state: { id },
  } = useContext(Store);

  const [isLoading, setIsLoading] = useState(false);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getSales();
  }, [id]);

  const getSales = async () => {
    setIsLoading(true);
    const { status, data } = await api(`/api/shop/sales?id=${id}`, { method: 'GET' });
    if (status === REQUEST_STATUS_ENUM.SUCCESS) {
      setSales(formatSales(data));
    } else {
      setSales([]);
    }
    setIsLoading(false);
  };

  const formatSales = (response) =>
    response
      .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
      .map((s) => ({ ...s, type: LIST_ITEM_ENUM.SALES }));

  if (isLoading) {
    return (
      <IgContainer>
        <CircularProgress />
      </IgContainer>
    );
  }

  if (!sales) {
    return null;
  }
  return (
    <IgContainer>
      <List items={sales} />
    </IgContainer>
  );
}
