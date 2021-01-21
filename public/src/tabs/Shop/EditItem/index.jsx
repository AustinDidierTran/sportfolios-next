import React, { useState } from 'react';
import { useFormInput } from '../../../hooks/forms';
import { useContext } from 'react';

import styles from './EditItem.module.css';
import { Store } from '../../../Store';

import { TextareaAutosize, Typography } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CustomButton from '../../../components/Custom/Button';
import CustomInput from '../../../components/Custom/Input';
import CustomPaper from '../../../components/Custom/Paper';
import CustomTextField from '../../../components/Custom/TextField';
import { editItem, onImgUpload } from '../../../utils/shop';
import { ERROR_ENUM } from '../../../../common/errors';
import { useTranslation } from 'react-i18next';
import AddSizes from '../AddSizes';
import { useRouter } from 'next/router';

export default function EditItem(props) {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const { fetchItems, isEditing, setIsEditing, item } = props;
  const { dispatch } = useContext(Store);

  const [img, setImg] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(item.photoUrl);
  const [error, setError] = useState(null);
  const [sizes, setSizes] = useState([]);

  const name = useFormInput(item.name);
  const amount = item.price / 100;
  const description = useFormInput(decodeURIComponent(item.description));

  const handleChange = (value) => {
    setSizes(value);
  };

  const onImgChange = async ([file]) => {
    setImg(file);
  };

  const onUpload = async () => {
    const res = await onImgUpload(id, img, dispatch);
    setPhotoUrl(res.photoUrl);
  };

  const reset = () => {
    setIsEditing(!isEditing);
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
    if (!description.value) {
      description.setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
      res = false;
    }
    if (!photoUrl) {
      setError(t(ERROR_ENUM.VALUE_IS_REQUIRED));
      res = false;
    }
    return res;
  };

  const addToStore = async () => {
    if (validate()) {
      await editItem({
        name: name.value,
        description: encodeURIComponent(description.value),
        amount: amount,
        photoUrl,
        entityId: id,
        sizes,
        stripePriceIdToUpdate: item.stripePriceId,
      });
      setIsEditing(!isEditing);
      name.reset();
      description.reset();
      fetchItems();
    }
  };

  if (!isEditing) {
    return (
      <div className={styles.button}>
        <CustomButton onClick={reset} endIcon="Add" style={{ margin: '8px' }}>
          {t('add_new_product')}
        </CustomButton>
      </div>
    );
  }

  return (
    <CustomPaper style={{ marginBottom: '8px' }}>
      {photoUrl ? (
        <>
          <CardMedia className={styles.media} image={photoUrl} />
          <CustomButton onClick={() => setPhotoUrl(null)} style={{ margin: '8px' }} endIcon="Undo">
            {t('change')}
          </CustomButton>
        </>
      ) : (
        <div className={styles.media}>
          <CustomInput type="file" error={error} onChange={onImgChange} />
          <CustomButton onClick={onUpload} style={{ margin: '8px' }} endIcon="Publish">
            {t('upload')}
          </CustomButton>
        </div>
      )}
      <CardContent className={styles.infos}>
        <CustomTextField {...name.inputProps} label={t('name')} className={styles.name} onChange={validateName} />
        <Typography className={styles.price}>{`${amount} CAD`}</Typography>
        <TextareaAutosize {...description.inputProps} placeholder="Description" className={styles.description} />
        <AddSizes className={styles.sizes} handleChange={handleChange} sizes={sizes} />
        <CustomButton size="small" endIcon="Store" onClick={addToStore} className={styles.cart}>
          {t('done')}
        </CustomButton>
        <CustomButton onClick={reset} color="secondary" endIcon="Close" className={styles.cancel}>
          {t('cancel')}
        </CustomButton>
      </CardContent>
    </CustomPaper>
  );
}
