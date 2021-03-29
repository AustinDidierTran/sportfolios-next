import React from 'react';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { ROUTES } from '../../../actions/goTo';

export default function LoggedOut() {
  return (
    <div>
      <AppBar position="static" style={{ position: 'fixed', top: 0 }}>
        <Toolbar>
          <Typography style={{ fontSize: '1.5rem', color: 'white' }} noWrap>
            <Link href={ROUTES.home}>Sportfolios</Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
