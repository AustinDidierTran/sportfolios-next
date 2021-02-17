import React, { useEffect, useState, useRef, useContext } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import Icon from '../../../components/Custom/Icon';
import HeaderHome from '../../../components/Custom/HeaderHome';
import { ENTITIES_ROLE_ENUM, STATUS_ENUM, CARD_TYPE_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import PostInput from '../../../components/Custom/Input/PostInput';
import { formatRoute } from '../../../../common/utils/stringFormat';
import { Store } from '../../../Store';
import CustomCard from '../../../components/Custom/Card';
import api from '../../../actions/api';
import Tooltip from '@material-ui/core/Tooltip';
import { uploadPicture } from '../../../actions/aws';
import Fab from '@material-ui/core/Fab';
import CustomPaper from '../../../components/Custom/Paper';

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

  const [posts, setPosts] = useState([]);
  const currentPage = useRef(1);

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
    initialLoad();
  }, []);
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  const getOrganizationPostFeed = async () => {
    const { status, data } = await api(
      formatRoute('/api/posts/organizationFeed', null, {
        userId: userInfo.primaryPerson.entity_id,
        organizationId: basicInfos.id,
        currentPage: currentPage.current,
        perPage: 5,
      })
    );

    if (status === STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('something_went_wrong'),
        severity: SEVERITY_ENUM.ERROR,
      });
      return;
    }

    if (!data || !data.length) {
      return;
    }

    setPosts((posts) => [...posts, ...data]);
  };

  const initialLoad = async () => {
    await getOrganizationPostFeed();
  };

  const handleLike = async (postId, entityId, like) => {
    const apiRoute = like ? '/api/posts/like' : '/api/posts/unlike';

    const { data, status } = await api(apiRoute, {
      method: 'POST',
      body: JSON.stringify({
        entityId,
        postId,
      }),
    });

    if (!data) {
      return;
    }
    let oldPosts = posts;
    setPosts((oldPosts) => oldPosts.map((o) => (o.id === postId ? data : o)));
  };

  const handleComment = async (entityId, postContent, images, post_id) => {
    const { status, data } = await api('/api/posts/comment', {
      method: 'POST',
      body: JSON.stringify({
        entityId,
        postId: post_id,
        content: postContent,
      }),
    });
    if (!data) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('something_went_wrong'),
        severity: SEVERITY_ENUM.ERROR,
      });
      return;
    }

    let oldPosts = posts;
    setPosts((oldPosts) => oldPosts.map((o) => (o.id === post_id ? data : o)));
  };

  const handlePost = async (entityId, postContent, images, post_id) => {
    const { data: newPostId } = await api('/api/posts/create', {
      method: 'POST',
      body: JSON.stringify({
        content: postContent,
        entity_id: entityId,
      }),
    });

    if (!images.length) {
      return;
    }

    Promise.all(
      images.map(async (image) => {
        const { file } = image;
        const url = await uploadPicture(newPostId, file);
        await api('/api/posts/image', {
          method: 'POST',
          body: JSON.stringify({
            postId: newPostId,
            imageUrl: url,
          }),
        });
      })
    );
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
          <CustomPaper className={classes.createPost}>
            <PostInput
              entityId={basicInfos.id}
              handlePost={handlePost}
              canAddImage={true}
              placeholder={t('start_a_post')}
            />
          </CustomPaper>
          {posts.map((post) => (
            <CustomCard
              items={{ postInfo: post, handleLike, handleComment, entityId: basicInfos.id }}
              type={CARD_TYPE_ENUM.POST}
              key={post.id}
            />
          ))}
        </div>
      </IgContainer>
    </>
  );
}
