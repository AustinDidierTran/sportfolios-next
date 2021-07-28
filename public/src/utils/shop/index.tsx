import { GLOBAL_ENUM } from '../../../common/enums';
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
}): Promise<number> => {
  const { name, description, amount, photoUrl, entityId, sizes } = params;
  const itemParams = {
    stripeProduct: {
      name: name,
      description: description,
      active: true,
      metadata: {
        seller_entity_id: entityId,
        sizes: JSON.stringify(sizes),
        type: GLOBAL_ENUM.SHOP_ITEM,
      },
    },
    stripePrice: {
      currency: 'cad',
      unit_amount: Math.floor(+amount * 100).toString(),
      active: true,
    },
    entityId,
    photoUrl,
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
}): Promise<number> => {
  const { name, description, amount, photoUrl, entityId, sizes, stripePriceIdToUpdate } = params;
  const itemParams = {
    stripeProduct: {
      name: name,
      description: description,
      active: true,
      metadata: {
        seller_entity_id: entityId,
        sizes: JSON.stringify(sizes),
        type: GLOBAL_ENUM.SHOP_ITEM,
      },
    },
    stripePrice: {
      currency: 'cad',
      unit_amount: Math.floor(+amount * 100).toString(),
      active: true,
      metadata: {
        type: GLOBAL_ENUM.SHOP_ITEM,
        id: entityId,
      },
    },
    entityId,
    photoUrl,
    stripePriceIdToUpdate,
  };

  return editShopItem(itemParams);
};

const onImgUpload = async (id: string, img: any, dispatch: any): Promise<{ status: number; photoUrl: string }> => {
  const photoUrl = await uploadPicture(id, img);

  if (photoUrl) {
    dispatch({
      type: ACTION_ENUM.UPDATE_STORE_ITEM_PICTURE,
      payload: photoUrl,
    });
    return { status: 200, photoUrl: photoUrl };
  }
  return { status: 404, photoUrl: photoUrl };
};

export { createItem, onImgUpload, editItem };
