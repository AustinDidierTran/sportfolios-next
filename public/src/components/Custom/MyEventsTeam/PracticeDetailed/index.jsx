import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../../../../../public/src/Store';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../utils/stringFormats';
import { SEVERITY_ENUM, ENTITIES_ROLE_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../common/errors';
import styles from './PracticeDetailed.module.css';
import CustomIconButton from '../../IconButton';
import Divider from '@material-ui/core/Divider';
import Posts from '../..//Posts';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '../../TextField';
import { formatDate } from '../../../../utils/stringFormats';
import LoadingSpinner from '../../LoadingSpinner';
import AddressSearchInput from '../../AddressSearchInput';
import CustomButton from '../../Button';
import * as yup from 'yup';

const Roster = dynamic(() => import('../../Roster'));

export default function PracticeDetailed(props) {
  const { practiceId } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { userInfo },
  } = useContext(Store);

  const [isLoading, setIsLoading] = useState(true);
  const [practice, setPractice] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState(false);
  const [wrongAddressFormat, setWrongAddressFormat] = useState('');

  const getPractice = async () => {
    const { data } = await api(
      formatRoute('/api/entity/practiceInfo', null, {
        practiceId: practiceId,
      }),
      { method: 'GET' }
    );

    if (!data) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      goBack();
      return;
    }

    let street_address = data.street_address ? data.street_address + ', ' : '';
    let city = data.city ? data.city + ', ' : '';
    let state = data.state ? data.state : '';
    let zip = data.zip ? data.zip : '';
    let country = data.country ? ', ' + data.country : '';
    let addressFormatted = street_address + city + state + zip + country;
    data.addressFormatted = addressFormatted;

    setPractice(data);

    formik.setFieldValue('name', data?.name || '');
    formik.setFieldValue('startDate', formatDate(moment.utc(data.start_date), 'YYYY-MM-DD'));
    formik.setFieldValue('startTime', formatDate(moment.utc(data.start_date), 'HH:mm'));
    formik.setFieldValue('endDate', formatDate(moment.utc(data.end_date), 'YYYY-MM-DD'));
    formik.setFieldValue('endTime', formatDate(moment.utc(data.end_date), 'HH:mm'));
    formik.setFieldValue('location', data?.location || '');
    formik.setFieldValue('addressFormatted', addressFormatted);
    formik.setFieldValue('address', '');

    if (data.role === ENTITIES_ROLE_ENUM.ADMIN || data.role === ENTITIES_ROLE_ENUM.EDITOR) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    if (practiceId) {
      getPractice();
    }
  }, [practiceId]);

  useEffect(() => {
    if (!practice || !practice.entity_id) {
      return;
    }

    setIsLoading(false);
  }, [practice]);

  const goBack = () => {
    history.back();
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    startDate: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    startTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    endDate: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    endTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    addressFormatted: yup.string().test('validate', () => {
      return wrongAddressFormat == '';
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      startDate: formatDate(moment.utc(new Date().toLocaleString()), 'YYYY-MM-DD'),
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      address: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { name, startDate, startTime, endDate, endTime, location, address } = values;

      let start = `${startDate} ${startTime}`;
      let end = `${endDate} ${endTime}`;

      if (!moment(start).isValid()) {
        start = null;
      }
      if (!moment(end).isValid()) {
        end = null;
      }

      const res = await api(`/api/entity/practice`, {
        method: 'PUT',
        body: JSON.stringify({
          id: practice.id,
          name,
          start_date: start,
          end_date: end,
          location,
          address,
        }),
      });
      if (res.status === STATUS_ENUM.ERROR || res.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        setEdit(false);
        getPractice();

        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('practice_changed'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 4000,
        });
      }
    },
  });

  const hasChanged = useMemo(() => {
    return (
      practice.name != formik.values.name ||
      formatDate(moment.utc(practice.start_date), 'YYYY-MM-DD') != formik.values.startDate ||
      formatDate(moment.utc(practice.start_date), 'HH:mm') != formik.values.startTime ||
      formatDate(moment.utc(practice.end_date), 'YYYY-MM-DD') != formik.values.endDate ||
      formatDate(moment.utc(practice.end_date), 'HH:mm') != formik.values.endTime ||
      practice.location != formik.values.location ||
      practice.addressFormatted != formik.values.addressFormatted
    );
  }, [formik.values, practice]);

  const addressChanged = (newAddress) => {
    setWrongAddressFormat('');
    formik.setFieldValue('address', newAddress);
  };

  const onAddressChanged = (event) => {
    if (event.length > 0) {
      setWrongAddressFormat(t('address_error'));
    } else {
      setWrongAddressFormat('');
      formik.setFieldValue('address', null);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onDelete = async () => {
    const res = await api(
      formatRoute('/api/entity/practice', null, {
        eventId: practice.team_id,
        practiceId: practiceId,
      }),
      {
        method: 'DELETE',
      }
    );

    if (res.status > STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else {
      history.back();
    }
  };

  const onEdit = () => {
    setEdit(true);
    handleClose();
  };

  const cancelEdit = () => {
    setEdit(false);
    getPractice();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.root}>
        <div className={styles.baseContent}>
          <div className={styles.header}>
            <div>
              <CustomIconButton size="medium" icon="ArrowBack" style={{ color: 'primary' }} onClick={goBack} />
            </div>
            <div className={styles.practiceInfo}>
              <TextField namespace="name" formik={formik} style={{ fontSize: '30px' }} disabled={!edit} />
              <div className={styles.practiceInfoSecondary}>
                <div className={styles.practiceInfoDate}>
                  {edit ? (
                    <div>
                      <TextField
                        className={styles.date}
                        namespace="startDate"
                        formik={formik}
                        helperText={t('event.event_start_date')}
                        type="date"
                      />
                      <TextField
                        className={styles.time}
                        namespace="startTime"
                        formik={formik}
                        helperText={t('event.event_start_time')}
                        type="time"
                      />
                      <TextField
                        className={styles.time}
                        namespace="endTime"
                        formik={formik}
                        helperText={t('event.event_end_time')}
                        type="time"
                      />
                    </div>
                  ) : (
                    `${
                      formatDate(moment.utc(formik.values.startDate), 'dddd Do MMM').charAt(0).toUpperCase() +
                      formatDate(moment.utc(formik.values.startDate), 'dddd Do MMM').slice(1)
                    }` +
                    ' ' +
                    formik.values.startTime +
                    '-' +
                    formik.values.endTime
                  )}
                </div>
                <div className={styles.practiceInfoSecondary}>
                  <TextField placeholder="location" namespace="location" formik={formik} disabled={!edit} />
                </div>
                <div className={styles.practiceInfoSecondary}>
                  {edit ? (
                    <AddressSearchInput
                      namespace="addressFormatted"
                      formik={formik}
                      addressChanged={addressChanged}
                      country="ca"
                      language={userInfo.language}
                      errorFormat={wrongAddressFormat}
                      placeholder={t('type_address')}
                      onChange={onAddressChanged}
                    />
                  ) : (
                    <TextField namespace="addressFormatted" formik={formik} disabled />
                  )}
                </div>
              </div>
            </div>

            <div className={styles.iconOptions}>
              {isAdmin && (
                <CustomIconButton
                  icon="MoreVertIcon"
                  style={{ color: 'primary' }}
                  onClick={handleClick}
                  size="medium"
                />
              )}
            </div>
          </div>
          {edit && (
            <div className={styles.editButtons}>
              <CustomButton color="secondary" className={styles.cancelButton} onClick={cancelEdit}>
                {t('cancel')}
              </CustomButton>
              <CustomButton disabled={!hasChanged} onClick={formik?.handleSubmit}>
                {t('edit.edit')}
              </CustomButton>
            </div>
          )}
          <Divider variant="middle" />
          <Roster roster={practice.roster} />
          <Divider variant="middle" />
          <Posts
            userInfo={userInfo}
            allowPostImage
            allowNewPost
            entityIdCreatePost={userInfo?.primaryPerson?.entity_id || -1}
            allowComment
            allowLike
            locationId={practice.entity_id}
            elevation={0}
            placeholder={t('write_a_comment')}
          />
          {isAdmin && (
            <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={onDelete}>{t('delete.delete')}</MenuItem>
              <MenuItem onClick={onEdit}>{t('edit.edit')}</MenuItem>
            </Menu>
          )}
        </div>
      </div>
    </div>
  );
}
