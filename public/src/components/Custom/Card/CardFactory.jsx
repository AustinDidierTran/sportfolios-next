import { CARD_TYPE_ENUM } from '../../../../common/enums';
import loadable from '@loadable/component';

const Default = loadable(() => import('./DefaultCard'));
const DeleteEntity = loadable(() => import('./DeleteEntity'));
const EditableGame = loadable(() => import('./EditableGame'));
const EventPost = loadable(() => import('./EventPost'));
const EventSettings = loadable(() => import('./EventSettings'));
const Game = loadable(() => import('./Game'));
const Invoice = loadable(() => import('./InvoiceItem'));
const Post = loadable(() => import('./Post'));
const Report = loadable(() => import('./Report'));
const ScoreSuggestion = loadable(() => import('./ScoreSuggestion'));
const Shop = loadable(() => import('./ShopItem'));
const TwoTeamGame = loadable(() => import('./TwoTeamGame'));
const TwoTeamGameEditable = loadable(() => import('./TwoTeamGameEditable'));
const TwoTeamGameProfile = loadable(() => import('./TwoTeamGameProfile'));
const CartSummary = loadable(() => import('./CartSummary'));
const AcceptPlayerInfos = loadable(() => import('./AcceptPlayerInfos'));
const AcceptTeamInfos = loadable(() => import('./AcceptTeamInfos'));

const CardMap = {
  [CARD_TYPE_ENUM.DELETE_ENTITY]: DeleteEntity,
  [CARD_TYPE_ENUM.EDITABLE_GAME]: EditableGame,
  [CARD_TYPE_ENUM.EVENT_SETTINGS]: EventSettings,
  [CARD_TYPE_ENUM.EVENT]: EventPost,
  [CARD_TYPE_ENUM.GAME]: Game,
  [CARD_TYPE_ENUM.INVOICE]: Invoice,
  [CARD_TYPE_ENUM.POST]: Post,
  [CARD_TYPE_ENUM.REPORT]: Report,
  [CARD_TYPE_ENUM.SCORE_SUGGESTION]: ScoreSuggestion,
  [CARD_TYPE_ENUM.SHOP]: Shop,
  [CARD_TYPE_ENUM.TWO_TEAM_GAME_EDITABLE]: TwoTeamGameEditable,
  [CARD_TYPE_ENUM.TWO_TEAM_GAME]: TwoTeamGame,
  [CARD_TYPE_ENUM.TWO_TEAM_GAME_PROFILE]: TwoTeamGameProfile,
  [CARD_TYPE_ENUM.CART_SUMMARY]: CartSummary,
  [CARD_TYPE_ENUM.ACCEPT_PLAYER_INFOS]: AcceptPlayerInfos,
  [CARD_TYPE_ENUM.ACCEPT_TEAM_INFOS]: AcceptTeamInfos,
};

export default function CardFactory(props) {
  const { type } = props;

  const Card = CardMap[type];

  if (!Card) {
    /* eslint-disable-next-line */
    console.error(`${type} is not supported in CardFactory`);
    return Default;
  }

  return Card;
}
