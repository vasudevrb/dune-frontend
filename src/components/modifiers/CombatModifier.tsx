import {CombatUnitType, type PlayerModel} from "../../model/PlayerModel.tsx";
import {ActionIcon, Group} from "@mantine/core";
import {produce} from "immer";
import {addOrRemoveCombatUnit, getCombatUnitIconByType} from "../../const/GameUtils.tsx";
import {ADD_OR_REMOVE_COMBAT_UNIT} from "../../const/Actions.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {useGameStore} from "../../store/GameStore.tsx";
import minus_icon from "../../assets/minus.svg";
import plus_icon from "../../assets/plus.svg";
import {QuantityIcon} from "../player/QuantityIcon.tsx";

export function CombatModifier(props: {
  player: PlayerModel;
  modifierType: CombatUnitType
}) {
  const {sendMessage} = useWebSocket();
  const {gameState, setGameState} = useGameStore();

  const combatModifierAction = (add: boolean, type: CombatUnitType) => {
    let success = false;
    setGameState(produce(gameState, draft => {
      success = addOrRemoveCombatUnit(props.player.name, draft, type, add)
    }))
    if (success) {
      sendMessage({
        action: ADD_OR_REMOVE_COMBAT_UNIT,
        body: {
          unitType: type,
          add: add,
          playerName: props.player.name
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
    <Group gap={5}>
      {getButton(minus_icon, () => combatModifierAction(false, props.modifierType))}
      <QuantityIcon
        size={30}
        textSize={"1em"}
        icon={getCombatUnitIconByType(props.modifierType)}/>
      {getButton(plus_icon, () => combatModifierAction(true, props.modifierType))}
    </Group>
  )
}