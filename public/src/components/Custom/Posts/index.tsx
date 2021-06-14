import React, { useEffect, useState, useRef } from 'react';
import { ACTION_ENUM, Store } from '../../../Store';
import CustomCard from '../Card';
import api from '../../../actions/api';
import PostInput from '../Input/PostInput';
import CustomPaper from '../Paper';
import { makeStyles } from '@material-ui/core/styles';
import { formatRoute } from '../../../utils/stringFormats';
import Button from '@material-ui/core/Button';
import { uploadPicture } from '../../../actions/aws';
import { useTranslation } from 'react-i18next';
import { STATUS_ENUM, CARD_TYPE_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { useWindowSize } from '../../../hooks/window';
import { Post, User } from '../../../../../typescript/types';

interface IProps {
  userInfo: User;
  allowNewPost: boolean;
  allowPostImage: boolean;
  entityIdCreatePost: string | number;
  allowComment: boolean;
  allowLike: boolean;
  locationId: string;
  elevation: number;
  placeholder: string;
}

const Posts: React.FunctionComponent<IProps> = (props) => {
  const [width] = useWindowSize();

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
      right: theme.spacing(2) + (width - 700) / 2,
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
  const { t } = useTranslation();

  const {
    allowNewPost,
    allowPostImage,
    entityIdCreatePost,
    allowComment,
    allowLike,
    locationId,
    elevation,
    placeholder,
  } = props;
  const {
    dispatch,
    state: { userInfo },
  } = React.useContext(Store);
  const classes = useStyles();

  const [posts, setPosts] = useState<Post[]>([]);
  const currentPage = useRef<any>(1);
  const [isMore, setIsMore] = useState<boolean>(true);

  useEffect((): void => {
    if (userInfo?.primaryPerson?.personId) {
      getPostFeed();
    }
  }, [userInfo?.primaryPerson?.personId]);

  const getPostFeed = async (): Promise<void> => {
    const { status, data } = await api(
      formatRoute('/api/posts', null, {
        userId: userInfo?.primaryPerson?.personId || -1,
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

    setPosts((posts) => [...posts, ...data.filter((post: Post) => posts.findIndex((t) => t.id === post.id) === -1)]);
  };

  const loadMorePost = async (): Promise<void> => {
    currentPage.current += 1;
    await getPostFeed();
  };

  const handleLike = async (postId: string, entityId: string, like: boolean): Promise<void> => {
    const apiRoute = like ? '/api/posts/like' : '/api/posts/unlike';

    const { data } = await api(apiRoute, {
      method: 'POST',
      body: JSON.stringify({
        entityId,
        postId,
      }),
    });

    if (!data) {
      return;
    }
    setPosts((oldPosts) => oldPosts.map((o) => (o.id === postId ? data : o)));
  };

  const handleComment = async (
    entityId: string,
    postContent: string,
    images: string,
    postId: string
  ): Promise<void> => {
    const { data } = await api('/api/posts/comment', {
      method: 'POST',
      body: JSON.stringify({
        entityId,
        postId,
        content: encodeURIComponent(postContent),
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

    setPosts((oldPosts) => oldPosts.map((o) => (o.id === postId ? data : o)));
  };

  const handleDeletePost = async (postId: string): Promise<void> => {
    const { status } = await api(
      formatRoute('/api/posts/deletePost', null, {
        postId,
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
    setPosts((oldPosts) => oldPosts.filter((o) => o.id !== postId));
    await getPostFeed();
  };

  const handleDeleteComment = async (commentId: string): Promise<void> => {
    const { status } = await api(
      formatRoute('/api/posts/comment', null, {
        commentId,
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
    await getPostFeed();
  };

  const handleEditComment = async (commentId: string, commentContent: string): Promise<void> => {
    await api('/api/posts/comment', {
      method: 'PUT',
      body: JSON.stringify({
        commentId: encodeURIComponent(commentId),
        commentContent,
      }),
    });
  };

  const handlePost = async (entityId: string, postContent: string, images: any): Promise<void> => {
    const { data: newPost } = await api('/api/posts/create', {
      method: 'POST',
      body: JSON.stringify({
        content: encodeURIComponent(postContent),
        locationId,
        entity_id: entityId,
      }),
    });
    console.log({ newPost });

    if (!images.length) {
      setPosts((posts) => [newPost, ...posts]);
      return;
    }

    await Promise.all(
      images.map(async (image: any) => {
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

  const handleEditPost = async (postId: string, postContent: string, images: any): Promise<void> => {
    await api('/api/posts', {
      method: 'PUT',
      body: JSON.stringify({
        postId,
        postContent,
      }),
    });

    if (!images.length) {
      return;
    }

    await Promise.all(
      images.map(async (image: any) => {
        let url;
        if (image.image_url) {
          url = image.image_url;
        } else {
          const { file } = image;
          url = await uploadPicture(postId, file);
        }
        await api('/api/posts/image', {
          method: 'POST',
          body: JSON.stringify({
            postId,
            imageUrl: url,
          }),
        });
      })
    );
  };

  return (
    <div>
      <div>
        {allowNewPost && entityIdCreatePost != -1 && (
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
          <>
            {post ? (
              <CustomCard
                items={{
                  postInfo: post,
                  handleLike,
                  handleComment,
                  handleDeletePost,
                  handleEditPost,
                  handleEditComment,
                  handleDeleteComment,
                  allowComment,
                  allowLike,
                  elevation,
                  entityId: userInfo?.primaryPerson?.personId,
                  isAdmin: entityIdCreatePost === post.entityId && allowNewPost,
                }}
                type={CARD_TYPE_ENUM.POST}
                key={post.id}
              />
            ) : (
              <></>
            )}
          </>
        ))}
      </div>
      {isMore && <Button onClick={loadMorePost}>{t('show_more')}</Button>}
    </div>
  );
};
export default Posts;
