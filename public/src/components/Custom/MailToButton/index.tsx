import React, { useState, useEffect, useContext } from 'react';

import IconButton from '../IconButton';
import { mailTo } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { ACTION_ENUM, Store } from '../../../Store';
import { SEVERITY_ENUM } from '../../../../common/enums';

interface IProps {
  emails: { email: string }[];
  subject?: string;
  message?: string;
  color?: string;
  tooltip?: string;
}

const MailToButton: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { emails, subject, message, color = 'primary', tooltip = t('send_email') } = props;
  const { dispatch } = useContext(Store);

  const [emailsFormatted, setEmailsFormatted] = useState([]);

  useEffect(() => {
    setEmailsFormatted(emails.map((email) => email.email));
  }, [emails]);

  const onClick = (): void => {
    if (emailsFormatted.length < 1 || !emailsFormatted) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no.no_email_provided'),
        severity: SEVERITY_ENUM.ERROR,
      });
    } else {
      mailTo(emailsFormatted, subject, message);
    }
  };

  return <IconButton variant="contained" onClick={onClick} icon="Mail" tooltip={tooltip} style={{ color: color }} />;
};
export default MailToButton;
