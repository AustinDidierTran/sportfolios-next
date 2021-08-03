import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import { GLOBAL_ENUM, VIEW_ENUM } from '../../../../common/enums';
import { goTo, ROUTES } from '../../../actions/goTo';

import CustomIcon from '../Icon';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';
import { COLORS } from '../../../utils/colors';

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'absolute',
    bottom: '80px',
    right: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 2,
  },
  speedDial2: {
    position: 'absolute',
    bottom: '40px',
    right: '40px',
    zIndex: theme.zIndex.drawer + 2,
  },
}));

export default function SpeedDialTooltipOpen() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [width] = useWindowSize();

  const classes = useStyles();
  const router = useRouter();
  const location = router.pathname;

  const actions = useMemo(() => {
    const path = location.split('/')[1] || '';
    switch (path) {
      case VIEW_ENUM.CART:
        setHidden(true);
        return [
          {
            icon: 'PeopleIcon',
            name: 'CART',
            onClick: () => {
              goTo(ROUTES.create, null, { type: GLOBAL_ENUM.TEAM });
              setOpen(false);
            },
          },
        ];
      case VIEW_ENUM.MENU:
        setHidden(true);
        return [
          {
            icon: 'Business',
            name: 'MENU',
            onClick: () => {
              goTo(ROUTES.create, null, { type: GLOBAL_ENUM.EVENT });
              setOpen(false);
            },
          },
        ];

      case VIEW_ENUM.HOME:
        setHidden(true);
        return [
          {
            icon: 'Event',
            name: 'Event',
            onClick: () => {
              goTo(ROUTES.create, null, { type: GLOBAL_ENUM.EVENT });
              setOpen(false);
            },
          },
          {
            icon: 'Business',
            name: 'Organization',
            onClick: () => {
              goTo(ROUTES.create, null, {
                type: GLOBAL_ENUM.ORGANIZATION,
              });
              setOpen(false);
            },
          },
          {
            icon: 'PeopleIcon',
            name: 'Team',
            onClick: () => {
              goTo(ROUTES.create, null, { type: GLOBAL_ENUM.TEAM });
              setOpen(false);
            },
          },
        ];

      case VIEW_ENUM.ORGANIZATION_LIST:
        setHidden(true);
        return [];
      default:
        setHidden(true);
        return [];
    }
  }, [location]);

  return (
    <div className={classes.root}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial"
        className={width < MOBILE_WIDTH ? classes.speedDial : classes.speedDial2}
        hidden={hidden}
        icon={<SpeedDialIcon style={{ color: COLORS.white }} />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={<CustomIcon icon={action.icon} />}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
