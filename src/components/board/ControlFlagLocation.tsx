import type {AgentLocationModel} from "../../model/AgentLocationModel.tsx";
import {Center, type MantineStyleProp, type StyleProp} from "@mantine/core";
import type {Property} from "csstype";
import control_flag_red from "../../assets/control_flags/control_flag_red.png";
import control_flag_blue from "../../assets/control_flags/control_flag_blue.png";
import control_flag_green from "../../assets/control_flags/control_flag_green.png";
import control_flag_gold from "../../assets/control_flags/control_flag_gold.png";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {createId} from "../../const/Util.tsx";
import {CSS} from "@dnd-kit/utilities";
import {createPortal} from "react-dom";
import {canMoveComponent} from "../../const/GameUtils.tsx";
import {useGameStore} from "../../store/GameStore.tsx";

function ControlFlag(props: {
  controlFlagId: string;
  color: string;
  playerName: string
}) {
  const {gameState} = useGameStore();
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: `${props.controlFlagId}`,
    data: {
      location: "boardspace",
      type: "control_flag"
    }
  });
  const draggedStyle = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 10,
    transition: !isDragging ? 'transform 300ms ease' : undefined,
  } : undefined;

  const getControlFlagIcon = (color: string) => {
    if (color === "RED") return control_flag_red;
    else if (color === "BLUE") return control_flag_blue;
    else if (color === "GOLD") return control_flag_gold;
    else if (color === "GREEN") return control_flag_green;
  }

  const node = ( canMoveComponent(gameState, props.playerName) ?
    <img
      ref={setNodeRef}
      style={draggedStyle}
      {...listeners}
      {...attributes}
      width={50}
      src={getControlFlagIcon(props.color)}
      alt="Agent icon"
      className={"locations-agent-icon"}/>
      :
      <img
        draggable={false}
        width={50}
        src={getControlFlagIcon(props.color)}
        alt="Agent icon"
        className={"locations-agent-icon"}/>
  )

  return isDragging ? createPortal(node, document.body): node
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
  const {setNodeRef} = useDroppable({
    id: `control-flag-droppable-${createId([props.location.name, props.location.id])}`,
    data: {
      location: "boardspace",
      type: "control_flag",
      id: props.location.id
    }
  });

  return (
    <Center
      ref={setNodeRef}
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