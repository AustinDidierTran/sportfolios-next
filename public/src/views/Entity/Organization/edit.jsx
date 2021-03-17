import React from 'react';

import { IgContainer, HeaderHome } from '../../../components/Custom';
import loadable from '@loadable/component';
import { ENTITIES_ROLE_ENUM, CARD_TYPE_ENUM, GLOBAL_ENUM } from '../../../../common/enums';
import { Card } from '../../../components/Custom';
import { useAdmin, useEditor } from '../../../hooks/roles';
import styles from './Organization.module.css';
import BottomPageLogo from '../../../components/Custom/BottomPageLogo';
import { useRouter } from 'next/router';

const BasicInfos = loadable(() => import('../../../tabs/Settings/BasicInfos'));
const AddMembership = loadable(() => import('../../../tabs/Settings/AddMembership'));
const BankAccount = loadable(() => import('../../../tabs/Settings/BankAccount'));
const Analytics = loadable(() => import('../../../tabs/Settings/Analytics'));
const ManageRoles = loadable(() => import('../../../tabs/Settings/ManageRoles'));

export default function EntitySettings(props) {
  const router = useRouter();
  const { id } = router.query;

  const { basicInfos, navBar } = props;

  const { role = ENTITIES_ROLE_ENUM.VIEWER, type } = basicInfos;

  const isEditor = useEditor(role);

  const isAdmin = useAdmin(role);

  if (isAdmin) {
    return (
      <>
        <HeaderHome basicInfos={basicInfos} navTabs={navBar} type={GLOBAL_ENUM.ORGANIZATION} />
        <IgContainer>
          <div className={styles.divEdit}>
            <BasicInfos basicInfos={basicInfos} />
            <AddMembership />
            <BankAccount />
            <Analytics />
            <ManageRoles role={role} />
            <Card items={{ id, name: basicInfos.name }} type={CARD_TYPE_ENUM.DELETE_ENTITY} />
            <BottomPageLogo />
          </div>
        </IgContainer>
      </>
    );
  }
  if (isEditor) {
    return (
      <>
        <HeaderHome basicInfos={basicInfos} navTabs={navBar} type={GLOBAL_ENUM.ORGANIZATION} />
        <IgContainer>
          <div className={styles.divEdit}>
            <BasicInfos basicInfos={basicInfos} />
            <AddMembership />
            <BottomPageLogo />
          </div>
        </IgContainer>
      </>
    );
  }
  return <></>;
}
