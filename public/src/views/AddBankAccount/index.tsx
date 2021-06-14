import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import Typography from '@material-ui/core/Typography';

// @ts-ignore
import styles from './AddBankAccount.module.css';
import CountrySelect from './CountrySelect';
import CurrencySelect from './CurrencySelect';
import { goTo, ROUTES } from '../../actions/goTo';
import { hasXDigits } from '../../utils/validators';
import Button from '../../components/Custom/Button';
import IgContainer from '../../components/Custom/IgContainer';
import Paper from '../../components/Custom/Paper';
import TextField from '../../components/Custom/TextField';
import api from '../../actions/api';
import { ERROR_ENUM } from '../../../common/errors';
import { ACTION_ENUM, Store } from '../../Store';
import { SEVERITY_ENUM, STATUS_ENUM, TABS_ENUM } from '../../../common/enums';

interface IProps {
  entityId: string;
  id: string;
}

interface IErrors {
  country?: string;
  currency?: string;
  accountHolderName?: string;
  transitNumber?: string;
  institutionNumber?: string;
  accountNumber?: string;
}

interface IValues {
  country?: string;
  currency?: string;
  accountHolderName?: string;
  transitNumber?: number;
  institutionNumber?: number;
  accountNumber?: number;
}

const AddBankAccount: React.FunctionComponent<IProps> = (props) => {
  const { entityId, id } = props;
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { dispatch } = useContext(Store);

  const isANumber = (number: number | undefined): boolean => !isNaN(Number(number));

  const validate = (values: IValues): IErrors => {
    const errors: IErrors = {};
    const { country, currency, accountHolderName, transitNumber, institutionNumber, accountNumber } = values;

    if (!country) {
      errors.country = t('value_is_required');
    }

    if (!currency) {
      errors.currency = t('value_is_required');
    }
    if (!accountHolderName) {
      errors.accountHolderName = t('value_is_required');
    }

    if (!isANumber(transitNumber)) {
      errors.transitNumber = t('value_must_be_numeric');
    } else if (hasXDigits(transitNumber, 5)) {
      errors.transitNumber = t('value_must_have_x_digits', {
        digits: 5,
      });
    }

    if (!isANumber(institutionNumber)) {
      errors.institutionNumber = t('value_must_be_numeric');
    } else if (hasXDigits(institutionNumber, 5)) {
      errors.institutionNumber = t('value_must_have_x_digits', {
        digits: 5,
      });
    }

    if (!accountNumber) {
      errors.accountNumber = t('value_is_required');
    } else if (!isANumber(accountNumber)) {
      errors.accountNumber = t('value_must_be_numeric');
    } else if (hasXDigits(accountNumber, 7)) {
      errors.transitNumber = t('value_must_have_x_digits', {
        digits: 7,
      });
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: { country: 'CA', currency: 'CAD' },
    validate,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values: IValues) => {
      try {
        setIsSubmitting(true);
        const { country, currency, accountHolderName, accountNumber, transitNumber, institutionNumber } = values;

        const params = {
          entityId,
          country: country,
          currency: currency,
          accountHolderName: accountHolderName,
          transitNumber,
          institutionNumber,
          accountNumber,
          id,
        };
        const res = await api('/api/stripe/externalAccount', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        if (res.status === STATUS_ENUM.ERROR) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t(ERROR_ENUM.INVALID_INFORMATION),
            severity: SEVERITY_ENUM.ERROR,
          });
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
          goTo(ROUTES.entity, { id: entityId }, { tab: TABS_ENUM.SETTINGS });
        }
      } catch (err) {
        setIsSubmitting(false);
        throw err;
      }
    },
  });

  return (
    <IgContainer>
      <Paper>
        <div className={styles.main}>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.content}>
              <Typography gutterBottom variant="h5" component="h2">
                {t('add.add_bank_account')}
              </Typography>
              <CountrySelect formik={formik} />
              <CurrencySelect formik={formik} />
              <TextField
                namespace="accountHolderName"
                formik={formik}
                type="accountHolderName"
                label={t('account_holder_name')}
                fullWidth
              />
              <TextField
                namespace="transitNumber"
                formik={formik}
                type="number"
                label={t('transit_number')}
                fullWidth
              />
              <TextField
                namespace="institutionNumber"
                formik={formik}
                type="number"
                label={t('institution_number')}
                fullWidth
              />
              <TextField
                namespace="accountNumber"
                formik={formik}
                type="accountNumber"
                label={t('account_number')}
                fullWidth
              />
            </div>
            <Button
              color="secondary"
              style={{ margin: '16px', width: '25%' }}
              onClick={() => {
                goTo(ROUTES.entity, { id: entityId }, { tab: TABS_ENUM.SETTINGS });
              }}
            >
              {t('cancel')}
            </Button>
            <Button color="primary" type="submit" disabled={isSubmitting} style={{ margin: '16px', width: '25%' }}>
              {t('submit')}
            </Button>
          </form>
        </div>
      </Paper>
    </IgContainer>
  );
};

export default AddBankAccount;
