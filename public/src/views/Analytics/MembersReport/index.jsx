import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CARD_TYPE_ENUM, FORM_DIALOG_TYPE_ENUM } from '../../../../common/enums';
import { goTo } from '../../../actions/goTo';
import Card from '../../../components/Custom/Card';
import FormDialog from '../../../components/Custom/FormDialog';
import { Store } from '../../../Store';

export default function MembersReport() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const {
    state: { id },
  } = useContext(Store);

  const onClose = () => {
    setOpen(false);
  };

  const handleCreated = () => {
    goTo(`/${id}?tab=settings`);
  };

  return (
    <>
      <Card
        items={{
          title: t('member.members'),
          description: t('member.members_report_description'),
          onClick: () => {
            setOpen(true);
          },
        }}
        type={CARD_TYPE_ENUM.REPORT}
      ></Card>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.MEMBERS_REPORT}
        items={{
          open,
          onClose,
          handleCreated,
        }}
      />
    </>
  );
}
