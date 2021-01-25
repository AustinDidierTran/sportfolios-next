import React, { useMemo, useState } from 'react';

import { Divider, ListItem, ListItemText } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styles from './MemberImportItem.module.css';
import { formatDate, validateDateWithYear, validateEmail } from '../../../../utils/stringFormats';
import moment from 'moment';
import EditMemberImportDialog from './EditMemberImportDialog';
import CustomIconButton from '../../../../components/Custom/IconButton';
import { LIST_ITEM_ENUM } from '../../../../../common/enums';

export default function MemberImportItem(props) {
  const { t } = useTranslation();
  const { email, day, formik, month, year } = props;

  const [open, setOpen] = useState(false);

  const updateMember = (newEmail, day, month, year) => {
    const index = formik.values.members.findIndex((t) => t.email === email);
    const editedMember = {
      email: newEmail,
      day: Number(day),
      month: Number(month),
      year: Number(year),
      type: LIST_ITEM_ENUM.MEMBER_IMPORT,
      key: index,
    };
    formik.setFieldValue(`members[${index}]`, editedMember);
  };

  const expirationDate = useMemo(() => {
    if (!validateDateWithYear(`${day}/${month}/${year}`)) {
      return;
    }
    const mom = moment();
    mom.set('year', year);
    mom.set('month', month - 1);
    mom.set('date', day);
    if (!mom.isValid()) {
      return;
    }
    return mom;
  }, [day, month, year]);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    formik.setFieldValue(
      'members',
      formik.values.members.filter((member) => member.email !== email)
    );
  };

  return (
    <>
      <ListItem style={{ width: '100%' }} className={styles.listItem}>
        <ListItemText
          className={styles.item1}
          primary={email}
          secondaryTypographyProps={{ color: 'secondary' }}
          secondary={validateEmail(email) ? '' : t('invalid_email')}
        />
        {!expirationDate ? (
          <ListItemText
            className={styles.date}
            primaryTypographyProps={{ color: 'secondary' }}
            className={styles.item2}
            primary={`${t('invalid_date')}: ${day}-${month}-${year}`}
            secondary="dd-mm-yyyy"
          />
        ) : (
          <>
            {expirationDate < moment() ? (
              <ListItemText
                className={styles.date}
                secondaryTypographyProps={{ color: 'secondary' }}
                primary={formatDate(expirationDate)}
                secondary={t('expired')}
              />
            ) : (
              <ListItemText className={styles.date} primary={formatDate(expirationDate)} />
            )}
          </>
        )}
        <EditMemberImportDialog
          open={open}
          onClose={onClose}
          email={email}
          expirationDate={expirationDate}
          updateMember={updateMember}
        />
        <CustomIconButton icon="Edit" tooltip={t('edit')} onClick={onOpen} style={{ color: 'primary' }} />
        <CustomIconButton icon="Delete" tooltip={t('delete')} onClick={handleDelete} style={{ color: 'primary' }} />
      </ListItem>
      <Divider />
    </>
  );
}
