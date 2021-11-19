import React, { useEffect, useState } from 'react';

import { useFormInput } from '../../../../hooks/forms';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import CustomTextField from '../../TextField';
import CustomIcon from '../../Icon';
import PersonList from './PersonList';
import { globalSearch } from '../../../../actions/service/entity/get';

export default function PersonSearchList(props) {
  const {
    blackList,
    whiteList,
    label,
    onClick,
    rejectedTypes = [],
    withoutIcon,
    secondary,
    style,
    autoFocus,
    inputRef,
  } = props;
  const { t } = useTranslation();
  const query = useFormInput('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getOptions();
  }, [query.value]);

  const getOptions = async () => {
    if (!query.value) {
      setOptions([]);
    }
    const body = {
      query: query.value,
      type: GLOBAL_ENUM.PERSON,
    };
    if (whiteList) {
      body.whiteList = JSON.stringify(whiteList);
    }
    if (blackList) {
      body.blackList = JSON.stringify(blackList);
    }
    const { data, status } = await globalSearch(body);
    if (status === REQUEST_STATUS_ENUM.SUCCESS) {
      setOptions(formatOptions(data));
    } else {
      setOptions([]);
    }
  };

  const handleClick = (e) => {
    onClick(e);
    query.reset();
  };

  const formatOptions = (response) => {
    if (!response) {
      return;
    }
    return response.entities
      .filter((entity) => !rejectedTypes.includes(entity.type))
      .map((e) => ({
        ...e,
        secondary,
        onClick: () => {
          handleClick(e);
        },
        key: e.id,
      }));
  };

  const handleChange = (value) => {
    if (value.length > 64) {
      query.setError(t('max_length'));
    } else {
      query.setError(null);
      query.onChange(value);
    }
  };

  const onEnter = (e) => {
    if (e.key === 'Enter' && options?.length) {
      onClick(options[0]);
    }
  };
  return (
    <>
      {withoutIcon ? (
        <CustomTextField
          {...query.inputProps}
          onChange={handleChange}
          variant="outlined"
          size="small"
          label={label}
          autoFocus={autoFocus}
          style={{ width: '100%', ...style }}
          onKeyPress={onEnter}
          inputRef={inputRef}
        />
      ) : (
        <CustomTextField
          {...query.inputProps}
          variant="outlined"
          label={label}
          style={{ margin: '8px', ...style }}
          size="small"
          autoFocus={autoFocus}
          onKeyPress={onEnter}
          inputRef={inputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CustomIcon icon="Search" />
              </InputAdornment>
            ),
          }}
        />
      )}
      {query.value.length === 0 ? null : <PersonList items={options} />}
    </>
  );
}
