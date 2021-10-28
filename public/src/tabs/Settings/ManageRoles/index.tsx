import React, { useEffect, useState, useMemo, useContext } from 'react';

import { Paper, Avatar, Select } from '../../../components/Custom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { getEntityTypeName } from '../../../utils/stringFormats';
import { ACTION_ENUM, ENTITIES_ROLE_ENUM, Store } from '../../../Store';
import { useTranslation } from 'react-i18next';
import styles from './ManageRoles.module.css';
import { goTo, ROUTES } from '../../../actions/goTo';
import AddAdmins from './AddAdmins';
import { GLOBAL_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import { getEntity as getEntityApi, getRoles } from '../../../actions/service/entity/get';
import { updateRole as updateRoleApi } from '../../../actions/service/entity/put';
import { Entity, EntityRole } from '../../../../../typescript/types';
import { addRole } from '../../../actions/service/entity/post';

const ManageRoles: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: entityId },
  } = useContext(Store);

  const [entities, setEntities] = useState<EntityRole[]>([]);
  const [entity, setEntity] = useState<Entity>();

  const getEntity = async (): Promise<void> => {
    getEntityApi(entityId).then((res) => setEntity(res));
  };

  useEffect((): void => {
    if (entityId) {
      getEntity();
      updateEntities();
    }
  }, [entityId]);

  const updateEntities = async (): Promise<void> => {
    const res = await getRoles(entityId);
    res.data.forEach((r, index) => {
      if (r.role === ENTITIES_ROLE_ENUM.VIEWER) {
        res.data.splice(index, 1);
      }
    });
    setEntities(res.data);
  };

  const blackList = useMemo((): string[] => entities.map((entity) => entity.entityId), [entities]);

  const isAdmin = (arr: EntityRole[], entityIdAdmin: string) => {
    return arr.length < 2 && arr[0].entityId === entityIdAdmin;
  };

  const updateRole = async (entityIdAdmin: string, role: string): Promise<void> => {
    if (entity.type === GLOBAL_ENUM.PERSON) {
      await updateRoleApi(entityId, entityIdAdmin, role);
      return;
    }
    const arr = entities.filter((e) => e.role === ENTITIES_ROLE_ENUM.ADMIN);

    if (isAdmin(arr, entityIdAdmin)) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('last_admin'),
        severity: SEVERITY_ENUM.ERROR,
      });
    } else {
      await updateRoleApi(entityId, entityIdAdmin, role);
    }
  };

  const onClick = async (e: any, { id }: any): Promise<void> => {
    await addRole(id, ENTITIES_ROLE_ENUM.EDITOR, entityId);
    await updateEntities();
  };

  const handleChange = async (newRole: string, entityIdAdmin: string): Promise<void> => {
    await updateRole(entityIdAdmin, newRole);
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
              <Avatar photoUrl={e.photoUrl} />
            </ListItemIcon>
            {e.surname ? (
              <ListItemText primary={`${e.name} ${e.surname}`} secondary={getEntityTypeName(e.type)} />
            ) : (
              <ListItemText primary={`${e.name}`} secondary={getEntityTypeName(e.type)} />
            )}
          </ListItem>
          <Select
            key={`s${index}`}
            value={e.role}
            label="Role"
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
