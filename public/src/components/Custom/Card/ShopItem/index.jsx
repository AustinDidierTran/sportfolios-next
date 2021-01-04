import React, { useState, useMemo } from 'react';

import styles from './ShopItem.module.css';

import { Typography } from '@material-ui/core';
import { Paper, Button } from '../..';
import CardContent from '@material-ui/core/CardContent';
import { goTo, ROUTES, formatRoute } from '../../../../actions/goTo';
import { formatPrice } from '../../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import ImageCard from '../../ImageCard';

import EditItem from '../../../../tabs/Shop/EditItem';
import { useRouter } from 'next/router';

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
    <Paper className={styles.root}>
      <ImageCard className={styles.media} image={photoUrl} onClick={onPaperClick} />
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
            <Button onClick={editItem} endIcon="Settings" color="primary" className={styles.button}>
              {t('edit')}
            </Button>
            <Button onClick={deleteItem} endIcon="Delete" color="secondary" className={styles.button}>
              {t('delete')}
            </Button>
          </div>
        ) : (
          <div className={styles.otherButtonMain}>
            <Button onClick={() => goTo(ROUTES.shopDetails, { id, stripePriceId })} className={styles.otherButton}>
              {t('learn_more')}
            </Button>
          </div>
        )}
      </CardContent>
    </Paper>
  );
}
