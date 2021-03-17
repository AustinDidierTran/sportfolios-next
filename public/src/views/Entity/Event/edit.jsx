import React from 'react';

import { IgContainer, HeaderHome } from '../../../components/Custom';
import loadable from '@loadable/component';
import { ENTITIES_ROLE_ENUM, GLOBAL_ENUM } from '../../../../common/enums';
import { useAdmin, useEditor } from '../../../hooks/roles';
import styles from './Event.module.css';
import { useRouter } from 'next/router';
const Settings = loadable(() => import('../../../tabs/Settings'));

export default function EntitySettings(props) {
  const router = useRouter();
  const { id } = router.query;

  const { basicInfos, navBar, eventInfo } = props;

  const { role = ENTITIES_ROLE_ENUM.VIEWER, type } = basicInfos;

  const isEditor = useEditor(role);

  const isAdmin = useAdmin(role);

  if (isAdmin || isEditor) {
    return (
      <>
        <HeaderHome basicInfos={basicInfos} eventInfo={eventInfo} navTabs={navBar} type={GLOBAL_ENUM.EVENT} />
        <IgContainer>
          <div className={styles.divEdit}>
            <Settings basicInfos={basicInfos} />
          </div>
        </IgContainer>
      </>
    );
  }

  return <></>;
}
