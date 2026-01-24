import {ScrollArea} from "@mantine/core";
import type {PlayerModel, TechModel} from "../../model/PlayerModel.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {FLIP_TECH_TILE, TRASH_TECH_TILE} from "../../const/Actions.tsx";
import trash_icon from "../../assets/cards/trash_card.png";
import tech_flipped from "../../assets/tech_tile_flipped.jpg";
import {Card, CardButtonType} from "../cards/Card.tsx";
import {produce} from "immer";
import {flipTech} from "../../const/GameUtils.tsx";
import {useGameStore} from "../../store/GameStore.tsx";

export function TechTiles(props: {
  player: PlayerModel;
  nonInteractive?: boolean;
}) {

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const getButtons = (techTile: TechModel) => {
    if (props.nonInteractive) return undefined;

    return [
      {
        type: CardButtonType.Icon,
        label: trash_icon,
        onclick: () => {
          sendMessage({action: TRASH_TECH_TILE, body: {url: techTile.url}})
        },
        doubleClick: true
      }
    ]
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
    return props.player.techs
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
