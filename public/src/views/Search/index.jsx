import React, { useEffect, useState } from 'react';

import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import IgContainer from '../../components/Custom/IgContainer';
import api from '../../actions/api';
import { useRouter } from 'next/router';
import { formatRoute } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';

const EntitySearch = dynamic(() => import('./EntitySearch/index'));

export default function Search(props) {
  const router = useRouter();
  const { query } = router.query;

  const { type } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState([]);
  const [timeoutRef, setTimeoutRef] = useState(null);
  const asyncFetchResult = async () => {
    const res = await api(formatRoute('/api/search/global', null, { query, type }), { method: 'GET' });

    setEntities(res.data.entities);

    setTimeoutRef(null);
    setIsLoading(false);
  };

  const fetchSearchResults = () => {
    setIsLoading(true);
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
    setTimeoutRef(setTimeout(asyncFetchResult, 1000));
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  if (isLoading) {
    return (
      <IgContainer>
        <LoadingSpinner />
      </IgContainer>
    );
  }

  return (
    <IgContainer>
      <EntitySearch query={query} entities={entities} />
    </IgContainer>
  );
}
