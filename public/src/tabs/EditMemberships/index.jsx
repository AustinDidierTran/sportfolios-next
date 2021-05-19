import React, { useEffect, useState } from 'react';
import { getMembershipName, getMembershipType, getExpirationDate } from '../../utils/stringFormats';
import { FORM_DIALOG_TYPE_ENUM, LIST_ITEM_ENUM } from '../../../common/enums';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../actions/goTo';
import List from '../../components/Custom/List';
import Button from '../../components/Custom/Button';
import FormDialog from '../../components/Custom/FormDialog';
import Paper from '../../components/Custom/Paper';
import { useRouter } from 'next/router';
import api from '../../actions/api';

export default function EditMemberships() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const [options, setOptions] = useState([]);

  useEffect(() => {
    getMemberships();
  }, [id]);

  const getMemberships = async () => {
    const res = await api(`/api/entity/memberships/?id=${id}`);

    const data = res.data.map((d) => ({
      membership: t(getMembershipName(d.membership_type)),
      membershipType: t(getMembershipType(d.length, d.fixed_date)),
      expirationDate: getExpirationDate(d.length, d.fixed_date),
      price: d.price,
      transactionFees: d.transactionFees,
      taxRates: d.taxRates,
      description: d.description,
      fileName: d.file_name,
      fileUrl: d.file_url,
      type: LIST_ITEM_ENUM.MEMBERSHIP_ORGANIZATION,
      id: d.id,
      update,
      key: d.id,
    }));
    setOptions(data);
  };

  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const update = () => {
    getMemberships();
  };

  return (
    <Paper title={t('member.memberships')}>
      <Button size="small" variant="contained" style={{ margin: '8px' }} onClick={onOpen}>
        {t('add.add_membership')}
      </Button>
      <Button
        size="small"
        variant="contained"
        style={{ margin: '8px' }}
        onClick={() => {
          goTo(ROUTES.membersList, null, { id });
        }}
      >
        {t('member.member_list')}
      </Button>
      <Button
        variant="contained"
        style={{ margin: '8px' }}
        onClick={() => {
          goTo(ROUTES.importMembers, null, { id });
        }}
      >
        {t('import_members')}
      </Button>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.ADD_MEMBERSHIP}
        items={{
          open,
          onClose,
          update,
        }}
      />
      <List items={options} />
    </Paper>
  );
}
