import {CombatUnitType, type PlayerModel} from "../../model/PlayerModel.tsx";
import {Group} from "@mantine/core";
import {produce} from "immer";
import {addOrRemoveCombatUnit, getCombatUnitIconByType} from "../../const/GameUtils.tsx";
import {ADD_OR_REMOVE_COMBAT_UNIT} from "../../const/Actions.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import minus_icon from "../../assets/minus.svg";
import plus_icon from "../../assets/plus.svg";
import {QuantityIcon} from "../player/QuantityIcon.tsx";
import {DebouncedButton} from "./DebouncedButton.tsx";

export function CombatModifier(props: {
  player: PlayerModel;
  modifierType: CombatUnitType
}) {
  const {sendMessage} = useWebSocket();
  const {gameState, setGameState} = useGameStore();

  const combatModifierAction = (add: boolean, quantity: number, type: CombatUnitType) => {
    let success = false;
    setGameState(produce(gameState, draft => {
      success = addOrRemoveCombatUnit(draft, quantity, type, add)
    }))
    if (success) {
      sendMessage({
        action: ADD_OR_REMOVE_COMBAT_UNIT,
        body: {
          unitType: type,
          add: add,
          quantity: quantity,
          playerName: props.player.name
        }
      })
    }
  }

  return (
    <Group gap={5}>
      <DebouncedButton onclick={(q) => combatModifierAction(false, q, props.modifierType)} icon={minus_icon}/>
      <QuantityIcon
        size={30}
        textSize={"1em"}
        icon={getCombatUnitIconByType(props.modifierType)}/>
      <DebouncedButton onclick={(q) => combatModifierAction(true, q, props.modifierType)} icon={plus_icon}/>
    </Group>
  )
}