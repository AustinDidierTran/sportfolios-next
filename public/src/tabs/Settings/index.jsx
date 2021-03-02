import React, { useEffect } from 'react';

import loadable from '@loadable/component';
import { ENTITIES_ROLE_ENUM, CARD_TYPE_ENUM, GLOBAL_ENUM } from '../../../common/enums';
import { Card } from '../../components/Custom';
import { useAdmin, useEditor } from '../../hooks/roles';
import styles from './Settings.module.css';
import BottomPageLogo from '../../components/Custom/BottomPageLogo';
import { useRouter } from 'next/router';

const AddMembership = loadable(() => import('./AddMembership'));
const AddOptionsEvent = loadable(() => import('./AddOptionsEvent'));
const BankAccount = loadable(() => import('./BankAccount'));
const BasicInfos = loadable(() => import('./BasicInfos'));
const ChangeAlias = loadable(() => import('./ChangeAlias'));
const Description = loadable(() => import('./Description'));
const EventSettings = loadable(() => import('./EventSettings'));
const ManageRoles = loadable(() => import('./ManageRoles'));
const QuickDescription = loadable(() => import('./QuickDescription'));
const Analytics = loadable(() => import('./Analytics'));
const TeamsRegistered = loadable(() => import('./TeamsRegistered'));
const PlayersRegistered = loadable(() => import('./PlayersRegistered'));

export default function EntitySettings(props) {
  const router = useRouter();
  const { id } = router.query;

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
      if (isAdmin) {
        return (
          <div className={styles.div}>
            <BasicInfos basicInfos={basicInfos} />
            <ChangeAlias />
            <QuickDescription />
            <Description />
            <EventSettings />
            <AddOptionsEvent />
            <TeamsRegistered />
            <PlayersRegistered />
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
            <ChangeAlias />
            <QuickDescription />
            <Description />
            <EventSettings />
            <AddOptionsEvent />
            <TeamsRegistered />
            <PlayersRegistered />
            <BottomPageLogo />
          </div>
        );
      }
      return <></>;
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
