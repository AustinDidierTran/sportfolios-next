import React, { useEffect, useState } from 'react';

import CustomIcon from '../../Icon';
import CustomList from '../../List';
import CustomTextField from '../../TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import { myTeamsSearch } from '../../../../actions/service/entity/get';

export default function TeamSearchList(props) {
  const {
    label,
    onClick,
    rejectedTypes = [],
    allowCreate,
    withoutIcon,
    secondary,
    style,
    autoFocus,
    formik,
    eventId,
  } = props;
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getOptions();
  }, [formik.values.teamSearchQuery]);

  const getOptions = async () => {
    const { data, status } = await myTeamsSearch(formik.values.teamSearchQuery, eventId);
    if (status === REQUEST_STATUS_ENUM.SUCCESS) {
      setOptions(formatOptions(data));
    } else {
      setOptions([]);
    }
  };

  const handleClick = (e) => {
    formik.setFieldValue('team', e);
    formik.setFieldValue('teamSearchQuery', '');
  };

  const formatOptions = (response) => {
    if (allowCreate) {
      return [
        {
          name: formik.values.teamSearchQuery,
          type: GLOBAL_ENUM.TEAM,
          secondary: t('click_to_create_new_team'),
          onClick: () => {
            handleClick({ name: formik.values.teamSearchQuery });
          },
          icon: 'Add',
          inverseColor: true,
        },
        ...response.entities
          .filter((entity) => !rejectedTypes.includes(entity.type))
          .map((e) => {
            return {
              ...e,
              secondary: e.isRegistered ? t('team.team_already_registered') : secondary,
              onClick: () => {
                handleClick(e);
              },
            };
          }),
      ];
    }
    return response.entities
      .filter((entity) => !rejectedTypes.includes(entity.type))
      .map((e) => ({
        ...e,
        secondary: e.isRegistered ? t('register.already_registered') : secondary,
        onClick: () => {
          handleClick(e);
        },
      }));
  };

  const handleChange = (value) => {
    if (value.length > 64) {
      formik.setFieldError('teamSearchQuery', t('max_length'));
    } else {
      formik.setFieldError('teamSearchQuery', null);
      formik.setFieldValue('teamSearchQuery', value);
    }
  };
  const onEnter = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value) {
        const entity = {};
        entity.id = options[0].id;
        entity.name = options[0].photoUrl;
        if (entity.id) {
          entity.name = options[0].completeName;
        } else {
          entity.name = options[0].name;
        }
        onClick(e, entity);
        formik.setFieldValue('teamSearchQuery', '');
      }
    }
  };

  return (
    <>
      {withoutIcon ? (
        <CustomTextField
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
      {formik.values.teamSearchQuery.length === 0 ? null : <CustomList items={options} />}
    </>
  );
}
