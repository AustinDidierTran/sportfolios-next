import React, { useEffect, useState } from 'react';
import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import FormDialog from '../../../components/Custom/FormDialog';
import { FORM_DIALOG_TYPE_ENUM, LIST_ITEM_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { List } from '../../../components/Custom';
import { useRouter } from 'next/router';

export default function AddPartner() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const [options, setOptions] = useState([]);

  useEffect(() => {
    getPartners();
  }, [id]);

  const getPartners = async () => {
    const res = await api(`/api/entity/partners/?id=${id}`);
    const data = res.data.map((d) => ({
      name: d.name,
      website: d.website,
      description: d.description,
      photoUrl: d.photo_url,
      type: LIST_ITEM_ENUM.PARTNER,
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
      <List items={options} />
    </Paper>
  );
}
