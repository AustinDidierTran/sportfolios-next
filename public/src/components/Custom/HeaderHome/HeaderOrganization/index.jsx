import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import { useRouter } from 'next/router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { FORM_DIALOG_TYPE_ENUM } from '../../../../../common/enums';
import FormDialog from '../../FormDialog';
import styles from '../HeaderHome.module.css';
import CustomIcon from '../../Icon';
import { goTo, ROUTES } from '../../../../actions/goTo';
import Typography from '@material-ui/core/Typography';
import loadable from '@loadable/component';

const BannerOrganization = loadable(() => import('../../BannerOrganization'));

export default function HeaderOrganization(props) {
  const { basicInfos, navTabs, index, isAdmin } = props;
  const router = useRouter();
  const { id } = router.query;

  const [open, setOpen] = useState(false);
  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const update = () => {};

  return (
    <Paper elevation={1} className={styles.paper}>
      <BannerOrganization basicInfos={basicInfos} onClickMainButton={onOpen} isAdmin={isAdmin} />
      <div className={styles.navigation}>
        <Tabs
          value={index}
          TabIndicatorProps={{
            style: { backgroundColor: 'white' },
          }}
          style={{
            color: 'white',
            backgroundColor: '#18B393',
            minHeight: 0,
            borderRadius: window.innerWidth > 600 ? '7px' : '0px',
          }}
          variant="fullWidth"
          scrollButtons="off"
        >
          {navTabs.map((s, index) => (
            <Tab
              key={index}
              onClick={() => {
                goTo(ROUTES.entity, { id }, { tab: s.value });
              }}
              label={
                <div className={styles.div}>
                  <CustomIcon icon={s.icon} />
                  {window.innerWidth > 600 && (
                    <Typography variant="body2" className={styles.typo}>
                      {s.label}
                    </Typography>
                  )}
                </div>
              }
              fontSize={0.6}
              style={{
                borderRightColor: 'white',
                borderRightStyle: navTabs.length === index + 1 ? 'none' : 'solid',
                borderRightWidth: 1,
                minHeight: 0,
                minWidth: 0,
                overflow: 'auto',
              }}
            />
          ))}
        </Tabs>
        <FormDialog
          type={FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER}
          items={{
            open,
            onClose,
            update,
          }}
        />
      </div>
    </Paper>
  );
}
