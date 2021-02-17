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

export default function Post(props) {
  const { postInfo, handleLike, entityId, handleComment } = props;
  const { t } = useTranslation();
  const [displayComment, setDisplayComment] = useState(false);

  const handleVisitProfile = (e) => {
    e.preventDefault();
    Router.push(postInfo.entity_id);
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

  const onClickComment = () => {
    setDisplayComment((displayComment) => !displayComment);
  };

  const showStats = useMemo(() => postInfo.likes.length > 0 || postInfo.comments.length > 0, [
    postInfo.likes.length,
    postInfo.comments.length,
  ]);

  return (
    <Card className={styles.card}>
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
          <IconButton aria-label="settings">
            <MoreHorizIcon />
          </IconButton>
        }
        title={postInfo.name + ' ' + postInfo.surname}
        subheader={getTimeToShow(postInfo.created_at)}
      />
      <CardContent className={styles.content}>{postInfo.content}</CardContent>
      {postInfo.images.length > 0 && <CardMedia className={styles.media} image={postInfo.images[0].image_url} />}
      {showStats && (
        <CardContent className={styles.postStats}>
          <div className={styles.likes}>
            {postInfo.likes.length > 0 && (
              <div>
                <CustomIcon icon="FavoriteIcon" color="rgb(24, 179, 147)" fontSize={'small'} />
                <Typography className={styles.likesText}>{postInfo.likes.length}</Typography>
              </div>
            )}
          </div>
          <div className={styles.comments}>
            {postInfo.comments.length > 0 && (
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
        <Button
          onClick={onClickLike}
          startIcon={<CustomIcon icon="ThumbUpAltOutlinedIcon" color={postInfo.liked ? 'rgb(24, 179, 147)' : ''} />}
          size="small"
          className={styles.actionsButton}
          color={postInfo.liked ? 'primary' : 'default'}
        >
          {t('like')}
        </Button>
        <Button
          onClick={onClickComment}
          startIcon={<CustomIcon icon="ChatBubbleOutlineOutlinedIcon" />}
          size="small"
          className={styles.actionsButton}
        >
          {t('comment')}
        </Button>
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
        </div>
      )}
    </Card>
  );
}
