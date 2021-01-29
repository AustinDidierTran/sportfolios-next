const Home = loadable(() => import('../../../tabs/Home'));

import React, { useEffect } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import Icon from '../../../components/Custom/Icon';
import HeaderHome from '../../../components/Custom/HeaderHome';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import loadable from '@loadable/component';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme) => ({
  fabMobile: {
    position: 'absolute',
    bottom: theme.spacing(2) + 58,
    right: theme.spacing(2),
    zIndex: 100,
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2) + (window.innerWidth - 700) / 2,
    zIndex: 100,
    color: 'white',
  },
}));

export default function OrganizationAbout(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { basicInfos, navBar } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  return (
    <>
      <HeaderHome photoUrl={basicInfos.photoUrl} basicInfos={basicInfos} navTabs={navBar} />
      <IgContainer>
        {basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN || basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR ? (
          <Tooltip title={t('player_view')}>
            <Fab
              color="primary"
              onClick={undefined} //Aller sur la route deit
              className={window.innerWidth < 768 ? classes.fabMobile : classes.fab}
            >
              <Icon icon="Autorenew" />
            </Fab>
          </Tooltip>
        ) : (
          <></>
        )}
        <div>
          <Home {...{ basicInfos }} />
        </div>
      </IgContainer>
    </>
  );
}
