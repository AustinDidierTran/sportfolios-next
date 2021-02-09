import React, { useEffect, useState, useRef } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import Icon from '../../../components/Custom/Icon';
import HeaderHome from '../../../components/Custom/HeaderHome';
import { ENTITIES_ROLE_ENUM, STATUS_ENUM, CARD_TYPE_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import PostInput from '../../../components/Custom/Input/PostInput';
import { formatRoute } from '../../../../common/utils/stringFormat';

import CustomCard from '../../../components/Custom/Card';
import api from '../../../actions/api';
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
  IgContainer: {
    backgroundColor: '#f5f5f5!important',
  },
}));

export default function OrganizationHome(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { basicInfos, navBar } = props;

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMoreItem, setHasMoreItem] = useState(true);
  const currentPage = useRef(1);
  const div = useRef();

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
    initialLoad();
  }, []);

  const getOrganizationPostFeed = async () => {
    const { status, data } = await api(
      formatRoute('/api/posts/organizationFeed', null, {
        organizationId: basicInfos.id,
        currentPage: currentPage.current,
        perPage: 5,
      })
    );

    if (status === STATUS_ENUM.ERROR) {
      return;
    }

    if (data && data.length) {
      setPosts((posts) => [...posts, ...data]);
    } else {
      setHasMoreItem(false);
    }
  };

  const initialLoad = async () => {
    await getOrganizationPostFeed();
    setIsLoading(false);
  };

  return (
    <>
      <HeaderHome basicInfos={basicInfos} navTabs={navBar} />
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
        <div>
          <PostInput />
          {posts.map((post) => (
            <CustomCard items={{ postInfo: post }} type={CARD_TYPE_ENUM.POST} key={post.id} />
          ))}
        </div>
      </IgContainer>
    </>
  );
}
