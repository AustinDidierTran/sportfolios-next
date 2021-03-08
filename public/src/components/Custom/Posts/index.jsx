import React, { useEffect, useState, useRef } from 'react';
import { Store } from '../../../Store';
import CustomCard from '../Card';
import api from '../../../actions/api';
import PostInput from '../Input/PostInput';
import CustomPaper from '../Paper';
import { makeStyles } from '@material-ui/core/styles';
import { formatRoute } from '../../../../common/utils/stringFormat';
import Button from '@material-ui/core/Button';
import { uploadPicture } from '../../../actions/aws';
import { useTranslation } from 'react-i18next';
import { STATUS_ENUM, CARD_TYPE_ENUM } from '../../../../common/enums';

import styles from './Posts.module.css';

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

export default function Posts(props) {
  const { t } = useTranslation();

  const {
    userInfo,
    allowNewPost,
    allowPostImage,
    entityIdCreatePost,
    allowComment,
    allowLike,
    locationId,
    elevation,
    placeholder,
  } = props;
  const { dispatch } = React.useContext(Store);
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const currentPage = useRef(1);
  const [isMore, setIsMore] = useState(true);

  useEffect(() => {
    initialLoad();
  }, []);

  const getPostFeed = async () => {
    const { status, data } = await api(
      formatRoute('/api/posts', null, {
        userId: userInfo?.primaryPerson?.entity_id,
        locationId,
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
      setIsMore(false);
      return;
    }

    setPosts((posts) => [...posts, ...data.filter((post) => posts.findIndex((t) => t.id === post.id) === -1)]);
  };
  const initialLoad = async () => {
    await getPostFeed();
  };

  const loadMorePost = async () => {
    currentPage.current += 1;
    await getPostFeed();
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

  const handleDeletePost = async (post_id) => {
    const { status } = await api(
      formatRoute('/api/posts/deletePost', null, {
        postId: post_id,
      }),
      {
        method: 'DELETE',
      }
    );
    if (!status) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t(ERROR_ENUM.ERROR_OCCURED),
        severity: SEVERITY_ENUM.ERROR,
      });
      return;
    }
    let oldPosts = posts;
    setPosts((oldPosts) => oldPosts.filter((o) => o.id !== post_id));
    await getPostFeed();
  };
  const handlePost = async (entityId, postContent, images, post_id) => {
    const { data: newPost } = await api('/api/posts/create', {
      method: 'POST',
      body: JSON.stringify({
        content: postContent,
        locationId,
        entity_id: entityId,
      }),
    });

    if (!images.length) {
      setPosts((posts) => [newPost, ...posts]);
      return;
    }

    await Promise.all(
      images.map(async (image) => {
        const { file } = image;
        const url = await uploadPicture(newPost.id, file);
        const { data: newImages } = await api('/api/posts/image', {
          method: 'POST',
          body: JSON.stringify({
            postId: newPost.id,
            imageUrl: url,
          }),
        });
        newPost.images = newImages;
      })
    ).then(() => {
      setPosts((posts) => [newPost, ...posts]);
    });
  };

  return (
    <div>
      <div>
        {allowNewPost && entityIdCreatePost != 0 && (
          <CustomPaper elevation={elevation} className={classes.createPost}>
            <PostInput
              entityId={entityIdCreatePost}
              handlePost={handlePost}
              canAddImage={allowPostImage}
              placeholder={placeholder}
            />
          </CustomPaper>
        )}
        {posts.map((post) => (
          <CustomCard
            items={{
              postInfo: post,
              handleLike,
              handleComment,
              handleDeletePost,
              allowComment,
              allowLike,
              elevation,
              entityId: userInfo?.primaryPerson?.entity_id,
              isAdmin: entityIdCreatePost === post.entity_id && allowNewPost,
            }}
            type={CARD_TYPE_ENUM.POST}
            key={post.id}
          />
        ))}
      </div>
      {isMore && <Button onClick={loadMorePost}>{t('show_more')}</Button>}
    </div>
  );
}
