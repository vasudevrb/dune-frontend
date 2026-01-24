import {ScrollArea} from "@mantine/core";
import type {CardModel, PlayerModel} from "../../model/PlayerModel.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {TRASH_COMMANDER_SKILL} from "../../const/Actions.tsx";
import trash_icon from "../../assets/cards/trash_card.png";
import {Card, CardButtonType} from "../cards/Card.tsx";

export function SardaukarSkills(props: {
  player: PlayerModel;
  nonInteractive?: boolean;
}) {

  const {sendMessage} = useWebSocket();

  const getButtons = (skill: CardModel) => {
    if (props.nonInteractive) return undefined;

    return [
      {
        type: CardButtonType.Icon,
        label: trash_icon,
        onclick: () => {
          sendMessage({action: TRASH_COMMANDER_SKILL, body: {url: skill.url}})
        },
        doubleClick: true
      }
    ]
  }

  const getSkills = () => {
    return props.player.skills
      .map(sk => {
        return (
          <Card
            key={sk.url}
            src={sk.url}
            w={"120"}
            h={"120"}
            fit={"contain"}
            buttons={getButtons(sk)}
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
