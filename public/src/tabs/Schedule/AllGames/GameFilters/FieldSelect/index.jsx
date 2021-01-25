import React, { useEffect, useState } from 'react';

import { Select } from '../../../../../components/Custom';
import styles from './FieldSelect.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../../../actions/api';
import { SELECT_ENUM } from '../../../../../../common/enums';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../../../common/utils/stringFormat';

export default function FieldSelect(props) {
  const { onChange, fieldId } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;

  const [fields, setFields] = useState([]);

  useEffect(() => {
    getFields();
  }, []);

  const getFields = async () => {
    const { data } = await api(formatRoute('/api/entity/fields', null, { eventId }));
    const res = data.map((d) => ({
      value: d.id,
      display: d.field,
    }));
    setFields([{ value: SELECT_ENUM.ALL, display: t('all_fields') }, ...res]);
  };

  const handleChange = (fieldId) => {
    const field = fields.find((field) => field.value === fieldId);
    onChange(field);
  };

  return (
    <div className={styles.select}>
      <Select
        options={fields}
        namespace="field"
        autoFocus
        margin="dense"
        label={t('field')}
        fullWidth
        onChange={handleChange}
        value={fieldId}
      />
    </div>
  );
}
