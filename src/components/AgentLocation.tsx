import type {AgentLocationModel} from "../model/AgentLocationModel.tsx";
import {Box, Group, type MantineStyleProp, type StyleProp} from "@mantine/core";
import agent_icon_blue from '../assets/agents/agent_blue.svg';
import type {Property} from "csstype";
import agent_icon_red from "../assets/agents/agent_red.svg";
import agent_icon_gold from "../assets/agents/agent_gold.svg";
import agent_icon_green from "../assets/agents/agent_green.svg";
import agent_icon_disabled from "../assets/agents/agent_disabled.svg";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {createId} from "../const/Util.tsx";
import {CSS} from "@dnd-kit/utilities";
import {createPortal} from "react-dom";

function Agent(props: {
  agentId: string;
  color: string;
  playerName: string
}) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: `${props.agentId}`,
    data: {
      type: "agent",
      from: "location"
    }
  });
  const draggedStyle = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 10,
    transition: !isDragging ? 'transform 300ms ease' : undefined,
  } : undefined;

  const getAgentIcon = (color: string) => {
    if (color === "RED") return agent_icon_red;
    else if (color === "BLUE") return agent_icon_blue;
    else if (color === "GOLD") return agent_icon_gold;
    else if (color === "GREEN") return agent_icon_green;
    else if (color === "GRAY") return agent_icon_disabled;
  }

  const node = (
    <img
      ref={setNodeRef}
      style={draggedStyle}
      {...listeners}
      {...attributes}
      width={25}
      src={getAgentIcon(props.color)}
      alt="Agent icon"
      className={"locations-agent-icon"}/>
  )

  return isDragging ? createPortal(node, document.body): node
}


export function AgentLocation(props: {
  location: AgentLocationModel;
  agentsContainerStyle?: { top: Property.Top, left: Property.Left };
  style?: MantineStyleProp
  w?: StyleProp<Property.Width>
  h?: StyleProp<Property.Height>
  maw?: StyleProp<Property.MaxWidth>
  mah?: StyleProp<Property.MaxHeight>
  bg?: string;
}) {
  const {isOver, setNodeRef} = useDroppable({
    id: `${createId([props.location.name, props.location.id])}`,
    data: {
      type: "location"
    }
  });

  return (
    <Box
      ref={setNodeRef}
      pos={"absolute"}
      w={props.w}
      h={props.h}
      maw={props.maw}
      mah={props.mah}
      bg={props.bg}
      style={props.style}>
      <Group
        className="locations-agent-icon-container"
        align="center"
        gap={0}
        style={{
          position: "absolute",
          top: props.agentsContainerStyle?.top,
          left: props.agentsContainerStyle?.left,
        }}>
        {
          props.location.agents.map((agent) =>
           <Agent
             agentId={agent.agentId}
             color={agent.color}
             playerName={agent.playerName}
             key={agent.agentId}/>
          )
        }
      </Group>
    </Box>
  )
}