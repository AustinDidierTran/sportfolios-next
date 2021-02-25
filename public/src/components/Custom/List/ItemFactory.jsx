import { GLOBAL_ENUM, LIST_ITEM_ENUM, NOTIFICATION_TYPE } from '../../../../common/enums';
import loadable from '@loadable/component';

const AppItem = loadable(() => import('./AppItem'));
const BankAccountItem = loadable(() => import('./BankAccountItem'));
const CartItem = loadable(() => import('./CartItem'));
const CreateEntityItem = loadable(() => import('./CreateEntityItem'));
const CreditCardItem = loadable(() => import('./CreditCardItem'));
const DefaultItem = loadable(() => import('./DefaultItem'));
const EventCreatorItem = loadable(() => import('./EventCreatorItem'));
const EventItem = loadable(() => import('./EventItem'));
const MembershipDetailItem = loadable(() => import('./MembershipDetailItem'));
const MembershipItem = loadable(() => import('./MembershipItem'));
const MembershipOrganizationItem = loadable(() => import('./MembershipOrganizationItem'));
const OrganizationItem = loadable(() => import('./OrganizationItem'));
const PaymentOptionItem = loadable(() => import('./PaymentOptionItem'));
const PersonItem = loadable(() => import('./PersonItem'));
const PurchasesItem = loadable(() => import('./PurchasesItem'));
const RankingItem = loadable(() => import('./RankingItem'));
const RankingWithStatsItem = loadable(() => import('./RankingWithStatsItem'));
const ReportItemFactory = loadable(() => import('./ReportItemFactory'));
const RosterItem = loadable(() => import('./RosterItem'));
const SalesItem = loadable(() => import('./SalesItem'));
const TeamItem = loadable(() => import('./TeamItem'));
const { AvatarAndTextSkeleton } = loadable(() => import('./SkeletonItems'));
const NotificationSettingItem = loadable(() => import('./NotificationSettingItem'));
const RosterNotificationItem = loadable(() => import('./NotificationItem/RosterNotificationItem'));
const ScoreSubmissionConflictNotificationItem = loadable(() =>
  import('./NotificationItem/ScoreSubmissionConflictNotificationItem')
);
const ScoreSubmissionRequestNotificationItem = loadable(() =>
  import('./NotificationItem/ScoreSubmissionRequestNotificationItem')
);
const ConfirmOrDeclineScoreNotificationItem = loadable(() =>
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
  [LIST_ITEM_ENUM.NOTIFICATION_SETTING]: NotificationSettingItem,
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
