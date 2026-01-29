import {ScrollArea} from "@mantine/core";
import type {PlayerModel, TechModel} from "../../model/PlayerModel.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {ACQUIRE_TECH_TILE, FLIP_TECH_TILE, TRASH_TECH_TILE} from "../../const/Actions.tsx";
import trash_icon from "../../assets/cards/trash_card.png";
import use_card_icon from "../../assets/cards/use_card.png";
import tech_flipped from "../../assets/tech_tile_flipped.jpg";
import {Card, type CardButton, CardButtonType} from "../cards/Card.tsx";
import {produce} from "immer";
import {flipTech} from "../../const/GameUtils.tsx";
import {useGameStore} from "../../store/GameStore.tsx";

export function TechTiles(props: {
  player: PlayerModel;
  nonInteractive?: boolean;
  source?: string
}) {

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const getButtons = (techTile: TechModel) => {
    if (props.nonInteractive) return undefined;

    const buttons: CardButton[] = [
      {
        type: CardButtonType.Icon,
        label: trash_icon,
        onclick: () => {
          sendMessage({action: TRASH_TECH_TILE, body: {url: techTile.url, source: props.source}})
        },
        doubleClick: true
      }
    ]

    if (props.source) {
      buttons.splice(0, 0, {
        type: CardButtonType.Icon,
        label: use_card_icon,
        onclick: () => {
          sendMessage({action: ACQUIRE_TECH_TILE, body: {url: techTile.url, source: props.source}})
        }
      })
    }

    return buttons;
  }

  const techClickAction = (tech: TechModel) => {
    if (props.nonInteractive) return;

    const alreadyFlipped = tech.flipped;
    setGameState(produce(gameState, draft => {
      flipTech(draft, tech, !alreadyFlipped);
    }))
    sendMessage({
      action: FLIP_TECH_TILE,
      body: {
        url: tech.url,
        flipped: !alreadyFlipped,
      }
    })
  }

  const getSkills = () => {
    const techs = props.source === "kota" ? (props.player.character.additionalInfo.kotaSecretProjects as TechModel[]) : props.player.techs
    return techs
      .map(tech => {
        return (
          <Card
            key={tech.url}
            src={tech.flipped ? tech_flipped : tech.url}
            w={"195"}
            h={"130"}
            fit={"contain"}
            radius={15}
            onclick={() => techClickAction(tech)}
            buttons={getButtons(tech)}
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
        {getSkills()}
      </div>
    </ScrollArea>
  )
}
