import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';
import { TABS_ENUM } from '../../common/enums';
import { ENTITIES_ROLE_ENUM } from '../Store';

const About = loadable(() => import('./About'));
const Cart = loadable(() => import('./Cart'));
const EditPersonInfos = loadable(() => import('./EditPersonInfos'));
const Purchases = loadable(() => import('./Purchases'));
const Settings = loadable(() => import('./Settings'));

export default function Tabs(props) {
  const { t } = useTranslation();
  const { list, role } = props;

  return list.reduce((prev, l) => {
    if (l === TABS_ENUM.ABOUT) {
      return [
        ...prev,
        {
          value: TABS_ENUM.ABOUT,
          component: About,
          label: t('about'),
          icon: 'Info',
        },
      ];
    }
    if (l === TABS_ENUM.CART) {
      return [
        ...prev,
        {
          value: TABS_ENUM.CART,
          component: Cart,
          label: t('cart'),
          icon: 'ShoppingCartOutlined',
        },
      ];
    }
    if (l === TABS_ENUM.PURCHASES) {
      return [
        ...prev,
        {
          value: TABS_ENUM.PURCHASES,
          component: Purchases,
          label: t('purchases'),
          icon: 'Store',
        },
      ];
    }
    if (l === TABS_ENUM.SETTINGS) {
      return [
        ...prev,
        {
          component: Settings,
          label: t('settings'),
          icon: 'Settings',
          value: TABS_ENUM.SETTINGS,
        },
      ];
    }
    if (l === TABS_ENUM.EDIT_PERSON_INFOS) {
      if ([ENTITIES_ROLE_ENUM.ADMIN, ENTITIES_ROLE_ENUM.EDITOR].includes(role)) {
        return [
          ...prev,
          {
            component: EditPersonInfos,
            label: t('edit.edit_infos'),
            icon: 'Edit',
            value: TABS_ENUM.EDIT_PERSON_INFOS,
          },
        ];
      }
      return prev;
    }
  }, []);
}
