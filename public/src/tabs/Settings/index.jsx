import React, { useContext } from 'react';

import dynamic from 'next/dynamic';
import { ENTITIES_ROLE_ENUM, CARD_TYPE_ENUM, GLOBAL_ENUM } from '../../../common/enums';
import Card from '../../components/Custom/Card';
import { useAdmin, useEditor } from '../../hooks/roles';
import styles from './Settings.module.css';
import BottomPageLogo from '../../components/Custom/BottomPageLogo';
import { Store } from '../../Store';

const AddMembership = dynamic(() => import('./AddPartner'));
const BankAccount = dynamic(() => import('./BankAccount'));
const BasicInfos = dynamic(() => import('./BasicInfos'));
const ManageRoles = dynamic(() => import('./ManageRoles'));
const Analytics = dynamic(() => import('./Analytics'));
const AllEventSettings = dynamic(() => import('./AllEventSettings'));

export default function EntitySettings(props) {
  const {
    state: { id },
  } = useContext(Store);
  const { basicInfos } = props;

  const { role = ENTITIES_ROLE_ENUM.VIEWER, type } = basicInfos;

  const isEditor = useEditor(role);

  const isAdmin = useAdmin(role);

  switch (type) {
    case GLOBAL_ENUM.TEAM:
      if (isAdmin) {
        return (
          <div className={styles.div}>
            <BasicInfos basicInfos={basicInfos} />
            <ManageRoles role={role} />
            <Card items={{ id, name: basicInfos.name }} type={CARD_TYPE_ENUM.DELETE_ENTITY} />
            <BottomPageLogo />
          </div>
        );
      }

      if (isEditor) {
        return (
          <div className={styles.div}>
            <BasicInfos basicInfos={basicInfos} />
            <BottomPageLogo />
          </div>
        );
      }
      return <></>;

    case GLOBAL_ENUM.EVENT:
      return <AllEventSettings basicInfos={basicInfos} role={role} />;
    case GLOBAL_ENUM.ORGANIZATION:
      if (isAdmin) {
        return (
          <div className={styles.div}>
            <BasicInfos basicInfos={basicInfos} />
            <AddMembership />
            <BankAccount />
            <Analytics />
            <ManageRoles role={role} />
            <Card items={{ id, name: basicInfos.name }} type={CARD_TYPE_ENUM.DELETE_ENTITY} />
            <BottomPageLogo />
          </div>
        );
      }
      if (isEditor) {
        return (
          <div className={styles.div}>
            <BasicInfos basicInfos={basicInfos} />
            <AddMembership />
            <BottomPageLogo />
          </div>
        );
      }
      return <></>;

    case GLOBAL_ENUM.PERSON:
      if (isAdmin) {
        return (
          <div className={styles.div}>
            <BankAccount />
            <ManageRoles role={role} />
            <BottomPageLogo />
          </div>
        );
      }
      if (isEditor) {
        return (
          <div className={styles.div}>
            <BottomPageLogo />
          </div>
        );
      }
      return <></>;
    default:
      throw 'type not defined';
  }
}
