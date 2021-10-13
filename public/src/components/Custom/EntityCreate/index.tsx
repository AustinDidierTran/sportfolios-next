import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
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
import { EVENT_TYPE, COMPONENT_TYPE_ENUM, GLOBAL_ENUM, TABS_ENUM, REQUEST_STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import ComponentFactory from '../ComponentFactory';
import { Store } from '../../../Store';
import { formatDate } from '../../../utils/stringFormats';

import * as yup from 'yup';
import { addEntity } from '../../../actions/service/entity/post';
import Avatar from '../Avatar';
import { getEntityOwned } from '../../../actions/service/entity/get';
import ImagesList from '../ImageSelection';

interface IProps {
  type: GLOBAL_ENUM;
}
interface ITitleDictionnary {
  [index: string]: string;
}

interface ICreatorOption {
  value: string;
  display: string;
}

const EntityCreate: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { type } = props;
  const {
    state: { userInfo, isAuthenticated },
  } = useContext(Store);
  const { id } = router.query;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [creatorOptions, setCreatorOptions] = useState<ICreatorOption[]>([]);
  const [hasNoImage, setHasNoImage] = useState<boolean>(false);

  useEffect((): void => {
    if (!isAuthenticated) {
      goTo(ROUTES.login, null, { redirectUrl: encodeURIComponent(router.asPath) });
    }
  }, [isAuthenticated]);

  const titleDictionary = useMemo(
    (): ITitleDictionnary => ({
      [GLOBAL_ENUM.ORGANIZATION]: t('create.create_organization'),
      [GLOBAL_ENUM.TEAM]: t('create.create_team'),
      [GLOBAL_ENUM.PERSON]: t('create.create_person'),
      [GLOBAL_ENUM.EVENT]: t('create.create_event'),
    }),
    []
  );

  const entityObject = useMemo((): { title: string } => ({ title: titleDictionary[type] }), [type]);

  const creatingEntity = useMemo((): number => Number(type), [type]);

  const [limit, setLimit] = useState<boolean>(false);

  const getCreatorsOptions = async (): Promise<void> => {
    if (creatingEntity === GLOBAL_ENUM.PERSON) {
      return;
    }

    let creatorEntityType;
    if (creatingEntity === GLOBAL_ENUM.TEAM || creatingEntity === GLOBAL_ENUM.ORGANIZATION) {
      creatorEntityType = GLOBAL_ENUM.PERSON;
    } else if (creatingEntity === GLOBAL_ENUM.EVENT) {
      creatorEntityType = GLOBAL_ENUM.ORGANIZATION;
    }

    const data = await getEntityOwned(Number(creatorEntityType));

    let filteredData = data;

    if (id) {
      filteredData = data.filter((a) => a.id == id);
    }

    if (data) {
      setCreatorOptions(
        filteredData.map((c) => ({
          value: c.id,
          display: `${c.name}${c.surname ? ` ${c.surname}` : ''}`,
        }))
      );
    }
  };

  const onChangeEventType = (e: any): void => {
    formik.setFieldValue('eventType', e);
  };

  useEffect((): void => {
    formik.resetForm();
    getCreatorsOptions();
  }, [type, id]);

  useEffect((): void => {
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
          primary: t('event.event_type'),
        },
        {
          namespace: 'eventType',
          componentType: COMPONENT_TYPE_ENUM.SELECT,
          options: [
            { display: t('team.team_registration_event'), value: EVENT_TYPE.TEAM_LEAGUE },
            { display: t('pick_up_event'), value: EVENT_TYPE.PICK_UP_LEAGUE },
            { display: t('team.team_tournament'), value: EVENT_TYPE.TEAM_TOURNAMENT },
          ],
          onChange: (e: any) => {
            onChangeEventType(e);
          },
          defaultValue: EVENT_TYPE.TEAM_LEAGUE,
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
      photoUrl: yup.string().test('validate', (): boolean => {
        setHasNoImage(formik.values.photoUrl == '');
        return formik.values.photoUrl != '';
      }),
    });
  } else if (creatingEntity === GLOBAL_ENUM.EVENT) {
    if (!limit) {
      validationSchema = yup.object().shape({
        name: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        startDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        startTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        creator: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        photoUrl: yup.string().test('validate', (): boolean => {
          setHasNoImage(formik.values.photoUrl == '');
          return formik.values.photoUrl != '';
        }),
      });
    } else {
      validationSchema = yup.object().shape({
        name: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        maximumSpots: yup.number().min(0, t(ERROR_ENUM.VALUE_IS_INVALID)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        startDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        startTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        creator: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
        photoUrl: yup.string().test('validate', (): boolean => {
          setHasNoImage(formik.values.photoUrl == '');
          return formik.values.photoUrl != '';
        }),
      });
    }
  } else {
    validationSchema = yup.object().shape({
      name: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
      creator: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
      photoUrl: yup.string().test('validate', (): boolean => {
        setHasNoImage(formik.values.photoUrl == '');
        return formik.values.photoUrl != '';
      }),
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
      eventType: EVENT_TYPE.TEAM_LEAGUE,
      photoUrl: '',
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
        photoUrl,
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

      const { id, status } = await addEntity(
        name,
        surname,
        type.toString(),
        creator,
        maximum,
        start,
        end,
        eventType,
        photoUrl
      );
      if (status === REQUEST_STATUS_ENUM.SUCCESS) {
        goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.SETTINGS });
      } else {
        formik.setFieldError('name', t('something_went_wrong'));
      }
      setIsSubmitting(false);
    },
  });

  const handleCancel = (): void => {
    history.back();
  };

  const handleChecked = (): void => {
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
              {fields.map((field: any, index: number) => {
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
              <span style={{ float: 'left', marginTop: '8px' }}>
                <Avatar namespace="photoUrl" photoUrl={formik.values.photoUrl} size="lg" />
              </span>
              <div style={{ marginTop: '8px', alignItems: 'center' }}>
                <ImagesList formik={formik} hasNoImage={hasNoImage} />
              </div>
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
};
export default EntityCreate;
