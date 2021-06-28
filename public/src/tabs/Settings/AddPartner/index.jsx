import React, { useEffect, useState, useContext } from 'react';
import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import FormDialog from '../../../components/Custom/FormDialog';
import { FORM_DIALOG_TYPE_ENUM, LIST_ITEM_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { List } from '../../../components/Custom';
import { formatRoute } from '../../../utils/stringFormats';
import { Store } from '../../../Store';

export default function AddPartner() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const {
    state: { id },
  } = useContext(Store);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (id) {
      getPartners();
    }
  }, [id]);

  const getPartners = async () => {
    const res = await api(formatRoute('/api/entity/partners', null, { id }));
    const data = res.data.map((d) => ({
      name: d.name,
      website: d.website,
      description: d.description,
      photoUrl: d.photoUrl,
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
    <Paper title={t('partner.partners')}>
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
