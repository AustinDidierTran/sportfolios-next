import React, { useState, useMemo } from 'react';

import styles from './ShopItem.module.css';

import { Typography } from '@material-ui/core';
import CustomButton from '../../Button';
import CustomPaper from '../../Paper';

import CardContent from '@material-ui/core/CardContent';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { formatPrice } from '../../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import ImageCard from '../../ImageCard';

import EditItem from '../../../../tabs/Shop/EditItem';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../../common/utils/stringFormat';

export default function ShopItem(props) {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { label: name, amount: price, photoUrl, description, stripePriceId, stripeProductId, isEditor, update } = props;

  const text = useMemo(() => decodeURIComponent(description), [description]);

  const onPaperClick = () => {
    goTo(ROUTES.shopDetails, { id, stripePriceId });
  };

  const deleteItem = async () => {
    await api(
      formatRoute('/api/stripe/deleteItem', null, {
        stripeProductId,
        stripePriceId,
      }),
      {
        method: 'DELETE',
      }
    );
    update();
  };

  const editItem = () => {
    setIsEditing(!isEditing);
  };

  if (isEditing) {
    return (
      <EditItem
        item={{
          name,
          price,
          photoUrl,
          description,
          stripePriceId,
          stripeProductId,
        }}
        fetchItems={update}
        isEditing={isEditing}
        setIsEditing={(s) => setIsEditing(s)}
      />
    );
  }

  return (
    <CustomPaper className={styles.root}>
      <ImageCard className={styles.media} image={photoUrl} onClick={onCustomClick} />
      <CardContent className={styles.infos}>
        <Typography gutterBottom variant="h5" className={styles.name}>
          {name}
        </Typography>
        <Typography variant="h5" className={styles.price}>
          {formatPrice(price)}
        </Typography>
        <Typography
          variant="h7"
          color="textSecondary"
          component="p"
          className={styles.description}
          placeholder="Description"
          value={text}
          disabled
        />

        {isEditor ? (
          <div className={styles.buttons}>
            <CustomButton onClick={editItem} endIcon="Settings" color="primary" className={styles.button}>
              {t('edit')}
            </CustomButton>
            <CustomButton onClick={deleteItem} endIcon="Delete" color="secondary" className={styles.button}>
              {t('delete')}
            </CustomButton>
          </div>
        ) : (
          <div className={styles.otherButtonMain}>
            <CustomButton
              onClick={() => goTo(ROUTES.shopDetails, { id, stripePriceId })}
              className={styles.otherButton}
            >
              {t('learn_more')}
            </CustomButton>
          </div>
        )}
      </CardContent>
    </CustomPaper>
  );
}
