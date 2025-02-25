import React from 'react';
import { Store } from '../../Store';
import Typography from '@material-ui/core/Typography';
import api from '../../actions/api';
import { GLOBAL_ENUM } from '../../../common/enums';
import CartIcon from '../Cart/CartICon';
import validator from 'validator';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const LoggedOut = dynamic(() => import('./LoggedOut'));
const Default = dynamic(() => import('./Default'));
const LoggedIn = dynamic(() => import('./LoggedIn'));

const getEntity = async (entityId) => {
  const { data } = await api(`/api/entity?id=${entityId}`, { method: 'GET' });
  return data.basicInfos;
};

export default function Header() {
  const {
    state: { isAuthenticated },
  } = React.useContext(Store);

  const router = useRouter();
  const [path, setPath] = React.useState('');
  const [entity, setEntity] = React.useState({});
  const [isNotLoginPage, setIsNotLoginPage] = React.useState(false);

  const fetchData = async () => {
    const pth = router.pathname.split('/')[1] || '';
    const isLogin = router.pathname.includes('login');
    const isSignUp = router.pathname.includes('signup');
    setIsNotLoginPage(isLogin || isSignUp ? false : true);

    if (
      [
        'addPaymentMethod',
        'cart',
        'checkout',
        'menu',
        'orderProcessed',
        'organizationList',
        'registrationStatus',
        'scheduleInteractiveTool',
      ].includes(pth)
    ) {
      setPath(pth);
    } else if (['eventRegistration'].includes(pth)) {
      const id = router.pathname.split('/')[2] || '';
      const ent = await getEntity(id);
      setPath(ent.type);
      setEntity(ent);
    } else if (validator.isUUID(pth)) {
      const ent = await getEntity(pth);
      setPath(ent.type);
      setEntity(ent);
    } else {
      setPath('');
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [router.pathname]);

  if (isAuthenticated) {
    switch (path) {
      case 'addPaymentMethod':
      case 'checkout':
      case 'orderProcessed':
      case 'registrationStatus':
        return (
          <Default
            Item1={() => <Typography style={{ fontSize: '24px' }}>{'Checkout'}</Typography>}
            Item4={() => <CartIcon />}
          />
        );

      case 'cart':
        return (
          <Default
            Item1={() => <Typography style={{ fontSize: '24px' }}>{'Cart'}</Typography>}
            Item4={() => <CartIcon />}
          />
        );

      case 'menu':
        return (
          <Default
            Item1={() => <Typography style={{ fontSize: '24px' }}>{'Menu'}</Typography>}
            Item4={() => <CartIcon />}
          />
        );

      case 'scheduleInteractiveTool':
        return <Default showBar={false} />;

      case GLOBAL_ENUM.EVENT:
      case GLOBAL_ENUM.ORGANIZATION:
      case GLOBAL_ENUM.PERSON:
      case GLOBAL_ENUM.TEAM:
        return (
          <Default
            Item2={() => <Typography style={{ fontSize: '16px' }}>{entity.name}</Typography>}
            Item4={() => <CartIcon />}
          />
        );

      default:
        return <LoggedIn />;
    }
  }
  return <LoggedOut isNotLogin={isNotLoginPage} />;
}
