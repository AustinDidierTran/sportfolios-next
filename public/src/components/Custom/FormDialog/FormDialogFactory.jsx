import React from 'react';

import { FORM_DIALOG_TYPE_ENUM } from '../../../../common/enums';
import dynamic from 'next/dynamic';

const AddEventPaymentOption = dynamic(() => import('./AddEventPaymentOption'));
const AddMember = dynamic(() => import('./AddMember'));
const AddMembership = dynamic(() => import('./AddMembership'));
const AddPartner = dynamic(() => import('./AddPartner'));
const AddPlayer = dynamic(() => import('./AddPlayer'));
const AddPlayerFee = dynamic(() => import('./AddPlayerFee'));
const AddRoster = dynamic(() => import('./AddRoster'));
const AddTeamFee = dynamic(() => import('./AddTeamFee'));
const BecomeMember = dynamic(() => import('./BecomeMember'));
const BecomeMemberCoupon = dynamic(() => import('./BecomeMemberCoupon'));
const CreateTaxRate = dynamic(() => import('./CreateTaxRate'));
const EditEventPaymentOption = dynamic(() => import('./EditEventPaymentOption'));
const EditMemberImport = dynamic(() => import('./EditMemberImport'));
const EditMembership = dynamic(() => import('./EditMembership'));
const EditMembershipTermsAndConditions = dynamic(() => import('./EditMembershipTermsAndConditions'));
const EditPartner = dynamic(() => import('./EditPartner'));
const EditPlayer = dynamic(() => import('./EditPlayer'));
const EditRoster = dynamic(() => import('./EditRoster'));
const EditRosterPlayer = dynamic(() => import('./EditRosterPlayer'));
const EnterEmail = dynamic(() => import('./EnterEmail'));
const JoinTeam = dynamic(() => import('./JoinTeam'));
const MembersReport = dynamic(() => import('./MembersReport'));
const RosterPlayerOptions = dynamic(() => import('./RosterPlayerOptions'));
const SalesReport = dynamic(() => import('./SalesReport'));
const SubmitScoreAndSpiritForm = dynamic(() => import('./SubmitScoreSpiritForm'));

const FormDialogMap = {
  [FORM_DIALOG_TYPE_ENUM.ADD_EVENT_PAYMENT_OPTION]: AddEventPaymentOption,
  [FORM_DIALOG_TYPE_ENUM.ADD_MEMBER]: AddMember,
  [FORM_DIALOG_TYPE_ENUM.ADD_MEMBERSHIP]: AddMembership,
  [FORM_DIALOG_TYPE_ENUM.ADD_PARTNER]: AddPartner,
  [FORM_DIALOG_TYPE_ENUM.ADD_PLAYER_FEE]: AddPlayerFee,
  [FORM_DIALOG_TYPE_ENUM.ADD_PLAYER]: AddPlayer,
  [FORM_DIALOG_TYPE_ENUM.ADD_ROSTER]: AddRoster,
  [FORM_DIALOG_TYPE_ENUM.ADD_TEAM_FEE]: AddTeamFee,
  [FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER_COUPON]: BecomeMemberCoupon,
  [FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER]: BecomeMember,
  [FORM_DIALOG_TYPE_ENUM.CREATE_TAX_RATE]: CreateTaxRate,
  [FORM_DIALOG_TYPE_ENUM.EDIT_EVENT_PAYMENT_OPTION]: EditEventPaymentOption,
  [FORM_DIALOG_TYPE_ENUM.EDIT_MEMBER_IMPORT]: EditMemberImport,
  [FORM_DIALOG_TYPE_ENUM.EDIT_MEMBERSHIP_TERMS_AND_CONDITIONS]: EditMembershipTermsAndConditions,
  [FORM_DIALOG_TYPE_ENUM.EDIT_MEMBERSHIP]: EditMembership,
  [FORM_DIALOG_TYPE_ENUM.EDIT_PARTNER]: EditPartner,
  [FORM_DIALOG_TYPE_ENUM.EDIT_PLAYER]: EditPlayer,
  [FORM_DIALOG_TYPE_ENUM.EDIT_ROSTER_PLAYER]: EditRosterPlayer,
  [FORM_DIALOG_TYPE_ENUM.EDIT_ROSTER]: EditRoster,
  [FORM_DIALOG_TYPE_ENUM.ENTER_EMAIL]: EnterEmail,
  [FORM_DIALOG_TYPE_ENUM.JOIN_TEAM]: JoinTeam,
  [FORM_DIALOG_TYPE_ENUM.MEMBERS_REPORT]: MembersReport,
  [FORM_DIALOG_TYPE_ENUM.ROSTER_PLAYER_OPTIONS]: RosterPlayerOptions,
  [FORM_DIALOG_TYPE_ENUM.SALES_REPORT]: SalesReport,
  [FORM_DIALOG_TYPE_ENUM.SUBMIT_SCORE_AND_SPIRIT]: SubmitScoreAndSpiritForm,
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
