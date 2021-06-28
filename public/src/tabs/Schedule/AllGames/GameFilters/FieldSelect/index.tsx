import React, { useEffect, useState, useContext } from 'react';

import { Select } from '../../../../../components/Custom';
import styles from './FieldSelect.module.css';
import { useTranslation } from 'react-i18next';
import { SELECT_ENUM } from '../../../../../../common/enums';
import { Store } from '../../../../../Store';
import { getFields as getFieldsApi } from '../../../../../actions/service/entity/get';
interface IProps {
  fieldId: string;
  onChange: (field: any) => void;
}

interface IFields {
  value: string;
  display: string;
}

const FieldSelect: React.FunctionComponent<IProps> = (props) => {
  const { onChange, fieldId } = props;
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const [fields, setFields] = useState<IFields[]>([]);

  useEffect((): void => {
    if (eventId) {
      getFields();
    }
  }, [eventId]);

  const getFields = async (): Promise<void> => {
    const data = await getFieldsApi(eventId);
    if (data.length > 0) {
      const res = data.map((d) => ({
        value: d.id,
        display: d.field,
      }));
      setFields([{ value: SELECT_ENUM.ALL, display: t('all_fields') }, ...res]);
    }
  };

  const handleChange = (fieldId: string): void => {
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
};
export default FieldSelect;
