import React, { useState, useContext } from 'react';

import { useFormInput } from '../../../hooks/forms';
import styles from './CreateItem.module.css';
import { Store, ACTION_ENUM } from '../../../Store';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '../../../components/Custom/Button';
import Paper from '../../../components/Custom/Paper';
import TextField from '../../../components/Custom/TextField';
import { createItem, onImgUpload } from '../../../utils/shop';
import { ERROR_ENUM } from '../../../../common/errors';
import { useTranslation } from 'react-i18next';
import AddSizes from '../AddSizes';
import { SEVERITY_ENUM } from '../../../../common/enums';
import Upload from 'rc-upload';
import { hasStripeBankAccount } from '../../../actions/service/stripe';
import MultiSelect from '../../../components/Custom/MultiSelect';
import { Tax } from '../../../../../typescript/types';

interface IProps {
  fetchItems: () => void;
  allTaxes: TaxesOption[];
}

interface TaxesOption extends Tax {
  display: string;
  value: string;
}

const CreateItem: React.FunctionComponent<IProps> = (props) => {
  const {
    dispatch,
    state: { id },
  } = useContext(Store);
  const { t } = useTranslation();
  const { fetchItems, allTaxes } = props;

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [sizes, setSizes] = useState<string[]>([]);
  const [taxes, setTaxes] = useState<string[]>([]);

  const name = useFormInput('');
  const amount = useFormInput('');
  const description = useFormInput('');
  const photoUrl = useFormInput('');

  const handleSizesChange = (value: string[]): void => {
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

  const reset = async () => {
    const hasBankAccount = await hasStripeBankAccount(id);
    if (!hasBankAccount) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('cant_add_product_no_bank_account'),
        severity: 'error',
      });
      setIsCreating(false);
    } else {
      setIsCreating(!isCreating);
    }
  };

  const validateName = (value: string[]) => {
    if (name.value.length > 64) {
      name.reset();
    } else {
      name.setValue(value);
      name.changeDefault(value);
    }
  };
  const validate = () => {
    let res = true;
    if (!name.value) {
      name.setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
      res = false;
    }
    if (!amount.value) {
      amount.setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
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

  const addToStore = async () => {
    if (validate()) {
      const taxRatesId = allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.id);
      await createItem({
        name: name.value,
        description: encodeURIComponent(description.value),
        amount: amount.value,
        photoUrl: photoUrl.value,
        entityId: id,
        sizes,
        taxRatesId,
      });
      setIsCreating(!isCreating);
      name.reset();
      amount.reset();
      description.reset();
      fetchItems();
    }
  };

  if (!isCreating) {
    return (
      <div className={styles.button}>
        <Button onClick={reset} endIcon="Add" style={{ margin: '8px' }}>
          {t('add.add_new_product')}
        </Button>
      </div>
    );
  }

  return (
    <Paper style={{ marginBottom: '8px' }}>
      {photoUrl.value ? (
        <>
          <CardMedia className={styles.media} image={photoUrl.value} />
          <Upload {...uploadImageProps}>
            <Button style={{ margin: '8px' }} endIcon="Undo">
              {t('change_picture')}
            </Button>
          </Upload>
        </>
      ) : (
        <div className={styles.media}>
          <Upload {...uploadImageProps}>
            <Button variant="outlined" endIcon="CloudUploadIcon" style={{ marginTop: '8px', marginBottom: '16px' }}>
              {t('upload')}
            </Button>
          </Upload>
        </div>
      )}
      <CardContent className={styles.infos}>
        <TextField {...name.inputProps} label={t('name')} className={styles.name} onChange={validateName} />
        <TextField {...amount.inputProps} type="number" label={t('price')} className={styles.price} />
        <TextField
          multiline
          rows={1}
          rowsMax={10}
          {...description.inputProps}
          placeholder={t('description.description')}
          className={styles.description}
        />
        <div className={styles.sizeTaxes}>
          <MultiSelect
            label={t('taxes')}
            options={allTaxes.map((a) => a.display)}
            values={taxes}
            onChange={handleTaxesChange}
          />
          <AddSizes handleChange={handleSizesChange} sizes={sizes} />
        </div>
        <Button size="small" endIcon="Add" onClick={addToStore} className={styles.cart}>
          {t('add.add')}
        </Button>
        <Button onClick={reset} color="secondary" endIcon="Close" className={styles.cancel}>
          {t('cancel')}
        </Button>
      </CardContent>
    </Paper>
  );
};
export default CreateItem;
