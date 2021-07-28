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
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import api from '../../../actions/api';
import { GLOBAL_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import Upload from 'rc-upload';
import { formatRoute } from '../../../utils/stringFormats';

export default function CreateItem(props) {
  const {
    dispatch,
    state: { id },
  } = useContext(Store);
  const { t } = useTranslation();
  const { fetchItems } = props;

  const [isCreating, setIsCreating] = useState(false);
  const [img, setImg] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [sizes, setSizes] = useState([]);

  const name = useFormInput('');
  const amount = useFormInput('');
  const description = useFormInput('');

  const handleChange = (value) => {
    setSizes(value);
  };

  const uploadImageProps = {
    multiple: false,
    accept: '.jpg, .png, .jpeg, .gif, .webp',
    onStart(file) {
      if (file.type.split('/')[0] === 'image') {
        setImg(file);
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  };

  const onUpload = async () => {
    const res = await onImgUpload(id, img, dispatch);
    setPhotoUrl(res.photoUrl);
  };

  const getHasBankAccount = async () => {
    const res = await api(
      formatRoute('/api/stripe/eventHasBankAccount', null, {
        id,
      }),
      { method: 'GET' }
    );
    return res.data;
  };

  const reset = async () => {
    const hasBankAccount = await getHasBankAccount();
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

  const validateName = (value) => {
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
    if (!photoUrl) {
      photoUrl.setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
      res = false;
    }
    return res;
  };

  const addToStore = async () => {
    if (validate()) {
      await createItem({
        name: name.value,
        description: encodeURIComponent(description.value),
        amount: amount.value,
        photoUrl,
        entityId: id,
        sizes,
        type: GLOBAL_ENUM.SHOP_ITEM,
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
      {photoUrl ? (
        <>
          <CardMedia className={styles.media} image={photoUrl} />
          <Button onClick={() => setPhotoUrl(null)} style={{ margin: '8px' }} endIcon="Undo">
            {t('change')}
          </Button>
        </>
      ) : (
        <div className={styles.media}>
          <Upload {...uploadImageProps}>
            <Button
              variant="outlined"
              endIcon="CloudUploadIcon"
              style={{ marginTop: '8px', marginBottom: '16px' }}
              component="label"
            >
              {t('change_picture')}
            </Button>
          </Upload>
          <Button onClick={onUpload} style={{ margin: '8px' }} endIcon="Publish">
            {t('upload')}
          </Button>
        </div>
      )}
      <CardContent className={styles.infos}>
        <TextField {...name.inputProps} label={t('name')} className={styles.name} onChange={validateName} />
        <TextField {...amount.inputProps} type="number" label={t('price')} className={styles.price} />
        <TextareaAutosize {...description.inputProps} placeholder="Description" className={styles.description} />
        <AddSizes className={styles.sizes} handleChange={handleChange} sizes={sizes} />
        <Button size="small" endIcon="Store" onClick={addToStore} className={styles.cart}>
          {t('add.add')}
        </Button>
        <Button onClick={reset} color="secondary" endIcon="Close" className={styles.cancel}>
          {t('cancel')}
        </Button>
      </CardContent>
    </Paper>
  );
}
