import React, { useState, useEffect } from 'react';

import Card from '@material-ui/core/Card';

import styles from './Comment.module.css';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useTranslation } from 'react-i18next';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CustomAvatar from '../../Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import AlertDialog from '../../Dialog/AlertDialog';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

interface IProps {
  commentId: string;
  commentContent: string;
  commentDate: string;
  commentPhotoUrl: string;
  commentFullName: string;
  handleEditComment: (commentId: string, editCommentContent: string) => void;
  handleDeleteComment: (commentId: string) => void;
  isAdmin: boolean;
  commentVerifiedAt: string;
}

const Comment: React.FunctionComponent<IProps> = (props) => {
  const {
    commentId,
    commentContent: content,
    commentDate,
    commentPhotoUrl,
    commentFullName,
    handleEditComment,
    handleDeleteComment,
    isAdmin,
    commentVerifiedAt,
  } = props;

  const modifyComment = (): void => {
    if (editCommentContent === '') {
      setOpenAlert(true);
      return;
    }
    handleEditComment(commentId, editCommentContent);
    setCommentContent(decodeURIComponent(editCommentContent));
    setEdit(false);
  };

  const cancelEdit = (): void => {
    setEditCommentContent(decodeURIComponent(commentContent));
    setEdit(false);
  };

  const { t } = useTranslation();
  const [edit, setEdit] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [editCommentContent, setEditCommentContent] = useState<string>(decodeURIComponent(content));
  const [commentContent, setCommentContent] = useState<string>(decodeURIComponent(content));

  useEffect((): void => {
    setCommentContent(decodeURIComponent(content));
    setEditCommentContent(decodeURIComponent(content));
  }, [content]);

  const handleClick = (event: any): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const onClickDelete = (): void => {
    handleDeleteComment(commentId);
    handleClose();
  };

  const onClickEdit = (): void => {
    setEdit(true);
    handleClose();
  };

  const handleChange = (event: any): void => {
    setEditCommentContent(event.target.value);
  };

  if (edit) {
    return (
      <Card elevation={0}>
        <CardHeader
          className={styles.headerComment}
          classes={{
            content: styles.headerCommentContentEdit,
            title: styles.headerTitle,
            avatar: styles.avatarComment,
            subheader: styles.subheaderComment,
            action: styles.headerAction,
          }}
          avatar={<CustomAvatar className={styles.avatarComment} photoUrl={commentPhotoUrl} />}
          subheader={
            <TextField
              placeholder=""
              className={styles.textField}
              multiline
              value={editCommentContent}
              rowsMax={Infinity}
              InputProps={{
                disableUnderline: true,
              }}
              onChange={handleChange}
            />
          }
        />
        <CardContent className={styles.dateComment}>
          <div className={styles.displayFlex}>
            <div className={styles.commentSave} onClick={modifyComment}>
              {t('save')}
            </div>
            <div className={styles.commentCancel} onClick={cancelEdit}>
              {t('cancel')}
            </div>
          </div>
        </CardContent>
        <AlertDialog
          open={openAlert}
          onCancel={() => {
            setOpenAlert(false);
          }}
          title={t('delete.delete_comment_confirmation')}
          onSubmit={() => {
            setEdit(false);
            onClickDelete();
            setOpenAlert(false);
          }}
        />
      </Card>
    );
  }

  return (
    <Card elevation={0}>
      <CardHeader
        className={styles.headerComment}
        classes={{
          content: styles.headerCommentContent,
          avatar: styles.avatarComment,
          subheader: styles.subheaderComment,
          action: styles.headerAction,
        }}
        avatar={<CustomAvatar className={styles.avatarComment} photoUrl={commentPhotoUrl} />}
        action={
          <>
            {isAdmin && (
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreHorizIcon />
              </IconButton>
            )}
          </>
        }
        title={
          <Typography variant="body2" className={styles.headerTitle}>
            {commentFullName}
            {commentVerifiedAt ? <CheckCircleIcon className={styles.verified} /> : <></>}
          </Typography>
        }
        subheader={commentContent}
      />
      <CardContent className={styles.dateComment}>{commentDate}</CardContent>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onClickEdit}>{t('edit.edit')}</MenuItem>
        <MenuItem onClick={onClickDelete}>{t('delete.delete')}</MenuItem>
      </Menu>
    </Card>
  );
};
export default Comment;
