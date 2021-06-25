import React, { useEffect, useState, useMemo, useContext } from 'react';

import { Paper, Avatar, Select } from '../../../components/Custom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { getEntityTypeName } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM, Store } from '../../../Store';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import styles from './ManageRoles.module.css';
import { goTo, ROUTES } from '../../../actions/goTo';
import AddAdmins from './AddAdmins';
import { getInitialsFromName } from '../../../utils/stringFormats';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { getEntity as getEntityApi, getRoles } from '../../../actions/service/entity';
import { Entity, EntityRole } from '../../../../../typescript/types';

const ManageRoles: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    state: { id: entity_id },
  } = useContext(Store);

  const [entities, setEntities] = useState<EntityRole[]>([]);
  const [entity, setEntity] = useState<Entity>();

  const getEntity = async (): Promise<void> => {
    const data = await getEntityApi(entity_id);
    setEntity(data.basicInfos);
  };

  useEffect((): void => {
    if (entity_id) {
      getEntity();
      updateEntities();
    }
  }, [entity_id]);

  const updateEntities = async (): Promise<void> => {
    const res = await getRoles(entity_id);
    res.data.forEach((r, index) => {
      if (r.role === ENTITIES_ROLE_ENUM.VIEWER) {
        res.data.splice(index, 1);
      }
    });
    setEntities(res.data);
  };

  const blackList = useMemo((): string[] => entities.map((entity) => entity.entityId), [entities]);

  const updateRole = async (entity_id_admin: string, role: string): Promise<void> => {
    if (entity.type === GLOBAL_ENUM.PERSON) {
      await api(`/api/entity/role`, {
        method: 'PUT',
        body: JSON.stringify({
          entity_id,
          entity_id_admin,
          role,
        }),
      });
      return;
    }
    const arr = entities.filter((e) => e.role === ENTITIES_ROLE_ENUM.ADMIN);

    if (arr.length < 2 && arr[0].entityId === entity_id_admin) {
      throw 'Last Admin';
    } else {
      await api(`/api/entity/role`, {
        method: 'PUT',
        body: JSON.stringify({
          entity_id,
          entity_id_admin,
          role,
        }),
      });
    }
  };

  const onClick = async (e: any, { id }: any): Promise<void> => {
    await api(`/api/entity/role`, {
      method: 'POST',
      body: JSON.stringify({
        entity_id_admin: id,
        role: ENTITIES_ROLE_ENUM.EDITOR,
        entity_id,
      }),
    });
    await updateEntities();
  };

  const handleChange = async (newRole: string, entity_id_admin: string): Promise<void> => {
    await updateRole(entity_id_admin, newRole);
    await updateEntities();
  };

  const items = [
    { display: t('admin'), value: ENTITIES_ROLE_ENUM.ADMIN },
    { display: t('edit.editor'), value: ENTITIES_ROLE_ENUM.EDITOR },
    { display: t('remove'), value: ENTITIES_ROLE_ENUM.VIEWER },
  ];

  return (
    <Paper title={t('admins')}>
      {entities.map((e, index) => [
        <List disablePadding className={styles.list} key={index}>
          <ListItem key={index} button onClick={() => goTo(ROUTES.entity, { id: e.entityId })} className={styles.item}>
            <ListItemIcon>
              <Avatar
                photoUrl={e.photoUrl}
                initials={getInitialsFromName(e.surname ? `${e.name} ${e.surname}` : e.name)}
              />
            </ListItemIcon>
            {e.surname ? (
              <ListItemText primary={`${e.name} ${e.surname}`} secondary={t(getEntityTypeName(e.type))}></ListItemText>
            ) : (
              <ListItemText primary={`${e.name}`} secondary={t(getEntityTypeName(e.type))}></ListItemText>
            )}
          </ListItem>
          <Select
            key={`s${index}`}
            value={e.role}
            labelId="Role"
            onChange={(newRole: string) => handleChange(newRole, e.entityId)}
            className={styles.select}
            options={items}
          />
        </List>,
      ])}
      <hr />
      <AddAdmins onClick={onClick} blackList={blackList} />
    </Paper>
  );
};
export default ManageRoles;
