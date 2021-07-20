import React from 'react';
import MultiSelect from '../../../../../components/Custom/MultiSelect';
import styles from './FieldSelect.module.css';
import { useTranslation } from 'react-i18next';
import { formatFilter } from '../GameFilters.utils';

interface IProps {
  fields: IFields[];
  onChange: (fields: IFields[]) => void;
  allFields: IFields[];
}

interface IFields {
  value: string;
  display: string;
}

const FieldSelect: React.FunctionComponent<IProps> = (props) => {
  const { onChange, fields, allFields } = props;
  const { t } = useTranslation();

  const handleChange = (fields: IFields[]): void => {
    onChange(formatFilter(fields, t('all_fields')));
  };

  return (
    <div className={styles.select}>
      <MultiSelect
        options={allFields}
        namespace="field"
        autoFocus
        margin="dense"
        label={t('field')}
        fullWidth
        onChange={handleChange}
        values={fields}
      />
    </div>
  );
};
export default FieldSelect;
