import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AdditionalInformation.module.css';
import { useRouter } from 'next/router';
import { TextField } from '../../../components/Custom';
import Typography from '@material-ui/core/Typography';

export default function AdditionalInformation(props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;
  const { stepHook, formik, informations, index } = props;

  useEffect(() => {
    stepHook.handleCompleted(index);
  }, []);

  return (
    <div>
      <Typography variant="body2" color="textSecondary" component="p" className={styles.infos}>
        {informations}
      </Typography>
      <TextField
        namespace="informations"
        formik={formik}
        variant="filled"
        className={styles.textField}
        multiline
        rows={8}
        rowsMax={8}
      />
    </div>
  );
}
