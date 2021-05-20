import { GLOBAL_ENUM, LIST_ITEM_ENUM, NOTIFICATION_TYPE } from '../../../../common/enums';
import dynamic from 'next/dynamic';

const AppItem = dynamic(() => import('./AppItem'));
const BankAccountItem = dynamic(() => import('./BankAccountItem'));
const CartItem = dynamic(() => import('./CartItem'));
const CreateEntityItem = dynamic(() => import('./CreateEntityItem'));
const CreditCardItem = dynamic(() => import('./CreditCardItem'));
const DefaultItem = dynamic(() => import('./DefaultItem'));
const EventCreatorItem = dynamic(() => import('./EventCreatorItem'));
const EventItem = dynamic(() => import('./EventItem'));
const MembershipDetailItem = dynamic(() => import('./MembershipDetailItem'));
const MembershipItem = dynamic(() => import('./MembershipItem'));
const PartnerItem = dynamic(() => import('./PartnerItem'));
const MembershipInfoItem = dynamic(() => import('./MembershipInfoItem'));
const MembershipOrganizationItem = dynamic(() => import('./MembershipOrganizationItem'));
const OrganizationItem = dynamic(() => import('./OrganizationItem'));
const PaymentOptionItem = dynamic(() => import('./PaymentOptionItem'));
const PersonItem = dynamic(() => import('./PersonItem'));
const PurchasesItem = dynamic(() => import('./PurchasesItem'));
const RankingItem = dynamic(() => import('./RankingItem'));
const RankingWithStatsItem = dynamic(() => import('./RankingWithStatsItem'));
const ReportItemFactory = dynamic(() => import('./ReportItemFactory'));
const RosterItem = dynamic(() => import('./RosterItem'));
const SalesItem = dynamic(() => import('./SalesItem'));
const TeamItem = dynamic(() => import('./TeamItem'));
const { AvatarAndTextSkeleton } = dynamic(() => import('./SkeletonItems'));
const NotificationSettingItem = dynamic(() => import('./NotificationSettingItem'));
const RosterNotificationItem = dynamic(() => import('./NotificationItem/RosterNotificationItem'));
const ScoreSubmissionConflictNotificationItem = dynamic(() =>
  import('./NotificationItem/ScoreSubmissionConflictNotificationItem')
);
const ScoreSubmissionRequestNotificationItem = dynamic(() =>
  import('./NotificationItem/ScoreSubmissionRequestNotificationItem')
);
const ConfirmOrDeclineScoreNotificationItem = dynamic(() =>
  import('./NotificationItem/ConfirmOrDeclineScoreNotificationItem')
);

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
  [LIST_ITEM_ENUM.MEMBERSHIP_ORGANIZATION]: MembershipOrganizationItem,
  [LIST_ITEM_ENUM.MEMBERSHIP]: MembershipItem,
  [LIST_ITEM_ENUM.MEMBERSHIP_INFO]: MembershipInfoItem,
  [LIST_ITEM_ENUM.NOTIFICATION_SETTING]: NotificationSettingItem,
  [LIST_ITEM_ENUM.PARTNER]: PartnerItem,
  [LIST_ITEM_ENUM.PAYMENT_OPTION]: PaymentOptionItem,
  [LIST_ITEM_ENUM.PURCHASES]: PurchasesItem,
  [LIST_ITEM_ENUM.RANKING_WITH_STATS]: RankingWithStatsItem,
  [LIST_ITEM_ENUM.RANKING]: RankingItem,
  [LIST_ITEM_ENUM.REPORT]: ReportItemFactory,
  [LIST_ITEM_ENUM.ROSTER_ITEM]: RosterItem,
  [LIST_ITEM_ENUM.SALES]: SalesItem,
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: RosterNotificationItem,
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
