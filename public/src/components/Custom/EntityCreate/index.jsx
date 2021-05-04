import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';

import api from '../../../actions/api';
import { ROUTES, goTo } from '../../../actions/goTo';

import { useTranslation } from 'react-i18next';

import styles from './Create.module.css';
import moment from 'moment';
import CustomPaper from '../Paper';
import CustomButton from '../Button';
import IgContainer from '../IgContainer';
import LoadingSpinner from '../LoadingSpinner';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { COMPONENT_TYPE_ENUM, GLOBAL_ENUM, STATUS_ENUM, TABS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import ComponentFactory from '../ComponentFactory';
import { Store } from '../../../Store';
import { formatRoute } from '../../../../common/utils/stringFormat';
import { useRouter } from 'next/router';
import { formatDate } from '../../../../src/utils/stringFormats';

import * as yup from 'yup';

export default function EntityCreate(props) {
  const { t } = useTranslation();
  const { type } = props;
  const {
    state: { userInfo },
  } = useContext(Store);

  const router = useRouter();
  const { id } = router.query;

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
        onlyAdmin: true,
      }),
      { method: 'GET' }
    );

    let filteredData = data;

    if (id) {
      filteredData = data.filter((a) => a.id == id);
    }

    if (status === STATUS_ENUM.SUCCESS) {
      setCreatorOptions(
        filteredData.map((c) => ({
          value: c.id,
          display: `${c.name}${c.surname ? ` ${c.surname}` : ''}`,
        }))
      );
    }
  };

  useEffect(() => {
    formik.resetForm();
    getCreatorsOptions();
  }, [type, id]);

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
    if (creatingEntity === GLOBAL_ENUM.EVENT) {
      return [
        {
          namespace: 'name',
          label: t('name'),
          type: 'text',
        },
        {
          namespace: 'maximumSpots',
          label: t('maximum_spots'),
          type: 'number',
        },
        {
          namespace: 'startDate',
          label: t('event.event_start_date'),
          type: 'date',
          shrink: true,
        },
        {
          namespace: 'startTime',
          label: t('event.event_start_time'),
          type: 'time',
          shrink: true,
        },
        {
          namespace: 'endDate',
          label: t('event.event_end_date'),
          type: 'date',
          shrink: true,
        },
        {
          namespace: 'endTime',
          label: t('event.event_end_time'),
          type: 'time',
          shrink: true,
        },
        {
          namespace: 'creator',
          label: t('create.create_as'),
          componentType: COMPONENT_TYPE_ENUM.SELECT,
          showTextIfOnlyOneOption: creatorOptions.length === 1,
          options: creatorOptions,
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

  let validationSchema;
  if (creatingEntity === GLOBAL_ENUM.PERSON) {
    validationSchema = yup.object().shape({
      name: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
      surname: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    });
  } else if (creatingEntity === GLOBAL_ENUM.EVENT) {
    validationSchema = yup.object().shape({
      name: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
      maximumSpots: yup.number().min(0, t(ERROR_ENUM.VALUE_IS_INVALID)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
      startDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
      startTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
      creator: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    });
  } else {
    validationSchema = yup.object().shape({
      name: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
      creator: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    });
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      creator: '',
      maximumSpots: '',
      startDate: formatDate(moment.parseZone(new Date().toLocaleString()), 'YYYY-MM-DDThh:mm'),
      endDate: '',
      endTime: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { name, surname, creator, maximumSpots, startDate, endDate, startTime, endTime } = values;
      setIsSubmitting(true);
      let start = new Date(`${startDate} ${startTime}`).getTime();
      let end = new Date(`${endDate} ${endTime}`).getTime();

      if (!moment(start).isValid()) {
        start = null;
      }
      if (!moment(end).isValid()) {
        end = null;
      }
      try {
        const res = await api('/api/entity', {
          method: 'POST',
          body: JSON.stringify({
            name,
            surname,
            type,
            creator,
            maximumSpots,
            startDate: start,
            endDate: end,
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
    history.back();
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
