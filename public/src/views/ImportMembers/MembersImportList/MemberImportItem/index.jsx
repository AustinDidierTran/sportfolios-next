import React, { useMemo, useState } from 'react';

import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import styles from './MemberImportItem.module.css';
import { formatDate, validateDateWithYear, validateEmail } from '../../../../utils/stringFormats';
import moment from 'moment';
import IconButton from '../../../../components/Custom/IconButton';
import { FORM_DIALOG_TYPE_ENUM, LIST_ITEM_ENUM } from '../../../../../common/enums';
import FormDialog from '../../../../components/Custom/FormDialog';

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
          primary={email}
          secondaryTypographyProps={{ color: 'secondary' }}
          secondary={validateEmail(email) ? '' : t('invalid.invalid_email')}
        />
        {!expirationDate ? (
          <ListItemText
            primaryTypographyProps={{ color: 'secondary' }}
            primary={`${t('invalid.invalid_date')}: ${day}-${month}-${year}`}
            secondary="dd-mm-yyyy"
          />
        ) : (
          <>
            {expirationDate < moment() ? (
              <ListItemText
                secondaryTypographyProps={{ color: 'secondary' }}
                primary={formatDate(expirationDate)}
                secondary={t('expired')}
              />
            ) : (
              <ListItemText primary={formatDate(expirationDate)} />
            )}
          </>
        )}
        <FormDialog
          type={FORM_DIALOG_TYPE_ENUM.EDIT_MEMBER_IMPORT}
          items={{
            open,
            onClose,
            email,
            expirationDate,
            updateMember,
          }}
        />
        <IconButton icon="Edit" tooltip={t('edit.edit')} onClick={onOpen} style={{ color: 'primary' }} />
        <IconButton icon="Delete" tooltip={t('delete.delete')} onClick={handleDelete} style={{ color: 'primary' }} />
      </ListItem>
      <Divider />
    </>
  );
}
