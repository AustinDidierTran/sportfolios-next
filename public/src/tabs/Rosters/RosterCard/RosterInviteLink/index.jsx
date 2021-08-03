import React, { useContext, useEffect, useState } from 'react';
import { CLIENT_BASE_URL } from '../../../../../../conf';
import api from '../../../../actions/api';
import { ROUTES_ENUM, SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import { AlertDialog, IconButton } from '../../../../components/Custom';
import Typography from '@material-ui/core/Typography';
import styles from './RosterInviteLink.module.css';
import CopyToClipBoard from '../../../../components/Custom/IconButton/CopyToClipboard';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../../../Store';
import moment from 'moment';
import { formatDate } from '../../../../utils/stringFormats';
import { formatRoute } from '../../../../utils/stringFormats';
import { ERROR_ENUM } from '../../../../../common/errors';

export default function RosterInviteLink(props) {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();
  const [link, setLink] = useState();
  const [alertOpened, setAlertOpened] = useState(false);
  const { rosterId, message } = props;
  const [expireDate, setExpireDate] = useState();

  function updateTokenInfos(data) {
    const { token, expires_at } = data;
    setExpireDate(formatDate(moment.utc(expires_at)));
    const newLink = CLIENT_BASE_URL + formatRoute(ROUTES_ENUM.rosterInviteLink, { token });
    setLink(newLink);
    return newLink;
  }

  async function fetchLink() {
    const res = await api(formatRoute('/api/entity/rosterInviteToken', null, { rosterId }), { method: 'GET' });
    if (res.status !== REQUEST_STATUS_ENUM.SUCCESS) {
      setLink(null);
      return;
    }
    updateTokenInfos(res.data);
  }

  function makeToastLinkIsCopied() {
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: t('link_has_been_copied_and_will_expire', {
        expireDate,
      }),
      severity: SEVERITY_ENUM.SUCCESS,
      duration: 2000,
    });
  }

  function makeToastError() {
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: ERROR_ENUM.ERROR_OCCURED,
      severity: SEVERITY_ENUM.ERROR,
      duration: 4000,
    });
  }

  async function changeToken() {
    const res = await api(
      formatRoute('/api/entity/newRosterInviteToken', null, {
        rosterId,
      }),
      { method: 'GET' }
    );
    if (res.status !== REQUEST_STATUS_ENUM.SUCCESS) {
      return;
    }
    return updateTokenInfos(res.data);
  }

  useEffect(() => {
    if (rosterId) {
      fetchLink();
    }
  }, [rosterId]);

  async function onConfirm() {
    const newLink = await changeToken();
    setAlertOpened(false);
    if (!newLink) {
      makeToastError();
      return;
    }
    navigator.clipboard.writeText(newLink);
    makeToastLinkIsCopied();
  }

  if (!rosterId || !link) {
    return null;
  }

  return (
    <div>
      <Typography variant="body1">{message}</Typography>
      <div className={styles.linkDiv}>
        <CopyToClipBoard
          copyText={link}
          text={t('copy_invite_link')}
          style={{
            color: 'secondary',
            textTransform: 'none',
            fontSize: 15,
            fontWeight: 400,
          }}
          snackBarText={t('link_has_been_copied_and_will_expire', {
            expireDate,
          })}
        />
        <IconButton
          icon="Replay"
          onClick={() => setAlertOpened(true)}
          tooltip={t('get_a_new_link')}
          style={{ color: 'secondary' }}
        />
      </div>
      <AlertDialog
        open={alertOpened}
        onSubmit={onConfirm}
        onCancel={() => setAlertOpened(false)}
        description={t('by_getting_a_new_link_the_old_one_will_expires')}
      />
    </div>
  );
}
