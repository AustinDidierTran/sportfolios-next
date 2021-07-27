import React, { useState, useContext, useMemo, useEffect } from 'react';

import CustomIcon from '../../Icon';
import CustomButton from '../../Button';
import CustomAvatar from '../../Avatar';
import CustomIconButton from '../../IconButton';
import AlertDialog from '../../Dialog/AlertDialog';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import styles from './Post.module.css';
import { useTranslation } from 'react-i18next';
import { SEVERITY_ENUM } from '../../../../../common/enums';
import { ACTION_ENUM, Store } from '../../../../Store';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { useRouter } from 'next/router';
import Upload from 'rc-upload';
import dynamic from 'next/dynamic';
import { Post as PostType, Comment as CommentType, PostImage } from '../../../../../../typescript/types';
import { getTimeToShow } from '../../../../utils/stringFormats';

const Comment = dynamic(() => import('../Comment'));
const PostInput = dynamic(() => import('../../Input/PostInput'));

interface IProps {
  postInfo: PostType;
  entityId: string;
  isAdmin: boolean;
  handleEditComment: () => void;
  handleComment: () => void;
  handleDeleteComment: (commentId: string) => void;
  handleDeletePost: (id: string) => void;
  handleEditPost: (id: string, content: string, images: any) => void;
  handleLike: (id: string, personId: string, liked: boolean) => void;
  allowComment: boolean;
  allowLike: boolean;
  elevation: number;
}

const Post: React.FunctionComponent<IProps> = (props) => {
  const {
    postInfo,
    handleLike,
    entityId,
    handleComment,
    handleDeletePost,
    handleEditPost,
    isAdmin,
    allowComment,
    allowLike,
    elevation,
    handleEditComment,
    handleDeleteComment,
  } = props;

  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const router = useRouter();

  const [openToLogin, setOpenToLogin] = useState<boolean>(false);
  const [displayComment, setDisplayComment] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [edit, setEdit] = useState<boolean>(false);

  const [editPostContent, setEditPostContent] = useState<string>(decodeURIComponent(postInfo.content));
  const [editImages, setEditImages] = useState<any>(postInfo.images);
  const [postContent, setPostContent] = useState<string>(decodeURIComponent(postInfo.content));
  const [images, setImages] = useState<PostImage[]>(postInfo.images);
  const [comments, setComments] = useState<CommentType[]>(postInfo.comments);

  useEffect((): void => {
    setComments(postInfo.comments);
  }, [postInfo.comments]);

  const handleClick = (event: any): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const goToLogin = (): void => {
    const redirectUrl = encodeURIComponent(router.asPath);
    goTo(ROUTES.login, null, { redirectUrl });
  };

  const onOpenToLoggin = (): void => {
    setOpenToLogin(true);
  };

  const onCloseToLoggin = (): void => {
    setOpenToLogin(false);
  };

  const {
    state: { userInfo },
  } = useContext(Store);

  const clearImage = (): void => {
    setEditImages([]);
  };

  const uploadImageProps = {
    multiple: false,
    accept: '.jpg, .png, .jpeg, .gif, .webp',
    onStart(file: any) {
      if (file.type.split('/')[0] === 'image') {
        setEditImages(() => [
          {
            file,
          },
        ]);
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  };

  const handleChange = (event: any): void => {
    setEditPostContent(event.target.value);
  };

  const onClickLike = async (e: any): Promise<void> => {
    e.preventDefault();
    handleLike(postInfo.id, userInfo.primaryPerson.personId, !postInfo.liked);
  };

  const onClickDelete = async (): Promise<void> => {
    handleDeletePost(postInfo.id);
  };

  const onClickComment = (): void => {
    setDisplayComment((displayComment) => !displayComment && allowComment);
  };

  const onClickEdit = (): void => {
    setEdit(true);
    handleClose();
  };

  const modifyPost = (): void => {
    handleEditPost(postInfo.id, encodeURIComponent(editPostContent), editImages);
    setPostContent(decodeURIComponent(editPostContent));
    setImages(editImages);
    setEdit(false);
  };

  const onClickDeleteComment = (commentId: string): void => {
    handleDeleteComment(commentId);
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  const cancelEdit = (): void => {
    setEditPostContent(decodeURIComponent(postContent));
    setEditImages(images);
    setEdit(false);
  };

  const showStats = useMemo(
    (): boolean => (postInfo.likes.length > 0 || comments.length > 0) && (allowComment || allowLike),
    [postInfo.likes.length, comments.length, allowComment, allowLike]
  );

  if (edit) {
    return (
      <Card elevation={elevation} className={styles.card}>
        <CardHeader
          className={styles.header}
          classes={{
            content: styles.headerContent,
            title: styles.headerTitle,
          }}
          avatar={<CustomAvatar aria-label="recipe" className={styles.avatar} photoUrl={postInfo.photoUrl} />}
          title={postInfo.name + ' ' + postInfo.surname}
          subheader={getTimeToShow(postInfo.createdAt)}
        />
        <div>
          <div className={styles.divRoot}>
            <TextField
              placeholder=""
              className={styles.textField}
              multiline
              rowsMax={Infinity}
              value={editPostContent}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <div style={{ display: 'flex' }}>
                    <Upload {...uploadImageProps}>
                      <CustomIconButton icon="ImageOutlinedIcon" className={styles.uploadIcon} />
                    </Upload>
                  </div>
                ),
              }}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          {editImages.map((image: any, index: number) => (
            <div className={styles.divImage} key={index}>
              <CustomIconButton
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRaduis: 25,
                  padding: 2,
                  margin: 5,
                }}
                icon="Clear"
                onClick={clearImage}
              />
              <img
                className={styles.imagePreview}
                src={image.imageUrl ? image.imageUrl : URL.createObjectURL(image.file)}
              />
            </div>
          ))}
        </div>
        <div className={styles.editButtons}>
          <CustomButton color="secondary" className={styles.cancelButton} onClick={cancelEdit}>
            {t('cancel')}
          </CustomButton>
          <CustomButton onClick={modifyPost}>{t('edit.edit')}</CustomButton>
        </div>
      </Card>
    );
  }

  return (
    <Card elevation={elevation} className={styles.card}>
      <CardHeader
        className={styles.header}
        classes={{
          content: styles.headerContent,
          title: styles.headerTitle,
        }}
        avatar={<CustomAvatar aria-label="recipe" className={styles.avatar} photoUrl={postInfo.photoUrl} />}
        action={
          <>
            {isAdmin && (
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreHorizIcon />
              </IconButton>
            )}
          </>
        }
        title={postInfo.name + ' ' + postInfo.surname}
        subheader={getTimeToShow(postInfo.createdAt)}
      />
      <CardContent className={styles.content}>
        <TextareaAutosize className={styles.textarea} value={postContent} disabled />
      </CardContent>
      {images.length > 0 && (
        <div>
          <CardMedia component="img" image={images[0].imageUrl} />
        </div>
      )}
      {showStats && (
        <CardContent className={styles.postStats}>
          <div className={styles.likes}>
            {postInfo.likes.length > 0 && allowLike && (
              <div>
                <CustomIcon icon="FavoriteIcon" color="rgb(24, 179, 147)" />
                <Typography className={styles.likesText}>{postInfo.likes.length}</Typography>
              </div>
            )}
          </div>
          <div className={styles.comments}>
            {comments.length > 0 && allowComment && (
              <div onClick={onClickComment}>
                {comments.length > 1
                  ? t('comment_plural', { count: comments.length })
                  : t('comment_singular', { count: comments.length })}
              </div>
            )}
          </div>
        </CardContent>
      )}
      {(postInfo.images.length < 1 || showStats) && <Divider variant="middle" />}
      <CardActions className={styles.actions}>
        {allowLike && (
          <Button
            onClick={entityId ? onClickLike : onOpenToLoggin}
            startIcon={<CustomIcon icon="FavoriteBorderIcon" color={postInfo.liked ? 'rgb(24, 179, 147)' : ''} />}
            size="small"
            className={styles.actionsButton}
            color={postInfo.liked ? 'primary' : 'default'}
          >
            {t('like')}
          </Button>
        )}
        {allowComment && (
          <Button
            onClick={entityId ? onClickComment : onOpenToLoggin}
            startIcon={<CustomIcon icon="ChatBubbleOutlineOutlinedIcon" />}
            size="small"
            className={styles.actionsButton}
          >
            {t('comment')}
          </Button>
        )}
      </CardActions>
      <Divider variant="middle" />
      {displayComment && (
        <div className={styles.contentComment}>
          {entityId && (
            <PostInput
              entityId={entityId}
              handlePost={handleComment}
              canAddImage={false}
              postId={postInfo.id}
              placeholder={t('write_a_comment')}
            />
          )}

          {comments.map((comment, index) => (
            <Comment
              key={index}
              commentId={comment.id}
              commentContent={comment.content}
              commentDate={getTimeToShow(comment.createdAt)}
              commentPhotoUrl={comment.photoUrl}
              commentFullName={comment.name + ' ' + comment.surname}
              handleEditComment={handleEditComment}
              handleDeleteComment={onClickDeleteComment}
              isAdmin={entityId === comment.entityId}
            />
          ))}
          {elevation === 0 && <Divider className={styles.dividerComment} />}
        </div>
      )}
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onClickDelete}>{t('delete.delete')}</MenuItem>
        <MenuItem onClick={onClickEdit}>{t('edit.edit')}</MenuItem>
      </Menu>
      <AlertDialog
        open={openToLogin}
        title={t('login_to_continue')}
        onCancel={onCloseToLoggin}
        onSubmit={goToLogin}
        onSubmitText={t('login')}
      />
    </Card>
  );
};
export default Post;
