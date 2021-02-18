import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';

import api from '../../../actions/api';
import { ROUTES, goTo } from '../../../actions/goTo';

import { useTranslation } from 'react-i18next';

import styles from './Create.module.css';

import CustomPaper from '../Paper';
import CustomButton from '../Button';
import IgContainer from '../IgContainer';
import LoadingSpinner from '../LoadingSpinner';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { COMPONENT_TYPE_ENUM, GLOBAL_ENUM, STATUS_ENUM, TABS_ENUM } from '../../../../common/enums';
import ComponentFactory from '../ComponentFactory';
import { Store } from '../../../Store';
import { formatRoute } from '../../../../common/utils/stringFormat';

export default function EntityCreate(props) {
  const { t } = useTranslation();
  const { type } = props;
  const {
    state: { userInfo },
  } = useContext(Store);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creatorOptions, setCreatorOptions] = useState([]);

  const titleDictionary = useMemo(
    () => ({
      [GLOBAL_ENUM.ORGANIZATION]: t('create.create_organization'),
      [GLOBAL_ENUM.TEAM]: t('create.create_team'),
      [GLOBAL_ENUM.PERSON]: t('create.create_person'),
      [GLOBAL_ENUM.EVENT]: t('create.create_event'),
    }),
    []
  );

  const entityObject = useMemo(() => ({ title: titleDictionary[type] }), [type]);

  const creatingEntity = useMemo(() => Number(type), [type]);

  const getCreatorsOptions = async () => {
    if (creatingEntity === GLOBAL_ENUM.PERSON) {
      return;
    }

    let creatorEntityType;
    if (creatingEntity === GLOBAL_ENUM.TEAM || creatingEntity === GLOBAL_ENUM.ORGANIZATION) {
      creatorEntityType = GLOBAL_ENUM.PERSON;
    } else if (creatingEntity === GLOBAL_ENUM.EVENT) {
      creatorEntityType = GLOBAL_ENUM.ORGANIZATION;
    }

    const { status, data } = await api(
      formatRoute('/api/entity/allOwned', null, {
        type: creatorEntityType,
      }),
      { method: 'GET' }
    );

    if (status === STATUS_ENUM.SUCCESS) {
      setCreatorOptions(
        data.map((c) => ({
          value: c.id,
          display: `${c.name}${c.surname ? ` ${c.surname}` : ''}`,
        }))
      );
    }
  };

  useEffect(() => {
    formik.resetForm();
    getCreatorsOptions();
  }, [type]);

  useEffect(() => {
    if (!creatorOptions.length) {
      return;
    }

    if (creatingEntity === GLOBAL_ENUM.EVENT) {
      formik.setFieldValue('creator', creatorOptions[0].value);
    } else if (creatingEntity === GLOBAL_ENUM.TEAM || creatingEntity === GLOBAL_ENUM.ORGANIZATION) {
      if (!userInfo.primaryPerson) {
        return;
      }
      formik.setFieldValue('creator', userInfo.primaryPerson.entity_id);
    }
  }, [creatorOptions]);

  const fields = useMemo(() => {
    if (creatingEntity === GLOBAL_ENUM.PERSON) {
      return [
        {
          namespace: 'name',
          label: t('name'),
          type: 'text',
        },
        {
          namespace: 'surname',
          label: t('surname'),
          type: 'text',
        },
      ];
    }
    return [
      {
        namespace: 'name',
        label: t('name'),
        type: 'text',
      },
      {
        namespace: 'creator',
        label: t('create.create_as'),
        componentType: COMPONENT_TYPE_ENUM.SELECT,
        showTextIfOnlyOneOption: creatorOptions.length === 1,
        options: creatorOptions,
      },
    ];
  }, [type, creatorOptions]);

  const validate = (values) => {
    const errors = {};
    const { name, surname, creator } = values;
    if (!name) {
      errors.name = t('value_is_required');
    } else {
      if (name.length > 64) {
        formik.setFieldValue('name', name.slice(0, 64));
      }
    }
    if (creatingEntity === GLOBAL_ENUM.PERSON && !surname.length) {
      errors.surname = t('value_is_required');
    } else if (surname.length > 64) {
      formik.setFieldValue('surname', surname.slice(0, 64));
    }
    if (creatingEntity !== GLOBAL_ENUM.PERSON && !creator.length) {
      errors.creator = t('value_is_required');
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      creator: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { name, surname, creator } = values;
      setIsSubmitting(true);
      try {
        const res = await api('/api/entity', {
          method: 'POST',
          body: JSON.stringify({
            name,
            surname,
            type,
            creator,
          }),
        });
        goTo(ROUTES.entity, { id: res.data.id }, { tab: TABS_ENUM.SETTINGS });
        setIsSubmitting(false);
      } catch (err) {
        setIsSubmitting(false);
        formik.setFieldError('name', t('something_went_wrong'));
        throw err;
      }
    },
  });

  const handleCancel = () => {
    goTo(ROUTES.home);
  };

  if (isSubmitting) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <div className={styles.main}>
        <form onSubmit={formik.handleSubmit}>
          <CustomPaper className={styles.card} title={entityObject.title}>
            <CardContent>
              {fields.map((field, index) => (
                <div style={{ marginTop: '8px' }} key={index}>
                  <ComponentFactory component={{ ...field, formik }} />
                </div>
              ))}
            </CardContent>
            <CardActions className={styles.buttons}>
              <>
                <CustomButton
                  size="small"
                  color="primary"
                  variant="contained"
                  className={styles.button}
                  type="submit"
                  endIcon="Check"
                >
                  {t('done')}
                </CustomButton>
                <CustomButton
                  size="small"
                  color="secondary"
                  variant="contained"
                  className={styles.button}
                  endIcon="Close"
                  onClick={handleCancel}
                >
                  {t('cancel')}
                </CustomButton>
              </>
            </CardActions>
          </CustomPaper>
        </form>
      </div>
    </IgContainer>
  );
}
