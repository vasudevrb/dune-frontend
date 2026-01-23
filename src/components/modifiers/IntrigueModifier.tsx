import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {ActionIcon, Image, Text, Center, Group} from "@mantine/core";
import minus_icon from "../../assets/minus.svg";
import draw_intrigue_card from "../../assets/cards/draw_intrigue_card.png";
import plus_icon from "../../assets/plus.svg";
import {GAIN_INTRIGUE_CARD, TRASH_INTRIGUE_CARD} from "../../const/Actions.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";

export function IntrigueModifier(props:{
  player: PlayerModel
}) {
  const {sendMessage} = useWebSocket();

  const intrigueModifierAction = (add: boolean) => {
    const action = add ? GAIN_INTRIGUE_CARD : TRASH_INTRIGUE_CARD;
    sendMessage({
      action: action,
      body: {
        playerName: props.player.name
      }
    })
  }

  const getButton = (icon: string, onClick?: () => void) => {
    return (
      <ActionIcon
        onClick={onClick}
        className={"player-resource-modifier-button"}
        variant={"outline"}
        radius={"0"}>
        <img width={30} src={icon} alt="Resource modifier button"/>
      </ActionIcon>
    )
  }

  return (
    <Group gap={5}>
      {getButton(minus_icon, () => intrigueModifierAction(false))}
      <Center pos={"relative"} w={30} h={30}>
        <Image h={30} src={draw_intrigue_card} fit={"contain"}/>
        <Text fw="500" size="1rem" className={"player-resource-modifier-text"}>{props.player.numCards.intrigues}</Text>
      </Center>
      {getButton(plus_icon, () => intrigueModifierAction(true))}
    </Group>
  )
}