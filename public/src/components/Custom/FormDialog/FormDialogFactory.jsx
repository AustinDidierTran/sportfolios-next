import { FORM_DIALOG_TYPE_ENUM } from '../../../../common/enums';
import loadable from '@loadable/component';

const AddEventPaymentOption = loadable(() => import('./AddEventPaymentOption'));
const EditEventPaymentOption = loadable(() => import('./EditEventPaymentOption'));
const AddMember = loadable(() => import('./AddMember'));
const AddMembership = loadable(() => import('./AddMembership'));
const BecomeMember = loadable(() => import('./BecomeMember'));
const BecomeMemberCoupon = loadable(() => import('./BecomeMemberCoupon'));
const MembersReport = loadable(() => import('./MembersReport'));
const SalesReport = loadable(() => import('./SalesReport'));
const EditMembership = loadable(() => import('./EditMembership'));
const EditMemberImport = loadable(() => import('./EditMemberImport'));
const EnterEmail = loadable(() => import('./EnterEmail'));
const CreateTaxRate = loadable(() => import('./CreateTaxRate'));
const RosterPlayerOptions = loadable(() => import('./RosterPlayerOptions'));
const SubmitScoreAndSpiritForm = loadable(() => import('./SubmitScoreSpiritForm'));

const FormDialogMap = {
  [FORM_DIALOG_TYPE_ENUM.ADD_EVENT_PAYMENT_OPTION]: AddEventPaymentOption,
  [FORM_DIALOG_TYPE_ENUM.EDIT_EVENT_PAYMENT_OPTION]: EditEventPaymentOption,
  [FORM_DIALOG_TYPE_ENUM.ADD_MEMBER]: AddMember,
  [FORM_DIALOG_TYPE_ENUM.ADD_MEMBERSHIP]: AddMembership,
  [FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER]: BecomeMember,
  [FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER_COUPON]: BecomeMemberCoupon,
  [FORM_DIALOG_TYPE_ENUM.MEMBERS_REPORT]: MembersReport,
  [FORM_DIALOG_TYPE_ENUM.SALES_REPORT]: SalesReport,
  [FORM_DIALOG_TYPE_ENUM.EDIT_MEMBERSHIP]: EditMembership,
  [FORM_DIALOG_TYPE_ENUM.EDIT_MEMBER_IMPORT]: EditMemberImport,
  [FORM_DIALOG_TYPE_ENUM.EDIT_MEMBERSHIP]: EditMembership,
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
