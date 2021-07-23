import React, { useEffect, useState, useContext } from 'react';
import Paper from '../../components/Custom/Paper';
import FormDialog from '../../components/Custom/FormDialog';
import Button from '../../components/Custom/Button';
import { getMembershipName, getMembershipType, getExpirationDate } from '../../utils/stringFormats';
import { FORM_DIALOG_TYPE_ENUM, LIST_ITEM_ENUM } from '../../../common/enums';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../actions/goTo';
import List from '../../components/Custom/List';
import { Store } from '../../Store';
import { getMemberships as getMembershipsApi } from '../../actions/service/entity/get';
import { EntityMembership } from '../../../../typescript/types';

interface IOptions extends EntityMembership {
  update: () => void;
  key: string;
  expirationDate: string;
  membership: any;
  type: string;
  membershipTypeText: string;
}

const EditMemberships: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const {
    state: { id },
  } = useContext(Store);

  const [options, setOptions] = useState<IOptions[]>([]);

  useEffect((): void => {
    if (id) {
      getMemberships();
    }
  }, [id]);

  const getMemberships = async (): Promise<void> => {
    const res = await getMembershipsApi(id);

    const data = res.map((d) => ({
      membership: getMembershipName(d.membershipType),
      membershipTypeText: getMembershipType(d.length, d.fixedDate),
      expirationDate: getExpirationDate(d.length, d.fixedDate),
      price: d.price,
      transactionFees: d.transactionFees,
      taxRates: d.taxRates,
      description: d.description,
      fileName: d.fileName,
      fileUrl: d.fileUrl,
      type: LIST_ITEM_ENUM.MEMBERSHIP_ORGANIZATION,
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
};
export default EditMemberships;
