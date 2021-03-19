import React from 'react';

import HeaderHome from '../../../components/Custom/HeaderHome';
import IgContainer from '../../../components/Custom/IgContainer';
import loadable from '@loadable/component';
import { ENTITIES_ROLE_ENUM, GLOBAL_ENUM } from '../../../../common/enums';
import { useAdmin, useEditor } from '../../../hooks/roles';
import styles from './Event.module.css';
const Settings = loadable(() => import('../../../tabs/Settings'));

export default function EntitySettings(props) {

  const { basicInfos, navBar, eventInfo } = props;

  const { role = ENTITIES_ROLE_ENUM.VIEWER } = basicInfos;

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
