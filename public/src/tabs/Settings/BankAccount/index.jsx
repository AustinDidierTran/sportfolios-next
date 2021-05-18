import React, { useEffect, useState } from 'react';
import { Button, Paper } from '../../../components/Custom';
import { LIST_ITEM_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { List } from '../../../components/Custom';
import { goTo, ROUTES } from '../../../actions/goTo';
import ListItemText from '@material-ui/core/ListItemText';

import { useRouter } from 'next/router';
import { formatRoute } from '../../../utils/stringFormats';

export default function BankAccount() {
  const { t } = useTranslation();

  const router = useRouter();
  const { id: entityId } = router.query;

  const [hasAccount, setHasAccount] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);

  useEffect(() => {
    getBankAccounts();
  }, []);

  const getBankAccounts = async () => {
    const { data: hasStripeAccount } = await api(formatRoute('/api/stripe/hasStripeAccount', null, { entityId }));
    setHasAccount(hasStripeAccount);
    const { data: bankAccounts } = await api(formatRoute('/api/stripe/bankAccounts', null, { entityId }));
    const res = bankAccounts.map((b) => ({
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

  const handleClick = async () => {
    if (!hasAccount) {
      const { data } = await api(
        formatRoute('/api/stripe/accountLink', null, {
          entityId,
        })
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
}
