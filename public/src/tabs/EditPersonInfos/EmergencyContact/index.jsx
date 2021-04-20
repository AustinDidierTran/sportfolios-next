import React from 'react';

import styles from '../EditPersonInfos.module.css';
import TextField from '../../../components/Custom/TextField';
import NumberFormat from '../../../components/Custom/NumberFormat';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';

export default function EmergencyContact(props) {
  const { formik, valueChanged } = props;
  const { t } = useTranslation();

  return (
    <>
      <Typography>{t('emergency_contact')}</Typography>
      <Divider className={styles.divider} />
      <div className={styles.div2equal}>
        <TextField
          namespace="emergencyName"
          className={styles.zone1}
          formik={formik}
          helperText={t('first_name')}
          onChange={valueChanged}
        />
        <TextField
          namespace="emergencySurname"
          className={styles.zone2}
          formik={formik}
          helperText={t('last_name')}
          onChange={valueChanged}
        />
      </div>
      <div className={styles.div2equal}>
        <TextField
          InputProps={{
            inputComponent: NumberFormat,
          }}
          namespace="emergencyPhoneNumber"
          formik={formik}
          helperText={t('phone_number')}
          onChange={valueChanged}
          className={styles.zone1}
        ></TextField>
      </div>
      <Typography>{t('medical_conditions')}</Typography>
      <Divider />
      <TextField
        namespace="medicalConditions"
        onChange={valueChanged}
        label={!formik.values.medicalConditions && t('write_your_medical_conditions_here')}
        className={styles.textField}
        formik={formik}
        variant="filled"
        multiline
        rows={4}
        rowsMax={8}
      />
    </>
  );
}
