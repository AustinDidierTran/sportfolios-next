import { GLOBAL_ENUM } from '../../../common/enums';
import { getMembershipName } from '../stringFormats';
import i18n from '../../i18n';

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

const groupedCart = (cart) => {
  const grouped = groupBy(cart, (item) => item.stripe_price_id);
  const keys = Array.from(grouped.keys());
  const groupedItems = keys.map((key) => {
    return {
      ...cart.find((e) => e.stripe_price_id == key),
      nbInCart: grouped.get(key).length,
    };
  });
  return groupedItems;
};

const getNbInCart = (cart, key) => {
  return cart.find((e) => e.stripe_price_id == key).nbInCart;
};

const getProductName = (type) => {
  if (type === GLOBAL_ENUM.MEMBERSHIP) {
    return i18n.t('member.membership');
  }
  if (type === GLOBAL_ENUM.SHOP_ITEM) {
    return i18n.t(type);
  }
  if (type === GLOBAL_ENUM.EVENT) {
    return i18n.t('event.event');
  }
  return '';
};

const getProductDetail = (metadata) => {
  switch (metadata.type) {
    case GLOBAL_ENUM.MEMBERSHIP:
      return getMembershipName(metadata.membership_type);
    case GLOBAL_ENUM.SHOP_ITEM:
      return '';
    case GLOBAL_ENUM.EVENT:
      if (metadata.person) {
        return `${metadata.event.basicInfos.name} | ${metadata.option?.name} | ${metadata.person.name} ${metadata.person.surname}`;
      }
      if (metadata.isIndividualOption) {
        return `${metadata.event.basicInfos.name} | ${metadata.option?.name} | ${metadata.name}`;
      }
      return `${metadata.event.basicInfos.name} | ${metadata.option?.name} | ${metadata.team?.name}`;
    default:
      return '';
  }
};

const getRegistrationFor = (metadata) => {
  switch (metadata.type) {
    case GLOBAL_ENUM.MEMBERSHIP:
      return `${metadata?.person?.name} ${metadata?.person?.surname}`;
    case GLOBAL_ENUM.SHOP_ITEM:
      return '';
    case GLOBAL_ENUM.EVENT:
      if (metadata.person) {
        return `${metadata.person.name} ${metadata.person.surname}`;
      }
      if (metadata.isIndividualOption) {
        return metadata.name;
      }
      return metadata.team?.name;
    default:
      return '';
  }
};

export { groupBy, groupedCart, getNbInCart, getProductName, getProductDetail, getRegistrationFor };
