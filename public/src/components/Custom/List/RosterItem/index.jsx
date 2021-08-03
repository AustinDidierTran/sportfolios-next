import React, { useContext } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

import { useTranslation } from 'react-i18next';
import { ROSTER_ROLE_ENUM, SEVERITY_ENUM } from '../../../../../common/enums';
import { ACTION_ENUM, Store } from '../../../../Store';

import styles from './RosterItem.module.css';
import CustomAvatar from '../../Avatar';
import CustomSelect from '../../Select';
import CustomIconButton from '../../IconButton';
import { COLORS } from '../../../../utils/colors';

export default function RosterItem(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const { personId, photoUrl, name, surname, onDelete, index, formik } = props;
  const { roster } = formik.values;

  const handleRoleChange = (newRole) => {
    if (
      newRole === ROSTER_ROLE_ENUM.PLAYER &&
      !roster.some((p) => p.role !== ROSTER_ROLE_ENUM.PLAYER && p.personId !== personId)
    ) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team.team_player_role_error'),
        severity: SEVERITY_ENUM.ERROR,
      });
    } else {
      formik.setFieldValue(`roster[${index}].role`, newRole);
    }
  };

  const RoleSelect = (
    <div>
      <CustomSelect
        className={styles.select}
        value={roster[index].role}
        onChange={(newRole) => handleRoleChange(newRole)}
        options={[
          {
            display: t('coach'),
            value: ROSTER_ROLE_ENUM.COACH,
          },
          {
            display: t('captain'),
            value: ROSTER_ROLE_ENUM.CAPTAIN,
          },
          {
            display: t('assistant_captain'),
            value: ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN,
          },
          {
            display: t('player'),
            value: ROSTER_ROLE_ENUM.PLAYER,
          },
        ]}
      />
    </div>
  );

  return (
    <ListItem className={styles.item}>
      <ListItemIcon>
        <CustomAvatar photoUrl={photoUrl} />
      </ListItemIcon>
      <div className={styles.text}>
        <Typography>{`${name}${surname ? ` ${surname}` : ''}`}</Typography>
        {RoleSelect}
      </div>
      <CustomIconButton
        icon="Delete"
        style={{ color: COLORS.grey }}
        tooltip={t('remove')}
        edge="end"
        onClick={onDelete}
      />
    </ListItem>
  );
}
