import { GLOBAL_ENUM, LIST_ITEM_ENUM, NOTIFICATION_TYPE } from '../../../../common/enums';
import dynamic from 'next/dynamic';

const { AvatarAndTextSkeleton } = dynamic(() => import('./SkeletonItems'));
const AddedToEventItem = dynamic(() => import('./NotificationItem/AddedToEventItem'));
const AddedToTeamItem = dynamic(() => import('./NotificationItem/AddedToTeamItem'));
const RequestToJoinTeamItem = dynamic(() => import('./NotificationItem/RequestToJoinTeamItem'));
const AppItem = dynamic(() => import('./AppItem'));
const BankAccountItem = dynamic(() => import('./BankAccountItem'));
const CartItem = dynamic(() => import('./CartItem'));
const ConfirmOrDeclineScoreNotificationItem = dynamic(() =>
  import('./NotificationItem/ConfirmOrDeclineScoreNotificationItem')
);
const CreateEntityItem = dynamic(() => import('./CreateEntityItem'));
const CreditCardItem = dynamic(() => import('./CreditCardItem'));
const DefaultItem = dynamic(() => import('./DefaultItem'));
const EventCreatorItem = dynamic(() => import('./EventCreatorItem'));
const EventItem = dynamic(() => import('./EventItem'));
const MembershipDetailItem = dynamic(() => import('./MembershipDetailItem'));
const MembershipInfoItem = dynamic(() => import('./MembershipInfoItem'));
const MembershipItem = dynamic(() => import('./MembershipItem'));
const MembershipOrganizationItem = dynamic(() => import('./MembershipOrganizationItem'));
const NotificationSettingItem = dynamic(() => import('./NotificationSettingItem'));
const OrganizationItem = dynamic(() => import('./OrganizationItem'));
const PartnerItem = dynamic(() => import('./PartnerItem'));
const PaymentOptionItem = dynamic(() => import('./PaymentOptionItem'));
const PersonItem = dynamic(() => import('./PersonItem'));
const PurchasesItem = dynamic(() => import('./PurchasesItem'));
const RankingItem = dynamic(() => import('./RankingItem'));
const RankingWithStatsItem = dynamic(() => import('./RankingWithStatsItem'));
const ReportItemFactory = dynamic(() => import('./ReportItemFactory'));
const RosterItem = dynamic(() => import('./RosterItem'));
const SalesItem = dynamic(() => import('./SalesItem'));
const TeamItem = dynamic(() => import('./TeamItem'));
const ScoreSubmissionConflictNotificationItem = dynamic(() =>
  import('./NotificationItem/ScoreSubmissionConflictNotificationItem')
);
const ScoreSubmissionRequestNotificationItem = dynamic(() =>
  import('./NotificationItem/ScoreSubmissionRequestNotificationItem')
);
const TeamItem = dynamic(() => import('./TeamItem'));

const ItemMap = {
  [GLOBAL_ENUM.EVENT]: EventItem,
  [GLOBAL_ENUM.ORGANIZATION]: OrganizationItem,
  [GLOBAL_ENUM.PERSON]: PersonItem,
  [GLOBAL_ENUM.TEAM]: TeamItem,
  [LIST_ITEM_ENUM.APP_ITEM]: AppItem,
  [LIST_ITEM_ENUM.AVATAR_TEXT_SKELETON]: AvatarAndTextSkeleton,
  [LIST_ITEM_ENUM.BANK_ACCOUNT]: BankAccountItem,
  [LIST_ITEM_ENUM.CART]: CartItem,
  [LIST_ITEM_ENUM.CREATE_ENTITY]: CreateEntityItem,
  [LIST_ITEM_ENUM.CREDIT_CARD]: CreditCardItem,
  [LIST_ITEM_ENUM.EVENT_CREATOR]: EventCreatorItem,
  [LIST_ITEM_ENUM.MEMBERSHIP_DETAIL]: MembershipDetailItem,
  [LIST_ITEM_ENUM.MEMBERSHIP_INFO]: MembershipInfoItem,
  [LIST_ITEM_ENUM.MEMBERSHIP_ORGANIZATION]: MembershipOrganizationItem,
  [LIST_ITEM_ENUM.MEMBERSHIP]: MembershipItem,
  [LIST_ITEM_ENUM.NOTIFICATION_SETTING]: NotificationSettingItem,
  [LIST_ITEM_ENUM.PARTNER]: PartnerItem,
  [LIST_ITEM_ENUM.PAYMENT_OPTION]: PaymentOptionItem,
  [LIST_ITEM_ENUM.PURCHASES]: PurchasesItem,
  [LIST_ITEM_ENUM.RANKING_WITH_STATS]: RankingWithStatsItem,
  [LIST_ITEM_ENUM.RANKING]: RankingItem,
  [LIST_ITEM_ENUM.REPORT]: ReportItemFactory,
  [LIST_ITEM_ENUM.ROSTER_ITEM]: RosterItem,
  [LIST_ITEM_ENUM.SALES]: SalesItem,
  [NOTIFICATION_TYPE.ADDED_TO_EVENT]: AddedToEventItem,
  [NOTIFICATION_TYPE.ADDED_TO_TEAM]: AddedToTeamItem,
  [NOTIFICATION_TYPE.REQUEST_TO_JOIN_TEAM]: RequestToJoinTeamItem,
  [NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE]: ConfirmOrDeclineScoreNotificationItem,
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_CONFLICT]: ScoreSubmissionConflictNotificationItem,
  [NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST]: ScoreSubmissionRequestNotificationItem,
};

export default function ItemFactory(props) {
  const { type } = props;
  const Item = ItemMap[type];

  if (!Item) {
    /* eslint-disable-next-line */
    //console.error(`${type} is not supported in ItemFactory`);
    return DefaultItem;
  }

  return Item;
}
