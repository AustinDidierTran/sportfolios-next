import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';

import api from '../../../actions/api';
import { ROUTES, goTo } from '../../../actions/goTo';
import { useRouter } from 'next/router';

import { useTranslation } from 'react-i18next';

import styles from './Create.module.css';
import moment from 'moment';
import CustomPaper from '../Paper';
import CustomButton from '../Button';
import IgContainer from '../IgContainer';
import LoadingSpinner from '../LoadingSpinner';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { EVENT_TYPE, COMPONENT_TYPE_ENUM, GLOBAL_ENUM, NUMBER_STATUS_ENUM, TABS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import ComponentFactory from '../ComponentFactory';
import { Store } from '../../../Store';
import { formatRoute } from '../../../utils/stringFormats';
import { formatDate } from '../../../utils/stringFormats';

import * as yup from 'yup';
import { addEntity } from '../../../actions/service/entity/post';

export default function EntityCreate(props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { type } = props;
  const {
    state: { userInfo },
  } = useContext(Store);
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

  const [limit, setLimit] = useState(false);

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

    if (status === NUMBER_STATUS_ENUM.SUCCESS) {
      setCreatorOptions(
        filteredData.map((c) => ({
          value: c.id,
          display: `${c.name}${c.surname ? ` ${c.surname}` : ''}`,
        }))
      );
    }
  };

  const onChangeEventType = (e) => {
    formik.setFieldValue('eventType', e.target.value);
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
      formik.setFieldValue('creator', userInfo.primaryPerson.personId);
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
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          primaryTypographyProps: { variant: 'h6' },
          primary: t('register.registration_type'),
        },
        {
          namespace: 'eventType',
          componentType: COMPONENT_TYPE_ENUM.RADIO_GROUP,
          options: [
            { display: t('by_team'), value: EVENT_TYPE.TEAM },
            { display: t('by_player'), value: EVENT_TYPE.PLAYER },
          ],
          onChange: (e) => {
            onChangeEventType(e);
          },
          defaultValue: EVENT_TYPE.TEAM,
          row: true,
        },
        {
          namespace: 'name',
          label: t('name'),
          type: 'text',
        },
        {
          namespace: 'maximumSpots',
          label: t('maximum_spots'),
          type: 'number',
          disabled: !limit,
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
  }, [type, creatorOptions, limit]);

  let validationSchema;
  if (creatingEntity === GLOBAL_ENUM.PERSON) {
    validationSchema = yup.object().shape({
      name: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
      surname: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    });
  } else if (creatingEntity === GLOBAL_ENUM.EVENT) {
    if (!limit) {
      validationSchema = yup.object().shape({
        name: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        startDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        startTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        creator: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
      });
    } else {
      validationSchema = yup.object().shape({
        name: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        maximumSpots: yup.number().min(0, t(ERROR_ENUM.VALUE_IS_INVALID)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        startDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        startTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        creator: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
      });
    }
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
      startDate: formatDate(moment.parseZone(new Date().toLocaleString()), 'YYYY-MM-DD'),
      startTime: '09:00',
      endDate: '',
      endTime: '',
      eventType: EVENT_TYPE.TEAM,
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const {
        name,
        surname: surnameProps,
        creator,
        maximumSpots,
        startDate,
        endDate,
        startTime,
        endTime,
        eventType,
      } = values;
      setIsSubmitting(true);
      let start = `${startDate} ${startTime}`;
      let end = `${endDate} ${endTime}`;
      let surname = '';
      if (!moment(start).isValid()) {
        start = null;
      }
      if (!moment(end).isValid()) {
        end = null;
      }
      let maximum = maximumSpots;
      if (!limit) {
        maximum = null;
      }
      if (surnameProps) {
        surname = surnameProps;
      }
      try {
        const id = await addEntity(name, surname, type, creator, maximum, start, end, eventType);
        goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.SETTINGS });
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

  const handleChecked = () => {
    setLimit(!limit);
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
              {fields.map((field, index) => {
                return field.label == t('maximum_spots') ? (
                  <div className={styles.row}>
                    <span style={{ marginLeft: '-12px', marginTop: '8px', float: 'left' }}>
                      <ComponentFactory
                        component={{
                          componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
                          label: t('set_limit_of_spots'),
                          onChange: handleChecked,
                        }}
                      />
                    </span>
                    <span style={{ float: 'left' }} key={index}>
                      <ComponentFactory component={{ ...field, formik }} />
                    </span>
                  </div>
                ) : (
                  <div style={{ marginTop: '8px' }} key={index}>
                    <ComponentFactory component={{ ...field, formik }} />
                  </div>
                );
              })}
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
