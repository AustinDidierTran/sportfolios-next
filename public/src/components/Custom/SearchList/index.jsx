import React, { useEffect, useState } from 'react';

import CustomIcon from '../Icon';
import CustomList from '../List';
import CustomTextField from '../TextField';
import { useFormInput } from '../../../hooks/forms';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM, REQUEST_STATUS_ENUM } from '../../../../common/enums';
import { globalSearch } from '../../../actions/service/entity/get';

export default function SearchList(props) {
  const {
    blackList,
    whiteList,
    label,
    onClick,
    type,
    rejectedTypes = [],
    allowCreate,
    withoutIcon,
    secondary,
    style,
    autoFocus,
  } = props;

  const { t } = useTranslation();
  const query = useFormInput('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getOptions();
  }, [query.value, type]);

  const getOptions = async () => {
    if (!query.value) {
      setOptions([]);
    }
    const body = {
      query: query.value,
      type,
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

  const handleClick = (...args) => {
    onClick(...args);
    query.reset();
  };

  const formatOptions = (response) => {
    if (!response) {
      return [];
    }

    if (allowCreate) {
      let uniqueSecondary = '';
      if (type === GLOBAL_ENUM.TEAM) {
        uniqueSecondary = t('click_to_create_new_team');
      }
      if (type === GLOBAL_ENUM.PERSON) {
        uniqueSecondary = t('add.add_player_with_no_account');
      }
      return [
        {
          name: query.value,
          type,
          secondary: uniqueSecondary,
          onClick: (...args) => {
            handleClick(...args);
          },
          icon: 'Add',
          inverseColor: true,
        },
        ...response.entities
          .filter((entity) => !rejectedTypes.includes(entity.type))
          .map((e) => ({
            ...e,
            secondary,
            onClick: (...args) => {
              handleClick(...args);
            },
          })),
      ];
    }

    return response.entities
      .filter((entity) => !rejectedTypes.includes(entity.type))
      .map((e) => ({
        ...e,
        secondary,
        onClick: (...args) => {
          handleClick(...args);
        },
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
    if (e.key === 'Enter') {
      if (e.target.value) {
        const entity = {};
        entity.id = options[0].id;
        if (entity.id) {
          entity.completeName = options[0].completeName;
        } else {
          entity.name = options[0].name;
        }
        onClick(e, entity);
        query.reset();
      }
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CustomIcon icon="Search" />
              </InputAdornment>
            ),
          }}
        />
      )}
      {query.value.length === 0 ? null : <CustomList items={options} />}
    </>
  );
}
