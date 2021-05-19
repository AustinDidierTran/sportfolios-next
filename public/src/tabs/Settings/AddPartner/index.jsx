import React, { useEffect, useState } from 'react';
import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import FormDialog from '../../../components/Custom/FormDialog';
import { FORM_DIALOG_TYPE_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
// import api from '../../../actions/api';
// import { goTo, ROUTES } from '../../../actions/goTo';
// import { List } from '../../../components/Custom';
import { useRouter } from 'next/router';

export default function AddPartner() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  // const [options, setOptions] = useState([]);

  useEffect(() => {
    getPartners();
  }, [id]);

  const getPartners = async () => {
    // const res = await api(`/api/entity/memberships/?id=${id}`);
    // const data = res.data.map((d) => ({
    //   membership: t(getMembershipName(d.membership_type)),
    //   membershipType: t(getMembershipType(d.length, d.fixed_date)),
    //   expirationDate: getExpirationDate(d.length, d.fixed_date),
    //   price: d.price,
    //   transactionFees: d.transactionFees,
    //   taxRates: d.taxRates,
    //   description: d.description,
    //   fileName: d.file_name,
    //   fileUrl: d.file_url,
    //   type: LIST_ITEM_ENUM.MEMBERSHIP_ORGANIZATION,
    //   id: d.id,
    //   update,
    //   key: d.id,
    // }));
    // setOptions(data);
  };

  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const update = () => {
    getPartners();
  };

  return (
    <Paper title={t('partners')}>
      <Button size="small" variant="contained" style={{ margin: '8px' }} onClick={onOpen}>
        {t('add.add_partner')}
      </Button>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.ADD_PARTNER}
        items={{
          open,
          onClose,
          update,
        }}
      />
      {/* <List items={options} /> */}
    </Paper>
  );
}
