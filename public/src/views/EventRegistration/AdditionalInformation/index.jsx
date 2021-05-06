import React, { useEffect } from 'react';
import styles from './AdditionalInformation.module.css';
import TextField from '@material-ui/core/TextField';
import CustomTextField from '../../../components/Custom/TextField';

export default function AdditionalInformation(props) {
  const { stepHook, formik, informations, index } = props;

  useEffect(() => {
    stepHook.handleCompleted(index);
  }, []);

  return (
    <>
      <TextField
        InputProps={{ disableUnderline: true, whiteSpace: 'pre-wrap' }}
        multiline
        className={styles.textArea}
        disabled
        value={informations}
      />
      <CustomTextField
        namespace="informations"
        formik={formik}
        variant="filled"
        className={styles.textField}
        multiline
        rows={8}
        rowsMax={8}
      />
    </>
  );
}
