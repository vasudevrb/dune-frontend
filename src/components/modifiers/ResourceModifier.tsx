import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {produce} from "immer";
import {addOrRemoveResource, getResourceIconByType, getResourceQuantityByType, getResourceTextColorByType} from "../../const/GameUtils.tsx";
import {ADD_OR_REMOVE_RESOURCE} from "../../const/Actions.tsx";
import {Group} from "@mantine/core";
import minus_icon from "../../assets/minus.svg";
import plus_icon from "../../assets/plus.svg";
import {useGameStore} from "../../store/GameStore.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {QuantityIcon} from "../player/QuantityIcon.tsx";
import {DebouncedButton} from "./DebouncedButton.tsx";

export function ResourceModifier(props: {
  player: PlayerModel;
  resourceType: string;
}) {

  const {sendMessage} = useWebSocket();
  const {gameState, setGameState} = useGameStore();

  const resourceModifierAction = (add: boolean, quantity: number, resourceType: string) => {
    let success = false;
    setGameState(produce(gameState, draft => {
      success = addOrRemoveResource(draft, resourceType, quantity, add)
    }))
    if (success) {
      sendMessage({
        action: ADD_OR_REMOVE_RESOURCE,
        body: {
          resourceType: resourceType,
          add: add,
          quantity: quantity,
          playerName: props.player.name,
        }
      })
    }
  }

  return (
    <Group gap={5}>
      <DebouncedButton onclick={(q) => resourceModifierAction(false, q, props.resourceType)} icon={minus_icon}/>
      <QuantityIcon
        size={30}
        textSize={"1em"}
        icon={getResourceIconByType(props.resourceType)}
        text={getResourceQuantityByType(props.player, props.resourceType)}
        textColor={getResourceTextColorByType(props.resourceType)}/>
      <DebouncedButton onclick={(q) => resourceModifierAction(true, q, props.resourceType)} icon={plus_icon}/>
    </Group>
  )
}