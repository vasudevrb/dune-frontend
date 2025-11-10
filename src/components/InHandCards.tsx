import '../css/InHandCards.css'
import {Card, CardButtonType} from "./Card.tsx";
import {Divider, ScrollArea, Space, Text} from "@mantine/core";
import type {CardModel, PlayerModel} from "../model/PlayerModel.tsx";
import use_card from '../assets/cards/use_card.png';
import discard_card from '../assets/cards/discard_card.png';
import trash_card from '../assets/cards/trash_card.png';
import {useWebSocket} from "./WebSocketContext.tsx";

export function InHandCards(props: {
  player: PlayerModel
}) {
  const {sendMessage} = useWebSocket();
  if (!props.player || !props.player.private) {
    return <></>
  }

  const getCardSection = (label: string, cards: CardModel[]) => {
    const cardElements = cards.map((card, index) => {
      return (
        <Card
          key={index}
          src={`${card.url}`}
          buttons={[{
            type: CardButtonType.Icon,
            label: use_card,
            onclick: () => {
              sendMessage({
                action: "USE_CARD",
                body: {
                  url: card.url,
                  source: "HAND"
                }
              })
            }
          },
            {
              type: CardButtonType.Icon,
              label: discard_card,
              onclick: () => null
            },
            {
              type: CardButtonType.Icon,
              label: trash_card,
              onclick: () => null
            }]}
        />)
    })
    return (
      <>
        <Divider orientation="vertical" mt={"50px"} mb={"50px"} color={"#cfcfcf45"}/>
        <Text className={"text-card-type"}>{label}</Text>
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
        {getCardSection("In Hand", props.player.private.inHandCards)}
        {getCardSection("In Play", props.player.private.inPlayCards)}
        {getCardSection("Discarded", props.player.private.discardedCards)}
        <div><Space w={"350px"}/></div>
      </div>
    </ScrollArea>
  )
}