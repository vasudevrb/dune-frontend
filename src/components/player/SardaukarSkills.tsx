import {ScrollArea} from "@mantine/core";
import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {TRASH_COMMANDER_SKILL} from "../../const/Actions.tsx";
import trash_icon from "../../assets/cards/trash_card.png";
import {Card, CardButtonType} from "../cards/Card.tsx";

export function SardaukarSkills(props: {
  player: PlayerModel;
}) {

  const {sendMessage} = useWebSocket();

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
            buttons={[
              {
                type: CardButtonType.Icon,
                label: trash_icon,
                onclick: () => {
                  sendMessage({action: TRASH_COMMANDER_SKILL, body: {url: sk.url}})
                },
                doubleClick: true
              }
            ]}
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
