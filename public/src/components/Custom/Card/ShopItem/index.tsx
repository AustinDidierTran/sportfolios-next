import React, { useState, useMemo, useContext } from 'react';

import styles from './ShopItem.module.css';

import Typography from '@material-ui/core/Typography';
import CustomButton from '../../Button';
import CustomPaper from '../../Paper';

import CardContent from '@material-ui/core/CardContent';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { formatPrice } from '../../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import ImageCard from '../../ImageCard';
import EditItem from '../../../../tabs/Shop/EditItem';
import { Store } from '../../../../Store';
import { deleteShopItem } from '../../../../actions/service/stripe';
import { AlertDialog } from '../..';

interface IProps {
  label: string;
  amount: number;
  photoUrl: string;
  description: string;
  stripePriceId: string;
  stripeProductId: string;
  sizes: string[];
  adminView: string;
  update: () => void;
}

const ShopItem: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const {
    label: name,
    amount: price,
    photoUrl,
    description,
    stripePriceId,
    stripeProductId,
    sizes,
    adminView,
    update,
  } = props;
  const {
    state: { id },
  } = useContext(Store);

  const text = useMemo((): string => decodeURIComponent(description), [description]);

  const onPaperClick = (): void => {
    goTo(ROUTES.shopDetails, { id, stripePriceId });
  };

  const deleteItem = (): void => {
    deleteShopItem(stripeProductId, stripePriceId).then(update);
    setOpenDelete(false);
  };

  const editItem = (): void => {
    setIsEditing(!isEditing);
  };

  const onClickDelete = async (): Promise<void> => {
    setOpenDelete(true);
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
          sizes,
        }}
        fetchItems={update}
        isEditing={isEditing}
        setIsEditing={(s) => setIsEditing(s)}
      />
    );
  }

  return (
    <>
    <CustomPaper className={styles.root}>
      <ImageCard className={styles.media} image={photoUrl} onClick={onPaperClick} />
      <CardContent className={styles.infos}>
        <Typography gutterBottom variant="h5" className={styles.name}>
          {name}
        </Typography>
        <Typography variant="h5" className={styles.price}>
          {formatPrice(price)}
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          component="p"
          className={styles.description}
          placeholder={t('description.description')}
        >
          {text}
        </Typography>

        {adminView ? (
          <div className={styles.buttons}>
            <CustomButton onClick={editItem} endIcon="Edit" color="primary" className={styles.button}>
              {t('edit.edit')}
            </CustomButton>
            <CustomButton onClick={onClickDelete} endIcon="Delete" color="secondary" className={styles.button}>
              {t('delete.delete')}
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
    <AlertDialog
    open={openDelete}
    onCancel={() => 
      setOpenDelete(false)
    }
    title={t('delete.delete_this_item_from_shop')}
    onSubmit={deleteItem}
    />
  </>
  );
};
export default ShopItem;
