import React, { useEffect, useState, useContext } from 'react';
import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import FormDialog from '../../../components/Custom/FormDialog';
import { FORM_DIALOG_TYPE_ENUM, LIST_ITEM_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import { List } from '../../../components/Custom';
import { Store } from '../../../Store';
import { getPartners as getPartnersApi } from '../../../actions/service/entity/get';

interface IOption {
  name: string;
  website: string;
  description: string;
  photoUrl: string;
  type: LIST_ITEM_ENUM;
  id: string;
  update: () => void;
  key: string;
}

const AddPartner: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    state: { id },
  } = useContext(Store);

  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<IOption[]>();

  useEffect((): void => {
    if (id) {
      getPartners();
    }
  }, [id]);

  const getPartners = async () => {
    const res = await getPartnersApi(id);
    const data = res.map((d) => ({
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

  const onOpen = (): void => {
    setOpen(true);
  };
  const onClose = (): void => {
    setOpen(false);
  };
  const update = (): void => {
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
export default AddPartner;