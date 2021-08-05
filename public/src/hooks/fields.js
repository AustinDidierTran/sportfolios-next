import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EVENT_TYPE, COMPONENT_TYPE_ENUM, FIELD_GROUP_ENUM } from '../../common/enums';
import moment from 'moment';
import { formatPrice } from '../utils/stringFormats';

export const useFields = (type, options) => {
  const { t } = useTranslation();
  const field = useMemo(() => {
    if (type === FIELD_GROUP_ENUM.ADD_PAYMENT_OPTION) {
      const {
        owners,
        teamPriceTotal,
        teamOnClick,
        onClickDeleteTeamsFee,
        onClickEditTeamsFee,
        eventType,
        onClickEditPlayerFee,
        onClickDeletePlayerFee,
        playerOnClick,
        playerPriceTotal,
        onManualAcceptationChange,
        manualAcceptation,
      } = options;
      return [
        {
          namespace: 'name',
          label: t('name'),
          type: 'text',
        },
        {
          componentType: COMPONENT_TYPE_ENUM.DIVIDER,
          style: { marginBottom: '24px', marginTop: '16px' },
        },
        eventType === EVENT_TYPE.TEAM
          ? teamPriceTotal
            ? {
                namespace: 'showTeamPrice',
                componentType: COMPONENT_TYPE_ENUM.TEXT_DOUBLE_BUTTON,
                value: t('register.registration_fee_team', { fee: formatPrice(teamPriceTotal * 100) }),
                firstIcon: 'Edit',
                firstOnClick: onClickEditTeamsFee,
                firstTooltip: t('edit.edit'),
                secondIcon: 'Delete',
                secondOnClick: onClickDeleteTeamsFee,
                secondTooltip: t('delete.delete'),
              }
            : {
                componentType: COMPONENT_TYPE_ENUM.BUTTON,
                children: t('add.add_team_fees'),
                onClick: teamOnClick,
                disabled: !owners.length,
              }
          : {
              componentType: COMPONENT_TYPE_ENUM.EMPTY,
            },
        playerPriceTotal
          ? {
              componentType: COMPONENT_TYPE_ENUM.TEXT_DOUBLE_BUTTON,
              value: t('register.registration_fee_player', { fee: formatPrice(playerPriceTotal * 100) }),
              firstIcon: 'Edit',
              firstOnClick: onClickEditPlayerFee,
              firstTooltip: t('edit.edit'),
              secondIcon: 'Delete',
              secondOnClick: onClickDeletePlayerFee,
              secondTooltip: t('delete.delete'),
            }
          : {
              componentType: COMPONENT_TYPE_ENUM.BUTTON,
              children: t('add.add_player_fees'),
              onClick: playerOnClick,
              disabled: !owners.length,
            },
        !owners.length
          ? {
              componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
              secondary: t('one_admin_need_bank_account'),
            }
          : {
              componentType: COMPONENT_TYPE_ENUM.EMPTY,
            },
        {
          componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
          checked: manualAcceptation,
          namespace: 'manualAcceptation',
          label: t('manual_acceptation'),
          onChange: onManualAcceptationChange,
          tooltip:
            eventType === 'team' ? t('team.team_acceptation_step_message') : t('player_acceptation_step_message'),
        },
        {
          componentType: COMPONENT_TYPE_ENUM.DIVIDER,
          style: { marginBottom: '24px', marginTop: '16px' },
        },
        {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          primaryTypographyProps: { variant: 'h6' },
          primary: t('payment.payment_management'),
        },
        owners.length
          ? {
              namespace: 'ownerId',
              label: t('payment.payment_option_owner'),
              componentType: COMPONENT_TYPE_ENUM.SELECT,
              options: owners,
            }
          : {
              componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
              primary: t('no.no_admins_with_bank_account'),
            },
        {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          secondary: t('all_the_admins_of_the_event_that_have_a_bank_account_linked_to_their_account_will_appear_here'),
        },
        {
          componentType: COMPONENT_TYPE_ENUM.DIVIDER,
          style: { marginBottom: '24px', marginTop: '16px' },
        },
        {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          primaryTypographyProps: { variant: 'h6' },
          primary: t('register.registration'),
        },
        {
          namespace: 'openDate',
          label: t('register.registration_open_date'),
          type: 'date',
          initialValue: moment().format('YYYY-MM-DD'),
          shrink: true,
        },
        {
          namespace: 'openTime',
          label: t('register.registration_open_time'),
          type: 'time',
          initialValue: '00:00',
          shrink: true,
        },
        {
          namespace: 'closeDate',
          label: t('register.registration_close_date'),
          type: 'date',
          shrink: true,
        },
        {
          namespace: 'closeTime',
          label: t('register.registration_close_time'),
          type: 'time',
          initialValue: '23:59',
          shrink: true,
        },
        {
          componentType: COMPONENT_TYPE_ENUM.DIVIDER,
          style: { marginBottom: '24px', marginTop: '16px' },
        },
        {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          primaryTypographyProps: { variant: 'h6' },
          primary: t('additional_informations'),
        },
        {
          componentType: COMPONENT_TYPE_ENUM.TEXT_FIELD_BOX,
          namespace: 'informations',
          label: t('required_informations_optional'),
          variant: 'filled',
          rows: 5,
          rowsMax: 5,
          style: { width: '100%' },
        },
      ];
    }
  }, [type, options]);
  return field;
};
