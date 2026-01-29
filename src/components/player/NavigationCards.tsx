import {ScrollArea} from "@mantine/core";
import type {CardModel, PlayerModel} from "../../model/PlayerModel.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {SELECT_YRKOON_NAVIGATION_CARD} from "../../const/Actions.tsx";
import use_card_icon from "../../assets/cards/use_card.png";
import {Card, type CardButton, CardButtonType} from "../cards/Card.tsx";

export function NavigationCards(props: {
  player: PlayerModel;
  nonInteractive?: boolean;
}) {

  const {sendMessage} = useWebSocket();

  const getButtons = (navCard: CardModel) => {
    if (props.nonInteractive) return undefined;

    const buttons: CardButton[] = [
      {
        type: CardButtonType.Icon,
        label: use_card_icon,
        onclick: () => {
          sendMessage({action: SELECT_YRKOON_NAVIGATION_CARD, body: {url: navCard.url}})
        }
      }
    ]

    return buttons;
  }

  const getNavCards = () => {
    const navCards = props.nonInteractive
      ? (props.player.character.additionalInfo.yrkoonSelectedNavigationCards as CardModel[])
      : (props.player.character.additionalInfo.yrkoonPresentedNavigationCards as CardModel[])

    return navCards
      .map(navCard => {
        return (
          <Card
            key={navCard.url}
            src={navCard.url}
            h={"230"}
            fit={"contain"}
            radius={15}
            buttons={getButtons(navCard)}
          />
        )
      })
  }

  return (
    <ScrollArea
      w={"100%"}
      className={"fadeScroll"}
      scrollbars={"x"}
      offsetScrollbars={false}
      type={"never"}>
      <div style={{display: 'flex', gap: 16, alignItems: "center"}}>
        {getNavCards()}
      </div>
    </ScrollArea>
  )
}
