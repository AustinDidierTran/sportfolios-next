import React, { useState, useContext, useMemo } from 'react';

import CustomIcon from '../../Icon';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

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

export default function Post(props) {
  const {
    postInfo,
    handleLike,
    entityId,
    handleComment,
    handleDeletePost,
    isAdmin,
    allowComment,
    allowLike,
    elevation,
  } = props;
  const { t } = useTranslation();
  const [displayComment, setDisplayComment] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
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

  const showStats = useMemo(
    () => (postInfo.likes.length > 0 || postInfo.comments.length > 0) && (allowComment || allowLike),
    [postInfo.likes.length, postInfo.comments.length, allowComment, allowLike]
  );

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
      <CardContent className={styles.content}>{postInfo.content}</CardContent>
      {postInfo.images.length > 0 && (
        <div>
          <CardMedia component="img" image={postInfo.images[0].image_url} />
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
            {postInfo.comments.length > 0 && allowComment && (
              <div onClick={onClickComment}>
                {postInfo.comments.length > 1
                  ? t('comment_plural', { count: postInfo.comments.length })
                  : t('comment_singular', { count: postInfo.comments.length })}
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

          {postInfo.comments.map((comment) => (
            <Card elevation={0}>
              <CardHeader
                className={styles.headerComment}
                classes={{
                  content: styles.headerCommentContent,
                  title: styles.headerTitle,
                  avatar: styles.avatarComment,
                  subheader: styles.subheaderComment,
                  action: styles.headerAction,
                }}
                avatar={<CustomAvatar className={styles.avatarComment} photoUrl={comment.photo_url}></CustomAvatar>}
                action={
                  <IconButton aria-label="settings">
                    <MoreHorizIcon />
                  </IconButton>
                }
                title={comment.name + ' ' + comment.surname}
                subheader={comment.content}
              />
              <CardContent className={styles.dateComment}>{getTimeToShow(comment.created_at)}</CardContent>
            </Card>
          ))}
          {elevation === 0 && <Divider className={styles.dividerComment} />}
        </div>
      )}
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onClickDelete}>{t('delete.delete')}</MenuItem>
      </Menu>
    </Card>
  );
}
