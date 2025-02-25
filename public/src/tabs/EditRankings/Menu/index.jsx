import React from 'react';
import { useTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import styles from './Menu.module.css';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Icon from '../../../components/Custom/Icon';
import { PHASE_STATUS_ENUM, PHASE_TYPE_ENUM } from '../../../../common/enums';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function CustomizedMenus(props) {
  const { phase, onOpenDeleteDialog, openEdit } = props;
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    openEdit();
    handleClose();
  };

  const handleDeletePhase = () => {
    onOpenDeleteDialog(phase);
    handleClose();
  };

  if (phase.status === PHASE_STATUS_ENUM.NOT_STARTED && phase.type != PHASE_TYPE_ENUM.ELIMINATION_BRACKET) {
    return (
      <div>
        <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          className={styles.menu}
        >
          <StyledMenuItem onClick={handleEdit}>
            <ListItemIcon className={styles.item}>
              <Icon icon="Edit" />
            </ListItemIcon>
            <ListItemText primary={t('edit.edit_team_number')} className={styles.text} />
          </StyledMenuItem>
          <StyledMenuItem onClick={handleDeletePhase}>
            <ListItemIcon className={styles.item}>
              <Icon icon="Delete" />
            </ListItemIcon>
            <ListItemText primary={t('delete.delete_phase')} className={styles.text} />
          </StyledMenuItem>
        </StyledMenu>
      </div>
    );
  }

  return (
    <div>
      <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={styles.menu}
      >
        <StyledMenuItem onClick={handleDeletePhase}>
          <ListItemIcon className={styles.item}>
            <Icon icon="Delete" />
          </ListItemIcon>
          <ListItemText primary={t('delete.delete_phase')} className={styles.text} />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}
