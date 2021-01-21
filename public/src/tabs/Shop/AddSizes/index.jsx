import React from 'react';
import { useTranslation } from 'react-i18next';
import { SIZES_ENUM } from '../../../../common/enums';
import CustomMultiSelect from '../../../components/Custom/MultiSelect';

export default function AddSizes(props) {
  const { t } = useTranslation();
  const { handleChange, sizes } = props;
  const options = Object.keys(SIZES_ENUM);

  return <CustomMultiSelect label={t('sizes')} values={sizes} onChange={handleChange} options={options} />;
}
