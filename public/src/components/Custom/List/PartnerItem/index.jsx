import React, { useState, useMemo, useContext } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '../../Avatar';
import Collapse from '../../Collapse';
import IconButton from '../../IconButton';
import Button from '../../Button';
import FormDialog from '../../FormDialog';
import AlertDialog from '../../Dialog/AlertDialog';
import { FORM_DIALOG_TYPE_ENUM, SEVERITY_ENUM } from '../../../../../common/enums';
import Typography from '@material-ui/core/Typography';
import styles from './PartnerItem.module.css';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { ACTION_ENUM, Store } from '../../../../Store';

export default function PartnerItem(props) {
  const { t } = useTranslation();
  const { id, photoUrl, name, website, description, update } = props;
  const { dispatch } = useContext(Store);
  const [expanded, setExpanded] = useState(false);
  const [edit, setEdit] = useState(false);
  const [alert, setAlert] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const redirect = () => {
    window.open(website);
  };

  const icon = useMemo(() => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'), [expanded]);

  const closeEdit = () => {
    setEdit(false);
    update();
  };

  const closeAlert = () => {
    setAlert(false);
  };

  const deleteConfirmed = async () => {
    await api(
      formatRoute('/api/entity/partner', null, {
        partnerId: id,
      }),
      {
        method: 'DELETE',
      }
    );
    update();
    closeAlert();
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: t('partner.partner_deleted'),
      severity: SEVERITY_ENUM.SUCCESS,
    });
  };

  return (
    <>
      <ListItem button onClick={handleExpand}>
        <ListItemIcon>
          <Avatar photoUrl={photoUrl}></Avatar>
        </ListItemIcon>
        <ListItemText primary={name} secondary={t('partner.partner')} />
        <IconButton onClick={handleExpand} aria-expanded={expanded} icon={icon} style={{ color: 'grey' }} />
      </ListItem>
      <Collapse in={expanded} timeaout="auto" unmountOnExit>
        <div style={{ backgroundColor: '#F5F5F5' }}>
          <ListItem button onClick={redirect}>
            <ListItemText primary={name} secondary={website} />
          </ListItem>
          <Typography display="block" align="left" className={styles.div}>
            {description}
          </Typography>
          <Button
            onClick={() => {
              setAlert(true);
            }}
            endIcon="Delete"
            color="secondary"
            style={{ margin: '8px' }}
          >
            {t('delete.delete')}
          </Button>
          <Button
            onClick={() => {
              setEdit(true);
            }}
            endIcon="Edit"
            color="primary"
            style={{ margin: '8px' }}
          >
            {t('edit.edit')}
          </Button>
          <AlertDialog
            open={alert}
            onSubmit={deleteConfirmed}
            onCancel={closeAlert}
            description={t('delete.delete_partner_confirmation')}
            title={t('delete.delete_partner')}
          />
          <FormDialog
            type={FORM_DIALOG_TYPE_ENUM.EDIT_PARTNER}
            items={{
              open: edit,
              onClose: closeEdit,
              update,
              id,
              photoUrl,
              name,
              website,
              description,
            }}
          />
        </div>
      </Collapse>
    </>
  );
}
