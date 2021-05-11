import React from 'react';

import { FORM_DIALOG_TYPE_ENUM } from '../../../../common/enums';
import dynamic from 'next/dynamic';

const AddEventPaymentOption = dynamic(() => import('./AddEventPaymentOption'));
const EditEventPaymentOption = dynamic(() => import('./EditEventPaymentOption'));
const AddMember = dynamic(() => import('./AddMember'));
const AddMembership = dynamic(() => import('./AddMembership'));
const AddTeamFee = dynamic(() => import('./AddTeamFee'));
const AddPlayerFee = dynamic(() => import('./AddPlayerFee'));
const BecomeMember = dynamic(() => import('./BecomeMember'));
const BecomeMemberCoupon = dynamic(() => import('./BecomeMemberCoupon'));
const MembersReport = dynamic(() => import('./MembersReport'));
const SalesReport = dynamic(() => import('./SalesReport'));
const EditMembership = dynamic(() => import('./EditMembership'));
const EditMembershipTermsAndConditions = dynamic(() => import('./EditMembershipTermsAndConditions'));
const EditMemberImport = dynamic(() => import('./EditMemberImport'));
const EnterEmail = dynamic(() => import('./EnterEmail'));
const CreateTaxRate = dynamic(() => import('./CreateTaxRate'));
const RosterPlayerOptions = dynamic(() => import('./RosterPlayerOptions'));
const SubmitScoreAndSpiritForm = dynamic(() => import('./SubmitScoreSpiritForm'));

const FormDialogMap = {
  [FORM_DIALOG_TYPE_ENUM.ADD_EVENT_PAYMENT_OPTION]: AddEventPaymentOption,
  [FORM_DIALOG_TYPE_ENUM.EDIT_EVENT_PAYMENT_OPTION]: EditEventPaymentOption,
  [FORM_DIALOG_TYPE_ENUM.ADD_MEMBER]: AddMember,
  [FORM_DIALOG_TYPE_ENUM.ADD_MEMBERSHIP]: AddMembership,
  [FORM_DIALOG_TYPE_ENUM.ADD_TEAM_FEE]: AddTeamFee,
  [FORM_DIALOG_TYPE_ENUM.ADD_PLAYER_FEE]: AddPlayerFee,
  [FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER]: BecomeMember,
  [FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER_COUPON]: BecomeMemberCoupon,
  [FORM_DIALOG_TYPE_ENUM.MEMBERS_REPORT]: MembersReport,
  [FORM_DIALOG_TYPE_ENUM.SALES_REPORT]: SalesReport,
  [FORM_DIALOG_TYPE_ENUM.EDIT_MEMBERSHIP]: EditMembership,
  [FORM_DIALOG_TYPE_ENUM.EDIT_MEMBERSHIP_TERMS_AND_CONDITIONS]: EditMembershipTermsAndConditions,
  [FORM_DIALOG_TYPE_ENUM.EDIT_MEMBER_IMPORT]: EditMemberImport,
  [FORM_DIALOG_TYPE_ENUM.ENTER_EMAIL]: EnterEmail,
  [FORM_DIALOG_TYPE_ENUM.ROSTER_PLAYER_OPTIONS]: RosterPlayerOptions,
  [FORM_DIALOG_TYPE_ENUM.SUBMIT_SCORE_AND_SPIRIT]: SubmitScoreAndSpiritForm,
  [FORM_DIALOG_TYPE_ENUM.CREATE_TAX_RATE]: CreateTaxRate,
};

export default function FormDialogFactory(props) {
  const { type } = props;

  const FormDialog = FormDialogMap[type];

  if (!FormDialog) {
    /* eslint-disable-next-line */
    console.error(`${type} is not supported in FormDialogFactory`);
    return <div></div>;
  }

  return FormDialog;
}
