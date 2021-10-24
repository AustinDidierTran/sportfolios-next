import { Accordion, AccordionSummary, ListItemText } from '@material-ui/core';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { ERROR_ENUM } from '../../../../../../../../../../common/errors';
import { Button, Icon, TextField } from '../../../../../../../../../components/Custom';
import { formatDate } from '../../../../../../../../../utils/stringFormats';
import styles from './General.module.css';
import * as service from '../../../../../../../../../actions/service/game';

interface IProps {
  id: string;
  name: string;
  description: string;
  tickets: {
    limit: number;
  };
}

const General: React.FunctionComponent<IProps> = (props) => {
  const {
    description,
    name,
    tickets: { limit: ticketLimit },
  } = props;
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(false);
  const validationSchema = yup.object().shape({
    name: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    ticketLimit: yup.number().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  useEffect(() => {
    formik.setFieldValue('description', description);
  }, [description]);

  useEffect(() => {
    formik.setFieldValue('name', name);
  }, [name]);

  useEffect(() => {
    formik.setFieldValue('ticketLimit', ticketLimit);
  }, [ticketLimit]);

  const formik = useFormik({
    initialValues: {
      description: '',
      name: '',
      ticketLimit: 250,
      startDate: formatDate(moment.parseZone(new Date().toLocaleString()), 'YYYY-MM-DD'),
      startTime: '09:00',
      endDate: '',
      endTime: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      await service.updateGame({
        gameId: props.id,
        name: values.name,
        ticketLimit: values.ticketLimit,
        description: values.description,
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded((exp) => !exp)}
        style={{ margin: '1rem 0.5rem 0 0.5rem', borderRadius: '1rem' }}
      >
        <AccordionSummary expandIcon={<Icon icon="ExpandMore" />}>
          <ListItemText primary={t('general')} />
        </AccordionSummary>
        <div className={styles.container}>
          <TextField formik={formik} namespace="name" label={t('name')} fullWidth />
          <TextField
            formik={formik}
            namespace="ticketLimit"
            label={t('ticketLimit')}
            type="number"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            namespace="description"
            formik={formik}
            multiline
            rows={1}
            rowsMax={20}
            label={t('description.description')}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button size="small" type="submit" endIcon="SaveIcon">
            {t('save')}
          </Button>
        </div>
      </Accordion>
    </form>
  );
};

export default General;
