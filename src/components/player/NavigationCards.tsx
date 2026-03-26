import {ScrollArea} from "@mantine/core";
import type {CardModel, NavigationCardModel, PlayerModel} from "../../model/PlayerModel.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {REVEAL_YRKOON_NAVIGATION_CARD, SELECT_YRKOON_NAVIGATION_CARD} from "../../const/Actions.tsx";
import use_card_icon from "../../assets/cards/use_card.png";
import navigation_card from "../../assets/navigation_card.jpg";
import {Card, type CardButton, CardButtonType} from "../cards/Card.tsx";
import {produce} from "immer";
import {setNavigationCardRevealed} from "../../const/GameUtils.tsx";
import {useGameStore} from "../../store/GameStore.tsx";

export function NavigationCards(props: {
  player: PlayerModel;
  showPresented: boolean;
  nonInteractive?: boolean;
}) {
  const {gameState, setGameState} = useGameStore();
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

  const cardClickAction = (card: NavigationCardModel) => {
    if (props.showPresented) return;

    const alreadyRevealed = card.revealed;
    setGameState(produce(gameState, draft => {
      setNavigationCardRevealed(draft, card, !alreadyRevealed);
    }))
    sendMessage({
      action: REVEAL_YRKOON_NAVIGATION_CARD,
      body: {
        url: card.url,
        revealed: !alreadyRevealed,
      }
    })
  }

  const getNavCards = () => {
    const navCards = !props.showPresented
      ? (props.player.character.additionalInfo.yrkoonSelectedNavigationCards as NavigationCardModel[])
      : (props.player.character.additionalInfo.yrkoonPresentedNavigationCards as NavigationCardModel[])

    const getUrl = (navCard: NavigationCardModel) => {
      if (!props.showPresented && navCard.revealed) {
        return navCard.url
      } else if (props.showPresented) {
        return navCard.url
      } else {
        return navigation_card
      }
    }

    console.log(navCards);

    return navCards
      .map(navCard => {
        return (
          <Card
            key={navCard.url}
            src={getUrl(navCard)}
            h={"230"}
            fit={"contain"}
            radius={15}
            onclick={() => cardClickAction(navCard)}
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
