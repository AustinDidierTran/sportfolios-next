import React, { useState, useContext, useEffect } from 'react';
import { useFormInput } from '../../../hooks/forms';

import styles from './EditItem.module.css';
import { ACTION_ENUM, Store } from '../../../Store';

import TextField from '../../../components/Custom/TextField';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CustomButton from '../../../components/Custom/Button';
import CustomPaper from '../../../components/Custom/Paper';
import CustomTextField from '../../../components/Custom/TextField';
import { editItem, onImgUpload } from '../../../utils/shop';
import { ERROR_ENUM } from '../../../../common/errors';
import { useTranslation } from 'react-i18next';
import AddSizes from '../AddSizes';
import Upload from 'rc-upload';
import { SEVERITY_ENUM } from '../../../../common/enums';
import { Tax } from '../../../../../typescript/types';
import MultiSelect from '../../../components/Custom/MultiSelect';

interface IProps {
  fetchItems: () => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  item: ShopItem;
}

interface ShopItem {
  photoUrl: string;
  name: string;
  description: string;
  price: number;
  stripePriceId: string;
  stripeProductId: string;
  sizes: string[];
  taxRatesId: string[];
  allTaxes: TaxesOption[];
}

interface TaxesOption extends Tax {
  display: string;
  value: string;
}

const EditItem: React.FunctionComponent<IProps> = (props) => {
  const {
    dispatch,
    state: { id },
  } = useContext(Store);
  const { t } = useTranslation();
  const { fetchItems, isEditing, setIsEditing, item } = props;

  const [sizes, setSizes] = useState<string[]>(item.sizes);
  const [taxes, setTaxes] = useState<string[]>([]);

  const name = useFormInput(item.name);
  const amount = useFormInput(item.price / 100);
  const description = useFormInput(decodeURIComponent(item.description));
  const photoUrl = useFormInput(item.photoUrl);

  useEffect(() => {
    const taxes = item.allTaxes.filter((t) => item.taxRatesId?.includes(t.id)).map((t) => t.display);
    setTaxes(taxes);
  }, [item]);

  const handleSizesChange = (value: string[]) => {
    setSizes(value);
  };

  const handleTaxesChange = (value: string[]) => {
    setTaxes(value);
  };

  const uploadImageProps = {
    multiple: false,
    accept: '.jpg, .png, .jpeg, .gif, .webp',
    onStart(file: any) {
      if (file.type.split('/')[0] === 'image') {
        onImgUpload(id, file, dispatch).then((res) => photoUrl.setValue(res.photoUrl));
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  };

  const reset = (): void => {
    setIsEditing(!isEditing);
  };

  const validateName = (value: string): void => {
    if (name.value.length > 64) {
      name.reset();
    } else {
      name.setValue(value);
      name.changeDefault(value);
    }
  };

  const validate = (): boolean => {
    let res = true;
    if (!name.value) {
      name.setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
      res = false;
    }
    if (!description.value) {
      description.setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
      res = false;
    }
    if (!photoUrl.value) {
      photoUrl.setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
      res = false;
    }
    return res;
  };

  const addToStore = (): void => {
    if (validate()) {
      const taxRatesId = item.allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.id);
      editItem({
        name: name.value,
        description: encodeURIComponent(description.value),
        amount: amount.value,
        photoUrl: photoUrl.value,
        entityId: id,
        sizes,
        stripePriceIdToUpdate: item.stripePriceId,
        taxRatesId,
      }).then(() => {
        setIsEditing(!isEditing);
        name.reset();
        description.reset();
        fetchItems();
      });
    }
  };

  if (!isEditing) {
    return (
      <div className={styles.button}>
        <CustomButton onClick={reset} endIcon="Add" style={{ margin: '8px' }}>
          {t('add.add_new_product')}
        </CustomButton>
      </div>
    );
  }

  return (
    <CustomPaper style={{ marginBottom: '8px' }}>
      <CardMedia className={styles.media} image={photoUrl.value} />
      <Upload {...uploadImageProps}>
        <CustomButton style={{ margin: '8px' }} endIcon="Undo">
          {t('change_picture')}
        </CustomButton>
      </Upload>
      <CardContent className={styles.infos}>
        <CustomTextField {...name.inputProps} label={t('name')} className={styles.name} onChange={validateName} />
        <CustomTextField {...amount.inputProps} className={styles.price}></CustomTextField>
        <TextField
          multiline
          rows={1}
          rowsMax={10}
          {...description.inputProps}
          placeholder={t('description.description')}
          className={styles.description}
        />
        <div className={styles.sizeTaxes}>
          {item.allTaxes ? (
            <MultiSelect
              label={t('taxes')}
              options={item.allTaxes.map((a) => a.display)}
              values={taxes}
              onChange={handleTaxesChange}
            />
          ) : null}
          <AddSizes handleChange={handleSizesChange} sizes={sizes} />
        </div>
        <CustomButton size="small" endIcon="SaveIcon" onClick={addToStore} className={styles.cart}>
          {t('done')}
        </CustomButton>
        <CustomButton onClick={reset} color="secondary" endIcon="Close" className={styles.cancel}>
          {t('cancel')}
        </CustomButton>
      </CardContent>
    </CustomPaper>
  );
};
export default EditItem;
