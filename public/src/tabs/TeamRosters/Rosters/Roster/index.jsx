import React, { useState, useEffect } from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import { formatRoute, getIconFromRole, getInitialsFromName } from '../../../../utils/stringFormats';
import styles from './Roster.module.css';
import { FORM_DIALOG_TYPE_ENUM, ROSTER_ROLE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../components/Custom/Icon';
import AlertDialog from '../../../../components/Custom/Dialog/AlertDialog';
import FormDialog from '../../../../components/Custom/FormDialog';
import IconButton from '../../../../components/Custom/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '../../../../components/Custom/Avatar';
import api from '../../../../actions/api';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';

export default function Roster(props) {
  const { roster, index, update, isAdmin } = props;
  const { t } = useTranslation();

  useEffect(() => {
    if (roster.id) {
      getPlayers();
    }
  }, [roster.id]);

  const [players, setPlayers] = useState([]);

  const getPlayers = async () => {
    const { data } = await api(
      formatRoute('/api/entity/rosterPlayers', null, {
        rosterId: roster.id,
      })
    );
    setPlayers(data);
  };

  return <ListItem className={index % 2 === 0 ? styles.greycard : styles.card}></ListItem>;
}
