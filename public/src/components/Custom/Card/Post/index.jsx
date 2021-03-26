import React, { useState, useContext, useMemo, useEffect } from 'react';

import CustomIcon from '../../Icon';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CustomCard from '../index'
import { CARD_TYPE_ENUM } from '../../../../../common/enums';
import styles from './Post.module.css';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CustomAvatar from '../../Avatar';
import { Store } from '../../../../Store';
import Typography from '@material-ui/core/Typography';
import PostInput from '../../Input/PostInput';
import CardMedia from '@material-ui/core/CardMedia';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Upload from 'rc-upload';
import CustomIconButton from '../../IconButton';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CustomButton from '../../Button'

export default function Post(props) {
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
  const [displayComment, setDisplayComment] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [edit, setEdit] = useState(false);

  const [editPostContent, setEditPostContent] = useState(decodeURIComponent(postInfo.content));
  const [editImages, setEditImages] = useState(postInfo.images);
  const [postContent, setPostContent] = useState(decodeURIComponent(postInfo.content));
  const [images, setImages] = useState(postInfo.images);

  const [comments, setComments] = useState(postInfo.comments);
  useEffect(() => {
    setComments(postInfo.comments)
  }, [postInfo.comments]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    state: { userInfo },
  } = useContext(Store);

  const getTimeToShow = (date) => {
    const newDate = new Date(date);
    const deltaTime = Math.floor(Math.abs(new Date() - newDate) / 1000 / 86400);
    if (deltaTime < 1) {
      return moment(newDate).fromNow();
    } else if (deltaTime > 1 && deltaTime < moment(newDate).daysInMonth()) {
      return moment(newDate).format('DD MMMM, HH:mm');
    } else if (deltaTime == 1) {
      return t('yesterday_at', { date_time: moment(newDate).format('HH:mm') });
    } else {
      return moment(newDate).format('DD MMMM YYYY');
    }
  };

  const clearImage = () => {
    setEditImages([]);
  };

  const uploadImageProps = {
    multiple: false,
    accept: '.jpg, .png, .jpeg, .gif, .webp',
    onStart(file) {
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

  const handleChange = (event) => {
    setEditPostContent(event.target.value);
  };

  const onClickLike = async (e) => {
    e.preventDefault();
    handleLike(postInfo.id, userInfo.primaryPerson.entity_id, !postInfo.liked);
  };

  const onClickDelete = async () => {
    handleDeletePost(postInfo.id);
  };

  const onClickComment = () => {
    setDisplayComment((displayComment) => !displayComment && allowComment);
  };

  const onClickEdit = () => {
    setEdit(true);
    handleClose();
  }

  const modifyPost = () => {
    handleEditPost(postInfo.id, encodeURIComponent(editPostContent), editImages);
    setPostContent(decodeURIComponent(editPostContent));
    setImages(editImages);
    setEdit(false);

  }

  const onClickDeleteComment = (commentId) => {
    handleDeleteComment(commentId);
    setComments(comments.filter((comment) => comment.id !== commentId));
  }

  const cancelEdit = () => {
    setEditPostContent(decodeURIComponent(postContent));
    setEditImages(images);
    setEdit(false);
  }

  const showStats = useMemo(
    () => (postInfo.likes.length > 0 || comments.length > 0) && (allowComment || allowLike),
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
          avatar={
            <CustomAvatar aria-label="recipe" className={styles.avatar} photoUrl={postInfo.photo_url}></CustomAvatar>
          }

          title={postInfo.name + ' ' + postInfo.surname}
          subheader={getTimeToShow(postInfo.created_at)}
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
          {editImages.map((image, index) => (
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
              <img className={styles.imagePreview} src={image.image_url ? image.image_url : URL.createObjectURL(image.file)} />
            </div>
          ))}
        </div>
        <div className={styles.editButtons}>
          <CustomButton
            color="secondary"
            className={styles.cancelButton}
            onClick={cancelEdit}>
            {t('cancel')}
          </CustomButton>
          <CustomButton
            onClick={modifyPost}>
            {t('edit.edit')}
          </CustomButton>
        </div>
      </Card>
    )
  }

  return (
    <Card elevation={elevation} className={styles.card}>
      <CardHeader
        className={styles.header}
        classes={{
          content: styles.headerContent,
          title: styles.headerTitle,
        }}
        avatar={
          <CustomAvatar aria-label="recipe" className={styles.avatar} photoUrl={postInfo.photo_url}></CustomAvatar>
        }
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
        subheader={getTimeToShow(postInfo.created_at)}
      />
      <CardContent className={styles.content}>
        <TextareaAutosize className={styles.textarea} value={postContent} disabled />
      </CardContent>
      {images.length > 0 && (
        <div>
          <CardMedia component="img" image={images[0].image_url} />
        </div>
      )}
      {showStats && (
        <CardContent className={styles.postStats}>
          <div className={styles.likes}>
            {postInfo.likes.length > 0 && allowLike && (
              <div>
                <CustomIcon icon="FavoriteIcon" color="rgb(24, 179, 147)" fontSize={'small'} />
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
          <div className={styles.share}></div>
        </CardContent>
      )}
      {(postInfo.images.length < 1 || showStats) && <Divider variant="middle" />}
      <CardActions className={styles.actions}>
        {allowLike && (
          <Button
            onClick={onClickLike}
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
            onClick={onClickComment}
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
          <PostInput
            entityId={entityId}
            handlePost={handleComment}
            canAddImage={false}
            postId={postInfo.id}
            placeholder={t('write_a_comment')}
          />

          {comments.map((comment, index) => (
            <CustomCard
              items={{
                commentId: comment.id,
                commentContent: comment.content,
                commentDate: getTimeToShow(comment.created_at),
                commentPhotoUrl: comment.photo_url,
                commentFullName: comment.name + ' ' + comment.surname,
                handleEditComment,
                handleDeleteComment: onClickDeleteComment,
                isAdmin: entityId === comment.entity_id,
              }}
              type={CARD_TYPE_ENUM.COMMENT}
              key={index}
            />

          ))}
          {elevation === 0 && <Divider className={styles.dividerComment} />}
        </div>
      )}
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onClickDelete}>{t('delete.delete')}</MenuItem>
        <MenuItem onClick={onClickEdit}>{t('edit.edit')}</MenuItem>
      </Menu>
    </Card>
  );
}
