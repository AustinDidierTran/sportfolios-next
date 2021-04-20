import React, { useState, useEffect, useContext } from 'react';

import styles from './EditPersonInfos.module.css';
import Paper from '../../components/Custom/Paper';
import Button from '../../components/Custom/Button';
import Avatar from '../../components/Custom/Avatar';
import ContainerBottomFixed from '../../components/Custom/ContainerBottomFixed';
import AddressSearchInput from '../../components/Custom/AddressSearchInput';
import NumberFormat from '../../components/Custom/NumberFormat';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import TextField from '../../components/Custom/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import * as yup from 'yup';

import api from '../../actions/api';
import { useTranslation } from 'react-i18next';
import { getInitialsFromName } from '../../utils/stringFormats';
import { uploadEntityPicture } from '../../actions/aws';
import { useFormik } from 'formik';
import { ACTION_ENUM, Store } from '../../Store';
import { GENDER_ENUM, STATUS_ENUM, SEVERITY_ENUM } from '../../../common/enums';
import { ERROR_ENUM } from '../../../common/errors';
import { formatRoute } from '../../../common/utils/stringFormat';
const moment = require('moment');
import Upload from 'rc-upload';
import EmergencyContact from './EmergencyContact';

export default function EditPersonInfos(props) {
  const { basicInfos } = props;
  const { t } = useTranslation();
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  const { id: personId, name: nameProp, surname: surnameProp, photoUrl: initialPhotoUrl } = basicInfos;

  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [personInfos, setPersonInfos] = useState({});
  const [changesMade, setChangesMade] = useState(false);

  const initials = getInitialsFromName(surnameProp ? `${nameProp} ${surnameProp}` : nameProp);

  const getPersonInfos = async () => {
    const { data } = await api(
      formatRoute('/api/entity/personInfos', null, {
        entityId: personId,
      })
    );

    formik.setFieldValue('name', data.name || '');
    formik.setFieldValue('surname', data.surname || '');
    formik.setFieldValue('birthDate', data.birthDate || '');
    formik.setFieldValue('gender', data.gender || '');
    formik.setFieldValue('phoneNumber', data.phoneNumber || '');
    formik.setFieldValue('address', data.address || '');
    formik.setFieldValue('addressFormatted', data.formattedAddress || '');
    formik.setFieldValue('emergencyName', data.emergencyName || '');
    formik.setFieldValue('emergencySurname', data.emergencySurname || '');
    formik.setFieldValue('emergencyPhoneNumber', data.emergencyPhoneNumber || '');
    formik.setFieldValue('medicalConditions', data.medicalConditions || '');
    setPhotoUrl(data.photoUrl);

    setPersonInfos(data);

    setChangesMade(false);
  };

  const uploadImageProps = {
    multiple: false,
    accept: '.jpg, .png, .jpeg, .gif, .webp',
    onStart(file) {
      // Show preview
      if (file.type.split('/')[0] === 'image') {
        setImg(file);
        setPhotoUrl(URL.createObjectURL(file)); // used as a preview only
        setChangesMade(true);
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  };

  useEffect(() => {
    getPersonInfos();
  }, []);

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    surname: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    phoneNumber: yup.string().test('len', t(ERROR_ENUM.VALUE_IS_INVALID), (val) => {
      if (!val) {
        return true;
      }
      return val.length === 10;
    }),
    emergencyPhoneNumber: yup.string().test('len', t(ERROR_ENUM.VALUE_IS_INVALID), (val) => {
      if (!val) {
        return true;
      }
      return val.length === 10;
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      birthDate: '',
      gender: '',
      phoneNumber: '',
      formattedAddress: '',
      address: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const {
        name,
        surname,
        birthDate,
        gender,
        address,
        phoneNumber,
        emergencyName,
        emergencySurname,
        emergencyPhoneNumber,
        medicalConditions,
      } = values;

      setIsLoading(true);

      if (img && img.type.split('/')[0] === 'image') {
        const photoUrl = await uploadEntityPicture(personId, img);
        if (photoUrl) {
          setPhotoUrl(photoUrl);
        }
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }

      const res = await api(`/api/entity/updatePersonInfos`, {
        method: 'PUT',
        body: JSON.stringify({
          entityId: personId,
          personInfos: {
            name,
            surname,
            birthDate,
            gender,
            address,
            phoneNumber,
            emergencyName,
            emergencySurname,
            emergencyPhoneNumber,
            medicalConditions,
          },
        }),
      });
      if (res.status === STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('informations_saved'),
          severity: SEVERITY_ENUM.SUCCESS,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
        });
      }

      setIsLoading(false);
      setChangesMade(false);
    },
  });

  const onCancel = async () => {
    formik.resetForm();
    getPersonInfos();
  };

  const addressChanged = (newAddress) => {
    formik.setFieldValue('address', newAddress);
    setChangesMade(true);
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  const valueChanged = () => {
    setChangesMade(true);
  };

  return (
    <Paper className={styles.card} formik={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Avatar initials={initials} photoUrl={photoUrl} size="lg" />
        <Upload {...uploadImageProps}>
          <Button
            variant="outlined"
            endIcon="CloudUploadIcon"
            style={{ marginTop: '8px', marginBottom: '16px' }}
            component="label"
          >
            {t('change_picture')}
          </Button>
        </Upload>
        <div className={styles.div2equal}>
          <TextField
            namespace="name"
            className={styles.zone1}
            formik={formik}
            type="name"
            helperText={t('first_name')}
            onChange={valueChanged}
          />
          <TextField
            namespace="surname"
            className={styles.zone2}
            formik={formik}
            type="surname"
            helperText={t('last_name')}
            onChange={valueChanged}
          />
        </div>
        <div className={styles.div2equal}>
          <TextField
            namespace="birthDate"
            className={styles.zone1}
            formik={formik}
            type="date"
            InputProps={{
              inputProps: {
                max: moment(new Date()).format('YYYY-MM-DD'),
              },
            }}
            helperText={t('birth_date')}
            onChange={valueChanged}
          />
          <TextField
            namespace="gender"
            className={styles.zone2}
            formik={formik}
            select
            type="gender"
            helperText={t('gender')}
            onChange={valueChanged}
          >
            <MenuItem value={GENDER_ENUM.FEMALE}>{t('female')}</MenuItem>
            <MenuItem value={GENDER_ENUM.MALE}>{t('male')}</MenuItem>
            <MenuItem value={GENDER_ENUM.NOT_SPECIFIED}>{t('do_not_specify')}</MenuItem>
          </TextField>
        </div>
        <div className={styles.div2equal}>
          <TextField
            InputProps={{
              inputComponent: NumberFormat,
            }}
            namespace="phoneNumber"
            formik={formik}
            helperText={t('phone_number')}
            onChange={valueChanged}
            className={styles.zone1}
          ></TextField>
        </div>
        <div className={styles.divSearch}>
          <AddressSearchInput
            namespace="addressFormatted"
            formik={formik}
            addressChanged={addressChanged}
            country="ca"
            language={userInfo.language}
          />
        </div>
        {personInfos.formattedAddress ? (
          <div className={styles.address}>
            <Typography variant="caption" color="textSecondary">
              {t('address')}
            </Typography>
          </div>
        ) : (
          <></>
        )}
        <EmergencyContact formik={formik} valueChanged={valueChanged} />
        {changesMade && (
          <ContainerBottomFixed>
            <div className={styles.buttons}>
              <Button endIcon="SaveIcon" style={{ marginRight: '8px' }} type="submit">
                {t('save')}
              </Button>
              <Button endIcon="Cancel" onClick={onCancel} style={{ marginLeft: '8px' }} color="secondary">
                {t('cancel')}
              </Button>
            </div>
          </ContainerBottomFixed>
        )}
      </form>
    </Paper>
  );
}
