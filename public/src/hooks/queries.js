import { useEffect, useState } from 'react';
import { ERROR_ENUM } from '../../common/errors';
import api from '../actions/api';

const paramsToObject = (entries) => {
  let result = {};
  for (let entry of entries) {
    // each 'entry' is a [key, value] tupple
    const [key, value] = entry;
    result[key] = value;
  }
  return result;
};

export const useApiRoute = (route, options = {}) => {
  const { defaultValue } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState(defaultValue);
  const [status, setStatus] = useState(200);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await api(route, options);
      setStatus(status);
      setResponse(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (route) {
      refetch();
    } else {
      setResponse(defaultValue);
    }
  }, [route]);

  return { response, isLoading, refetch, status };
};
