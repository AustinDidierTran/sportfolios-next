import React, { useEffect, useState, useContext } from 'react';
import { Button, Paper } from '../../../components/Custom';
import { LIST_ITEM_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { List } from '../../../components/Custom';
import { goTo, ROUTES } from '../../../actions/goTo';
import ListItemText from '@material-ui/core/ListItemText';
import { formatRoute } from '../../../utils/stringFormats';
import { Store } from '../../../Store';

interface BankAccountItem {
  type: LIST_ITEM_ENUM;
  last4: string;
  createdAt: string;
  bankAccountId: string;
  update: () => void;
  isDefault: boolean;
  key: string;
  removeDelete: boolean;
}
const BankAccount: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    state: { id: entityId },
  } = useContext(Store);

  const [hasAccount, setHasAccount] = useState<boolean>(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>();

  useEffect((): void => {
    if (entityId) {
      getBankAccounts();
    }
  }, [entityId]);

  const getBankAccounts = async (): Promise<void> => {
    const { data: hasStripeAccount } = await api(formatRoute('/api/stripe/hasStripeAccount', null, { entityId }), {
      method: 'GET',
    });
    setHasAccount(hasStripeAccount);
    const { data: bankAccounts } = await api(formatRoute('/api/stripe/bankAccounts', null, { entityId }), {
      method: 'GET',
    });
    const res = bankAccounts.map((b: any) => ({
      type: LIST_ITEM_ENUM.BANK_ACCOUNT,
      last4: b.last4,
      createdAt: b.created_at,
      bankAccountId: b.bank_account_id,
      update: getBankAccounts,
      isDefault: b.is_default,
      key: b.bank_account_id,
      removeDelete: bankAccounts.length < 2,
    }));
    setBankAccounts(res);
  };

  const handleClick = async (): Promise<void> => {
    if (!hasAccount) {
      const { data } = await api(
        formatRoute('/api/stripe/accountLink', null, {
          entityId,
        }),
        { method: 'GET' }
      );
      window.location.href = data.url;
    } else {
      goTo(ROUTES.addBankAccount, null, {
        entityId,
      });
    }
  };
  return (
    <Paper title={t('bank_accounts')}>
      <Button size="small" variant="contained" style={{ margin: '8px' }} onClick={handleClick}>
        {t('add.add_bank_account')}
      </Button>
      <ListItemText secondary={t('bank_accounts_information')} />
      <List items={bankAccounts} />
    </Paper>
  );
};

export default BankAccount;
