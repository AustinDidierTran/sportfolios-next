import { CARD_TYPE_ENUM } from '../../../../common/enums';
import dynamic from 'next/dynamic';

const Default = dynamic(() => import('./DefaultCard'));
const DeleteEntity = dynamic(() => import('./DeleteEntity'));
const EditableGame = dynamic(() => import('./EditableGame'));
const EventPost = dynamic(() => import('./EventPost'));
const EventSettings = dynamic(() => import('./EventSettings'));
const Game = dynamic(() => import('./Game'));
const Invoice = dynamic(() => import('./InvoiceItem'));
const MultipleTeamGame = dynamic(() => import('./MultipleTeamGame'));
const Post = dynamic(() => import('./Post'));
const Comment = dynamic(() => import('./Comment'));
const Report = dynamic(() => import('./Report'));
const ScoreSuggestion = dynamic(() => import('./ScoreSuggestion'));
const Shop = dynamic(() => import('./ShopItem'));
const TwoTeamGame = dynamic(() => import('./TwoTeamGame'));
const TwoTeamGameEditable = dynamic(() => import('./TwoTeamGameEditable'));
const TwoTeamGameProfile = dynamic(() => import('./TwoTeamGameProfile'));
const CartSummary = dynamic(() => import('./CartSummary'));
const AcceptPlayerInfos = dynamic(() => import('./AcceptPlayerInfos'));
const AcceptTeamInfos = dynamic(() => import('./AcceptTeamInfos'));
const OurTeamMember = dynamic(() => import('./OurTeamMember'));

const CardMap = {
  [CARD_TYPE_ENUM.DELETE_ENTITY]: DeleteEntity,
  [CARD_TYPE_ENUM.EDITABLE_GAME]: EditableGame,
  [CARD_TYPE_ENUM.EVENT_SETTINGS]: EventSettings,
  [CARD_TYPE_ENUM.EVENT]: EventPost,
  [CARD_TYPE_ENUM.GAME]: Game,
  [CARD_TYPE_ENUM.INVOICE]: Invoice,
  [CARD_TYPE_ENUM.POST]: Post,
  [CARD_TYPE_ENUM.COMMENT]: Comment,
  [CARD_TYPE_ENUM.REPORT]: Report,
  [CARD_TYPE_ENUM.SCORE_SUGGESTION]: ScoreSuggestion,
  [CARD_TYPE_ENUM.SHOP]: Shop,
  [CARD_TYPE_ENUM.TWO_TEAM_GAME_EDITABLE]: TwoTeamGameEditable,
  [CARD_TYPE_ENUM.TWO_TEAM_GAME]: TwoTeamGame,
  [CARD_TYPE_ENUM.MULTIPLE_TEAM_GAME]: MultipleTeamGame,
  [CARD_TYPE_ENUM.TWO_TEAM_GAME_PROFILE]: TwoTeamGameProfile,
  [CARD_TYPE_ENUM.CART_SUMMARY]: CartSummary,
  [CARD_TYPE_ENUM.ACCEPT_PLAYER_INFOS]: AcceptPlayerInfos,
  [CARD_TYPE_ENUM.ACCEPT_TEAM_INFOS]: AcceptTeamInfos,
  [CARD_TYPE_ENUM.OUR_TEAM_MEMBER]: OurTeamMember,
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
