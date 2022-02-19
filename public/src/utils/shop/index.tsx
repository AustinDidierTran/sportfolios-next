import { CART_ITEM, REQUEST_STATUS_ENUM } from '../../../common/enums';
import { uploadPicture } from '../../actions/aws';
import { editShopItem, createShopItem } from '../../actions/service/stripe';
import { ACTION_ENUM } from '../../Store';

const createItem = async (params: {
  name: string;
  description: string;
  amount: number;
  photoUrl: string;
  entityId: string;
  sizes: string[];
  taxRatesId: string[];
}): Promise<number> => {
  const { name, description, amount, photoUrl, entityId, sizes, taxRatesId } = params;
  const itemParams = {
    stripeProduct: {
      name: name,
      description: description,
      active: true,
      metadata: {
        seller_entity_id: entityId,
        sizes: JSON.stringify(sizes),
        type: CART_ITEM.SHOP_ITEM,
      },
    },
    stripePrice: {
      currency: 'cad',
      unit_amount: Math.floor(+amount * 100).toString(),
      active: true,
    },
    entityId,
    photoUrl,
    taxRatesId,
  };

  return await createShopItem(itemParams);
};

const editItem = async (params: {
  name: string;
  description: string;
  amount: number;
  photoUrl: string;
  entityId: string;
  sizes: string[];
  stripePriceIdToUpdate: string;
  taxRatesId: string[];
}): Promise<number> => {
  const { name, description, amount, photoUrl, entityId, sizes, stripePriceIdToUpdate, taxRatesId } = params;
  const itemParams = {
    stripeProduct: {
      name: name,
      description: description,
      active: true,
      metadata: {
        seller_entity_id: entityId,
        sizes: JSON.stringify(sizes),
        type: CART_ITEM.SHOP_ITEM,
      },
    },
    stripePrice: {
      currency: 'cad',
      unit_amount: Math.floor(+amount * 100).toString(),
      active: true,
      metadata: {
        type: CART_ITEM.SHOP_ITEM,
        id: entityId,
      },
    },
    entityId,
    photoUrl,
    stripePriceIdToUpdate,
    taxRatesId,
  };

  return editShopItem(itemParams);
};

// eslint-disable-next-line
const onImgUpload = async (id: string, img: any, dispatch: any): Promise<{ status: number; photoUrl: string }> => {
  const photoUrl = await uploadPicture(id, img);

  if (photoUrl) {
    dispatch({
      type: ACTION_ENUM.UPDATE_STORE_ITEM_PICTURE,
      payload: photoUrl,
    });
    return { status: REQUEST_STATUS_ENUM.SUCCESS, photoUrl: photoUrl };
  }
  return { status: REQUEST_STATUS_ENUM.ERROR, photoUrl: photoUrl };
};

export { createItem, onImgUpload, editItem };
