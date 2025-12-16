import type {PlayerModel} from "../../model/PlayerModel.tsx";
import {produce} from "immer";
import {addOrRemoveVP} from "../../const/GameUtils.tsx";
import {ADD_OR_REMOVE_VP} from "../../const/Actions.tsx";
import {ActionIcon, Stack} from "@mantine/core";
import minus_icon from "../../assets/minus.svg";
import plus_icon from "../../assets/plus.svg";
import {useGameStore} from "../../store/GameStore.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {QuantityIcon} from "../player/QuantityIcon.tsx";
import vp_icon from '../../assets/resources/victory_point.png';

export function VictoryPointModifier(props: {
  player: PlayerModel;
}) {

  const {sendMessage} = useWebSocket();
  const {gameState, setGameState} = useGameStore();

  const VPModifierAction = (add: boolean) => {
    let success = false;
    setGameState(produce(gameState, draft => {
      success = addOrRemoveVP(draft, add)
    }))
    if (success) {
      sendMessage({
        action: ADD_OR_REMOVE_VP,
        body: {
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
      {getButton(plus_icon, () =>  VPModifierAction(true))}
      <QuantityIcon
        icon={vp_icon}
        text={props.player.victoryPoints}/>
      {getButton(minus_icon, () => VPModifierAction(false))}
    </Stack>
  )
}