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
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
export default function Comment(props) {
  const {
    index,
    commentId,
    commentContent: content,
    commentDate,
    commentPhotoUrl,
    commentFullName,
    handleEditComment,
    handleDeleteComment,
    isAdmin,
  } = props;

  const modifyComment = () => {
    handleEditComment(commentId, editCommentContent);
    setCommentContent(decodeURIComponent(editCommentContent));
    setEdit(false);
  }

  const cancelEdit = () => {
    setEditCommentContent(decodeURIComponent(editCommentContent));
    setEdit(false);
  }

  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState(decodeURIComponent(content));
  const [commentContent, setCommentContent] = useState(decodeURIComponent(content));

  useEffect(() => {
    setCommentContent(decodeURIComponent(content));
  }, [content])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickDelete = () => {
    handleDeleteComment(commentId);
    handleClose();
  }

  const onClickEdit = () => {
    setEdit(true);
    handleClose();
  }

  const handleChange = (event) => {
    setEditCommentContent(event.target.value);
  }


  if (edit) {
    return (
      <Card elevation={0} key={index}>
        <CardHeader
          className={styles.headerComment}
          classes={{
            content: styles.headerCommentContentEdit,
            title: styles.headerTitle,
            avatar: styles.avatarComment,
            subheader: styles.subheaderComment,
            action: styles.headerAction,
          }}
          avatar={<CustomAvatar className={styles.avatarComment} photoUrl={commentPhotoUrl}></CustomAvatar>}

          subheader={(
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

          )}
        />
        <CardContent className={styles.dateComment}><div className={styles.displayFlex}><div className={styles.commentSave} onClick={modifyComment}>{t('save')}</div><div className={styles.commentCancel} onClick={cancelEdit}>{t('cancel')}</div></div></CardContent>
      </Card>
    )
  }

  return (
    <Card elevation={0} key={index}>
      <CardHeader
        className={styles.headerComment}
        classes={{
          content: styles.headerCommentContent,
          title: styles.headerTitle,
          avatar: styles.avatarComment,
          subheader: styles.subheaderComment,
          action: styles.headerAction,
        }}
        avatar={<CustomAvatar className={styles.avatarComment} photoUrl={commentPhotoUrl}></CustomAvatar>}
        action={
          <>
            {isAdmin && (
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreHorizIcon />
              </IconButton>)}
          </>
        }
        title={commentFullName}
        subheader={commentContent}
      />
      <CardContent className={styles.dateComment}>{commentDate}</CardContent>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onClickEdit}>{t('edit.edit')}</MenuItem>
        <MenuItem onClick={onClickDelete}>{t('delete.delete')}</MenuItem>
      </Menu>
    </Card>

  );
}
