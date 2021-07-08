import React, { useState, useEffect, useContext, useMemo } from 'react';
import { FormDialog } from '../..';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import { formatDate, formatRoute } from '../../../../utils/stringFormats';
import * as yup from 'yup';
import moment from 'moment';
import { Location } from '../../../../../../typescript/types';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}

interface ILocationOption {
  value: string;
  display: string;
}

const CreatePractice: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { isOpen, onClose, onCreate } = props;
  const {
    dispatch,
    state: { id: teamId, userInfo },
  } = useContext(Store);

  const [wrongAddressFormat, setWrongAddressFormat] = useState<string>('');
  const [locationOptions, setLocationOptions] = useState<ILocationOption[]>([]);
  const [locationHidden, setLocationHidden] = useState<boolean>(true);

  useEffect((): void => {
    if (isOpen) {
      getLocations();
      setLocationHidden(true);
    }
  }, [isOpen]);

  const open = useMemo((): boolean => {
    return isOpen;
  }, [isOpen]);

  const handleClose = (): void => {
    formik.resetForm();
    onClose();
    setLocationHidden(true);
  };

  const getLocations = async (): Promise<void> => {
    const { data } = await api(formatRoute('/api/entity/teamLocations', null, { teamId }));
    const formattedData = data.filter((n: Location) => n.id != null);
    formattedData.push(
      { id: t('no_location'), location: t('no_location') },
      { id: t('create_new_location'), location: t('create_new_location') }
    );

    const locationOption: ILocationOption[] = formattedData.map((c: Location) => ({
      value: c.id,
      display: `${c.streetAddress ? `${c.location} - ${c.streetAddress}` : c.location}`,
    }));

    setLocationOptions(locationOption);
  };

  const addressChanged = (address: string): void => {
    setWrongAddressFormat('');
    formik.setFieldValue('address', address);
  };

  const onAddressChanged = (address: any): void => {
    if (address.length > 0) {
      setWrongAddressFormat(t('address_error'));
    } else {
      setWrongAddressFormat('');
      formik.setFieldValue('address', null);
    }
  };

  const handleChange = (event: any): void => {
    let newTime = moment().hour(event.substring(0, 2)).minutes(event.substring(3, 5)).add(2, 'hours').format('HH:mm');

    formik.setFieldValue('timeEnd', newTime);
  };

  const handleLocationChange = (event: any) => {
    if (event == t('create_new_location')) {
      setLocationHidden(false);
    } else {
      setLocationHidden(true);
      formik.setFieldValue('address', null);
      formik.setFieldValue('newLocation', '');
    }
  };

  const validationSchema = yup.object().shape({
    name: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    date: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    timeStart: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    timeEnd: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    addressFormatted: yup.string().test('validate', () => {
      return wrongAddressFormat == '';
    }),
    newLocation: yup.string().when('location', {
      is: (location: string) => location == t('create_new_location'),
      then: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    }),
    location: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      date: formatDate(moment.utc(new Date().toLocaleString()), 'YYYY-MM-DD'),
      timeStart: '18:00',
      timeEnd: '20:00',
      addressFormatted: '',
      address: '',
      location: '',
      newLocation: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { name, date, timeStart, timeEnd, address, location, newLocation } = values;
      let locationId = null;
      if (location != t('no_location') && location != t('create_new_location')) {
        locationId = location;
      }
      let dateStart = `${date} ${timeStart}`;
      let dateEnd = `${date} ${timeEnd}`;
      const res = await api('/api/entity/practice', {
        method: 'POST',
        body: JSON.stringify({
          name,
          dateStart,
          dateEnd,
          address,
          locationId,
          newLocation,
          teamId,
        }),
      });

      if (res.status === REQUEST_STATUS_ENUM.ERROR || res.status === REQUEST_STATUS_ENUM.UNAUTHORIZED) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
        return;
      }

      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('practice_added'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });
      onCreate();
      resetForm();
    },
  });

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add.add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'name',
      label: t('name'),
      type: 'input',
    },
    {
      namespace: 'date',
      label: t('event.event_start_date'),
      type: 'date',
      shrink: true,
    },
    {
      namespace: 'timeStart',
      label: t('event.event_start_time'),
      type: 'time',
      shrink: true,
      onChange: handleChange,
    },
    {
      namespace: 'timeEnd',
      label: t('event.event_end_time'),
      type: 'time',
      shrink: true,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LOCATION,
      label: t('location'),
      namespace: 'location',
      onChange: handleLocationChange,
      options: locationOptions,
      addressChanged: addressChanged,
      onAddressChanged: onAddressChanged,
      language: userInfo.language,
      errorFormat: wrongAddressFormat,
      showCreate: !locationHidden,
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('create.create_activity')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
};

export default CreatePractice;
