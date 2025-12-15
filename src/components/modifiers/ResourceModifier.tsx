import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {produce} from "immer";
import {addOrRemoveResource, getResourceIconByType, getResourceQuantityByType} from "../../const/GameUtils.tsx";
import {ADD_OR_REMOVE_RESOURCE} from "../../const/Actions.tsx";
import {ActionIcon, Stack} from "@mantine/core";
import minus_icon from "../../assets/minus.svg";
import plus_icon from "../../assets/plus.svg";
import {useGameStore} from "../../store/GameStore.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {QuantityIcon} from "../player/QuantityIcon.tsx";

export function ResourceModifier(props: {
  player: PlayerModel;
  resourceType: string;
}) {

  const {sendMessage} = useWebSocket();
  const {gameState, setGameState} = useGameStore();

  const resourceModifierAction = (add: boolean, resourceType: string) => {
    let success = false;
    setGameState(produce(gameState, draft => {
      success = addOrRemoveResource(draft, resourceType, add)
    }))
    if (success) {
      sendMessage({
        action: ADD_OR_REMOVE_RESOURCE,
        body: {
          resourceType: resourceType,
          add: add
        }
      })
    }
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
    <Stack align="center" gap={"xs"}>
      {getButton(plus_icon, () =>  resourceModifierAction(true, props.resourceType))}
      <QuantityIcon
        icon={getResourceIconByType(props.resourceType)}
        text={getResourceQuantityByType(props.player, props.resourceType)}/>
      {getButton(minus_icon, () => resourceModifierAction(false, props.resourceType))}
    </Stack>
  )
}