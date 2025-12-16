import type {AgentLocationModel} from "../../model/AgentLocationModel.tsx";
import {Center, Image, type MantineStyleProp, type StyleProp} from "@mantine/core";
import type {Property} from "csstype";
import control_flag_red from "../../assets/control_flags/control_flag_red.png";
import control_flag_blue from "../../assets/control_flags/control_flag_blue.png";
import control_flag_green from "../../assets/control_flags/control_flag_green.png";
import control_flag_gold from "../../assets/control_flags/control_flag_gold.png";
import {useGameStore} from "../../store/GameStore.tsx";
import {useWebSocket} from "../WebSocketContext.tsx";
import {assertExists, placeControlFlag} from "../../const/GameUtils.tsx";
import {produce} from "immer";
import {PLACE_CONTROL_FLAG,} from "../../const/Actions.tsx";

function ControlFlag(props: {
  controlFlagId: string;
  color: string;
  playerName: string
}) {

  const getControlFlagIcon = (color: string) => {
    if (color === "RED") return control_flag_red;
    else if (color === "BLUE") return control_flag_blue;
    else if (color === "GOLD") return control_flag_gold;
    else if (color === "GREEN") return control_flag_green;
  }

  return (
    <Image
      draggable={false}
      w={50}
      src={getControlFlagIcon(props.color)}
      alt="Agent icon"
      className={"locations-agent-icon"}/>
  );
}


export function ControlFlagLocation(props: {
  location: AgentLocationModel;
  style?: MantineStyleProp
  w?: StyleProp<Property.Width>
  h?: StyleProp<Property.Height>
  maw?: StyleProp<Property.MaxWidth>
  mah?: StyleProp<Property.MaxHeight>
  bg?: string;
}) {

  const {gameState, setGameState} = useGameStore();
  const {sendMessage} = useWebSocket();

  const sendControlFlag = () => {
    const player = assertExists(
      gameState.players.find(p => p.isThisPlayer),
      "Current player not found"
    )

    const controlFlagId = player.controlFlags[0].id
    setGameState(produce(gameState, draft => {
      placeControlFlag(draft, controlFlagId, props.location.id)
    }));

    sendMessage({
      action: PLACE_CONTROL_FLAG, body: {
        controlFlagId: controlFlagId,
        locationId: props.location.id,
        playerName: player.name,
      }
    });
  }

  const canSendControlFlag = () => {
    const player = assertExists(
      gameState.players.find(p => p.isThisPlayer),
      "Current player not found"
    )

    return player.controlFlags.length > 0
  }

  return (
    <Center
      className={"pulse-bg agent-control-flag-container"}
      onClick={canSendControlFlag() ? sendControlFlag : undefined}
      pos={"absolute"}
      w={props.w}
      h={props.h}
      maw={props.maw}
      mah={props.mah}
      bg={props.bg}
      style={props.style}>
      {props.location.controlFlag &&
        <ControlFlag
          controlFlagId={props.location.controlFlag.controlFlagId}
          color={props.location.controlFlag.color}
          playerName={props.location.controlFlag.playerName}/>
      }
    </Center>
  )
}