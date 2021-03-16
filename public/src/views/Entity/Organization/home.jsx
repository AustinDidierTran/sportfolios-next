import React, { useEffect, useState, useRef, useContext, componentDidMount } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import Icon from '../../../components/Custom/Icon';
import HeaderHome from '../../../components/Custom/HeaderHome';
import { ENTITIES_ROLE_ENUM, STATUS_ENUM, CARD_TYPE_ENUM, GLOBAL_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { formatPageTitle } from '../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Store } from '../../../Store';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Posts from '../../../components/Custom/Posts';

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
  IgContainer: {
    backgroundColor: '#f5f5f5 !important',
  },
  createPost: {
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
  },
}));

export default function OrganizationHome(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { basicInfos, navBar } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, []);
  const {
    state: { userInfo },
  } = useContext(Store);

  return (
    <>
      <HeaderHome basicInfos={basicInfos} navTabs={navBar} type={GLOBAL_ENUM.ORGANIZATION} />
      <IgContainer className={classes.IgContainer}>
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
          <div></div>
        )}
        <Posts
          userInfo={userInfo}
          allowPostImage={true}
          allowNewPost={basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN}
          entityIdCreatePost={basicInfos.id}
          entityRole={basicInfos.role}
          allowComment={true}
          allowLike={true}
          locationId={basicInfos.id}
          elevation={1}
          placeholder={t('start_a_post')}
        />
      </IgContainer>
    </>
  );
}
