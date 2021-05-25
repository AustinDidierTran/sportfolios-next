import React, { useEffect, useState, useContext } from 'react';

import { Select } from '../../../../../components/Custom';
import styles from './FieldSelect.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../../../actions/api';
import { SELECT_ENUM } from '../../../../../../common/enums';
import { formatRoute } from '../../../../../utils/stringFormats';
import { Store } from '../../../../../Store';

export default function FieldSelect(props) {
  const { onChange, fieldId } = props;
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (eventId) {
      getFields();
    }
  }, [eventId]);

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
