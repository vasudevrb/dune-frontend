import '../../css/InHandCards.css'
import {Card, CardButtonType} from "./Card.tsx";
import {Divider, ScrollArea, Space, Text} from "@mantine/core";
import type {CardModel, PlayerModel} from "../../model/PlayerModel.tsx";
import use_card_icon from '../../assets/cards/use_card.png';
import discard_card_icon from '../../assets/cards/discard_card.png';
import trash_card_icon from '../../assets/cards/trash_card.png';
import {useWebSocket} from "../WebSocketContext.tsx";
import {DISCARD_CARD, TRASH_CARD, USE_CARD} from "../../const/Actions.tsx";

// Careful changing these values, they are used to send messages over websocket.
const CardType = {
  HAND: "HAND",
  PLAY: "PLAY",
  DISCARD: "DISCARD",
  INTRIGUE: "INTRIGUE",
} as const;

export type CardType = keyof typeof CardType;


export function InHandCards(props: {
  player: PlayerModel
}) {
  const {sendMessage} = useWebSocket();
  if (!props.player || !props.player.private) {
    return <></>
  }

  const getSectionLabel = (cardType: CardType) => {
    switch (cardType) {
      case CardType.HAND: return "In Hand";
      case CardType.PLAY: return "In Play";
      case CardType.DISCARD: return "Discarded";
      case CardType.INTRIGUE: return "Intrigues";
    }
  }

  const getButtons = (cardType: CardType, card: CardModel) => {
    const getOnClickAction = (action: string) => {
      return sendMessage({action: action, body: {url: card.url, source: cardType}})
    }
    const getIconButton = (action: string, label: string) => {
      return {
        type: CardButtonType.Icon,
        label: label,
        onclick: () => {getOnClickAction(action)}
      }
    }

    const useButton = getIconButton(USE_CARD, use_card_icon)
    const discardButton = getIconButton(DISCARD_CARD, discard_card_icon)
    const trashButton = getIconButton(TRASH_CARD, trash_card_icon)

    switch (cardType) {
      case CardType.HAND: return [useButton,  discardButton, trashButton];
      case CardType.PLAY: return [useButton, trashButton];
      case CardType.DISCARD: return [useButton, trashButton];
      case CardType.INTRIGUE: return [useButton, trashButton];
    }
  }

  const getCardSection = (type: CardType, cards: CardModel[]) => {
    if (cards.length === 0) return null;

    const sectionLabel = getSectionLabel(type);
    const cardElements = cards.map((card, index) => {
      return (
        <Card
          key={index}
          h={type === CardType.INTRIGUE ? "230px" : "270px"}
          src={`${card.url}`}
          buttons={getButtons(type, card)}
        />)
    })
    return (
      <>
        <Divider orientation="vertical" mt={"50px"} mb={"50px"} color={"#cfcfcf45"}/>
        <Text className={"text-card-type"}>{sectionLabel}</Text>
        {cardElements}
      </>
    )
  }

  return (
    <ScrollArea
      className={"in-hand-card in-hand-cards-row"}
      w={"100%"}
      style={{flexShrink: 0}}
      offsetScrollbars={false}
      type={"never"}
      scrollbars="x">
      <div style={{ display: 'flex', gap: 8, padding: "16px" }}>
        {getCardSection(CardType.HAND, props.player.private.inHandCards)}
        {getCardSection(CardType.PLAY, props.player.private.inPlayCards)}
        {getCardSection(CardType.DISCARD, props.player.private.discardedCards)}
        {getCardSection(CardType.INTRIGUE, props.player.private.intrigueCards)}
        <div><Space w={"350px"}/></div>
      </div>
    </ScrollArea>
  )
}